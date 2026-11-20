import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

const baseNavLinks = [
  { name: 'Home', path: '/' },
  { name: 'Events', path: '/events' },
  { name: 'Search', path: '/search' },
  { name: 'Organizer', path: '/organizer', organizerOnly: true },
  { name: 'Profile', path: '/profile' },
  { name: 'About', path: '/about' },
  { name: 'Contact', path: '/contact' },
]

function Navbar() {
  const location = useLocation()
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

  // Only organizers see the organizer link in navbar
  const visibleLinks = baseNavLinks.filter((link) => {
    if (link.organizerOnly) {
      return isOrganizer
    }
    return true
  })

  return (
    <nav className="flex items-center justify-center gap-1.5 sm:gap-2 px-2 py-3 overflow-x-auto">
      {visibleLinks.map((link) => {
        const isActive = location.pathname === link.path
        return (
          <Link
            key={link.name}
            to={link.path}
            className={`rounded-md border px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm transition shrink-0 ${
              isActive
                ? 'border-fuchsia-500 bg-fuchsia-600 text-white font-semibold shadow-md shadow-fuchsia-600/30'
                : 'border-gray-800 text-gray-200 hover:bg-fuchsia-600 hover:text-white'
            }`}
          >
            {link.name}
          </Link>
        )
      })}
    </nav>
  )
}

export default Navbar
