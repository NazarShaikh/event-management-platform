function EventCard({ event }) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-stone-200 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative h-52 overflow-hidden bg-stone-200">
        <img
          src={event.image}
          alt={event.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />

        <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-[#123D35]">
          {event.category}
        </span>
      </div>

      <div className="p-5">
        <p className="text-sm font-medium text-[#F06A35]">
          {event.date}
        </p>

        <h3 className="mt-2 text-xl font-bold text-[#123D35]">
          {event.title}
        </h3>

        <p className="mt-2 text-sm text-stone-500">
          📍 {event.location}
        </p>

        <div className="mt-5 flex items-center justify-between border-t border-stone-100 pt-4">
          <p className="font-semibold text-stone-800">
            {event.price}
          </p>

          <button
            type="button"
            className="rounded-full bg-[#123D35] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#1B5147]"
          >
            View details
          </button>
        </div>
      </div>
    </article>
  )
}

export default EventCard