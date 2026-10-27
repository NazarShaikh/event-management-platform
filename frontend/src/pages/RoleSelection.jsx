import { useNavigate } from 'react-router-dom'

function RoleSelection() {
  const navigate = useNavigate()

  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-5 py-10 text-white">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-10 flex justify-center">
          <img
            src="/images/ellevents-logo.png"
            alt="Elleven ts"
            className="h-auto w-56 object-contain"
          />
        </div>

        {/* Heading */}
        <div className="mb-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-500">
            Welcome to Ellevents
          </p>

          <h1 className="mt-3 text-3xl font-bold">
            How will you use Ellevents?
          </h1>

          <p className="mt-3 text-sm leading-6 text-neutral-400">
            Choose your role to continue.
          </p>
        </div>

        {/* Attendee Option */}
        <button
          type="button"
          onClick={() => navigate('/register', { state: { role: 'attendee' } })}
          className="mb-4 w-full rounded-2xl border border-neutral-700 bg-neutral-950 p-5 text-left transition hover:border-blue-500 hover:bg-neutral-900"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-500/15 text-2xl">
              🎟️
            </div>

            <div className="flex-1">
              <h2 className="font-semibold">I'm an Attendee</h2>
              <p className="mt-1 text-sm leading-5 text-neutral-400">
                Discover events, book tickets, and enjoy new experiences.
              </p>
            </div>

            <span className="text-xl text-neutral-500">→</span>
          </div>
        </button>

        {/* Organizer Option */}
        <button
          type="button"
          onClick={() => navigate('/register', { state: { role: 'organizer' } })}
          className="w-full rounded-2xl border border-neutral-700 bg-neutral-950 p-5 text-left transition hover:border-blue-500 hover:bg-neutral-900"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-500/15 text-2xl">
              🎤
            </div>

            <div className="flex-1">
              <h2 className="font-semibold">I'm an Organizer</h2>
              <p className="mt-1 text-sm leading-5 text-neutral-400">
                Create events, manage bookings, and connect with attendees.
              </p>
            </div>

            <span className="text-xl text-neutral-500">→</span>
          </div>
        </button>

        {/* Login Link */}
        <p className="mt-8 text-center text-sm text-neutral-400">
          Already have an account?{' '}
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="font-semibold text-blue-500 hover:underline"
          >
            Log in
          </button>
        </p>
      </div>
    </main>
  )
}

export default RoleSelection