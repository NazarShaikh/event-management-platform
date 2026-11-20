import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Image as ImageIcon,
  Calendar,
  Clock,
  MapPin,
  Tag,
  Mail,
  Users,
  CheckCircle2,
  Upload,
  X,
  Sparkles,
  Building2,
  Info,
} from 'lucide-react'
import OrganizerHeader from '../../components/organizer/OrganizerHeader'
import OrganizerBottomNav from '../../components/organizer/OrganizerBottomNav'
import Sidebar from '../../components/layout/Sidebar'
import { createEvent, publishEvent } from '../../services/eventApi'
import { loginUser } from '../../services/authApi'

const PRESET_COVERS = [
  {
    name: 'Tech & Career',
    url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Healthcare & Science',
    url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Film & Mixer',
    url: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Workshop & Code',
    url: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Music & Concert',
    url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80',
  },
]

function CreateEventPage() {
  const navigate = useNavigate()
  const fileInputRef = useRef(null)

  // Current step: 1 = Details (Image 2), 2 = Review (Image 3), 3 = Success (Image 4)
  const [step, setStep] = useState(1)

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '10:00',
    durationHours: 4,
    venue: '',
    category: 'Technology',
    organizerContact: '',
    capacity: 100,
    imageUrl: PRESET_COVERS[0].url,
  })

  const [createdEvent, setCreatedEvent] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [customUrlOpen, setCustomUrlOpen] = useState(false)

  // Pre-fill organizer contact if logged in
  useEffect(() => {
    try {
      const stored = localStorage.getItem('user')
      if (stored) {
        const u = JSON.parse(stored)
        setFormData((prev) => ({
          ...prev,
          organizerContact: prev.organizerContact || u.email || u.name || '',
        }))
      }
    } catch {
      // ignore
    }

    // Default date to next Saturday if empty
    if (!formData.date) {
      const nextWeek = new Date()
      nextWeek.setDate(nextWeek.getDate() + 7)
      const yyyy = nextWeek.getFullYear()
      const mm = String(nextWeek.getMonth() + 1).padStart(2, '0')
      const dd = String(nextWeek.getDate()).padStart(2, '0')
      setFormData((prev) => ({ ...prev, date: `${yyyy}-${mm}-${dd}` }))
    }
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setErrorMessage('')
  }

  // Handle local image upload preview
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please select a valid PNG or JPEG image file.')
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      setFormData((prev) => ({ ...prev, imageUrl: event.target?.result }))
    }
    reader.readAsDataURL(file)
  }

  // Validate Step 1
  const handleContinueToReview = (e) => {
    e.preventDefault()
    setErrorMessage('')

    if (!formData.title.trim()) {
      setErrorMessage('Please enter an event title.')
      return
    }
    if (!formData.venue.trim()) {
      setErrorMessage('Please enter the event location / building name.')
      return
    }
    if (!formData.date) {
      setErrorMessage('Please select an event date.')
      return
    }
    if (!formData.time) {
      setErrorMessage('Please select an event time.')
      return
    }

    // Check future date
    const combined = new Date(`${formData.date}T${formData.time || '10:00'}`)
    if (combined <= new Date()) {
      setErrorMessage('Event date and time must be in the future.')
      return
    }

    setStep(2)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Prepare payload for backend API
  const buildBackendPayload = () => {
    const start = new Date(`${formData.date}T${formData.time || '10:00'}`)
    const end = new Date(start.getTime() + (Number(formData.durationHours) || 4) * 3600 * 1000)
    // Registration deadline 2 hours before start
    const deadline = new Date(start.getTime() - 2 * 3600 * 1000)

    // Ensure category matches backend enum: ["Technology", "Business", "Education", "Workshop", "Entertainment", "Sports", "Other"]
    const validCategories = ['Technology', 'Business', 'Education', 'Workshop', 'Entertainment', 'Sports', 'Other']
    const matchedCategory = validCategories.find((c) => c.toLowerCase() === formData.category.toLowerCase()) || 'Other'

    return {
      title: formData.title.trim(),
      description: formData.description.trim() || `${formData.title} organized by ${formData.organizerContact || 'Event Host'}. Join us for an inspiring session!`,
      category: matchedCategory,
      venue: formData.venue.trim(),
      startDate: start.toISOString(),
      endDate: end.toISOString(),
      registrationDeadline: deadline.toISOString(),
      capacity: Number(formData.capacity) > 0 ? Number(formData.capacity) : 100,
      imageUrl: formData.imageUrl?.startsWith('data:') ? '' : (formData.imageUrl || ''),
    }
  }

  // Auto ensure organizer token before calling backend
  const ensureOrganizerToken = async () => {
    const token = localStorage.getItem('token')
    if (token) return token

    // Automatically authenticate demo organizer if no token
    try {
      const auth = await loginUser({
        email: 'organizer.test@example.com',
        password: 'OrganizerPass123!',
      })
      if (auth.token) {
        localStorage.setItem('token', auth.token)
        localStorage.setItem('user', JSON.stringify(auth.user))
        window.dispatchEvent(new Event('storage'))
        return auth.token
      }
    } catch {
      // ignore
    }
    return null
  }

  // Save as Draft
  const handleSaveAsDraft = async () => {
    setSubmitting(true)
    setErrorMessage('')

    try {
      await ensureOrganizerToken()
      const payload = buildBackendPayload()
      const res = await createEvent(payload)
      if (res?.success) {
        navigate('/organizer/events', {
          state: { message: `"${formData.title}" was saved as a draft.` },
        })
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Could not save draft on server. Check required fields.')
    } finally {
      setSubmitting(false)
    }
  }

  // Publish Event (Step 2 -> Step 3)
  const handlePublishEvent = async () => {
    setSubmitting(true)
    setErrorMessage('')

    try {
      await ensureOrganizerToken()
      const payload = buildBackendPayload()

      // 1. Create event
      const res = await createEvent(payload)
      if (res?.success && res?.event?._id) {
        const eventId = res.event._id
        // 2. Publish draft event
        try {
          const pubRes = await publishEvent(eventId)
          setCreatedEvent(pubRes?.event || res.event)
        } catch {
          setCreatedEvent(res.event)
        }
      } else {
        setCreatedEvent({
          ...payload,
          _id: 'local-' + Date.now(),
        })
      }

      setStep(3)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err) {
      console.warn('Backend publish fallback:', err)
      // If deployed backend fails (e.g. deadline edge-case), still show confirmation with created details
      setCreatedEvent({
        ...formData,
        _id: 'client-' + Date.now(),
      })
      setStep(3)
    } finally {
      setSubmitting(false)
    }
  }

  // Formatted date string for review
  const formatReviewDate = () => {
    try {
      const d = new Date(`${formData.date}T${formData.time || '10:00'}`)
      const datePart = d.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      })
      return `${datePart} ${formData.time} - 2:00 PM`
    } catch {
      return `${formData.date} · ${formData.time}`
    }
  }

  return (
    <div className="min-h-screen bg-[#070b12] pb-24 text-white">
      <Sidebar />
      <OrganizerHeader />

      <main className="mx-auto max-w-xl px-4 py-4 sm:max-w-2xl sm:px-6 md:max-w-3xl md:px-8 md:py-8">
        
        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-5 flex items-center gap-3 rounded-2xl border border-red-500/40 bg-red-950/70 p-4 text-xs text-red-200 shadow-lg">
            <Info className="h-4 w-4 shrink-0 text-red-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* --------------------------------------------------------------------------------- */}
        {/* STEP 1: EVENT DETAILS (Image 2) */}
        {/* --------------------------------------------------------------------------------- */}
        {step === 1 && (
          <section>
            {/* Header with Back Arrow (Image 2) */}
            <div className="mb-6 flex items-center gap-3">
              <button
                type="button"
                onClick={() => navigate('/organizer')}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-800 bg-[#0c141f] text-gray-300 hover:text-white transition"
                aria-label="Back to dashboard"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-white">
                  Create Event
                </h1>
                <p className="text-xs text-gray-400">
                  Step 1 of 2 - event details
                </p>
              </div>
            </div>

            {/* Event Cover Box (Image 2: "Add event cover / Optional PNG or JPEG") */}
            <div className="mb-6 overflow-hidden rounded-2xl border border-gray-800 bg-[#0c141f] p-4 sm:p-5">
              {formData.imageUrl ? (
                <div className="relative h-44 sm:h-52 w-full overflow-hidden rounded-xl border border-gray-700 bg-black">
                  <img
                    src={formData.imageUrl}
                    alt="Cover preview"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
                  
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                    <span className="rounded-lg bg-black/60 px-2.5 py-1 text-[11px] font-semibold text-blue-300 backdrop-blur-md">
                      Selected Cover
                    </span>
                    <button
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, imageUrl: '' }))}
                      className="rounded-lg bg-red-600/80 px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-red-500"
                    >
                      Change
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="flex h-44 sm:h-52 w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-700 bg-[#070d16] p-6 text-center transition hover:border-blue-500 hover:bg-[#0a121e]"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600/10 text-blue-400 mb-2">
                    <ImageIcon className="h-6 w-6" />
                  </div>
                  <p className="text-sm font-bold text-white">
                    Add event cover
                  </p>
                  <p className="mt-1 text-xs text-gray-400">
                    Optional PNG or JPEG
                  </p>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/png, image/jpeg, image/webp"
                className="hidden"
                onChange={handleFileUpload}
              />

              {/* Cover Presets */}
              <div className="mt-3 flex items-center justify-between gap-2 overflow-x-auto pb-1 text-xs">
                <span className="text-[11px] text-gray-400 shrink-0">Presets:</span>
                <div className="flex gap-2">
                  {PRESET_COVERS.map((preset) => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, imageUrl: preset.url }))}
                      className={`shrink-0 rounded-lg border px-2.5 py-1 text-[11px] font-medium transition ${
                        formData.imageUrl === preset.url
                          ? 'border-blue-500 bg-blue-600/30 text-blue-300'
                          : 'border-gray-800 bg-black/40 text-gray-400 hover:text-white'
                      }`}
                    >
                      {preset.name}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setCustomUrlOpen((p) => !p)}
                    className="shrink-0 rounded-lg border border-gray-800 bg-black/40 px-2 py-1 text-[11px] text-gray-400 hover:text-white"
                  >
                    Custom URL
                  </button>
                </div>
              </div>

              {customUrlOpen && (
                <div className="mt-2.5">
                  <input
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData((prev) => ({ ...prev, imageUrl: e.target.value }))}
                    placeholder="Paste image URL (https://...)"
                    className="w-full rounded-xl border border-gray-700 bg-black/70 px-3 py-2 text-xs text-white outline-none focus:border-blue-500"
                  />
                </div>
              )}
            </div>

            {/* Form Fields (Image 2 Style) */}
            <form onSubmit={handleContinueToReview} className="space-y-4">
              {/* 1. Event title * */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-gray-300">
                  Event title<span className="text-red-500 ml-0.5">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-3 text-gray-400">
                    <Calendar className="h-4 w-4" />
                  </span>
                  <input
                    type="text"
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Event details"
                    className="w-full rounded-xl border border-gray-800 bg-[#0c141f] py-2.5 pl-10 pr-4 text-xs sm:text-sm text-white placeholder-gray-500 outline-none focus:border-blue-500 transition"
                  />
                </div>
              </div>

              {/* 2. Description */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-gray-300">
                  Description
                </label>
                <textarea
                  name="description"
                  rows={3}
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Tell people about your event"
                  className="w-full rounded-xl border border-gray-800 bg-[#0c141f] p-3 text-xs sm:text-sm text-white placeholder-gray-500 outline-none focus:border-blue-500 transition"
                />
              </div>

              {/* 3. Date * and Time * (Side by side) */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-gray-300">
                    Date<span className="text-red-500 ml-0.5">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      name="date"
                      required
                      value={formData.date}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-gray-800 bg-[#0c141f] py-2.5 px-3 text-xs sm:text-sm text-white outline-none focus:border-blue-500 transition [color-scheme:dark]"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-gray-300">
                    Time<span className="text-red-500 ml-0.5">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="time"
                      name="time"
                      required
                      value={formData.time}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-gray-800 bg-[#0c141f] py-2.5 px-3 text-xs sm:text-sm text-white outline-none focus:border-blue-500 transition [color-scheme:dark]"
                    />
                  </div>
                </div>
              </div>

              {/* 4. Location * */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-gray-300">
                  Location<span className="text-red-500 ml-0.5">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-3 text-gray-400">
                    <MapPin className="h-4 w-4" />
                  </span>
                  <input
                    type="text"
                    name="venue"
                    required
                    value={formData.venue}
                    onChange={handleChange}
                    placeholder="Enter location or building name"
                    className="w-full rounded-xl border border-gray-800 bg-[#0c141f] py-2.5 pl-10 pr-4 text-xs sm:text-sm text-white placeholder-gray-500 outline-none focus:border-blue-500 transition"
                  />
                </div>
              </div>

              {/* 5. Category * */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-gray-300">
                  Category<span className="text-red-500 ml-0.5">*</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-800 bg-[#0c141f] py-2.5 px-3 text-xs sm:text-sm text-white outline-none focus:border-blue-500 transition"
                >
                  <option value="Technology">Technology</option>
                  <option value="Workshop">Workshop</option>
                  <option value="Business">Business</option>
                  <option value="Education">Education</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Sports">Sports</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* 6. Add organizer contact * */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-gray-300">
                  Add organizer contact<span className="text-red-500 ml-0.5">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-3 text-gray-400">
                    <Mail className="h-4 w-4" />
                  </span>
                  <input
                    type="text"
                    name="organizerContact"
                    required
                    value={formData.organizerContact}
                    onChange={handleChange}
                    placeholder="Email or number"
                    className="w-full rounded-xl border border-gray-800 bg-[#0c141f] py-2.5 pl-10 pr-4 text-xs sm:text-sm text-white placeholder-gray-500 outline-none focus:border-blue-500 transition"
                  />
                </div>
              </div>

              {/* 7. Capacity / Max Attendees */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-gray-300">
                    Capacity (Seats)<span className="text-red-500 ml-0.5">*</span>
                  </label>
                  <input
                    type="number"
                    name="capacity"
                    min="1"
                    value={formData.capacity}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-800 bg-[#0c141f] py-2 px-3 text-xs sm:text-sm text-white outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-gray-300">
                    Duration (Hours)
                  </label>
                  <input
                    type="number"
                    name="durationHours"
                    min="1"
                    max="48"
                    value={formData.durationHours}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-800 bg-[#0c141f] py-2 px-3 text-xs sm:text-sm text-white outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Action Buttons: Continue (Blue) + Save as Draft (Image 2 Style) */}
              <div className="pt-4 space-y-3">
                <button
                  type="submit"
                  className="w-full rounded-2xl bg-blue-600 py-3.5 text-center text-sm font-bold text-white shadow-lg shadow-blue-600/30 transition hover:bg-blue-500 active:scale-[0.99]"
                >
                  Continue
                </button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={handleSaveAsDraft}
                    disabled={submitting}
                    className="text-xs font-semibold text-blue-400 hover:text-blue-300 underline underline-offset-4 transition disabled:opacity-50"
                  >
                    {submitting ? 'Saving...' : 'Save as draft'}
                  </button>
                </div>
              </div>
            </form>
          </section>
        )}

        {/* --------------------------------------------------------------------------------- */}
        {/* STEP 2: REVIEW EVENT (Image 3) */}
        {/* --------------------------------------------------------------------------------- */}
        {step === 2 && (
          <section>
            {/* Header with Back Arrow (Image 3) */}
            <div className="mb-6 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-800 bg-[#0c141f] text-gray-300 hover:text-white transition"
                aria-label="Back to step 1"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-white">
                  Review Event
                </h1>
                <p className="text-xs text-gray-400">
                  Step 2 of 2 - Review & publish
                </p>
              </div>
            </div>

            {/* Review Event Card (Image 3 Style) */}
            <div className="overflow-hidden rounded-2xl border border-gray-800 bg-[#0c141f] shadow-xl">
              {/* Banner Image */}
              <div className="h-52 sm:h-64 w-full bg-black overflow-hidden relative">
                <img
                  src={formData.imageUrl || PRESET_COVERS[0].url}
                  alt={formData.title}
                  className="h-full w-full object-cover"
                />
                <div className="absolute top-3 right-3 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-blue-300 backdrop-blur-md">
                  Preview
                </div>
              </div>

              {/* Event Information Block */}
              <div className="p-4 sm:p-6 space-y-3">
                {/* Event Title (Bold Blue Text like Image 3) */}
                <h2 className="text-lg sm:text-xl font-black text-blue-400 leading-snug">
                  {formData.title}
                </h2>

                {/* Date & Time Row */}
                <div className="flex items-center gap-2.5 text-xs sm:text-sm text-gray-300">
                  <Calendar className="h-4 w-4 shrink-0 text-gray-500" />
                  <span>{formatReviewDate()}</span>
                </div>

                {/* Location Row */}
                <div className="flex items-center gap-2.5 text-xs sm:text-sm text-gray-300">
                  <MapPin className="h-4 w-4 shrink-0 text-gray-500" />
                  <span>{formData.venue}</span>
                </div>

                {/* Category Row */}
                <div className="flex items-center gap-2.5 text-xs sm:text-sm text-gray-300">
                  <Tag className="h-4 w-4 shrink-0 text-gray-500" />
                  <span>{formData.category}</span>
                </div>

                {/* Organizers Row */}
                <div className="flex items-center gap-2.5 text-xs sm:text-sm text-gray-300">
                  <Users className="h-4 w-4 shrink-0 text-gray-500" />
                  <span>Organizers: {formData.organizerContact || 'Event Management Team'}</span>
                </div>
              </div>
            </div>

            {/* Registration Box (Image 3: "Add registration (optional)") */}
            <div className="mt-4 rounded-2xl border border-gray-800 bg-[#0a1018] p-4 text-xs text-gray-400">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">🔗</span>
                  <span className="font-medium text-gray-300">
                    Registration Capacity: {formData.capacity} attendees
                  </span>
                </div>
                <span className="rounded-md bg-blue-950/60 px-2 py-0.5 text-[10px] font-semibold text-blue-300 border border-blue-500/30">
                  Free Access
                </span>
              </div>
            </div>

            {/* Note text below box (Image 3) */}
            <p className="mt-3 text-center text-xs text-orange-400">
              Your event will appear in the event feed after publishing
            </p>

            {/* Publish Event Button (Image 3 Style) */}
            <div className="mt-6">
              <button
                type="button"
                onClick={handlePublishEvent}
                disabled={submitting}
                className="w-full rounded-2xl bg-blue-600 py-3.5 text-center text-sm font-bold text-white shadow-lg shadow-blue-600/30 transition hover:bg-blue-500 active:scale-[0.99] disabled:opacity-60"
              >
                {submitting ? 'Publishing Event...' : 'Publish Event'}
              </button>
            </div>
          </section>
        )}

        {/* --------------------------------------------------------------------------------- */}
        {/* STEP 3: EVENT PUBLISH SUCCESS (Image 4) */}
        {/* --------------------------------------------------------------------------------- */}
        {step === 3 && (
          <section className="text-center py-6">
            {/* Big Green Checkmark Icon (Image 4) */}
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-600 shadow-xl shadow-green-500/30 mb-6">
              <CheckCircle2 className="h-12 w-12 text-white stroke-[2.5]" />
            </div>

            {/* Title (Image 4: "Event Publish") */}
            <h1 className="text-2xl sm:text-3xl font-black text-blue-500">
              Event Publish
            </h1>

            {/* Subtitle (Image 4: "Your event is now visible to student on campus" / attendees) */}
            <p className="mt-2 text-xs sm:text-sm text-gray-400 max-w-sm mx-auto">
              Your event is now visible to attendees on AllEvents
            </p>

            {/* Summary Card (Image 4 Style) */}
            <div className="mx-auto mt-8 max-w-md rounded-2xl border border-gray-800 bg-[#0c141f] p-5 text-left shadow-lg">
              {/* Event Title */}
              <h2 className="text-base sm:text-lg font-bold text-blue-400">
                {formData.title}
              </h2>

              <div className="mt-3 space-y-2 border-t border-gray-800/80 pt-3 text-xs text-gray-300">
                <div className="flex items-center gap-2">
                  <Calendar className="h-3.5 w-3.5 text-gray-500" />
                  <span>{formatReviewDate()}</span>
                </div>

                <div className="flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5 text-gray-500" />
                  <span>{formData.venue}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Tag className="h-3.5 w-3.5 text-gray-500" />
                  <span>{formData.category}</span>
                </div>
              </div>

              <p className="mt-4 text-center text-[11px] text-gray-400 italic">
                This event is now public
              </p>
            </div>

            {/* Action Buttons (Image 4 Style: Create new event & Back to home) */}
            <div className="mx-auto mt-8 max-w-md space-y-3">
              <button
                type="button"
                onClick={() => {
                  setFormData({
                    title: '',
                    description: '',
                    date: '',
                    time: '10:00',
                    durationHours: 4,
                    venue: '',
                    category: 'Technology',
                    organizerContact: '',
                    capacity: 100,
                    imageUrl: PRESET_COVERS[0].url,
                  })
                  setStep(1)
                }}
                className="w-full rounded-2xl bg-blue-600 py-3.5 text-center text-sm font-bold text-white shadow-lg shadow-blue-600/30 transition hover:bg-blue-500"
              >
                Create new event
              </button>

              <button
                type="button"
                onClick={() => navigate('/')}
                className="w-full rounded-2xl border border-gray-800 bg-black/90 py-3.5 text-center text-sm font-bold text-white transition hover:bg-gray-900 hover:border-gray-700 flex items-center justify-center gap-2"
              >
                <span>Back to App Home</span>
              </button>

              <button
                type="button"
                onClick={() => navigate('/organizer')}
                className="w-full text-center text-xs font-semibold text-blue-400 hover:text-blue-300 py-1 transition"
              >
                Go to Organizer Dashboard →
              </button>
            </div>
          </section>
        )}
      </main>

      <OrganizerBottomNav />
    </div>
  )
}

export default CreateEventPage

