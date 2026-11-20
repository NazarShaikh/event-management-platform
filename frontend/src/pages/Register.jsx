import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { registerUser } from '../services/authApi'

function Register() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((previous) => ({ ...previous, [name]: value }))
    setError('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    const name = formData.name.trim()
    const email = formData.email.trim().toLowerCase()
    const { password, confirmPassword } = formData

    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields.')
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.')
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    try {
      const response = await registerUser({ name, email, password })

      if (!response.success) {
        setError(response.message || 'Unable to create your account. Please try again.')
        return
      }

      if (response.user) {
        localStorage.setItem('user', JSON.stringify(response.user))
        window.dispatchEvent(new Event('storage'))
      }

      navigate('/login', {
        replace: true,
        state: { message: 'Account created. Log in with your email and password.' },
      })
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          'Unable to create your account. Please try again.',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-black px-5 py-6 text-white">
      <div className="mx-auto flex min-h-[90vh] w-full max-w-md flex-col">
        <button
          type="button"
          onClick={() => navigate('/login')}
          aria-label="Go back to login"
          className="mb-8 w-fit text-3xl text-white transition hover:text-blue-400"
        >
          ←
        </button>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <img
              src="/images/app-logo.png"
              alt="AllEvents logo"
              className="h-10 w-10 rounded-xl object-contain shadow-lg shadow-blue-600/30"
            />
            <span className="text-xl font-bold tracking-tight">all<span className="text-blue-500">events</span></span>
          </div>
          <h1 className="text-3xl font-bold">Create your account</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="name" className="mb-2 block text-sm text-gray-300">
              Full name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="w-full rounded-xl border border-gray-700 bg-gray-900 px-4 py-3 outline-none transition focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="mb-2 block text-sm text-gray-300">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full rounded-xl border border-gray-700 bg-gray-900 px-4 py-3 outline-none transition focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block text-sm text-gray-300">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              value={formData.password}
              onChange={handleChange}
              placeholder="At least 8 characters"
              className="w-full rounded-xl border border-gray-700 bg-gray-900 px-4 py-3 outline-none transition focus:border-blue-500"
              minLength={8}
              required
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="mb-2 block text-sm text-gray-300">
              Confirm password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter your password"
              className="w-full rounded-xl border border-gray-700 bg-gray-900 px-4 py-3 outline-none transition focus:border-blue-500"
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
            className="w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-blue-400 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </main>
  )
}

export default Register
