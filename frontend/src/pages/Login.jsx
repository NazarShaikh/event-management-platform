import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { loginUser } from '../services/authApi'

function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const message = location.state?.message

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((previous) => ({ ...previous, [name]: value }))
    setError('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    const email = formData.email.trim()
    if (!email || !formData.password) {
      setError('Please enter your email and password.')
      return
    }

    setLoading(true)
    try {
      const response = await loginUser({ email, password: formData.password })

      if (!response.success || !response.token) {
        setError(response.message || 'Unable to log in. Please try again.')
        return
      }

      localStorage.setItem('token', response.token)
      if (response.user) {
        localStorage.setItem('user', JSON.stringify(response.user))
      }
      window.dispatchEvent(new Event('storage'))

      const targetPath =
        location.state?.from ||
        (response.user?.role?.toLowerCase() === 'organizer' ? '/organizer' : '/')
      navigate(targetPath, { replace: true })
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          'Unable to log in. Please check your details and try again.',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-black text-white">
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

      <section className="mx-auto max-w-md px-6 pb-12 pt-8">
        <div className="mb-9 flex items-center justify-center gap-3">
          <img
            src="/images/app-logo.png"
            alt="AllEvents logo"
            className="h-12 w-12 rounded-2xl object-contain shadow-lg shadow-blue-600/30"
          />
          <span className="text-2xl font-bold tracking-tight">all<span className="text-blue-500">events</span></span>
        </div>

        {message && (
          <p role="status" className="mb-4 text-sm text-green-400">
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="mb-2 block text-sm text-neutral-300">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full rounded-md border border-neutral-600 bg-black px-4 py-3 text-sm outline-none transition focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block text-sm text-neutral-300">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full rounded-md border border-neutral-600 bg-black px-4 py-3 text-sm outline-none transition focus:border-blue-500"
              required
            />
          </div>

          {error && (
            <p role="alert" className="text-sm text-red-400">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-blue-600 px-4 py-3 font-semibold transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Logging in...' : 'Log in'}
          </button>
        </form>

        <p className="mt-5 text-center text-[10px] leading-5 text-neutral-400">
          By signing in, I agree to AllEvents{' '}
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
          Don&apos;t have an account?{' '}
          <Link to="/select-role" className="font-semibold text-blue-500 hover:underline">
            Sign up
          </Link>
        </p>
      </section>
    </main>
  )
}

export default Login
