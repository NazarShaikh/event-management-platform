
function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-stone-200 bg-[#FAF7F0]">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        {/* Brand */}
        <a href="/" className="flex items-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#123D35] text-xl text-white">
            e
          </span>

          <span className="text-xl font-bold tracking-tight text-[#123D35]">
            Eventora
          </span>
        </a>

        {/* Navigation Links */}
        <div className="hidden items-center gap-8 md:flex">
          <a
            href="#events"
            className="text-sm font-medium text-stone-600 transition hover:text-[#123D35]"
          >
            Explore Events
          </a>

          <a
            href="#categories"
            className="text-sm font-medium text-stone-600 transition hover:text-[#123D35]"
          >
            Categories
          </a>

          <a
            href="#about"
            className="text-sm font-medium text-stone-600 transition hover:text-[#123D35]"
          >
            About Us
          </a>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <a
            href="/login"
            className="hidden px-3 py-2 text-sm font-semibold text-[#123D35] transition hover:text-[#F06A35] sm:inline-block"
          >
            Log in
          </a>

          <a
            href="/register"
            className="rounded-full bg-[#123D35] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1B5147]"
          >
            Sign up
          </a>
        </div>
      </nav>
    </header>
  )
}

export default Navbar
