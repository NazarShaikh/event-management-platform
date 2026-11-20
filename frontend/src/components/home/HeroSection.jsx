import { Link } from 'react-router-dom'

function HeroSection({ searchTerm, onSearchChange, onSearch }) {
  return (
    <section className="relative isolate overflow-hidden rounded-3xl border border-white/10 bg-black">
      {/* Background image */}
      <div
        className="absolute inset-0 -z-20 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=1800')",
        }}
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black via-black/90 to-black/30" />

      <div className="grid min-h-[480px] gap-8 p-6 sm:p-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center lg:p-12">
        {/* Hero content */}
        <div className="flex flex-col justify-center">
          <div className="mb-5 flex items-center gap-3">
            <span className="text-4xl">🎟️</span>
            <span className="text-sm font-semibold uppercase tracking-[0.25em] text-fuchsia-400">
              Your event journey starts here
            </span>
          </div>

          <h1 className="max-w-2xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            <span className="bg-gradient-to-r from-pink-500 to-fuchsia-500 bg-clip-text text-transparent">
              Events
            </span>{' '}
            that bring people
            <span className="mt-1 block bg-gradient-to-r from-fuchsia-500 to-purple-400 bg-clip-text text-transparent">
              Together.
            </span>
          </h1>

          <p className="mt-5 max-w-xl text-base leading-7 text-gray-300 sm:text-lg">
            Discover exciting events, meet amazing people, and create
            unforgettable memories. Your next great experience starts here.
          </p>

          {/* Search */}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              onSearch()
            }}
            className="mt-7 flex max-w-lg items-center gap-2 rounded-xl border border-white/15 bg-black/70 p-2 backdrop-blur-md transition focus-within:border-fuchsia-500"
          >
            <span className="pl-2 text-2xl text-gray-300" aria-hidden="true">
              ⌕
            </span>

            <input
              type="search"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search events, keywords..."
              aria-label="Search events"
              className="min-w-0 flex-1 bg-transparent px-2 py-3 text-sm text-white outline-none placeholder:text-gray-400"
            />

            <button
              type="submit"
              aria-label="Search"
              className="rounded-lg bg-gradient-to-r from-fuchsia-600 to-purple-600 px-5 py-3 font-semibold text-white transition hover:brightness-110"
            >
              Search
            </button>
          </form>

          <p className="mt-4 text-sm text-gray-400">
            ✨ Discover. Connect. Experience.
          </p>
        </div>

        {/* Attendee and Organizer cards */}
        <div className="grid grid-cols-2 gap-3 self-end lg:self-center">
          {/* Attendee */}
          <article className="flex min-h-48 flex-col rounded-2xl border border-emerald-400/50 bg-emerald-950/60 p-4 shadow-lg shadow-emerald-500/10 backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:border-emerald-300 sm:p-5">
            <span className="text-3xl" aria-hidden="true">
              👥
            </span>

            <h2 className="mt-3 text-lg font-bold text-emerald-300">
              Attendee
            </h2>

            <p className="mt-2 flex-1 text-xs leading-5 text-gray-300 sm:text-sm">
              Browse exciting events and register for your favourites.
            </p>

            <Link
              to="/"
              onClick={() =>
                document.getElementById('featured-events')?.scrollIntoView({
                  behavior: 'smooth',
                })
              }
              className="mt-4 flex items-center justify-between gap-2 rounded-lg bg-gradient-to-r from-emerald-500 to-green-400 px-3 py-2 text-xs font-bold text-black transition hover:brightness-110 sm:text-sm"
            >
              Explore Events <span aria-hidden="true">→</span>
            </Link>
          </article>

          {/* Organizer */}
          <article className="flex min-h-48 flex-col rounded-2xl border border-fuchsia-500/50 bg-fuchsia-950/50 p-4 shadow-lg shadow-fuchsia-500/10 backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:border-fuchsia-300 sm:p-5">
            <span className="text-3xl" aria-hidden="true">
              🎤
            </span>

            <h2 className="mt-3 text-lg font-bold text-fuchsia-300">
              Organizer
            </h2>

            <p className="mt-2 flex-1 text-xs leading-5 text-gray-300 sm:text-sm">
              Create events, reach audiences, and manage your events.
            </p>

            <Link
              to="/organizer"
              className="mt-4 flex items-center justify-between gap-2 rounded-lg bg-gradient-to-r from-fuchsia-600 to-purple-500 px-3 py-2 text-xs font-bold text-white transition hover:brightness-110 sm:text-sm"
            >
              Go to organizer <span aria-hidden="true">→</span>
            </Link>
          </article>
        </div>
      </div>
    </section>
  )
}

export default HeroSection