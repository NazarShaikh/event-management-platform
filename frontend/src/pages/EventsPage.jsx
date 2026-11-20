import { useState, useMemo, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Search,
  Star,
  Zap,
  Calendar,
  Heart,
  ArrowRight,
  Menu,
  Check,
  X,
  Ticket,
  MapPin,
  Clock,
  Users,
} from 'lucide-react'
import { getEvents } from '../services/eventApi'
import { registerForEvent } from '../services/registrationApi'
import { getEventImage, formatEventDate } from '../utils/eventHelpers'
import Header from '../components/layout/header'
import Navbar from '../components/layout/navbar'
import Footer from '../components/layout/footer'
import BottomNav from '../components/layout/BottomNav'
import Sidebar from '../components/layout/Sidebar'
import { useSidebar } from '../context/SidebarContext'

// Categories list
const eventCategories = [
  'All',
  'Technology',
  'Workshop',
  'Education',
  'Music',
  'Sport',
  'Conference',
  'Food & drink',
  'Service',
  'Movies',
  'Yoga',
  'Health',
]

function EventsPage() {
  const navigate = useNavigate()
  const { openSidebar } = useSidebar()

  const [allEvents, setAllEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')

  // Starred / favorites state in localStorage
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('ellevents_favorites')
      return saved ? JSON.parse(saved) : {}
    } catch {
      return {}
    }
  })

  // Registration modal state
  const [registerModalEvent, setRegisterModalEvent] = useState(null)
  const [registering, setRegistering] = useState(false)
  const [registrationSuccess, setRegistrationSuccess] = useState(false)
  const [registrationMessage, setRegistrationMessage] = useState('')

  // Fetch real events directly from deployed backend
  useEffect(() => {
    let cancelled = false

    const fetchEventsFromBackend = async () => {
      try {
        setLoading(true)
        setError('')
        const res = await getEvents({
          search: searchQuery,
          category: selectedCategory === 'All' ? '' : selectedCategory,
          limit: 50,
        })

        if (!cancelled) {
          setAllEvents(res?.events || [])
        }
      } catch (err) {
        if (!cancelled) {
          console.error('Backend events fetch error:', err)
          setError('Unable to load events from server. Please try again.')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchEventsFromBackend()

    return () => {
      cancelled = true
    }
  }, [searchQuery, selectedCategory])

  const toggleFavorite = (id) => {
    setFavorites((prev) => {
      const updated = { ...prev, [id]: !prev[id] }
      try {
        localStorage.setItem('ellevents_favorites', JSON.stringify(updated))
      } catch {
        // ignore
      }
      return updated
    })
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    // Triggered automatically via state dependency or navigate to search
  }

  const handleCategoryClick = (cat) => {
    setSelectedCategory((prev) => (prev === cat ? 'All' : cat))
  }

  const handleRegisterClick = (event) => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login', { state: { from: `/events/${event._id || event.id}` } })
      return
    }

    setRegisterModalEvent(event)
    setRegistrationSuccess(false)
    setRegistrationMessage('')
  }

  const confirmRegistration = async () => {
    if (!registerModalEvent) return
    try {
      setRegistering(true)
      const res = await registerForEvent(registerModalEvent._id || registerModalEvent.id)
      setRegistrationSuccess(true)
      setRegistrationMessage(res.message || 'You have registered successfully!')

      // Update registered count in local event state
      setAllEvents((prev) =>
        prev.map((e) =>
          (e._id || e.id) === (registerModalEvent._id || registerModalEvent.id)
            ? { ...e, registeredCount: (e.registeredCount || 0) + 1 }
            : e
        )
      )

      setTimeout(() => {
        setRegistrationSuccess(false)
        setRegisterModalEvent(null)
      }, 1800)
    } catch (err) {
      setRegistrationMessage(
        err.response?.data?.message || err.message || 'Registration failed.'
      )
    } finally {
      setRegistering(false)
    }
  }

  return (
    <div className="min-h-screen bg-black pb-24 text-white">
      <Sidebar />

      {/* Desktop Header and Navbar */}
      <div className="hidden md:block mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 border-b border-gray-900">
        <Header />
        <Navbar />
      </div>

      {/* Main Container */}
      <div className="mx-auto max-w-xl bg-[#8a989e] px-4 py-3 sm:max-w-2xl sm:bg-[#20272c] sm:px-6 md:max-w-7xl md:border-none md:bg-transparent md:px-8 md:py-6">
        
        {/* Mobile Top Header Bar */}
        <header className="flex md:hidden items-center gap-2 pt-1 pb-3">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white transition hover:bg-black/20"
            aria-label="Back to home"
          >
            <ArrowLeft className="h-6 w-6 stroke-[2.5]" />
          </button>

          {/* Search Input Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="flex flex-1 items-center overflow-hidden rounded-xl border border-gray-900/60 bg-[#141b24] shadow-inner"
          >
            <div className="pl-3 text-gray-400">
              <Search className="h-4 w-4" />
            </div>

            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search event, keyword..."
              className="w-full bg-transparent px-2.5 py-2 text-xs sm:text-sm text-white placeholder-gray-400 focus:outline-none"
            />

            <button
              type="submit"
              aria-label="Submit search"
              className="flex h-8 w-8 items-center justify-center m-1 rounded-lg bg-fuchsia-600 text-white transition hover:bg-fuchsia-500 shrink-0"
            >
              <Search className="h-4 w-4 stroke-[2.5]" />
            </button>
          </form>

          {/* Sidebar Drawer trigger */}
          <button
            type="button"
            onClick={openSidebar}
            title="Open Menu"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-sky-400/40 bg-[#09222c] text-sky-300 shadow-md transition hover:bg-sky-900/50"
          >
            <Menu className="h-5 w-5" />
          </button>
        </header>

        {/* Desktop Breadcrumbs and Search Bar */}
        <div className="hidden md:flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Link to="/" className="hover:text-white transition">Home</Link>
            <span>/</span>
            <span className="text-fuchsia-400 font-semibold">Explore Events</span>
          </div>

          <div className="flex w-full max-w-md items-center overflow-hidden rounded-xl border border-gray-800 bg-[#11141a] px-3 py-1.5 focus-within:border-fuchsia-500 transition">
            <Search className="h-4 w-4 text-gray-400 mr-2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search backend events..."
              className="w-full bg-transparent text-sm text-white placeholder-gray-500 outline-none"
            />
          </div>
        </div>

        {/* Hero Banner matching Image 2 */}
        <section className="relative mt-2 overflow-hidden rounded-3xl bg-gradient-to-r from-[#0d0725] via-[#1a0a3a] to-[#2b0838] p-5 text-white shadow-2xl md:p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="z-10 max-w-lg">
              <span className="inline-block rounded-full border border-fuchsia-400/30 bg-fuchsia-950/60 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-fuchsia-300 mb-3">
                Live Server Events
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-black leading-tight">
                Find your Next <br />
                <span className="text-[#39df78] drop-shadow-[0_0_16px_rgba(57,223,120,0.6)]">
                  Amazing Event
                </span>
              </h2>

              <p className="mt-3 text-xs sm:text-sm text-gray-300 leading-relaxed hidden sm:block">
                Browse real events hosted on the deployed server. Book tickets, explore topics, and connect.
              </p>

              <div className="mt-5 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedCategory('All')}
                  className="inline-flex items-center gap-1.5 rounded-full border border-purple-400/40 bg-black/60 px-4 py-2 text-xs font-semibold text-white backdrop-blur-md transition hover:bg-white/10"
                >
                  Browse All Events <ArrowRight className="h-3.5 w-3.5" />
                </button>
                <Link
                  to="/search"
                  className="text-xs font-semibold text-fuchsia-300 hover:text-white transition"
                >
                  Search Filter &rarr;
                </Link>
              </div>
            </div>

            {/* Category preview pills */}
            <div className="grid grid-cols-4 gap-2 max-w-md w-full">
              {[
                { name: 'Tech', cat: 'Technology', img: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=200' },
                { name: 'Workshop', cat: 'Workshop', img: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=200' },
                { name: 'Education', cat: 'Education', img: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=200' },
                { name: 'Music', cat: 'Music', img: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=200' },
              ].map((item) => (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => setSelectedCategory(item.cat)}
                  className="flex flex-col items-center rounded-xl border border-purple-500/30 bg-black/50 p-1.5 text-center transition hover:border-fuchsia-400 hover:scale-105"
                >
                  <img
                    src={item.img}
                    alt={item.name}
                    className="h-14 sm:h-16 w-full rounded-lg object-cover"
                  />
                  <span className="mt-1 text-[10px] sm:text-xs font-medium text-gray-200">
                    {item.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Section: Explore categories */}
        <section className="mt-6 md:mt-10">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-base sm:text-lg md:text-2xl font-bold text-white">
                Explore categories
              </h3>
              <p className="hidden md:block text-xs text-gray-400 mt-0.5">
                Filter live backend events by category
              </p>
            </div>
            {selectedCategory !== 'All' && (
              <button
                type="button"
                onClick={() => setSelectedCategory('All')}
                className="text-xs text-fuchsia-400 hover:underline"
              >
                Reset Filter
              </button>
            )}
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-6 gap-2 sm:gap-2.5">
            {eventCategories.map((category) => {
              const isSelected = selectedCategory === category
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => handleCategoryClick(category)}
                  className={`rounded-xl py-2.5 px-1.5 text-center text-[11px] sm:text-xs font-medium transition duration-200 shadow-sm ${
                    isSelected
                      ? 'bg-fuchsia-700 text-white ring-2 ring-fuchsia-400 font-bold scale-[1.03] shadow-fuchsia-600/30'
                      : 'bg-[#816584] text-gray-100 hover:bg-[#927395] hover:text-white border border-[#6b526e]'
                  }`}
                >
                  {category}
                </button>
              )
            })}
          </div>
        </section>

        {/* Section: Real Backend Events */}
        <section className="mt-8 md:mt-12">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
              <h3 className="text-base sm:text-lg md:text-2xl font-bold text-white">
                Published Events ({allEvents.length})
              </h3>
            </div>
            <span className="text-xs text-teal-400 font-medium">Live from Server</span>
          </div>

          {loading && (
            <div className="py-12 text-center text-sm text-gray-400">
              Loading live events from deployed server...
            </div>
          )}

          {error && (
            <div className="p-4 rounded-xl border border-red-500/30 bg-red-950/20 text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          {!loading && allEvents.length === 0 && (
            <div className="rounded-2xl border border-gray-800 bg-black/40 p-12 text-center my-6 md:bg-[#11141a]">
              <Calendar className="mx-auto h-10 w-10 text-gray-500" />
              <p className="mt-3 text-base font-semibold text-white">No events found</p>
              <p className="mt-1 text-xs text-gray-400">
                {selectedCategory !== 'All'
                  ? `There are currently no events under "${selectedCategory}". Try another category.`
                  : 'No published events on the server currently.'}
              </p>
              {selectedCategory !== 'All' && (
                <button
                  type="button"
                  onClick={() => setSelectedCategory('All')}
                  className="mt-4 rounded-xl bg-fuchsia-600 px-4 py-2 text-xs font-semibold text-white hover:bg-fuchsia-500"
                >
                  Show All Events
                </button>
              )}
            </div>
          )}

          {/* Real Backend Events Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {allEvents.map((ev) => {
              const eventId = ev._id || ev.id
              const isFav = !!favorites[eventId]
              const evImage = getEventImage(ev)

              return (
                <div
                  key={eventId}
                  className="overflow-hidden rounded-2xl border border-gray-700/60 bg-[#909da4] shadow-md dark:bg-[#12161e] md:border-gray-800 transition duration-300 hover:-translate-y-1 hover:border-fuchsia-500/50 flex flex-col justify-between"
                >
                  {/* Image with heart favorite */}
                  <div className="relative h-40 w-full overflow-hidden bg-black/40">
                    <img
                      src={evImage}
                      alt={ev.title}
                      className="h-full w-full object-cover transition duration-300 hover:scale-105"
                    />
                    <span className="absolute left-2.5 bottom-2.5 rounded-md bg-fuchsia-600 px-2.5 py-0.5 text-xs font-bold text-white shadow">
                      {ev.category || 'Event'}
                    </span>

                    <button
                      type="button"
                      onClick={() => toggleFavorite(eventId)}
                      className="absolute right-2.5 top-2.5 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm transition hover:scale-110"
                    >
                      <Heart
                        className={`h-4 w-4 ${
                          isFav ? 'fill-red-500 text-red-500' : 'text-white'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Content */}
                  <div className="p-4 flex flex-col justify-between flex-1">
                    <div>
                      <h4 className="text-sm sm:text-base font-bold text-white line-clamp-1">
                        {ev.title}
                      </h4>
                      <p className="mt-1 text-xs text-gray-300 line-clamp-2">
                        {ev.description}
                      </p>

                      <div className="mt-3 space-y-1 text-xs text-gray-300">
                        <p className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5 text-fuchsia-400 shrink-0" />
                          <span>{formatEventDate(ev.startDate)}</span>
                        </p>
                        <p className="flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5 text-teal-400 shrink-0" />
                          <span>{ev.venue || 'Pune, Maharashtra'}</span>
                        </p>
                        <p className="flex items-center gap-1.5 text-gray-400">
                          <Users className="h-3.5 w-3.5 text-sky-400 shrink-0" />
                          <span>{ev.registeredCount ?? 0} registered / {ev.capacity || 'Open'} seats</span>
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center gap-2 pt-2 border-t border-gray-800">
                      <button
                        type="button"
                        onClick={() => handleRegisterClick(ev)}
                        className="flex-1 rounded-xl bg-[#2563eb] py-2 text-center text-xs font-semibold text-white transition hover:bg-blue-500 shadow"
                      >
                        Register Now
                      </button>
                      <Link
                        to={`/events/${eventId}`}
                        className="rounded-xl border border-gray-700 px-3 py-2 text-xs font-semibold text-gray-300 hover:text-white hover:bg-gray-800 transition"
                      >
                        Details
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

      </div>

      {/* Desktop Footer */}
      <div className="hidden md:block mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-12 border-t border-gray-900">
        <Footer />
      </div>

      {/* Quick Registration Modal */}
      {registerModalEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-sky-400/30 bg-[#091e24] p-5 text-white shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-gray-800">
              <h3 className="text-base font-bold flex items-center gap-2 text-teal-300">
                <Ticket className="h-5 w-5 text-sky-400" />
                Event Registration
              </h3>
              <button
                type="button"
                onClick={() => setRegisterModalEvent(null)}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {registrationSuccess ? (
              <div className="py-6 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                  <Check className="h-7 w-7" />
                </div>
                <h4 className="mt-3 text-base font-bold text-white">Registered Successfully!</h4>
                <p className="text-xs text-gray-300 mt-1">
                  {registrationMessage || `You are confirmed for ${registerModalEvent.title}. Pass is saved to your Attendee profile.`}
                </p>
              </div>
            ) : (
              <div className="mt-4 space-y-3">
                <div className="flex gap-3 items-center rounded-xl bg-black/40 p-2.5 border border-teal-500/20">
                  <img
                    src={getEventImage(registerModalEvent)}
                    alt={registerModalEvent.title}
                    className="h-12 w-12 rounded-lg object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-bold text-white">
                      {registerModalEvent.title}
                    </p>
                    <p className="text-[10px] text-gray-400">
                      {formatEventDate(registerModalEvent.startDate)}
                    </p>
                    <p className="text-[10px] text-teal-400">
                      📍 {registerModalEvent.venue}
                    </p>
                  </div>
                </div>

                <div className="rounded-xl bg-black/30 p-2.5 text-xs text-gray-300 space-y-1">
                  <p>👤 Role: <span className="font-semibold text-teal-300">Attendee</span></p>
                  <p>🎟️ Capacity: <span className="font-semibold text-white">{registerModalEvent.capacity || 'Unlimited'} seats</span></p>
                  <p className="text-[10px] text-gray-400">Official server registration.</p>
                </div>

                {registrationMessage && !registrationSuccess && (
                  <p className="text-xs text-red-400">{registrationMessage}</p>
                )}

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setRegisterModalEvent(null)}
                    className="rounded-lg border border-gray-700 px-3 py-1.5 text-xs text-gray-300 hover:bg-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={confirmRegistration}
                    disabled={registering}
                    className="rounded-lg bg-blue-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-blue-500 transition disabled:opacity-50"
                  >
                    {registering ? 'Registering...' : 'Confirm Registration'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Bottom Navigation for Mobile */}
      <BottomNav />
    </div>
  )
}

export default EventsPage
