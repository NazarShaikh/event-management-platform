import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

function Footer() {
  const [isOrganizer, setIsOrganizer] = useState(false)

  useEffect(() => {
    const checkRole = () => {
      try {
        const stored = localStorage.getItem('user')
        if (stored) {
          const u = JSON.parse(stored)
          setIsOrganizer(u?.role?.toLowerCase() === 'organizer')
          return
        }
      } catch {
        // ignore
      }
      setIsOrganizer(false)
    }

    checkRole()
    window.addEventListener('storage', checkRole)
    return () => window.removeEventListener('storage', checkRole)
  }, [])

  return (
    <footer className="border-t border-gray-800 py-10 text-center">
      <Link to="/" className="inline-flex items-center gap-2 group">
        <img
          src="/images/app-logo.png"
          alt="AllEvents logo"
          className="h-8 w-8 rounded-xl object-contain shadow-lg shadow-blue-600/20 transition group-hover:scale-105"
        />
        <span className="font-extrabold tracking-wider text-blue-400 text-lg">
          ALLEVENTS
        </span>
      </Link>

      <p className="mt-3 text-xs sm:text-sm text-gray-400 max-w-md mx-auto">
        Discover events. Connect with people. Create memories across India.
      </p>

      {/* Navigation Links in Footer */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-gray-400">
        <Link to="/" className="hover:text-white transition">Home</Link>
        <span>•</span>
        <Link to="/events" className="hover:text-white transition">Events</Link>
        <span>•</span>
        <Link to="/search" className="hover:text-white transition">Search</Link>
        <span>•</span>
        <Link to="/about" className="hover:text-white transition">About Us</Link>
        <span>•</span>
        <Link to="/contact" className="hover:text-white transition">Contact</Link>
        {isOrganizer && (
          <>
            <span>•</span>
            <Link to="/organizer" className="hover:text-white text-blue-400 font-semibold transition">Organizer</Link>
          </>
        )}
        <span>•</span>
        <Link to="/profile" className="hover:text-white transition">Profile</Link>
      </div>

      <p className="mt-6 text-[11px] text-gray-500">
        © {new Date().getFullYear()} AllEvents. All rights reserved.
      </p>
    </footer>
  )
}

export default Footer
