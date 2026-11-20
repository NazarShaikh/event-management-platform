import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import Home from './pages/Home'
import EventsPage from './pages/EventsPage'
import SearchPage from './pages/SearchPage'
import ProfilePage from './pages/ProfilePage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import Login from './pages/Login'
import EmailLogin from './pages/EmailLogin'
import Register from './pages/Register'
import VerifyOTP from './pages/VerifyOTP'
import RoleSelection from './pages/RoleSelection'
import NotificationPermission from './pages/NotificationPermission'
import EventDetails from './pages/EventDetails'
import OrganizerDashboard from './pages/organizer/OrganizerDashboard'
import CreateEventPage from './pages/organizer/CreateEventPage'
import MyEventsPage from './pages/organizer/MyEventsPage'
import OrganizerRoute from './components/auth/OrganizerRoute'
import { SidebarProvider } from './context/SidebarContext'

function App() {
  return (
    <SidebarProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />

          {/* Organizer Routes - Strictly Protected for Organizer Role Only */}
          <Route
            path="/organizer"
            element={
              <OrganizerRoute>
                <OrganizerDashboard />
              </OrganizerRoute>
            }
          />
          <Route
            path="/organizer/dashboard"
            element={
              <OrganizerRoute>
                <OrganizerDashboard />
              </OrganizerRoute>
            }
          />
          <Route
            path="/organizer/create"
            element={
              <OrganizerRoute>
                <CreateEventPage />
              </OrganizerRoute>
            }
          />
          <Route
            path="/organizer/events"
            element={
              <OrganizerRoute>
                <MyEventsPage />
              </OrganizerRoute>
            }
          />

          <Route path="/login" element={<Login />} />
          <Route path="/login/email" element={<EmailLogin />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login/verify-otp" element={<VerifyOTP />} />
          <Route path="/select-role" element={<RoleSelection />} />
          <Route path="/notification-permission" element={<NotificationPermission />} />
          <Route path="/events/:eventId" element={<EventDetails />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </SidebarProvider>
  )
}

export default App
