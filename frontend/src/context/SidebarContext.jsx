import { createContext, useContext, useState, useEffect } from 'react'

const SidebarContext = createContext()

export function SidebarProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false)
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [feedbackOpen, setFeedbackOpen] = useState(false)

  // Read logged-in user from localStorage
  const getStoredUser = () => {
    try {
      const raw = localStorage.getItem('user')
      if (raw) return JSON.parse(raw)
    } catch {
      // ignore
    }
    return null
  }

  const [currentUser, setCurrentUser] = useState(getStoredUser)

  // Determine active role strictly from user's account role, defaulting to 'Attendee'
  // There are only two roles: 'Attendee' and 'Organizer'
  const [userRole, setRoleState] = useState(() => {
    const u = getStoredUser()
    if (u?.role && u.role.toLowerCase() === 'organizer') return 'Organizer'
    return 'Attendee'
  })

  // Keep state in sync with localStorage changes
  useEffect(() => {
    const handleStorageChange = () => {
      const u = getStoredUser()
      setCurrentUser(u)
      if (u?.role && u.role.toLowerCase() === 'organizer') {
        setRoleState('Organizer')
      } else {
        setRoleState('Attendee')
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  // Switch between the ONLY two allowed roles: 'Attendee' and 'Organizer'
  const setUserRole = (newRole) => {
    const normalized = newRole.toLowerCase() === 'organizer' ? 'organizer' : 'attendee'
    const displayRole = normalized === 'organizer' ? 'Organizer' : 'Attendee'
    setRoleState(displayRole)

    try {
      const u = getStoredUser() || { name: 'Attendee', email: 'attendee@allevents.com' }
      const updated = { ...u, role: normalized }
      localStorage.setItem('user', JSON.stringify(updated))
      setCurrentUser(updated)
    } catch {
      // ignore
    }
  }

  const toggleSidebar = () => setIsOpen((prev) => !prev)
  const openSidebar = () => setIsOpen(true)
  const closeSidebar = () => setIsOpen(false)

  // Close sidebar on Esc key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        closeSidebar()
        setFeedbackOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <SidebarContext.Provider
      value={{
        isOpen,
        toggleSidebar,
        openSidebar,
        closeSidebar,
        notificationsEnabled,
        setNotificationsEnabled,
        feedbackOpen,
        setFeedbackOpen,
        userRole,
        setUserRole,
        currentUser,
        setCurrentUser,
      }}
    >
      {children}
    </SidebarContext.Provider>
  )
}

export const useSidebar = () => {
  const context = useContext(SidebarContext)
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider')
  }
  return context
}
