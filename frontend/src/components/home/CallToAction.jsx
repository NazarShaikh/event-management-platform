import { Link } from 'react-router-dom'

function CallToAction() {
  return (
    <section className="my-8 rounded-2xl bg-gradient-to-r from-blue-800 to-fuchsia-800 px-6 py-10 text-center">
      <p className="text-sm font-medium text-blue-200">
        BE A PART OF SOMETHING BIG
      </p>

      <h2 className="mt-3 text-2xl font-bold md:text-3xl">
        Ready to attend your next event?
      </h2>

      <p className="mx-auto mt-3 max-w-xl text-sm text-gray-200">
        Discover exciting experiences, meet new people, and create
        unforgettable memories.
      </p>

      <Link
        to="/events"
        className="mt-6 inline-block rounded-full bg-white px-6 py-3 font-semibold text-black transition hover:bg-gray-200"
      >
        Get Started →
      </Link>
    </section>
  )
}

export default CallToAction