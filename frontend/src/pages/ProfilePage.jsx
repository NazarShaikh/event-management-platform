import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import {
  ArrowLeft,
  SquarePen,
  Share2,
  Check,
  Star,
  Ticket,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  Calendar,
  Download,
  Trash2,
  ShieldCheck,
  MapPin,
  Clock,
} from 'lucide-react'
import { getMyRegistrations, cancelRegistration } from '../services/registrationApi'
import { getEvents } from '../services/eventApi'
import { getEventImage, formatEventDate } from '../utils/eventHelpers'
import Header from '../components/layout/header'
import Navbar from '../components/layout/navbar'
import Footer from '../components/layout/footer'
import BottomNav from '../components/layout/BottomNav'
import Sidebar from '../components/layout/Sidebar'
import { useSidebar } from '../context/SidebarContext'

function ProfilePage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const initialTab = searchParams.get('tab') || 'registered'

  const {
    openSidebar,
    notificationsEnabled,
    setNotificationsEnabled,
    userRole,
    setUserRole,
    currentUser,
    setCurrentUser,
  } = useSidebar()

  const [activeTab, setActiveTab] = useState(initialTab)
  const [copied, setCopied] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  // Real logged-in user details
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('user')
      if (stored) return JSON.parse(stored)
    } catch {
      // ignore
    }
    return {
      name: 'Attendee',
      email: 'attendee@allevents.com',
      role: 'attendee',
    }
  })

  // Format display role: strictly 'Attendee' or 'Organizer'
  const displayRole = user.role?.toLowerCase() === 'organizer' ? 'Organizer' : 'Attendee'

  const [userBio, setUserBio] = useState(
    'Attendee enjoying learning opportunities, technical summits, and live events.'
  )

  // Real backend registrations
  const [registrations, setRegistrations] = useState([])
  const [loadingRegistrations, setLoadingRegistrations] = useState(true)

  // Starred events
  const [starredList, setStarredList] = useState([])
  const [allBackendEvents, setAllBackendEvents] = useState([])

  useEffect(() => {
    let cancelled = false

    const loadProfileData = async () => {
      try {
        setLoadingRegistrations(true)

        // 1. Load real registrations from backend
        const userRegs = await getMyRegistrations()
        if (!cancelled) {
          setRegistrations(userRegs || [])
        }

        // 2. Load all backend events to match with favorites
        const res = await getEvents({ limit: 50 })
        const backendEvents = res?.events || []
        if (!cancelled) {
          setAllBackendEvents(backendEvents)

          try {
            const rawFavs = localStorage.getItem('ellevents_favorites')
            const favMap = rawFavs ? JSON.parse(rawFavs) : {}
            const matched = backendEvents.filter((e) => favMap[e._id || e.id])
            setStarredList(matched)
          } catch {
            setStarredList([])
          }
        }
      } catch (err) {
        console.error('Error loading backend profile data:', err)
      } finally {
        if (!cancelled) setLoadingRegistrations(false)
      }
    }

    loadProfileData()

    // Read stored user from localStorage
    try {
      const stored = localStorage.getItem('user')
      if (stored) {
        const parsed = JSON.parse(stored)
        setUser(parsed)
      }
    } catch {
      // ignore
    }

    return () => {
      cancelled = true
    }
  }, [])

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${user.name} Profile - AllEvents`,
          url: window.location.href,
        })
      } else {
        await navigator.clipboard.writeText(window.location.href)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }
    } catch {
      // User cancelled
    }
  }

  const handleCancelBooking = async (regId) => {
    if (!window.confirm('Are you sure you want to cancel this event registration?')) return
    try {
      await cancelRegistration(regId)
      setRegistrations((prev) =>
        prev.map((r) => (r._id === regId ? { ...r, status: 'cancelled' } : r))
      )
      alert('Registration has been cancelled.')
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Failed to cancel registration.')
    }
  }

  const handleSaveProfile = (e) => {
    e.preventDefault()
    try {
      localStorage.setItem('user', JSON.stringify(user))
      setCurrentUser(user)
    } catch {
      // ignore
    }
    setIsEditModalOpen(false)
  }

  const handleRoleSwitch = (newRole) => {
    const formatted = newRole.toLowerCase() === 'organizer' ? 'organizer' : 'attendee'
    const updated = { ...user, role: formatted }
    setUser(updated)
    setUserRole(formatted === 'organizer' ? 'Organizer' : 'Attendee')
    try {
      localStorage.setItem('user', JSON.stringify(updated))
    } catch {
      // ignore
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
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
        
        {/* Mobile Top Header */}
        <header className="flex md:hidden items-center justify-between pt-1 pb-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex h-9 w-9 items-center justify-center rounded-full text-white transition hover:bg-black/20"
              aria-label="Back"
            >
              <ArrowLeft className="h-6 w-6 stroke-[2.5]" />
            </button>
            <h1 className="text-lg font-bold text-white">Profile</h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleShare}
              className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-gray-700 bg-black/40 text-gray-200 hover:text-white"
              title="Share Profile"
            >
              {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Share2 className="h-4 w-4" />}
            </button>

            <button
              type="button"
              onClick={openSidebar}
              title="Open Navigation Menu"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-sky-400/40 bg-[#09222c] text-sky-300 shadow-md transition hover:bg-sky-900/50"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </header>

        {/* Desktop Breadcrumbs */}
        <div className="hidden md:flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Link to="/" className="hover:text-white transition">Home</Link>
            <span>/</span>
            <span className="text-fuchsia-400 font-semibold">User Profile & Account</span>
          </div>

          <button
            type="button"
            onClick={handleShare}
            className="flex items-center gap-1.5 rounded-xl border border-gray-800 bg-[#12161f] px-3 py-1.5 text-xs text-gray-300 hover:text-white hover:border-gray-700 transition"
          >
            {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Share2 className="h-4 w-4" />}
            <span>{copied ? 'Profile Link Copied!' : 'Share Profile'}</span>
          </button>
        </div>

        {/* Grid Container for Desktop: 2 Columns */}
        <div className="md:grid md:grid-cols-12 md:gap-8">
          
          {/* Column 1 (Left on desktop, 4 cols): Profile Card & Quick Info */}
          <div className="md:col-span-4 space-y-4">
            <div className="rounded-2xl border border-teal-500/30 bg-[#07191d]/90 p-5 shadow-xl backdrop-blur-md">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80"
                      alt={user.name}
                      className="h-20 w-20 rounded-full border-2 border-teal-400/80 object-cover shadow-lg"
                    />
                    <span className="absolute bottom-0 right-1 h-4 w-4 rounded-full border-2 border-[#07191d] bg-emerald-500" />
                  </div>

                  <div>
                    <h2 className="text-xl font-bold text-white">{user.name}</h2>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="rounded-md border border-teal-500/40 bg-teal-950/60 px-2.5 py-0.5 text-xs font-semibold text-teal-300">
                        {displayRole}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">{user.email}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(true)}
                  title="Edit Profile"
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-teal-500/30 bg-[#0a2b34] text-teal-300 hover:border-teal-400 hover:text-white transition shrink-0"
                >
                  <SquarePen className="h-4 w-4" />
                </button>
              </div>

              <p className="mt-4 text-xs text-gray-300 leading-relaxed">
                {userBio}
              </p>

              {/* Quick Stats Grid with REAL backend counts */}
              <div className="mt-5 grid grid-cols-3 gap-2 border-t border-[#133c46] pt-4 text-center">
                <div className="rounded-xl bg-black/40 p-2.5 border border-teal-500/10">
                  <p className="text-lg font-bold text-white">{registrations.length}</p>
                  <p className="text-[10px] text-gray-400">Bookings</p>
                </div>
                <div className="rounded-xl bg-black/40 p-2.5 border border-teal-500/10">
                  <p className="text-lg font-bold text-teal-300">
                    {displayRole === 'Organizer' ? allBackendEvents.length : 0}
                  </p>
                  <p className="text-[10px] text-gray-400">Organized</p>
                </div>
                <div className="rounded-xl bg-black/40 p-2.5 border border-teal-500/10">
                  <p className="text-lg font-bold text-amber-400">{starredList.length}</p>
                  <p className="text-[10px] text-gray-400">Starred</p>
                </div>
              </div>

              {/* Verified account badge */}
              <div className="mt-4 flex items-center gap-2 rounded-xl bg-teal-950/40 p-2.5 border border-teal-500/20 text-xs text-teal-300">
                <ShieldCheck className="h-4 w-4 text-teal-400 shrink-0" />
                <span>Verified {displayRole} Account</span>
              </div>

              {/* Organizer Dashboard Quick Jump (Only for Organizers) */}
              {displayRole === 'Organizer' && (
                <div className="mt-3">
                  <Link
                    to="/organizer"
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-2.5 text-xs font-bold text-white shadow-md hover:bg-blue-500 transition"
                  >
                    Open Organizer Dashboard →
                  </Link>
                </div>
              )}
            </div>

            {/* Desktop Side Quick Actions */}
            <div className="hidden md:block rounded-2xl border border-gray-800 bg-[#11141a] p-4 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                Quick Actions
              </h4>
              <button
                type="button"
                onClick={openSidebar}
                className="flex w-full items-center justify-between rounded-xl border border-sky-500/30 bg-sky-950/30 px-3 py-2 text-xs font-semibold text-sky-300 hover:bg-sky-900/50 transition"
              >
                <span>Open Navigation Sidebar</span>
                <span>&rarr;</span>
              </button>
              <button
                type="button"
                onClick={() => navigate('/events')}
                className="flex w-full items-center justify-between rounded-xl border border-gray-800 px-3 py-2 text-xs text-gray-300 hover:bg-gray-800 hover:text-white transition"
              >
                <span>Browse All Events</span>
                <span>&rarr;</span>
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center justify-between rounded-xl border border-red-500/30 bg-red-950/20 px-3 py-2 text-xs font-semibold text-red-400 hover:bg-red-900/40 transition"
              >
                <span>Logout Session</span>
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Column 2 (Right on desktop, 8 cols): Tabbed Sections */}
          <div className="md:col-span-8 mt-6 md:mt-0">
            {/* Profile Tabs */}
            <div className="flex gap-1.5 rounded-2xl border border-gray-700/60 bg-black/50 p-1.5 md:bg-[#11141a] md:border-gray-800">
              <button
                type="button"
                onClick={() => setActiveTab('registered')}
                className={`flex-1 rounded-xl py-2.5 text-center text-xs sm:text-sm font-semibold transition ${
                  activeTab === 'registered'
                    ? 'bg-fuchsia-600 text-white shadow-md shadow-fuchsia-600/30'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                My Tickets ({registrations.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('starred')}
                className={`flex-1 rounded-xl py-2.5 text-center text-xs sm:text-sm font-semibold transition ${
                  activeTab === 'starred'
                    ? 'bg-fuchsia-600 text-white shadow-md shadow-fuchsia-600/30'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Saved Events ({starredList.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('settings')}
                className={`flex-1 rounded-xl py-2.5 text-center text-xs sm:text-sm font-semibold transition ${
                  activeTab === 'settings'
                    ? 'bg-fuchsia-600 text-white shadow-md shadow-fuchsia-600/30'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Settings
              </button>
            </div>

            {/* Tab 1: Real Backend Registered Events */}
            {activeTab === 'registered' && (
              <div className="mt-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                    <Ticket className="h-4 w-4 text-fuchsia-400" />
                    Booked Event Passes
                  </h3>
                  <span className="text-xs text-teal-400 font-medium">Backend Connected</span>
                </div>

                {loadingRegistrations && (
                  <p className="text-xs text-gray-400 py-6 text-center">Loading your registrations from server...</p>
                )}

                {!loadingRegistrations && registrations.length === 0 && (
                  <div className="rounded-2xl border border-gray-800 bg-black/40 p-8 text-center md:bg-[#11141a]">
                    <Ticket className="mx-auto h-10 w-10 text-gray-500" />
                    <p className="mt-2 text-sm font-semibold text-white">No active registrations yet</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Explore events on the platform and click "Register Now" with your Attendee account to book tickets.
                    </p>
                    <Link
                      to="/events"
                      className="mt-4 inline-block rounded-xl bg-fuchsia-600 px-5 py-2 text-xs font-semibold text-white hover:bg-fuchsia-500 transition"
                    >
                      Explore Events
                    </Link>
                  </div>
                )}

                {registrations.map((reg) => {
                  const ev = reg.event || {}
                  const isConfirmed = reg.status === 'confirmed'
                  const evImage = getEventImage(ev)

                  return (
                    <div
                      key={reg._id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 rounded-2xl bg-black/40 p-4 border border-gray-700/50 md:bg-[#11141a] md:border-gray-800 transition hover:border-gray-700"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <img
                          src={evImage}
                          alt={ev.title || 'Event'}
                          className="h-20 w-24 rounded-xl object-cover shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span
                              className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                                isConfirmed
                                  ? 'bg-teal-900/60 text-teal-300 border border-teal-500/30'
                                  : 'bg-red-900/60 text-red-300 border border-red-500/30'
                              }`}
                            >
                              {isConfirmed ? 'Confirmed Pass' : 'Cancelled'}
                            </span>
                            <span className="text-[10px] text-gray-400">
                              Pass #{reg._id?.slice(-6).toUpperCase()}
                            </span>
                          </div>

                          <h4 className="mt-1 truncate text-xs sm:text-sm font-bold text-white">
                            {ev.title || 'Event Registration'}
                          </h4>
                          <p className="text-[11px] text-gray-300 mt-0.5 flex items-center gap-1">
                            <Clock className="h-3 w-3 text-fuchsia-400" />
                            {formatEventDate(ev.startDate)}
                          </p>
                          <p className="text-[11px] text-gray-400 flex items-center gap-1">
                            <MapPin className="h-3 w-3 text-teal-400" />
                            {ev.venue || 'Pune, Maharashtra'}
                          </p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 sm:self-center shrink-0">
                        <Link
                          to={`/events/${ev._id || ev.id}`}
                          className="rounded-xl border border-gray-700 px-3 py-2 text-xs font-semibold text-gray-300 hover:text-white hover:bg-gray-800 transition"
                        >
                          View Event
                        </Link>

                        {isConfirmed && (
                          <button
                            type="button"
                            onClick={() => handleCancelBooking(reg._id)}
                            className="flex items-center gap-1 rounded-xl border border-gray-700 px-2.5 py-2 text-xs text-gray-400 hover:text-red-400 hover:border-red-500/50 transition"
                            title="Cancel Booking"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {/* Tab 2: Starred / Saved Events */}
            {activeTab === 'starred' && (
              <div className="mt-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    Saved & Bookmarked Events
                  </h3>
                  <span className="text-xs text-gray-400">{starredList.length} items</span>
                </div>

                {starredList.length === 0 ? (
                  <div className="rounded-2xl border border-gray-800 bg-black/40 p-8 text-center md:bg-[#11141a]">
                    <Star className="mx-auto h-8 w-8 text-gray-500" />
                    <p className="mt-2 text-sm font-semibold text-white">No saved events yet</p>
                    <p className="text-xs text-gray-400 mt-1">Click the star icon on any event to bookmark it here.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {starredList.map((ev) => (
                      <div
                        key={ev._id || ev.id}
                        className="flex items-center gap-3 rounded-2xl bg-black/40 p-3 border border-gray-700/50 md:bg-[#11141a] md:border-gray-800 hover:border-fuchsia-500/40 transition"
                      >
                        <img
                          src={getEventImage(ev)}
                          alt={ev.title}
                          className="h-20 w-24 rounded-xl object-cover shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <span className="rounded bg-fuchsia-950/80 text-fuchsia-300 px-2 py-0.5 text-[10px] font-bold">
                            {ev.category || 'Event'}
                          </span>
                          <h4 className="mt-1 truncate text-xs font-bold text-white">{ev.title}</h4>
                          <p className="text-[10px] text-gray-300">{formatEventDate(ev.startDate)}</p>
                          <p className="text-[10px] text-gray-400">{ev.venue}</p>

                          <Link
                            to={`/events/${ev._id || ev.id}`}
                            className="mt-2 inline-block text-xs font-semibold text-teal-300 hover:underline"
                          >
                            View Details &rarr;
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab 3: Settings (STRICTLY TWO ROLES: Attendee & Organizer) */}
            {activeTab === 'settings' && (
              <div className="mt-5 space-y-4">
                <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                  <Settings className="h-4 w-4 text-sky-400" />
                  Preferences & Account Settings
                </h3>

                {/* All notification switch */}
                <div className="rounded-2xl border border-sky-400/30 bg-black/50 p-4 md:bg-[#11141a]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Bell className="h-5 w-5 text-sky-400" />
                      <div>
                        <p className="text-xs sm:text-sm font-semibold text-white">All notification</p>
                        <p className="text-[11px] text-gray-400">Receive alerts for registered events and bookings</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      role="switch"
                      aria-checked={notificationsEnabled}
                      onClick={() => setNotificationsEnabled((prev) => !prev)}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                        notificationsEnabled ? 'bg-sky-500' : 'bg-gray-600'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ease-in-out ${
                          notificationsEnabled ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Role Switcher: STRICTLY TWO ROLES */}
                <div className="rounded-2xl border border-gray-700/50 bg-black/40 p-4 md:bg-[#11141a] md:border-gray-800">
                  <p className="text-xs sm:text-sm font-semibold text-white mb-2">Switch Active Role</p>
                  <p className="text-[11px] text-gray-400 mb-3">Choose between the two platform roles:</p>
                  <div className="grid grid-cols-2 gap-3">
                    {['Attendee', 'Organizer'].map((role) => (
                      <button
                        key={role}
                        type="button"
                        onClick={() => handleRoleSwitch(role)}
                        className={`rounded-xl py-2.5 text-center text-xs sm:text-sm font-semibold transition ${
                          displayRole === role
                            ? 'bg-teal-600 text-white font-bold shadow-lg shadow-teal-600/30 ring-2 ring-teal-400'
                            : 'bg-black/60 text-gray-400 hover:text-white border border-gray-800'
                        }`}
                      >
                        {role}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Account Details & Security */}
                <div className="rounded-2xl border border-gray-700/50 bg-black/40 p-4 space-y-3 md:bg-[#11141a] md:border-gray-800">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(true)}
                    className="flex w-full items-center justify-between text-xs sm:text-sm text-gray-200 hover:text-white"
                  >
                    <span>Edit Profile Details</span>
                    <span>&rarr;</span>
                  </button>
                  <div className="border-t border-gray-800" />
                  <button
                    type="button"
                    onClick={() => navigate('/notification-permission')}
                    className="flex w-full items-center justify-between text-xs sm:text-sm text-gray-200 hover:text-white"
                  >
                    <span>Browser Notification Permissions</span>
                    <span>&rarr;</span>
                  </button>
                  <div className="border-t border-gray-800" />
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center justify-between text-xs sm:text-sm font-semibold text-red-400 hover:text-red-300"
                  >
                    <span className="flex items-center gap-2">
                      <LogOut className="h-4 w-4" />
                      Logout from this Device
                    </span>
                    <span>&rarr;</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Desktop Footer */}
      <div className="hidden md:block mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-12 border-t border-gray-900">
        <Footer />
      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-teal-500/30 bg-[#091e24] p-5 text-white shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-gray-800">
              <h3 className="text-base font-bold flex items-center gap-2 text-teal-300">
                <SquarePen className="h-5 w-5 text-sky-400" />
                Edit Profile
              </h3>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="mt-4 space-y-3">
              <div>
                <label className="block text-[11px] font-medium text-gray-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={user.name}
                  onChange={(e) => setUser((u) => ({ ...u, name: e.target.value }))}
                  required
                  className="w-full rounded-xl border border-gray-700 bg-black/60 p-2.5 text-xs text-white focus:border-teal-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-gray-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={user.email}
                  onChange={(e) => setUser((u) => ({ ...u, email: e.target.value }))}
                  required
                  className="w-full rounded-xl border border-gray-700 bg-black/60 p-2.5 text-xs text-white focus:border-teal-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-gray-300 mb-1">
                  Role
                </label>
                <select
                  value={user.role?.toLowerCase() === 'organizer' ? 'organizer' : 'attendee'}
                  onChange={(e) => setUser((u) => ({ ...u, role: e.target.value }))}
                  className="w-full rounded-xl border border-gray-700 bg-black/60 p-2.5 text-xs text-white focus:border-teal-400 focus:outline-none"
                >
                  <option value="attendee">Attendee</option>
                  <option value="organizer">Organizer</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-gray-300 mb-1">
                  Bio
                </label>
                <textarea
                  rows={3}
                  value={userBio}
                  onChange={(e) => setUserBio(e.target.value)}
                  className="w-full rounded-xl border border-gray-700 bg-black/60 p-2.5 text-xs text-white focus:border-teal-400 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="rounded-lg border border-gray-700 px-3 py-1.5 text-xs text-gray-300 hover:bg-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-teal-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-teal-500 transition"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bottom Navigation for Mobile */}
      <BottomNav />
    </div>
  )
}

export default ProfilePage
