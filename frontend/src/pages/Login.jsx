import { Link } from 'react-router-dom'

function Login() {
  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hero Image */}
      <section className="relative min-h-[280px] overflow-hidden sm:min-h-[350px]">
        <img
          src="https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=1400&q=85"
          alt="People enjoying a live music event"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

        <div className="relative flex min-h-[280px] flex-col justify-end px-6 pb-8 sm:min-h-[350px] sm:px-10">
          <p className="text-2xl font-bold tracking-tight sm:text-3xl">
            STRESS-FREE SETUP
          </p>

          <p className="mt-3 max-w-md text-sm font-semibold leading-6 sm:text-base">
            Go live in minutes and start selling instantly,
            <br className="hidden sm:block" /> no tech headaches.
          </p>
        </div>
      </section>

      {/* Authentication Options */}
      <section className="mx-auto max-w-md px-6 pb-12 pt-8">
        {/* Temporary text logo until original Figma assets are available */}
        <div className="mb-9 flex items-center justify-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-b from-blue-500 to-blue-700 text-xl font-bold shadow-lg">
            e
          </div>

          <span className="text-2xl font-semibold tracking-tight">
            ellevents
          </span>
        </div>

        {/* Facebook */}
        <button
          type="button"
          className="mb-4 flex w-full items-center justify-center gap-3 rounded-md border border-neutral-600 px-4 py-3 text-sm transition hover:bg-neutral-900"
          onClick={() => alert('Facebook login will be connected later.')}
        >
          <span className="font-bold text-lg text-white">f</span>
          <span>Continue with Facebook</span>
        </button>

        {/* Google */}
        <button
          type="button"
          className="mb-4 flex w-full items-center justify-center gap-3 rounded-md border border-neutral-600 px-4 py-3 text-sm transition hover:bg-neutral-900"
          onClick={() => alert('Google login will be connected later.')}
        >
          <span className="font-bold text-lg text-blue-400">G</span>
          <span>Continue with Google</span>
        </button>

        {/* Email */}
        <Link
          to="/login/email"
          className="flex w-full items-center justify-center gap-3 rounded-md border border-neutral-600 px-4 py-3 text-sm transition hover:bg-neutral-900"
        >
          <span aria-hidden="true">✉</span>
          <span>Continue with Email</span>
        </Link>

        <p className="mt-5 text-center text-[10px] leading-5 text-neutral-400">
          By signing in, I agree to Ellevents{' '}
          <a href="#privacy" className="text-blue-500 hover:underline">
            privacy policy
          </a>{' '}
          and{' '}
          <a href="#terms" className="text-blue-500 hover:underline">
            Terms of service
          </a>
          .
        </p>
        <p className="mt-6 text-center text-sm text-neutral-400">
            Don't have an account?{' '}
            <Link
                to="/register"
                className="font-semibold text-blue-500 hover:underline"
            >
                Sign up
            </Link>
        </p>
      </section>
    </main>
  )
}

export default Login