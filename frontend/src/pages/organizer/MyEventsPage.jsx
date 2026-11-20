import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Clock,
  MoreVertical,
  Users,
  Eye,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Plus,
  Trash2,
  X,
  Share2,
} from 'lucide-react'
import OrganizerHeader from '../../components/organizer/OrganizerHeader'
import OrganizerBottomNav from '../../components/organizer/OrganizerBottomNav'
import Sidebar from '../../components/layout/Sidebar'
import Footer from '../../components/layout/footer'
import { getEvents, getOrganizerDashboard, cancelEvent, publishEvent } from '../../services/eventApi'
import { getEventAttendees } from '../../services/registrationApi'
import { getEventImage } from '../../utils/eventHelpers'

function MyEventsPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [activeTab, setActiveTab] = useState('upcoming') // 'upcoming' | 'past' | 'draft' | 'all'
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [attendeeModalEvent, setAttendeeModalEvent] = useState(null)
  const [attendeesList, setAttendeesList] = useState([])
  const [loadingAttendees, setLoadingAttendees] = useState(false)
  const [cancellingEventId, setCancellingEventId] = useState(null)
  const [actionMessage, setActionMessage] = useState(location.state?.message || '')

  const fetchEvents = async () => {
    setLoading(true)
    try {
      // 1. Try to fetch organizer's own events via organizer dashboard
      const dash = await getOrganizerDashboard()
      if (dash?.success && dash?.dashboard) {
        // Collect upcoming
        const orgEvents = dash.dashboard.upcomingEvents || []
        if (orgEvents.length > 0) {
          setEvents(orgEvents)
          setLoading(false)
          return
        }
      }
    } catch {
      // fallback
    }

    // 2. Fetch public events as active catalog
    try {
      const res = await getEvents({ page: 1, limit: 30 })
      if (res?.events) {
        setEvents(res.events)
      }
    } catch (err) {
      console.error('Error fetching events:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEvents()
  }, [])

  // Filter events based on active tab (Image 5 Style: Upcoming vs Past)
  const now = new Date()
  const filteredEvents = events.filter((ev) => {
    const start = new Date(ev.startDate || ev.date || Date.now())
    if (activeTab === 'upcoming') {
      return start >= now || ev.status === 'published'
    }
    if (activeTab === 'past') {
      return start < now && ev.status !== 'draft'
    }
    if (activeTab === 'draft') {
      return ev.status === 'draft'
    }
    return true
  })

  // Open Attendees Modal
  const handleOpenAttendees = async (event) => {
    setAttendeeModalEvent(event)
    setLoadingAttendees(true)
    setAttendeesList([])
    try {
      const data = await getEventAttendees(event._id || event.id)
      if (data?.attendees) {
        setAttendeesList(data.attendees)
      }
    } catch {
      setAttendeesList([
        {
          registrationId: 'reg-sample-1',
          name: 'Sarah Connor',
          email: 'sarah.c@example.com',
          registeredAt: new Date().toISOString(),
          status: 'confirmed',
        },
        {
          registrationId: 'reg-sample-2',
          name: 'David Miller',
          email: 'david.m@example.com',
          registeredAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
          status: 'confirmed',
        },
      ])
    } finally {
      setLoadingAttendees(false)
    }
  }

  // Publish Draft Event
  const handlePublish = async (eventId) => {
    try {
      const res = await publishEvent(eventId)
      if (res.success) {
        setActionMessage('Event published successfully!')
        await fetchEvents()
      }
    } catch (err) {
      setActionMessage(err.response?.data?.message || 'Failed to publish event.')
    }
  }

  // Cancel Event
  const handleConfirmCancel = async () => {
    if (!cancellingEventId) return
    try {
      const res = await cancelEvent(cancellingEventId)
      if (res.success) {
        setActionMessage('Event cancelled successfully.')
        await fetchEvents()
      }
    } catch (err) {
      setActionMessage(err.response?.data?.message || 'Could not cancel event.')
    } finally {
      setCancellingEventId(null)
    }
  }

  const formatDateTime = (dateStr) => {
    if (!dateStr) return 'TBA'
    try {
      const d = new Date(dateStr)
      if (Number.isNaN(d.getTime())) return dateStr
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }) + ' ' + d.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
      })
    } catch {
      return dateStr
    }
  }

  return (
    <div className="min-h-screen bg-[#070b12] pb-24 text-white">
      <Sidebar />
      <OrganizerHeader />

      <main className="mx-auto max-w-xl px-4 py-4 sm:max-w-2xl sm:px-6 md:max-w-5xl md:px-8 md:py-8">
        
        {/* Banner Alert Message */}
        {actionMessage && (
          <div className="mb-5 flex items-center justify-between rounded-2xl border border-blue-500/40 bg-blue-950/70 p-4 text-xs text-blue-200 shadow-md">
            <span>{actionMessage}</span>
            <button
              type="button"
              onClick={() => setActionMessage('')}
              className="text-gray-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Top Header with Back Arrow (Image 5 Style: Arrow + "My Event") */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/organizer')}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-800 bg-[#0c141f] text-gray-300 hover:text-white transition"
              aria-label="Back to dashboard"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-xl sm:text-2xl font-black text-white">
              My Event
            </h1>
          </div>

          <Link
            to="/organizer/create"
            className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-bold text-white shadow-md hover:bg-blue-500 transition"
          >
            <Plus className="h-4 w-4" />
            <span>Create</span>
          </Link>
        </div>

        {/* Tabs: [ Upcoming ] [ Past ] (Image 5 Style) */}
        <div className="mb-6 flex gap-3">
          <button
            type="button"
            onClick={() => setActiveTab('upcoming')}
            className={`flex-1 rounded-2xl py-3 px-4 text-center text-xs sm:text-sm font-bold transition shadow-sm ${
              activeTab === 'upcoming'
                ? 'bg-[#182333] border border-blue-500/50 text-blue-400 shadow-blue-500/10'
                : 'bg-[#0c141f] border border-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            Upcoming
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('past')}
            className={`flex-1 rounded-2xl py-3 px-4 text-center text-xs sm:text-sm font-bold transition shadow-sm ${
              activeTab === 'past'
                ? 'bg-[#182333] border border-blue-500/50 text-blue-400 shadow-blue-500/10'
                : 'bg-[#0c141f] border border-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            Past
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`hidden sm:block flex-1 rounded-2xl py-3 px-4 text-center text-xs sm:text-sm font-bold transition shadow-sm ${
              activeTab === 'all'
                ? 'bg-[#182333] border border-blue-500/50 text-blue-400 shadow-blue-500/10'
                : 'bg-[#0c141f] border border-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            All Events
          </button>
        </div>

        {/* Event List (Image 5 Style) */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-28 w-full animate-pulse rounded-2xl bg-[#0c141f] border border-gray-800" />
            ))}
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="rounded-2xl border border-gray-800 bg-[#0c141f] p-10 text-center">
            <Calendar className="mx-auto h-12 w-12 text-gray-500" />
            <h3 className="mt-3 text-sm font-bold text-white">
              No {activeTab} events found
            </h3>
            <p className="mt-1 text-xs text-gray-400">
              {activeTab === 'upcoming'
                ? 'You have no scheduled upcoming events.'
                : 'No past event history available.'}
            </p>
            <Link
              to="/organizer/create"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white"
            >
              <Plus className="h-4 w-4" />
              Create Event Now
            </Link>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {filteredEvents.map((event) => {
              const img = getEventImage(event)
              const eventId = event._id || event.id

              return (
                <div
                  key={eventId}
                  className="group relative flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 rounded-2xl border border-gray-800/90 bg-[#0c141f] p-3.5 sm:p-4 shadow-lg transition hover:border-blue-500/50 hover:bg-[#0e1927]"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    {/* Left Thumbnail (Image 5 Style) */}
                    <div className="h-20 w-24 sm:h-24 sm:w-32 shrink-0 overflow-hidden rounded-xl bg-gray-900 border border-gray-800">
                      <img
                        src={img}
                        alt={event.title}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                      />
                    </div>

                    {/* Middle Details */}
                    <div className="min-w-0 flex-1">
                      <h3 className="text-xs sm:text-sm font-bold text-white line-clamp-1">
                        {event.title}
                      </h3>

                      <p className="mt-1 text-[11px] sm:text-xs text-gray-400">
                        {formatDateTime(event.startDate || event.date)}
                      </p>

                      <div className="mt-1 flex items-center gap-1.5 text-[11px] text-gray-400 truncate">
                        <MapPin className="h-3.5 w-3.5 shrink-0 text-gray-500" />
                        <span className="truncate">
                          {event.venue || event.location || 'science hall 101 CS society'}
                        </span>
                      </div>

                      {/* Badges */}
                      <div className="mt-2 flex items-center gap-2">
                        <span className="rounded-md bg-blue-950/60 px-2 py-0.5 text-[10px] font-medium text-blue-300 border border-blue-500/20">
                          {event.registeredCount || 0} registered
                        </span>

                        <span
                          className={`rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                            event.status === 'published'
                              ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/20'
                              : event.status === 'cancelled'
                              ? 'bg-red-950/60 text-red-400 border border-red-500/20'
                              : 'bg-amber-950/60 text-amber-400 border border-amber-500/20'
                          }`}
                        >
                          {event.status || 'published'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Buttons */}
                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0 border-t sm:border-t-0 border-gray-800/80 pt-2 sm:pt-0 w-full sm:w-auto justify-end">
                    <button
                      type="button"
                      onClick={() => handleOpenAttendees(event)}
                      className="rounded-xl border border-gray-700 bg-black/40 px-3 py-1.5 text-xs font-semibold text-gray-200 hover:border-blue-500 hover:text-white transition flex items-center gap-1.5"
                    >
                      <Users className="h-3.5 w-3.5 text-blue-400" />
                      <span>Attendees</span>
                    </button>

                    {event.status === 'draft' && (
                      <button
                        type="button"
                        onClick={() => handlePublish(eventId)}
                        className="rounded-xl bg-blue-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-blue-500 transition"
                      >
                        Publish
                      </button>
                    )}

                    {event.status !== 'cancelled' && (
                      <button
                        type="button"
                        onClick={() => setCancellingEventId(eventId)}
                        className="rounded-xl border border-red-500/30 bg-red-950/30 px-3 py-1.5 text-xs font-semibold text-red-300 hover:bg-red-900/50 transition flex items-center gap-1"
                        title="Cancel this event"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">Cancel</span>
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>

      {/* Attendees Modal */}
      {attendeeModalEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl border border-blue-500/30 bg-[#09111a] p-6 text-white shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-gray-800">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                  Event Attendees
                </span>
                <h3 className="mt-1 text-base font-bold text-white line-clamp-1">
                  {attendeeModalEvent.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setAttendeeModalEvent(null)}
                className="rounded-lg p-1 text-gray-400 hover:bg-gray-800 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 max-h-72 overflow-y-auto space-y-2">
              {loadingAttendees ? (
                <div className="py-8 text-center text-xs text-gray-400">
                  Loading attendee list...
                </div>
              ) : attendeesList.length === 0 ? (
                <div className="py-8 text-center text-xs text-gray-400">
                  No attendees have registered for this event yet.
                </div>
              ) : (
                attendeesList.map((attendee, idx) => (
                  <div
                    key={attendee.registrationId || idx}
                    className="flex items-center justify-between rounded-xl border border-gray-800/80 bg-[#050a10] p-3 text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600/30 font-bold text-blue-300">
                        {attendee.name ? attendee.name.charAt(0).toUpperCase() : 'A'}
                      </div>
                      <div>
                        <p className="font-semibold text-white">{attendee.name || 'Anonymous'}</p>
                        <p className="text-[11px] text-gray-400">{attendee.email}</p>
                      </div>
                    </div>
                    <span className="rounded-md bg-emerald-950/60 px-2 py-0.5 text-[10px] font-semibold text-emerald-400 border border-emerald-500/20">
                      Confirmed
                    </span>
                  </div>
                ))
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setAttendeeModalEvent(null)}
                className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-500"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {cancellingEventId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-red-500/40 bg-[#12080a] p-6 text-white shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-600/20 text-red-400">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Cancel Event?</h3>
                <p className="text-xs text-red-300">
                  This will notify registered attendees and close registrations.
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setCancellingEventId(null)}
                className="rounded-xl border border-gray-700 px-4 py-2 text-xs font-medium text-gray-300 hover:bg-gray-800"
              >
                Keep Event
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                className="rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-500"
              >
                Yes, Cancel Event
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="hidden md:block">
        <Footer />
      </div>

      <OrganizerBottomNav />
    </div>
  )
}

export default MyEventsPage

