import { Link, useLocation } from 'react-router-dom'
import { Home, LayoutDashboard, CalendarDays, CircleUser } from 'lucide-react'

function OrganizerBottomNav() {
  const location = useLocation()
  const pathname = location.pathname

  const navItems = [
    {
      name: 'App Home',
      path: '/',
      icon: Home,
      isActive: pathname === '/',
    },
    {
      name: 'Dashboard',
      path: '/organizer',
      icon: LayoutDashboard,
      isActive: pathname === '/organizer' || pathname === '/organizer/dashboard',
    },
    {
      name: 'My Event',
      path: '/organizer/events',
      icon: CalendarDays,
      isActive: pathname === '/organizer/events',
    },
    {
      name: 'Profile',
      path: '/profile',
      icon: CircleUser,
      isActive: pathname === '/profile',
    },
  ]

  return (
    <nav
      aria-label="Organizer Bottom Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-800 bg-[#0d151c]/95 backdrop-blur-md transition-all duration-300 md:hidden"
    >
      <div className="mx-auto flex max-w-lg items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = item.isActive

          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex flex-col items-center justify-center gap-1 px-3 py-1.5 transition duration-200 group ${
                active ? 'text-blue-400' : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-xl transition ${
                  active
                    ? 'bg-blue-600/20 text-blue-400 shadow-sm ring-1 ring-blue-500/40'
                    : 'text-gray-400 group-hover:text-white'
                }`}
              >
                <Icon className="h-4 w-4" />
              </div>

              <span
                className={`text-[10px] sm:text-[11px] font-medium tracking-tight ${
                  active ? 'font-bold text-blue-400' : 'text-gray-400'
                }`}
              >
                {item.name}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

export default OrganizerBottomNav
