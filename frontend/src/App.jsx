import Navbar from './components/Navbar'
import EventCard from './components/EventCard'
import events from './data/events'

function App() {
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

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="#events"
                className="rounded-full bg-[#123D35] px-7 py-3.5 font-semibold text-white transition hover:bg-[#1B5147]"
              >
                Explore events →
              </a>

              <a
                href="#about"
                className="rounded-full border border-stone-300 px-7 py-3.5 font-semibold text-[#123D35] transition hover:bg-white"
              >
                How it works
              </a>
            </div>
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
            <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="text-sm font-semibold uppercase tracking-widest text-[#F06A35]">
                  Made for your weekends
                </p>

                <h2 className="mt-3 text-3xl font-bold text-[#123D35] sm:text-4xl">
                  Events worth going out for
                </h2>

                <p className="mt-3 max-w-xl text-stone-600">
                  Find your next favourite experience, right around the corner.
                </p>
              </div>

              <a
                href="#events"
                className="font-semibold text-[#123D35] hover:text-[#F06A35]"
              >
                View all events →
              </a>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
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

      {/* Footer */}
      <footer className="bg-[#123D35] px-6 py-8 text-center text-sm text-white/80">
        <p>
          © 2026 Eventora. Built for people who love getting together.
        </p>
      </footer>
    </div>
  )
}

export default App