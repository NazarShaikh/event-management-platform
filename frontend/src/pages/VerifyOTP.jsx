import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

function VerifyOTP() {
  const navigate = useNavigate()
  const location = useLocation()
  const email = location.state?.email || ''

  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [seconds, setSeconds] = useState(60)
  const [error, setError] = useState('')

  const inputRefs = useRef([])

  useEffect(() => {
    if (seconds <= 0) return

    const timer = setTimeout(() => {
      setSeconds((previous) => previous - 1)
    }, 1000)

    return () => clearTimeout(timer)
  }, [seconds])

  const handleChange = (value, index) => {
    const digit = value.replace(/\D/g, '').slice(-1)

    const updatedOtp = [...otp]
    updatedOtp[index] = digit

    setOtp(updatedOtp)
    setError('')

    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (event, index) => {
    if (event.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (event) => {
    event.preventDefault()

    const pastedDigits = event.clipboardData
      .getData('text')
      .replace(/\D/g, '')
      .slice(0, 6)

    if (!pastedDigits) return

    const updatedOtp = [...otp]

    pastedDigits.split('').forEach((digit, index) => {
      updatedOtp[index] = digit
    })

    setOtp(updatedOtp)
    setError('')

    const nextIndex = Math.min(pastedDigits.length, 5)
    inputRefs.current[nextIndex]?.focus()
  }

  const handleResend = () => {
    if (seconds > 0) return

    setSeconds(60)
    setOtp(['', '', '', '', '', ''])
    setError('')

    // Actual OTP delivery will be connected to the backend later.
  }

  const handleConfirm = (event) => {
    event.preventDefault()

    if (!email) {
      setError('Email address is missing. Please enter your email again.')
      return
    }

    if (otp.some((digit) => digit === '')) {
      setError('Please enter all 6 digits.')
      return
    }

    setError('OTP verification will be available after backend integration.')
  }

  const formattedTime = `00:${String(seconds).padStart(2, '0')}`

  return (
    <main className="min-h-screen bg-black px-4 py-6 text-white sm:px-6">
      <div className="mx-auto flex min-h-[90vh] w-full max-w-md flex-col">
        {/* Back button */}
        <button
          type="button"
          onClick={() => navigate('/login/email')}
          aria-label="Go back to email entry"
          className="mb-8 flex h-8 w-8 items-center text-3xl transition hover:text-blue-400"
        >
          ←
        </button>

        {/* Heading */}
        <h1 className="text-base font-semibold">
          Enter Verification Code
        </h1>

        <p className="mt-4 text-sm text-neutral-500">
          We sent a 6-digit code to your email
        </p>

        {/* Email address */}
        <div className="mt-4 flex items-center gap-3">
          <p className="truncate text-sm text-neutral-400">
            {email || 'No email provided'}
          </p>

          <button
            type="button"
            onClick={() => navigate('/login/email')}
            aria-label="Edit email address"
            className="shrink-0 text-neutral-400 transition hover:text-blue-500"
          >
            ✎
          </button>
        </div>

        {/* OTP Form */}
        <form onSubmit={handleConfirm}>
          <div className="mt-7 flex justify-between gap-2 sm:gap-3">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(element) => {
                  inputRefs.current[index] = element
                }}
                type="text"
                inputMode="numeric"
                autoComplete={index === 0 ? 'one-time-code' : 'off'}
                aria-label={`Verification digit ${index + 1}`}
                maxLength={1}
                value={digit}
                onChange={(event) =>
                  handleChange(event.target.value, index)
                }
                onKeyDown={(event) => handleKeyDown(event, index)}
                onPaste={index === 0 ? handlePaste : undefined}
                className="h-11 min-w-0 w-full max-w-12 rounded-lg border border-blue-600 bg-black text-center text-lg text-blue-500 outline-none transition focus:border-blue-400 focus:ring-1 focus:ring-blue-500"
              />
            ))}
          </div>

          {/* Countdown and resend */}
          <div className="mt-4 flex items-center justify-between text-xs">
            <span className="text-neutral-500">{formattedTime}</span>

            <button
              type="button"
              onClick={handleResend}
              disabled={seconds > 0}
              className={`transition ${
                seconds > 0
                  ? 'cursor-not-allowed text-neutral-600'
                  : 'text-neutral-400 hover:text-blue-500'
              }`}
            >
              Resend OTP
            </button>
          </div>

          {error && (
            <p role="alert" className="mt-4 text-sm text-red-400">
              {error}
            </p>
          )}

          {/* Bottom actions */}
          <div className="mt-auto pt-24">
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="mb-5 w-full text-center text-sm text-neutral-500 transition hover:text-white"
            >
              Login with password
            </button>

            <button
              type="submit"
              className="w-full rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
            >
              Confirm
            </button>
          </div>
        </form>
      </div>
    </main>
  )
}

export default VerifyOTP