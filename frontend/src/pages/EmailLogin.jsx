import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function EmailLogin() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')

  const handleContinue = (event) => {
    event.preventDefault()

    if (!email.trim()) {
      setError('Please enter your email address.')
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.')
      return
    }

    setError('')

    // Temporary navigation until the backend OTP API is connected.
    navigate('/login/verify-otp', {
      state: { email: email.trim() },
    })
  }

  return (
    <main className="min-h-screen bg-black px-4 py-6 text-white sm:px-6">
      <div className="mx-auto flex min-h-[90vh] w-full max-w-md flex-col">
        {/* Back button */}
        <button
          type="button"
          onClick={() => navigate('/login')}
          aria-label="Go back to login"
          className="mb-8 flex h-10 w-10 items-center justify-start text-3xl text-white transition hover:text-blue-400"
        >
          ←
        </button>

        {/* Email icon */}
        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-100 text-2xl text-blue-500">
          ✉
        </div>

        {/* Heading */}
        <h1 className="text-base font-semibold">
          What's your Email?
        </h1>

        <p className="mt-1 text-xs leading-5 text-neutral-400">
          Please enter your email to continue with your event planning journey.
        </p>

        {/* Email form */}
        <form onSubmit={handleContinue} className="mt-6">
          <label htmlFor="email" className="sr-only">
            Email address
          </label>

          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="name@email.com"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value)
              setError('')
            }}
            className="w-full rounded-lg border border-neutral-700 bg-black px-3 py-3 text-sm text-white outline-none placeholder:text-neutral-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />

          {error && (
            <p role="alert" className="mt-2 text-sm text-red-400">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="mt-8 w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-500"
          >
            Continue
          </button>
        </form>
      </div>
    </main>
  )
}

export default EmailLogin