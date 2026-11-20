import { Link, useLocation } from 'react-router-dom'
import { Home, Search, CalendarDays, CircleUser } from 'lucide-react'

function BottomNav() {
  const location = useLocation()
  const pathname = location.pathname

  const navItems = [
    {
      name: 'Home',
      path: '/',
      icon: Home,
      isActive: pathname === '/',
    },
    {
      name: 'Search',
      path: '/search',
      icon: Search,
      isActive: pathname.startsWith('/search'),
    },
    {
      name: 'Event',
      path: '/events',
      icon: CalendarDays,
      isActive: pathname.startsWith('/events'),
    },
    {
      name: 'Profile',
      path: '/profile',
      icon: CircleUser,
      isActive: pathname.startsWith('/profile'),
    },
  ]

  return (
    <nav
      aria-label="Bottom Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-800 bg-[#161f26]/95 backdrop-blur-md transition-all duration-300 md:hidden"
    >
      <div className="mx-auto flex max-w-lg items-center justify-around px-3 py-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = item.isActive

          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex flex-col items-center justify-center gap-1 px-4 py-1.5 transition duration-200 group ${
                active ? 'text-[#a3e635]' : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full transition ${
                  active
                    ? 'border-2 border-[#a3e635] text-[#a3e635] bg-[#a3e635]/15 shadow-sm'
                    : 'text-gray-400 group-hover:text-white'
                }`}
              >
                <Icon className="h-5 w-5" />
              </div>

              <span
                className={`text-[11px] font-medium tracking-tight ${
                  active ? 'font-bold text-[#a3e635]' : 'text-gray-400'
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

export default BottomNav

