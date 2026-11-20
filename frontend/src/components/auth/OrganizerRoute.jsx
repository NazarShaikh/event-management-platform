import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { ShieldAlert, Lock, ArrowLeft, LogIn, Sparkles, CheckCircle2 } from 'lucide-react'
import { loginUser } from '../../services/authApi'

function OrganizerRoute({ children }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [checking, setChecking] = useState(true)
  const [isOrganizer, setIsOrganizer] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [loggingInDemo, setLoggingInDemo] = useState(false)
  const [demoSuccess, setDemoSuccess] = useState(false)

  const verifyRole = () => {
    try {
      const token = localStorage.getItem('token')
      const rawUser = localStorage.getItem('user')

      if (!token || !rawUser) {
        setIsOrganizer(false)
        setCurrentUser(null)
        setChecking(false)
        return
      }

      const parsed = JSON.parse(rawUser)
      setCurrentUser(parsed)

      // Strict check: role must equal 'organizer'
      if (parsed?.role?.toLowerCase() === 'organizer') {
        setIsOrganizer(true)
      } else {
        setIsOrganizer(false)
      }
    } catch {
      setIsOrganizer(false)
      setCurrentUser(null)
    } finally {
      setChecking(false)
    }
  }

  useEffect(() => {
    verifyRole()

    const handleStorageChange = () => {
      verifyRole()
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  // One-click demo organizer login helper for effortless testing
  const handleQuickOrganizerLogin = async () => {
    setLoggingInDemo(true)
    try {
      const res = await loginUser({
        email: 'organizer.test@example.com',
        password: 'OrganizerPass123!',
      })
      if (res?.success && res?.token) {
        localStorage.setItem('token', res.token)
        localStorage.setItem('user', JSON.stringify(res.user))
        window.dispatchEvent(new Event('storage'))
        setCurrentUser(res.user)
        setIsOrganizer(true)
        setDemoSuccess(true)
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Could not authenticate demo organizer.')
    } finally {
      setLoggingInDemo(false)
    }
  }

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#070b12] text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
          <p className="text-xs text-gray-400">Verifying organizer permissions...</p>
        </div>
      </div>
    )
  }

  // If user is verified organizer, render the protected children
  if (isOrganizer) {
    return children
  }

  // Access Denied / Role Restriction Screen
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#070b12] px-4 py-12 text-white">
      <div className="w-full max-w-md rounded-3xl border border-red-500/30 bg-[#0b131f] p-6 sm:p-8 shadow-2xl text-center">
        {/* Shield Icon */}
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-950/60 border border-red-500/40 text-red-400 mb-5 shadow-lg shadow-red-500/10">
          <ShieldAlert className="h-8 w-8" />
        </div>

        {/* Badge */}
        <span className="inline-block rounded-full bg-red-950/80 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-red-300 border border-red-500/30 mb-3">
          Organizer Access Only
        </span>

        {/* Title */}
        <h1 className="text-xl sm:text-2xl font-black text-white">
          Organizer Portal Restricted
        </h1>

        {/* Explanation */}
        <p className="mt-3 text-xs sm:text-sm text-gray-300 leading-relaxed">
          {currentUser ? (
            <>
              You are currently signed in as an{' '}
              <strong className="text-emerald-400 capitalize">{currentUser.role || 'Attendee'}</strong>{' '}
              (<span className="text-gray-400">{currentUser.email}</span>).
              <br className="hidden sm:inline" /> Only users with the{' '}
              <strong className="text-blue-400">Organizer</strong> role can view or manage the Organizer Dashboard.
            </>
          ) : (
            'You must be logged in with a registered Organizer account to view this dashboard, create events, and review attendees.'
          )}
        </p>

        {/* Actions */}
        <div className="mt-8 space-y-3">
          {/* 1. Log In as Organizer */}
          <Link
            to="/login"
            state={{ message: 'Please log in with an Organizer account to continue.', from: location.pathname }}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 py-3 text-xs sm:text-sm font-bold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500 transition"
          >
            <LogIn className="h-4 w-4" />
            <span>Sign In to Organizer Account</span>
          </Link>

          {/* 2. One-click Demo Organizer Login for rapid testing */}
          <button
            type="button"
            onClick={handleQuickOrganizerLogin}
            disabled={loggingInDemo}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-blue-500/40 bg-blue-950/40 py-3 text-xs sm:text-sm font-semibold text-blue-300 hover:bg-blue-900/40 transition disabled:opacity-60"
          >
            <Sparkles className="h-4 w-4 text-blue-400" />
            <span>{loggingInDemo ? 'Authenticating...' : 'Sign In as Test Organizer'}</span>
          </button>

          {/* 3. Return to public attendee home */}
          <Link
            to="/"
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-gray-800 bg-black/50 py-3 text-xs sm:text-sm font-semibold text-gray-400 hover:text-white hover:border-gray-700 transition"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Return to Attendee Home</span>
          </Link>
        </div>

        {/* Security Note */}
        <p className="mt-6 text-[11px] text-gray-500 flex items-center justify-center gap-1">
          <Lock className="h-3 w-3" />
          <span>Protected route • Role-based access control</span>
        </p>
      </div>
    </div>
  )
}

export default OrganizerRoute

