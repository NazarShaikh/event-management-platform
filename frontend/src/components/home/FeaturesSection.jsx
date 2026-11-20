const features = [
  {
    icon: '✦',
    title: 'Explore Events',
    description:
      'Discover exciting workshops, concerts, conferences, and experiences that match your interests.',
    accent: 'from-fuchsia-500 to-purple-600',
    glow: 'group-hover:shadow-fuchsia-500/10',
  },
  {
    icon: '🎟',
    title: 'Easy Registration',
    description:
      'Find your favourite events and enjoy a simple, convenient registration experience.',
    accent: 'from-purple-500 to-indigo-600',
    glow: 'group-hover:shadow-purple-500/10',
  },
  {
    icon: '🛡',
    title: 'Secure & Reliable',
    description:
      'Enjoy a reliable event experience with clear information and secure account access.',
    accent: 'from-pink-500 to-fuchsia-600',
    glow: 'group-hover:shadow-pink-500/10',
  },
]

function FeaturesSection() {
  return (
    <section className="py-8 sm:py-12">
      <div className="mb-7 text-center">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-fuchsia-400">
          Made for your next experience
        </p>

        <h2 className="mt-3 text-2xl font-extrabold text-white sm:text-3xl">
          Everything You Need for{' '}
          <span className="bg-gradient-to-r from-fuchsia-400 to-purple-400 bg-clip-text text-transparent">
            Great Events
          </span>
        </h2>

        <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-gray-400 sm:text-base">
          Discover opportunities, connect with people, and make every event
          experience memorable.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {features.map((feature, index) => (
          <article
            key={feature.title}
            className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#15121f] to-[#0b0d12] p-6 shadow-lg transition duration-300 hover:-translate-y-1 hover:border-fuchsia-500/40 hover:shadow-xl ${feature.glow}`}
          >
            <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-fuchsia-600/5 blur-2xl transition group-hover:bg-fuchsia-600/15" />

            <div
              className={`relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.accent} text-2xl font-bold text-white shadow-lg`}
            >
              {feature.icon}
            </div>

            <h3 className="relative mt-5 text-lg font-bold text-white">
              {feature.title}
            </h3>

            <p className="relative mt-3 text-sm leading-6 text-gray-400">
              {feature.description}
            </p>

            <div className="relative mt-5 flex items-center gap-2 text-xs font-semibold text-fuchsia-300">
              <span className="h-1.5 w-1.5 rounded-full bg-fuchsia-400" />
              {index === 0
                ? 'Find your next experience'
                : index === 1
                  ? 'Simple and convenient'
                  : 'Designed with reliability in mind'}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default FeaturesSection