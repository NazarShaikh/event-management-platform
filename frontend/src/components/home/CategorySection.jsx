const categories = [
  { name: 'All', icon: '▦' },
  { name: 'Music', icon: '♫' },
  { name: 'Education', icon: '🎓' },
  { name: 'Sports', icon: '◉' },
  { name: 'Business', icon: '▥' },
  { name: 'Service', icon: '⚒' },
  { name: 'Health', icon: '✚' },
]

function CategorySection({ selectedCategory, onCategoryChange }) {
  return (
    <section
      aria-label="Event categories"
      className="rounded-2xl border border-white/10 bg-black/70 p-3 sm:p-4"
    >
      <div className="flex gap-3 overflow-x-auto pb-2 sm:justify-between sm:gap-4 sm:pb-0">
        {categories.map((category) => {
          const active = selectedCategory === category.name

          return (
            <button
              key={category.name}
              type="button"
              onClick={() => onCategoryChange(category.name)}
              aria-pressed={active}
              className={`flex min-w-[82px] shrink-0 flex-col items-center justify-center gap-2 rounded-2xl border px-4 py-3 transition duration-200 sm:min-w-[96px] sm:px-5 sm:py-4 ${
                active
                  ? 'border-fuchsia-500 bg-gradient-to-b from-fuchsia-600 to-purple-700 text-white shadow-lg shadow-fuchsia-600/30'
                  : 'border-gray-700 bg-[#0b0d12] text-gray-300 hover:border-fuchsia-500/70 hover:bg-fuchsia-950/40 hover:text-white'
              }`}
            >
              <span
                aria-hidden="true"
                className="text-2xl font-bold leading-none sm:text-3xl"
              >
                {category.icon}
              </span>

              <span className="text-xs font-medium sm:text-sm">
                {category.name}
              </span>
            </button>
          )
        })}
      </div>
    </section>
  )
}

export default CategorySection