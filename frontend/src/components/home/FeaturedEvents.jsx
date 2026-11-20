import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import EventCard from '../EventCard'
import { getEvents } from '../../services/eventApi'

function FeaturedEvents({ searchTerm = '', selectedCategory = 'All' }) {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    const fetchEvents = async () => {
      try {
        setLoading(true)
        setError('')

        const response = await getEvents({
          search: searchTerm,
          category: selectedCategory === 'All' ? '' : selectedCategory,
        })

        if (!cancelled) {
          setEvents(response.events || [])
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err.response?.data?.message ||
              'Unable to load events. Please try again later.'
          )
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    fetchEvents()

    return () => {
      cancelled = true
    }
  }, [searchTerm, selectedCategory])

  return (
    <section id="featured-events" className="py-10 sm:py-14">
      {/* Section heading */}
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-fuchsia-400">
            Discover experiences
          </p>

          <h2 className="mt-3 text-3xl font-extrabold text-white sm:text-4xl">
            Featured{' '}
            <span className="bg-gradient-to-r from-fuchsia-400 to-purple-400 bg-clip-text text-transparent">
              Events
            </span>
          </h2>

          <p className="mt-3 max-w-xl text-sm leading-6 text-gray-400 sm:text-base">
            Find exciting events, meet new people, and create unforgettable
            memories.
          </p>
        </div>

        <Link
          to="/events"
          className="inline-flex w-fit items-center gap-2 rounded-xl border border-fuchsia-500/40 px-5 py-3 text-sm font-semibold text-fuchsia-300 transition hover:border-fuchsia-400 hover:bg-fuchsia-500/10 hover:text-white"
        >
          View All Events
          <span aria-hidden="true">→</span>
        </Link>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="animate-pulse overflow-hidden rounded-2xl border border-white/10 bg-[#111116]"
            >
              <div className="h-48 bg-white/5" />
              <div className="space-y-3 p-5">
                <div className="h-4 w-3/4 rounded bg-white/10" />
                <div className="h-3 w-1/2 rounded bg-white/10" />
                <div className="h-3 w-full rounded bg-white/10" />
                <div className="h-10 rounded-xl bg-white/10" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error state */}
      {!loading && error && (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/5 px-5 py-10 text-center">
          <p className="text-lg font-semibold text-white">
            Something went wrong
          </p>

          <p className="mt-2 text-sm text-gray-400">{error}</p>

          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-5 rounded-xl bg-fuchsia-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-fuchsia-500"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && events.length === 0 && (
        <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.02] px-5 py-14 text-center">
          <div className="text-4xl" aria-hidden="true">
            🎟️
          </div>

          <h3 className="mt-4 text-xl font-bold text-white">
            No events found
          </h3>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-400">
            {searchTerm || selectedCategory !== 'All'
              ? 'Try another search term or select a different category.'
              : 'There are no events available right now. Check back soon!'}
          </p>
        </div>
      )}

      {/* Events grid */}
      {!loading && !error && events.length > 0 && (
        <>
          <div className="mb-5 flex items-center justify-between">
            <p className="text-sm text-gray-400">
              Showing{' '}
              <span className="font-semibold text-white">{events.length}</span>{' '}
              {events.length === 1 ? 'event' : 'events'}
            </p>

            <span className="rounded-full border border-fuchsia-500/20 bg-fuchsia-500/10 px-3 py-1 text-xs font-medium text-fuchsia-300">
              {selectedCategory === 'All' ? 'All Categories' : selectedCategory}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <EventCard
                key={event._id || event.id}
                event={event}
              />
            ))}
          </div>
        </>
      )}
    </section>
  )
}

export default FeaturedEvents