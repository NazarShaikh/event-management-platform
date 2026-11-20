import { Link } from 'react-router-dom'
import { getEventImage } from '../utils/eventHelpers'

function EventCard({ event }) {
  // Format the event date
  const formattedDate = event.startDate
    ? new Date(event.startDate).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : 'Date to be announced'

  const imageUrl = getEventImage(event)

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-gray-800 bg-[#101318] transition duration-300 hover:-translate-y-1 hover:border-fuchsia-500/60">
      {/* Event image */}
      <div className="relative h-44 overflow-hidden bg-gray-900 sm:h-48">
        <img
          src={imageUrl}
          alt={event.title}
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />

        <span className="absolute left-3 top-3 rounded-md bg-fuchsia-600 px-3 py-1 text-xs font-semibold text-white">
          {event.category || 'Event'}
        </span>
      </div>

      {/* Event information */}
      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs font-semibold text-fuchsia-400 sm:text-sm">
          {formattedDate}
        </p>

        <h3 className="mt-2 line-clamp-2 text-base font-bold leading-6 text-white sm:text-lg">
          {event.title}
        </h3>

        <p className="mt-2 text-sm text-gray-400">
          📍 {event.venue || 'Location to be announced'}
        </p>

        <p className="mt-2 text-sm text-gray-400">
          {event.registeredCount ?? 0} registered
          {event.capacity ? ` · ${event.capacity} seats` : ''}
        </p>

        <div className="mt-auto pt-4">
          <Link
            to={`/events/${event._id || event.id}`}
            className="block w-full rounded-lg bg-blue-600 px-3 py-2 text-center text-sm font-semibold text-white transition hover:bg-blue-500"
          >
            View Details
          </Link>
        </div>
      </div>
    </article>
  )
}

export default EventCard
