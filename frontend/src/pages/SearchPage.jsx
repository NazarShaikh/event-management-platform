import { useState, useMemo, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import {
  ArrowLeft,
  Search,
  ChevronDown,
  Download,
  Star,
  Menu,
  Check,
  X,
  Ticket,
  MapPin,
  Calendar,
  Clock,
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

const categoryOptions = [
  'All',
  'Technology',
  'Workshop',
  'Education',
  'Music',
  'Sport',
  'Conference',
  'Food & drink',
  'Service',
  'Health',
]

function SearchPage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const { openSidebar } = useSidebar()

  const initialQuery = searchParams.get('q') || ''
  const initialCategory = searchParams.get('category') || ''

  const [allEvents, setAllEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [selectedCategory, setSelectedCategory] = useState(initialCategory)

  // Open dropdown states
  const [activeDropdown, setActiveDropdown] = useState(null)

  // Starred / favorites state synced with localStorage
  const [starredEvents, setStarredEvents] = useState(() => {
    try {
      const saved = localStorage.getItem('ellevents_favorites')
      return saved ? JSON.parse(saved) : {}
    } catch {
      return {}
    }
  })

  // Ticket modal state
  const [ticketModalEvent, setTicketModalEvent] = useState(null)
  const [downloadSuccess, setDownloadSuccess] = useState(false)
  const [downloadError, setDownloadError] = useState('')

  // Fetch live backend events
  useEffect(() => {
    let cancelled = false
    const loadEvents = async () => {
      try {
        setLoading(true)
        const res = await getEvents({
          search: searchQuery,
          category: selectedCategory === 'All' ? '' : selectedCategory,
          limit: 50,
        })
        if (!cancelled) {
          setAllEvents(res?.events || [])
        }
      } catch (err) {
        console.error('Backend search error:', err)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    loadEvents()
    return () => {
      cancelled = true
    }
  }, [searchQuery, selectedCategory])

  useEffect(() => {
    if (initialQuery !== searchQuery) {
      setSearchQuery(initialQuery)
    }
  }, [initialQuery])

  const toggleDropdown = (name) => {
    setActiveDropdown((prev) => (prev === name ? null : name))
  }

  const toggleStar = (id) => {
    setStarredEvents((prev) => {
      const updated = { ...prev, [id]: !prev[id] }
      try {
        localStorage.setItem('ellevents_favorites', JSON.stringify(updated))
      } catch {
        // ignore
      }
      return updated
    })
  }

  const handleDownloadTicket = (event) => {
    setTicketModalEvent(event)
    setDownloadSuccess(false)
    setDownloadError('')
  }

  const triggerDownloadAction = async () => {
    if (!ticketModalEvent) return
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login', { state: { from: `/events/${ticketModalEvent._id || ticketModalEvent.id}` } })
      return
    }

    try {
      await registerForEvent(ticketModalEvent._id || ticketModalEvent.id)
      setDownloadSuccess(true)
      setTimeout(() => {
        setDownloadSuccess(false)
        setTicketModalEvent(null)
      }, 1600)
    } catch (err) {
      // If already registered or registered successfully
      if (err.response?.status === 409) {
        setDownloadSuccess(true)
        setTimeout(() => {
          setDownloadSuccess(false)
          setTicketModalEvent(null)
        }, 1600)
      } else {
        setDownloadError(err.response?.data?.message || err.message || 'Unable to book pass')
      }
    }
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    setSearchParams({
      ...(searchQuery.trim() ? { q: searchQuery.trim() } : {}),
      ...(selectedCategory && selectedCategory !== 'All' ? { category: selectedCategory } : {}),
    })
  }

  const resetAllFilters = () => {
    setSearchQuery('')
    setSelectedCategory('')
    setActiveDropdown(null)
    setSearchParams({})
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
        <header className="flex md:hidden items-center gap-2 pb-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white transition hover:bg-black/20"
            aria-label="Back"
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

        {/* Desktop Header / Breadcrumb & Title */}
        <div className="hidden md:flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Link to="/" className="hover:text-white transition">Home</Link>
              <span>/</span>
              <span className="text-fuchsia-400 font-semibold">Search Events</span>
            </div>
            <h2 className="text-3xl font-extrabold text-white mt-2">
              Search & Discover Server Events
            </h2>
          </div>

          <form
            onSubmit={handleSearchSubmit}
            className="flex w-full max-w-md items-center overflow-hidden rounded-xl border border-gray-800 bg-[#11141a] px-3 py-2 focus-within:border-fuchsia-500 transition"
          >
            <Search className="h-4 w-4 text-gray-400 mr-2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search event, keyword, venue..."
              className="w-full bg-transparent text-sm text-white placeholder-gray-500 outline-none"
            />
            <button
              type="submit"
              className="rounded-lg bg-fuchsia-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-fuchsia-500 transition"
            >
              Search
            </button>
          </form>
        </div>

        {/* Filter Pills Row matching Image 3 */}
        <div className="relative mb-5 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {/* 1. All filters pill */}
          <button
            type="button"
            onClick={resetAllFilters}
            className="flex shrink-0 items-center gap-1 rounded-xl bg-black px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-gray-900 border border-gray-800"
          >
            All filters <ChevronDown className="h-3 w-3" />
          </button>

          {/* 2. Category filter pill */}
          <div className="relative">
            <button
              type="button"
              onClick={() => toggleDropdown('category')}
              className={`flex shrink-0 items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold shadow-sm transition border ${
                selectedCategory && selectedCategory !== 'All'
                  ? 'bg-fuchsia-700 text-white border-fuchsia-500'
                  : 'bg-black text-white hover:bg-gray-900 border-gray-800'
              }`}
            >
              {selectedCategory && selectedCategory !== 'All' ? selectedCategory : 'Category'}{' '}
              <ChevronDown className="h-3 w-3" />
            </button>

            {activeDropdown === 'category' && (
              <div className="absolute left-0 top-10 z-30 max-h-56 w-44 overflow-y-auto rounded-xl border border-gray-700 bg-[#161c24] p-1 shadow-2xl">
                {categoryOptions.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      setSelectedCategory(cat)
                      setActiveDropdown(null)
                    }}
                    className={`block w-full rounded-lg px-3 py-1.5 text-left text-xs transition ${
                      selectedCategory === cat
                        ? 'bg-fuchsia-600 text-white font-bold'
                        : 'text-gray-300 hover:bg-white/10'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Results summary */}
        <div className="mb-4 flex items-center justify-between text-xs text-gray-300">
          <span>Found {allEvents.length} events from server</span>
          {(selectedCategory || searchQuery) && (
            <button
              type="button"
              onClick={resetAllFilters}
              className="text-fuchsia-300 hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>

        {loading && (
          <p className="text-sm text-gray-400 py-10 text-center">Loading backend events...</p>
        )}

        {/* Event Cards Vertical List matching Image 3 on Mobile, 2-column or 3-column on Desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {allEvents.map((event) => {
            const eventId = event._id || event.id
            const isStarred = !!starredEvents[eventId]
            const evImage = getEventImage(event)

            return (
              <div
                key={eventId}
                className="flex items-center gap-3.5 rounded-2xl bg-black/40 p-3 transition duration-200 hover:bg-black/60 md:border md:border-gray-800/80 md:bg-[#11141a] md:hover:border-fuchsia-500/40"
              >
                {/* Event Image on Left with rounded corners */}
                <div className="h-24 w-36 shrink-0 overflow-hidden rounded-2xl bg-gray-800 sm:h-28 sm:w-44">
                  <img
                    src={evImage}
                    alt={event.title}
                    className="h-full w-full object-cover transition duration-300 hover:scale-105"
                  />
                </div>

                {/* Event Details on Right */}
                <div className="flex min-w-0 flex-1 flex-col justify-between self-stretch py-0.5">
                  <div>
                    <h3 className="line-clamp-1 text-xs sm:text-sm font-semibold text-white">
                      {event.title}
                    </h3>

                    <p className="mt-1 line-clamp-1 text-[11px] sm:text-xs text-gray-300">
                      📍 {event.venue || 'Pune, Maharashtra'}
                    </p>

                    <p className="mt-1 text-[10px] sm:text-[11px] text-gray-300">
                      🗓️ {formatEventDate(event.startDate)}
                    </p>
                  </div>

                  {/* Bottom Action Icons matching Image 3 */}
                  <div className="mt-2 flex items-center justify-end gap-3 self-end">
                    <button
                      type="button"
                      onClick={() => handleDownloadTicket(event)}
                      title="Download Ticket Pass"
                      className="text-gray-200 transition hover:text-white hover:scale-110"
                    >
                      <Download className="h-4 w-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => toggleStar(eventId)}
                      title="Save / Star Event"
                      className="transition hover:scale-110"
                    >
                      <Star
                        className={`h-4 w-4 ${
                          isStarred
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {!loading && allEvents.length === 0 && (
          <div className="rounded-2xl border border-gray-700/60 bg-black/40 p-12 text-center my-6 md:bg-[#11141a]">
            <p className="text-base font-semibold text-white">No server events matched your search</p>
            <p className="mt-1 text-xs text-gray-400">
              Try searching for different terms or reset your filters.
            </p>
            <button
              type="button"
              onClick={resetAllFilters}
              className="mt-4 rounded-xl bg-fuchsia-600 px-5 py-2 text-xs font-semibold text-white hover:bg-fuchsia-500"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </div>

      {/* Desktop Footer */}
      <div className="hidden md:block mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-12 border-t border-gray-900">
        <Footer />
      </div>

      {/* Ticket Download / Registration Modal */}
      {ticketModalEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-teal-500/30 bg-[#091e24] p-5 text-white shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-gray-800">
              <h3 className="text-base font-bold flex items-center gap-2 text-teal-300">
                <Ticket className="h-5 w-5 text-sky-400" />
                Event Pass & Ticket
              </h3>
              <button
                type="button"
                onClick={() => setTicketModalEvent(null)}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {downloadSuccess ? (
              <div className="py-6 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                  <Check className="h-7 w-7" />
                </div>
                <h4 className="mt-3 text-base font-bold text-white">Ticket Pass Confirmed!</h4>
                <p className="text-xs text-gray-300 mt-1">
                  Pass for {ticketModalEvent.title} has been confirmed on the server and saved in your Profile.
                </p>
              </div>
            ) : (
              <div className="mt-4 space-y-3">
                <div className="flex gap-3 items-center rounded-xl bg-black/50 p-3 border border-teal-500/20">
                  <img
                    src={getEventImage(ticketModalEvent)}
                    alt={ticketModalEvent.title}
                    className="h-14 w-14 rounded-lg object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-bold text-white">
                      {ticketModalEvent.title}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      📍 {ticketModalEvent.venue}
                    </p>
                    <p className="text-[10px] text-teal-400 mt-0.5">
                      🗓️ {formatEventDate(ticketModalEvent.startDate)}
                    </p>
                  </div>
                </div>

                <div className="rounded-xl bg-black/40 p-3 text-xs text-gray-300 space-y-1">
                  <p className="flex justify-between">
                    <span className="text-gray-400">Category:</span>
                    <span className="font-semibold text-white">{ticketModalEvent.category || 'General'}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-gray-400">Seat Capacity:</span>
                    <span className="font-semibold text-teal-300">{ticketModalEvent.capacity || 'Open'} seats</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-gray-400">Entry Code:</span>
                    <span className="font-mono text-fuchsia-400">#EV-{ticketModalEvent._id?.slice(-6).toUpperCase()}</span>
                  </p>
                </div>

                {downloadError && (
                  <p className="text-xs text-red-400">{downloadError}</p>
                )}

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setTicketModalEvent(null)}
                    className="rounded-lg border border-gray-700 px-3 py-1.5 text-xs text-gray-300 hover:bg-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={triggerDownloadAction}
                    className="flex items-center gap-1.5 rounded-lg bg-sky-500 px-4 py-1.5 text-xs font-semibold text-white hover:bg-sky-400 transition"
                  >
                    <Download className="h-3.5 w-3.5" />
                    Book & Download Pass
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

export default SearchPage
