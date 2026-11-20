import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getEventById } from '../services/eventApi'
import { registerForEvent } from '../services/registrationApi'
import { getEventImage, formatEventDate } from '../utils/eventHelpers'
import Header from '../components/layout/header'
import Navbar from '../components/layout/navbar'
import Footer from '../components/layout/footer'
import BottomNav from '../components/layout/BottomNav'
import Sidebar from '../components/layout/Sidebar'

function EventDetails() {
  const { eventId } = useParams()
  const navigate = useNavigate()

  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [registering, setRegistering] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('success')

  useEffect(() => {
    let cancelled = false

    const fetchEventData = async () => {
      try {
        setLoading(true)
        setError('')
        const eventData = await getEventById(eventId)
        if (!cancelled) {
          if (!eventData || (!eventData._id && !eventData.id)) {
            throw new Error('Event not found on server.')
          }
          setEvent(eventData)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.response?.data?.message || err.message || 'Unable to load event details.')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchEventData()

    return () => {
      cancelled = true
    }
  }, [eventId])

  const handleRegister = async () => {
    setMessage('')
    setMessageType('success')

    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login', { state: { from: `/events/${eventId}` } })
      return
    }

    try {
      setRegistering(true)
      const res = await registerForEvent(event._id || event.id)
      setMessageType('success')
      setMessage(res.message || 'Successfully registered for this event on the server!')
      setEvent((prev) => ({
        ...prev,
        registeredCount: (prev.registeredCount || 0) + 1,
      }))
    } catch (err) {
      setMessageType('error')
      setMessage(err.response?.data?.message || err.message || 'Unable to register for this event.')
    } finally {
      setRegistering(false)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#050505] p-8 text-center text-white">
        <Sidebar />
        <p className="mt-20 text-gray-400">Loading live event details from server...</p>
      </main>
    )
  }

  if (error || !event) {
    return (
      <main className="min-h-screen bg-[#050505] p-8 text-center text-white">
        <Sidebar />
        <p className="mt-20 text-red-400">{error || 'Event not found.'}</p>
        <Link to="/events" className="mt-4 inline-block text-fuchsia-400 hover:underline">
          &larr; Back to Explore Events
        </Link>
      </main>
    )
  }

  const imageUrl = getEventImage(event)

  const registrationClosed =
    (event.registrationDeadline &&
      new Date(event.registrationDeadline) <= new Date())

  const eventFull =
    event.capacity != null &&
    (event.registeredCount ?? 0) >= event.capacity

  return (
    <div className="min-h-screen bg-black pb-24 text-white">
      <Sidebar />

      <div className="hidden md:block mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 border-b border-gray-900">
        <Header />
        <Navbar />
      </div>

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-8">
        <div className="mb-6 flex items-center justify-between">
          <Link
            to="/events"
            className="inline-flex items-center gap-1.5 text-sm text-fuchsia-400 hover:text-fuchsia-300"
          >
            &larr; Back to Explore Events
          </Link>
          <span className="rounded-full bg-fuchsia-600/20 px-3.5 py-1 text-xs font-semibold text-fuchsia-300 border border-fuchsia-500/30">
            {event.category || 'Event'}
          </span>
        </div>

        <img
          src={imageUrl}
          alt={event.title}
          className="h-64 w-full rounded-3xl object-cover shadow-2xl sm:h-96 border border-gray-800"
        />

        <div className="mt-6">
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white">
            {event.title}
          </h1>

          <p className="mt-4 whitespace-pre-line leading-7 text-gray-300">
            {event.description || 'No description available.'}
          </p>

          <div className="mt-8 grid gap-4 rounded-2xl border border-gray-800 bg-[#11141a] p-6 sm:grid-cols-2">
            <div>
              <p className="text-xs text-gray-400">Date & Schedule</p>
              <p className="mt-1 font-semibold text-white">{formatEventDate(event.startDate)}</p>
            </div>

            <div>
              <p className="text-xs text-gray-400">Venue & Location</p>
              <p className="mt-1 font-semibold text-white">{event.venue || 'To be announced'}</p>
            </div>

            <div>
              <p className="text-xs text-gray-400">Registration Deadline</p>
              <p className="mt-1 font-semibold text-teal-400">
                {event.registrationDeadline ? formatEventDate(event.registrationDeadline) : 'Open'}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-400">Available Capacity</p>
              <p className="mt-1 font-semibold text-white">
                {event.registeredCount ?? 0} registered
                {event.capacity != null ? ` / ${event.capacity} seats` : ''}
              </p>
            </div>
          </div>

          {message && (
            <p
              role="status"
              className={`mt-4 rounded-xl p-3 text-sm font-medium ${
                messageType === 'success'
                  ? 'bg-green-900/40 text-green-300 border border-green-500/30'
                  : 'bg-red-900/40 text-red-300 border border-red-500/30'
              }`}
            >
              {message}
            </p>
          )}

          <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
            <button
              type="button"
              onClick={handleRegister}
              disabled={registering || registrationClosed || eventFull}
              className="w-full sm:w-auto rounded-xl bg-fuchsia-600 px-8 py-3.5 font-semibold text-white transition hover:bg-fuchsia-500 disabled:cursor-not-allowed disabled:bg-gray-700 disabled:text-gray-400 shadow-lg shadow-fuchsia-600/30"
            >
              {registering
                ? 'Registering...'
                : eventFull
                  ? 'Event Full'
                  : registrationClosed
                    ? 'Registration Closed'
                    : 'Register for Event'}
            </button>

            <Link
              to="/profile?tab=registered"
              className="w-full sm:w-auto text-center rounded-xl border border-gray-700 bg-gray-900 px-6 py-3.5 text-sm font-medium text-gray-200 hover:text-white hover:bg-gray-800 transition"
            >
              View My Passes in Profile
            </Link>
          </div>
        </div>
      </main>

      <div className="hidden md:block mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-12 border-t border-gray-900">
        <Footer />
      </div>

      <BottomNav />
    </div>
  )
}

export default EventDetails
