import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Bell, PlusCircle, Calendar, LayoutDashboard, ArrowRightLeft, Menu, Home } from 'lucide-react'
import { useSidebar } from '../../context/SidebarContext'

function OrganizerHeader({ title = 'AllEvents' }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { toggleSidebar } = useSidebar()
  const [user, setUser] = useState(null)
  const [notificationActive, setNotificationActive] = useState(false)
  const [notificationToast, setNotificationToast] = useState(null)

  useEffect(() => {
    try {
      const stored = localStorage.getItem('user')
      if (stored) {
        setUser(JSON.parse(stored))
      }
    } catch {
      // ignore
    }
  }, [])

  const handleNotificationClick = () => {
    setNotificationActive((prev) => !prev)
    setNotificationToast('Notification preferences updated for this session.')
    setTimeout(() => setNotificationToast(null), 3000)
  }

  const handleSwitchToAttendee = () => {
    if (user) {
      const updated = { ...user, role: 'attendee' }
      localStorage.setItem('user', JSON.stringify(updated))
      window.dispatchEvent(new Event('storage'))
    }
    navigate('/')
  }

  return (
    <>
      {/* Toast Notification */}
      {notificationToast && (
        <div className="fixed top-4 right-4 z-50 rounded-xl border border-blue-500/40 bg-[#0d1b2a] px-4 py-2.5 text-xs text-blue-300 shadow-2xl backdrop-blur-md animate-fade-in">
          🔔 {notificationToast}
        </div>
      )}

      {/* Desktop Header */}
      <header className="hidden md:block border-b border-gray-800 bg-[#05080e]/95 backdrop-blur-md sticky top-0 z-30">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3.5">
          {/* Logo -> App Homepage */}
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2.5 group" title="Return to App Homepage">
              <img
                src="/images/app-logo.png"
                alt="AllEvents logo"
                className="h-9 w-9 rounded-xl object-contain shadow-md shadow-blue-500/20 group-hover:scale-105 transition"
              />
              <span className="text-xl font-black tracking-tight text-white">
                all<span className="text-blue-500">events</span>
              </span>
            </Link>

            <span className="rounded-full border border-blue-500/40 bg-blue-950/60 px-3 py-0.5 text-xs font-bold text-blue-400">
              Organizer Hub
            </span>
          </div>

          {/* Navigation links */}
          <nav className="flex items-center gap-2">
            <Link
              to="/"
              className="rounded-lg px-3.5 py-1.5 text-xs font-semibold text-gray-300 hover:bg-gray-800 hover:text-white transition flex items-center gap-1.5"
              title="Browse public events & discover content"
            >
              <Home className="h-3.5 w-3.5 text-emerald-400" />
              <span>App Home</span>
            </Link>

            <Link
              to="/organizer"
              className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition ${
                location.pathname === '/organizer' || location.pathname === '/organizer/dashboard'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <LayoutDashboard className="h-3.5 w-3.5" />
                Dashboard
              </span>
            </Link>

            <Link
              to="/organizer/events"
              className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition ${
                location.pathname === '/organizer/events'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                My Events
              </span>
            </Link>

            <Link
              to="/organizer/create"
              className="rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-1.5 text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:brightness-110 transition flex items-center gap-1.5"
            >
              <PlusCircle className="h-3.5 w-3.5" />
              + Create Event
            </Link>
          </nav>

          {/* Right Action buttons */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleNotificationClick}
              aria-label="Toggle notifications"
              className="relative rounded-lg p-2 text-gray-300 hover:bg-gray-800 hover:text-white transition"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-blue-500 ring-2 ring-[#05080e]" />
            </button>

            <button
              type="button"
              onClick={handleSwitchToAttendee}
              className="flex items-center gap-1.5 rounded-lg border border-gray-700 bg-gray-900/60 px-3 py-1.5 text-xs font-medium text-gray-300 hover:border-blue-500 hover:text-white transition"
              title="Switch to public attendee mode"
            >
              <ArrowRightLeft className="h-3.5 w-3.5 text-blue-400" />
              <span>Attendee Mode</span>
            </button>

            <Link
              to="/profile"
              className="flex items-center gap-2 rounded-lg border border-gray-800 bg-[#0d1620] px-3 py-1.5 hover:border-gray-700 transition"
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'O'}
              </div>
              <span className="text-xs font-semibold text-gray-200">
                {user?.name || 'Organizer'}
              </span>
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile Header */}
      <div className="flex md:hidden items-center justify-between px-4 pt-3 pb-3 bg-gradient-to-b from-[#06101d] to-[#040810] border-b border-gray-800/80">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggleSidebar}
            aria-label="Open menu"
            className="p-1 text-gray-300 hover:text-white"
          >
            <Menu className="h-6 w-6" />
          </button>

          {/* Mobile Logo -> App Homepage */}
          <Link to="/" className="flex items-center gap-2" title="Return to App Homepage">
            <img
              src="/images/app-logo.png"
              alt="AllEvents logo"
              className="h-8 w-8 rounded-xl object-contain shadow-sm shadow-blue-500/30"
            />
            <span className="text-lg font-black tracking-tight text-white">
              all<span className="text-blue-500">events</span>
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick link to App Homepage on mobile */}
          <Link
            to="/"
            title="App Homepage"
            className="flex h-9 items-center gap-1 rounded-full border border-gray-800 bg-gray-900/80 px-2.5 py-1 text-[11px] font-semibold text-gray-300 hover:text-white transition"
          >
            <Home className="h-3.5 w-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Home</span>
          </Link>

          <button
            type="button"
            onClick={handleNotificationClick}
            aria-label="Organizer notifications"
            className="relative flex h-9 w-9 items-center justify-center rounded-full border border-blue-500/30 bg-blue-950/40 text-blue-300 transition hover:bg-blue-900/60 active:scale-95"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-blue-400 ring-1 ring-black" />
          </button>
        </div>
      </div>
    </>
  )
}

export default OrganizerHeader
