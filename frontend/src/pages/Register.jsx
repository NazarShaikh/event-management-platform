import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function Register() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
  })

  const [error, setError] = useState('')

  const handleChange = (event) => {
    const { name, value } = event.target

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }))

    setError('')
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!formData.name.trim() || !formData.email.trim()) {
      setError('Please fill in all fields.')
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Please enter a valid email address.')
      return
    }

    navigate('/login/verify-otp', {
      state: { email: formData.email.trim() },
    })
  }

  return (
    <main className="min-h-screen bg-black px-5 py-6 text-white">
      <div className="mx-auto flex min-h-[90vh] w-full max-w-md flex-col">
        <button
          type="button"
          onClick={() => navigate('/login')}
          aria-label="Go back to login"
          className="mb-10 w-fit text-3xl text-white hover:text-blue-400"
        >
          ←
        </button>

        <div className="mb-8 flex items-center gap-3">
          <img
            src="/images/ellevents-logo.png"
            alt="Elleven ts"
            className="h-12 w-auto object-contain"
          />
        </div>

        <h1 className="text-2xl font-semibold">
          Create your account
        </h1>

        <p className="mt-2 text-sm leading-6 text-neutral-400">
          Join Ellevents and discover experiences worth sharing.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-medium text-neutral-300"
            >
              Full name
            </label>

            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              className="w-full rounded-lg border border-neutral-700 bg-black px-4 py-3 text-sm outline-none placeholder:text-neutral-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="register-email"
              className="mb-2 block text-sm font-medium text-neutral-300"
            >
              Email address
            </label>

            <input
              id="register-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="name@email.com"
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded-lg border border-neutral-700 bg-black px-4 py-3 text-sm outline-none placeholder:text-neutral-500 focus:border-blue-500"
            />
          </div>

          {error && (
            <p role="alert" className="text-sm text-red-400">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 py-3 font-semibold transition hover:bg-blue-500"
          >
            Continue with Email
          </button>
        </form>

        <p className="mt-auto pt-10 text-center text-sm text-neutral-400">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-semibold text-blue-500 hover:underline"
          >
            Log in
          </Link>
        </p>
      </div>
    </main>
  )
}

export default Register