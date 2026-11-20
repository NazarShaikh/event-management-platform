function WhyEllevents() {
  return (
    <section className="grid gap-6 rounded-2xl border border-gray-800 bg-gray-950 p-6 md:grid-cols-2 md:items-center">
      <div>
        <p className="text-sm font-semibold text-fuchsia-400">
          WHY ALLEVENTS?
        </p>

        <h2 className="mt-3 text-2xl font-bold">
          Create. Learn. Network. Grow.
        </h2>

        <p className="mt-3 text-sm leading-6 text-gray-400">
          Whether you want to attend an event or organize your own,
          AllEvents helps bring people together through memorable experiences
          and meaningful connections.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-lg border border-gray-800 p-4">
          <h3 className="font-semibold">Easy Registration</h3>
          <p className="mt-2 text-xs text-gray-400">
            Find events and register with ease.
          </p>
        </div>

        <div className="rounded-lg border border-gray-800 p-4">
          <h3 className="font-semibold">Verified Events</h3>
          <p className="mt-2 text-xs text-gray-400">
            Discover reliable event information.
          </p>
        </div>

        <div className="rounded-lg border border-gray-800 p-4">
          <h3 className="font-semibold">Event Management</h3>
          <p className="mt-2 text-xs text-gray-400">
            Organize and manage events.
          </p>
        </div>

        <div className="rounded-lg border border-gray-800 p-4">
          <h3 className="font-semibold">Connect</h3>
          <p className="mt-2 text-xs text-gray-400">
            Meet people with similar interests.
          </p>
        </div>
      </div>
    </section>
  )
}

export default WhyEllevents
