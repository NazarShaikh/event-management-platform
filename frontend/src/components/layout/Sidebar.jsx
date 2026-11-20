import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  LayoutGrid,
  AppWindow,
  FileText,
  Users,
  Briefcase,
  Settings,
  Star,
  Bell,
  MessageSquare,
  HelpCircle,
  LogOut,
  SquarePen,
  Share2,
  ChevronsUpDown,
  X,
  Check,
} from 'lucide-react'
import { useSidebar } from '../../context/SidebarContext'

function Sidebar() {
  const {
    isOpen,
    closeSidebar,
    notificationsEnabled,
    setNotificationsEnabled,
    feedbackOpen,
    setFeedbackOpen,
    userRole,
    setUserRole,
    currentUser,
  } = useSidebar()

  const navigate = useNavigate()
  const [copied, setCopied] = useState(false)
  const [roleMenuOpen, setRoleMenuOpen] = useState(false)
  const [feedbackText, setFeedbackText] = useState('')
  const [feedbackSent, setFeedbackSent] = useState(false)
  const [helpOpen, setHelpOpen] = useState(false)

  const displayName = currentUser?.name || 'Attendee'
  const displayRole = userRole === 'Organizer' ? 'Organizer' : 'Attendee'

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${displayName} Profile - AllEvents`,
          url: window.location.origin + '/profile',
        })
      } else {
        await navigator.clipboard.writeText(window.location.origin + '/profile')
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }
    } catch {
      // User canceled share
    }
  }

  const handleNavigate = (path) => {
    closeSidebar()
    navigate(path)
  }

  const handleFeedbackSubmit = (e) => {
    e.preventDefault()
    if (!feedbackText.trim()) return
    setFeedbackSent(true)
    setTimeout(() => {
      setFeedbackSent(false)
      setFeedbackText('')
      setFeedbackOpen(false)
    }, 1800)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    closeSidebar()
    navigate('/login')
  }

  if (!isOpen) return null

  return (
    <>
      {/* Dark backdrop overlay */}
      <div
        className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm transition-opacity duration-300"
        onClick={closeSidebar}
        aria-hidden="true"
      />

      {/* Sidebar Drawer */}
      <aside
        className="fixed inset-y-0 left-0 z-50 flex w-[330px] max-w-[85vw] flex-col overflow-y-auto border-r border-[#15343d] bg-gradient-to-b from-[#031518] via-[#04191e] to-[#020d10] p-4 text-white shadow-2xl transition-transform duration-300 ease-out"
        aria-label="Navigation sidebar"
      >
        {/* Top close button for mobile convenience */}
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src="/images/app-logo.png"
              alt="AllEvents logo"
              className="h-6 w-6 rounded-lg object-contain"
            />
            <span className="text-sm font-bold tracking-tight text-white">
              all<span className="text-blue-500">events</span>
            </span>
          </div>
          <button
            type="button"
            onClick={closeSidebar}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-sky-500/30 bg-sky-950/40 text-sky-300 hover:bg-sky-900/60 transition"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* User Profile Card */}
        <div className="relative mb-6 rounded-2xl border border-[#1b434c] bg-[#061e24]/90 p-4 shadow-lg backdrop-blur-md">
          <div className="flex items-start justify-between">
            {/* Avatar */}
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80"
                alt={displayName}
                className="h-16 w-16 rounded-full border-2 border-teal-400/80 object-cover shadow-md"
              />
              <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-[#061e24] bg-emerald-500" />
            </div>

            {/* Top Right Actions */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleNavigate('/profile')}
                title="Edit profile"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-teal-500/30 bg-[#0a2b34] text-teal-300 hover:border-teal-400 hover:text-white transition"
              >
                <SquarePen className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={handleShare}
                title="Share profile"
                className="relative flex h-8 w-8 items-center justify-center rounded-lg border border-teal-500/30 bg-[#0a2b34] text-teal-300 hover:border-teal-400 hover:text-white transition"
              >
                {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Share2 className="h-4 w-4" />}
                {copied && (
                  <span className="absolute -top-7 right-0 whitespace-nowrap rounded bg-emerald-600 px-2 py-0.5 text-[10px] text-white">
                    Link Copied!
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Name & Role Switcher: STRICTLY TWO ROLES (Attendee & Organizer) */}
          <div className="mt-3">
            <button
              type="button"
              onClick={() => setRoleMenuOpen((prev) => !prev)}
              className="flex w-full items-center justify-between text-left group"
            >
              <div>
                <h3 className="text-base font-bold text-white group-hover:text-teal-300 transition">
                  {displayName}
                </h3>
                <p className="text-xs text-teal-400 font-medium">{displayRole}</p>
              </div>
              <ChevronsUpDown className="h-4 w-4 text-gray-400 group-hover:text-teal-300 transition" />
            </button>

            {/* Role dropdown: ONLY TWO ROLES */}
            {roleMenuOpen && (
              <div className="mt-2 space-y-1 rounded-xl border border-teal-500/30 bg-[#031317] p-2 text-xs">
                {['Attendee', 'Organizer'].map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => {
                      setUserRole(role)
                      setRoleMenuOpen(false)
                    }}
                    className={`block w-full rounded-lg px-2.5 py-1.5 text-left transition ${
                      displayRole === role
                        ? 'bg-teal-600 text-white font-semibold'
                        : 'text-gray-300 hover:bg-teal-950/60 hover:text-white'
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Section: Main Menu */}
        <div className="mb-6 space-y-2.5">
          <h4 className="mb-3 text-lg font-bold tracking-tight text-white">
            Main Menu
          </h4>

          {/* 1. All event */}
          <div className="flex items-center gap-3">
            <LayoutGrid className="h-5 w-5 shrink-0 text-sky-400" />
            <button
              type="button"
              onClick={() => handleNavigate('/events')}
              className="flex-1 rounded-xl border border-sky-400/80 bg-black/90 py-2.5 px-4 text-center text-sm font-semibold text-white shadow-sm transition hover:border-sky-300 hover:bg-sky-950/50"
            >
              All event
            </button>
          </div>

          {/* 2. Browse events */}
          <div className="flex items-center gap-3">
            <AppWindow className="h-5 w-5 shrink-0 text-sky-400" />
            <button
              type="button"
              onClick={() => handleNavigate('/events')}
              className="flex-1 rounded-xl border border-sky-400/80 bg-black/90 py-2.5 px-4 text-center text-sm font-semibold text-white shadow-sm transition hover:border-sky-300 hover:bg-sky-950/50"
            >
              Browse events
            </button>
          </div>

          {/* 3. Events details */}
          <div className="flex items-center gap-3">
            <FileText className="h-5 w-5 shrink-0 text-sky-400" />
            <button
              type="button"
              onClick={() => handleNavigate('/events')}
              className="flex-1 rounded-xl border border-sky-400/80 bg-black/90 py-2.5 px-4 text-center text-sm font-semibold text-white shadow-sm transition hover:border-sky-300 hover:bg-sky-950/50"
            >
              Events details
            </button>
          </div>

          {/* 4. Attendee */}
          <div className="flex items-center gap-3">
            <Users className="h-5 w-5 shrink-0 text-sky-400" />
            <button
              type="button"
              onClick={() => {
                setUserRole('Attendee')
                handleNavigate('/profile?tab=registered')
              }}
              className="flex-1 rounded-xl border border-sky-400/80 bg-black/90 py-2.5 px-4 text-center text-sm font-semibold text-white shadow-sm transition hover:border-sky-300 hover:bg-sky-950/50"
            >
              Attendee
            </button>
          </div>

          {/* 5. Organizer */}
          <div className="flex items-center gap-3">
            <Briefcase className="h-5 w-5 shrink-0 text-sky-400" />
            <button
              type="button"
              onClick={() => {
                setUserRole('Organizer')
                handleNavigate('/organizer')
              }}
              className="flex-1 rounded-xl border border-sky-400/80 bg-black/90 py-2.5 px-4 text-center text-sm font-semibold text-white shadow-sm transition hover:border-sky-300 hover:bg-sky-950/50"
            >
              Organizer
            </button>
          </div>

          {/* 6. Settings */}
          <div className="flex items-center gap-3">
            <Settings className="h-5 w-5 shrink-0 text-sky-400" />
            <button
              type="button"
              onClick={() => handleNavigate('/profile?tab=settings')}
              className="flex-1 rounded-xl border border-sky-400/80 bg-black/90 py-2.5 px-4 text-center text-sm font-semibold text-white shadow-sm transition hover:border-sky-300 hover:bg-sky-950/50"
            >
              Settings
            </button>
          </div>

          {/* 7. Event Review */}
          <div className="flex items-center gap-3">
            <Star className="h-5 w-5 shrink-0 text-sky-400" />
            <button
              type="button"
              onClick={() => handleNavigate('/profile?tab=starred')}
              className="flex-1 rounded-xl border border-sky-400/80 bg-black/90 py-2.5 px-4 text-center text-sm font-semibold text-white shadow-sm transition hover:border-sky-300 hover:bg-sky-950/50"
            >
              Event Review
            </button>
          </div>
        </div>

        {/* Section: Other */}
        <div className="mt-auto space-y-2.5 pt-4">
          <h4 className="mb-3 text-lg font-bold tracking-tight text-white">
            Other
          </h4>

          {/* 1. All notification with Toggle Switch */}
          <div className="flex items-center gap-3">
            <Bell className="h-5 w-5 shrink-0 text-sky-400" />
            <button
              type="button"
              onClick={() => setNotificationsEnabled((prev) => !prev)}
              className="flex-1 rounded-xl border border-sky-400/80 bg-black/90 py-2 px-3 text-center text-sm font-semibold text-white shadow-sm transition hover:border-sky-300 hover:bg-sky-950/50"
            >
              All notification
            </button>

            {/* Toggle switch */}
            <button
              type="button"
              role="switch"
              aria-checked={notificationsEnabled}
              onClick={() => setNotificationsEnabled((prev) => !prev)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                notificationsEnabled ? 'bg-sky-500' : 'bg-gray-600'
              }`}
            >
              <span
                aria-hidden="true"
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  notificationsEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* 2. Feedback */}
          <div className="flex items-center gap-3">
            <MessageSquare className="h-5 w-5 shrink-0 text-sky-400" />
            <button
              type="button"
              onClick={() => setFeedbackOpen(true)}
              className="flex-1 rounded-xl border border-sky-400/80 bg-black/90 py-2.5 px-4 text-center text-sm font-semibold text-white shadow-sm transition hover:border-sky-300 hover:bg-sky-950/50"
            >
              feedback
            </button>
          </div>

          {/* 3. Help and support */}
          <div className="flex items-center gap-3">
            <HelpCircle className="h-5 w-5 shrink-0 text-sky-400" />
            <button
              type="button"
              onClick={() => setHelpOpen(true)}
              className="flex-1 rounded-xl border border-sky-400/80 bg-black/90 py-2.5 px-4 text-center text-sm font-semibold text-white shadow-sm transition hover:border-sky-300 hover:bg-sky-950/50"
            >
              Help and support
            </button>
          </div>

          {/* 4. Logout */}
          <div className="flex items-center gap-3">
            <LogOut className="h-5 w-5 shrink-0 text-sky-400" />
            <button
              type="button"
              onClick={handleLogout}
              className="flex-1 rounded-xl border border-sky-400/80 bg-black/90 py-2.5 px-4 text-center text-sm font-semibold text-white shadow-sm transition hover:border-red-400 hover:bg-red-950/40 hover:text-red-300"
            >
              Logout
            </button>
          </div>

          {/* Quick Footer Links */}
          <div className="pt-2 border-t border-gray-800/80 flex items-center justify-center gap-3 text-xs text-gray-400">
            <button
              type="button"
              onClick={() => handleNavigate('/')}
              className="hover:text-sky-400 transition"
            >
              Home
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => handleNavigate('/about')}
              className="hover:text-sky-400 transition"
            >
              About
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => handleNavigate('/contact')}
              className="hover:text-sky-400 transition"
            >
              Contact
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => handleNavigate('/events')}
              className="hover:text-sky-400 transition"
            >
              Events
            </button>
          </div>
        </div>
      </aside>

      {/* Interactive Feedback Modal */}
      {feedbackOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-sky-500/30 bg-[#081b22] p-6 text-white shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-gray-800">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-sky-400" />
                Share your Feedback
              </h3>
              <button
                type="button"
                onClick={() => setFeedbackOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {feedbackSent ? (
              <div className="py-8 text-center">
                <Check className="mx-auto h-12 w-12 text-emerald-400" />
                <p className="mt-3 text-lg font-semibold text-white">Thank you!</p>
                <p className="text-sm text-gray-400">Your feedback helps make AllEvents better.</p>
              </div>
            ) : (
              <form onSubmit={handleFeedbackSubmit} className="mt-4 space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">
                    How was your experience today?
                  </label>
                  <textarea
                    rows={4}
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    placeholder="Tell us what you liked or what we can improve..."
                    required
                    className="w-full rounded-xl border border-gray-700 bg-black/60 p-3 text-sm text-white placeholder-gray-500 focus:border-sky-400 focus:outline-none"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setFeedbackOpen(false)}
                    className="rounded-lg border border-gray-700 px-4 py-2 text-xs font-medium text-gray-300 hover:bg-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-lg bg-sky-500 px-4 py-2 text-xs font-semibold text-white hover:bg-sky-400 transition"
                  >
                    Submit Feedback
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Interactive Help & Support Modal */}
      {helpOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-sky-500/30 bg-[#081b22] p-6 text-white shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-gray-800">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-sky-400" />
                Help & Support
              </h3>
              <button
                type="button"
                onClick={() => setHelpOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-4 space-y-3 text-sm text-gray-300">
              <div className="rounded-xl border border-gray-800 bg-black/50 p-3">
                <p className="font-semibold text-white">How do I register for events?</p>
                <p className="text-xs text-gray-400 mt-1">Select any event card, click "Register Now" with your Attendee account to reserve your seat.</p>
              </div>
              <div className="rounded-xl border border-gray-800 bg-black/50 p-3">
                <p className="font-semibold text-white">How do I cancel my booking?</p>
                <p className="text-xs text-gray-400 mt-1">Open your Profile page under 'My Tickets' to manage and cancel bookings.</p>
              </div>
              <div className="rounded-xl border border-gray-800 bg-black/50 p-3">
                <p className="font-semibold text-white">Contact support & regional office:</p>
                <p className="text-xs text-sky-400 mt-1">support@allevents.com • +91 (020) 4123-5678</p>
                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleNavigate('/contact')}
                    className="flex-1 rounded-lg bg-sky-600 py-1.5 text-center text-xs font-semibold text-white hover:bg-sky-500"
                  >
                    Contact Us
                  </button>
                  <button
                    type="button"
                    onClick={() => handleNavigate('/about')}
                    className="flex-1 rounded-lg border border-gray-700 py-1.5 text-center text-xs font-semibold text-gray-300 hover:text-white"
                  >
                    About Us
                  </button>
                </div>
              </div>
            </div>
            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={() => setHelpOpen(false)}
                className="rounded-lg bg-sky-500 px-4 py-2 text-xs font-semibold text-white hover:bg-sky-400"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Sidebar
