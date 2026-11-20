import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Menu, LogOut, User } from 'lucide-react'
import { useSidebar } from '../../context/SidebarContext'

function Header() {
  const { openSidebar } = useSidebar()
  const navigate = useNavigate()
  const [currentUser, setCurrentUser] = useState(null)

  useEffect(() => {
    const loadUser = () => {
      try {
        const stored = localStorage.getItem('user')
        if (stored) {
          setCurrentUser(JSON.parse(stored))
        } else {
          setCurrentUser(null)
        }
      } catch {
        setCurrentUser(null)
      }
    }

    loadUser()
    window.addEventListener('storage', loadUser)
    return () => window.removeEventListener('storage', loadUser)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setCurrentUser(null)
    navigate('/login')
  }

  const displayName = currentUser?.name || 'Attendee'
  const displayRole = currentUser?.role === 'organizer' ? 'Organizer' : 'Attendee'

  return (
    <header className="flex items-center justify-between gap-4 py-4">
      <div className="flex items-center gap-3">
        {/* Menu toggle button to open Sidebar */}
        <button
          type="button"
          onClick={openSidebar}
          aria-label="Open sidebar menu"
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-sky-400/40 bg-[#06181e] text-sky-300 shadow-md transition hover:border-sky-300 hover:bg-sky-950/60"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* App Logo */}
        <Link
          to="/"
          aria-label="AllEvents home"
          className="flex shrink-0 items-center gap-2.5 group"
        >
          <img
            src="/images/app-logo.png"
            alt="AllEvents logo"
            className="h-9 w-9 rounded-xl object-contain shadow-lg shadow-blue-600/30 transition group-hover:scale-105"
          />

          <span className="text-lg font-extrabold tracking-tight text-white flex items-center">
            all<span className="text-blue-500">events</span>
          </span>
        </Link>
      </div>

      {/* Authentication and Profile buttons */}
      <div className="flex items-center gap-2 sm:gap-3">
        {currentUser ? (
          <>
            <Link
              to="/profile"
              className="flex items-center gap-2 rounded-xl border border-[#1b434c] bg-[#07191d] px-3 py-1.5 text-xs text-white hover:border-teal-400 transition"
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-teal-600 text-[11px] font-bold text-white border border-teal-400">
                {displayName.charAt(0).toUpperCase()}
              </div>
              <div className="hidden sm:block text-left">
                <span className="block font-semibold text-teal-300 leading-none">
                  {displayName.split(' ')[0]}
                </span>
                <span className="block text-[10px] text-gray-400 leading-none mt-0.5">
                  {displayRole}
                </span>
              </div>
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-1.5 rounded-lg border border-gray-700 px-3 py-2 text-xs font-medium text-gray-300 transition hover:border-red-500 hover:bg-red-950/40 hover:text-red-300 sm:px-4"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="rounded-lg border border-gray-700 px-3 py-2 text-sm font-medium text-white transition hover:border-gray-500 hover:bg-gray-900 sm:px-5"
            >
              Login
            </Link>

            <Link
              to="/select-role"
              className="rounded-lg bg-fuchsia-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-fuchsia-500 sm:px-5"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </header>
  )
}

export default Header
