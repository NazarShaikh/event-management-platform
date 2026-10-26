import { useState } from 'react'
import Navbar from './components/Navbar'
import EventCard from './components/EventCard'
import events from './data/events'

function App() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')

  const categories = [
    'All',
    ...new Set(events.map((event) => event.category)),
  ]

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory =
      selectedCategory === 'All' ||
      event.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-[#FAF7F0]">
      <Navbar />

      {/* Hero Section */}
      <main>
        <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
          <div className="max-w-3xl">
            <p className="mb-5 inline-block rounded-full bg-orange-100 px-4 py-2 text-sm font-semibold text-[#B94722]">
              Your city. Your people. Your moments.
            </p>

            <h1 className="text-4xl font-bold leading-tight tracking-tight text-[#123D35] sm:text-6xl lg:text-7xl">
              Find your people.
              <br />
              <span className="text-[#F06A35]">Make it a moment.</span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-stone-600">
              From live music and creative workshops to food festivals,
              discover experiences worth stepping out for.
            </p>

            <a
              href="#events"
              className="mt-8 inline-flex rounded-full bg-[#123D35] px-7 py-3.5 font-semibold text-white transition hover:bg-[#1B5147]"
            >
              Explore events →
            </a>
          </div>

          <div className="mt-14 flex flex-wrap gap-x-10 gap-y-4 border-t border-stone-200 pt-6">
            <p className="text-sm text-stone-600">
              <span className="font-bold text-[#123D35]">Discover</span>{' '}
              something new
            </p>
            <p className="text-sm text-stone-600">
              <span className="font-bold text-[#123D35]">Connect</span>{' '}
              with your community
            </p>
            <p className="text-sm text-stone-600">
              <span className="font-bold text-[#123D35]">Experience</span>{' '}
              more together
            </p>
          </div>
        </section>

        {/* Events Section */}
        <section id="events" className="bg-white py-20">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mb-10">
              <p className="text-sm font-semibold uppercase tracking-widest text-[#F06A35]">
                Made for your weekends
              </p>

              <h2 className="mt-3 text-3xl font-bold text-[#123D35] sm:text-4xl">
                Events worth going out for
              </h2>

              <p className="mt-3 text-stone-600">
                Find your next favourite experience.
              </p>
            </div>

            {/* Search */}
            <div className="mb-6">
              <label
                htmlFor="event-search"
                className="mb-2 block text-sm font-semibold text-[#123D35]"
              >
                Search events
              </label>

              <input
                id="event-search"
                type="search"
                placeholder="Search by event name or city..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="w-full rounded-xl border border-stone-300 bg-[#FAF7F0] px-4 py-3 outline-none transition placeholder:text-stone-400 focus:border-[#123D35] focus:ring-2 focus:ring-[#123D35]/10 sm:max-w-md"
              />
            </div>

            {/* Category Filters */}
            <div className="mb-10 flex flex-wrap gap-3">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                    selectedCategory === category
                      ? 'bg-[#123D35] text-white'
                      : 'border border-stone-200 bg-white text-stone-600 hover:border-[#123D35] hover:text-[#123D35]'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Event Cards */}
            {filteredEvents.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl bg-[#FAF7F0] px-6 py-14 text-center">
                <h3 className="text-xl font-bold text-[#123D35]">
                  No events found
                </h3>

                <p className="mt-2 text-stone-600">
                  Try another search or select a different category.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm('')
                    setSelectedCategory('All')
                  }}
                  className="mt-5 rounded-full bg-[#123D35] px-5 py-2.5 font-semibold text-white hover:bg-[#1B5147]"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="px-6 py-20 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-[#F06A35]">
            More than just events
          </p>

          <h2 className="mx-auto mt-4 max-w-2xl text-3xl font-bold text-[#123D35] sm:text-4xl">
            Good experiences bring people together.
          </h2>

          <p className="mx-auto mt-5 max-w-xl leading-7 text-stone-600">
            Eventora helps you discover activities, explore new interests,
            and spend time with people who share your passions.
          </p>
        </section>
      </main>

      <footer className="bg-[#123D35] px-6 py-8 text-center text-sm text-white/80">
        <p>
          © 2026 Eventora. Built for people who love getting together.
        </p>
      </footer>
    </div>
  )
}

export default App