import { useNavigate } from 'react-router-dom'

function NotificationPermission() {
  const navigate = useNavigate()

  const handleEnableNotifications = async () => {
    if (!('Notification' in window)) {
      alert('Notifications are not supported in this browser.')
      return
    }

    try {
      const permission = await Notification.requestPermission()

      if (permission === 'granted') {
        alert('Notifications enabled successfully!')
      } else {
        alert('Notification permission was not granted.')
      }
    } catch {
      alert('Unable to request notification permission.')
    }
  }

  const handleNotNow = () => {
    navigate('/')
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-5 py-10 text-white">
      <div className="w-full max-w-md text-center">
        {/* Logo */}
        <div className="mb-12 flex justify-center">
          <img
            src="/images/ellevents-logo.png"
            alt="Elleven ts"
            className="h-auto w-56 object-contain"
          />
        </div>

        {/* Notification Icon */}
        <div className="mx-auto mb-7 flex h-24 w-24 items-center justify-center rounded-full bg-blue-600/15">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-12 w-12 text-blue-500"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9a6 6 0 0 0-12 0v.75a8.967 8.967 0 0 1-2.311 6.022 23.848 23.848 0 0 0 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
            />
          </svg>
        </div>

        {/* Heading */}
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-500">
          Stay Connected
        </p>

        <h1 className="mt-3 text-3xl font-bold">
          Your Events, Live Updates
        </h1>

        <p className="mt-4 text-sm leading-7 text-neutral-400">
          Get notified about ticket confirmations, upcoming events, important
          reminders, and updates from your favorite organizers.
        </p>

        {/* Enable Notifications */}
        <button
          type="button"
          onClick={handleEnableNotifications}
          className="mt-9 w-full rounded-xl bg-blue-600 px-5 py-4 font-semibold transition hover:bg-blue-500"
        >
          Enable Notifications
        </button>

        {/* Not Now */}
        <button
          type="button"
          onClick={handleNotNow}
          className="mt-4 w-full rounded-xl border border-neutral-700 px-5 py-4 font-semibold text-neutral-300 transition hover:bg-neutral-900"
        >
          Not Now
        </button>

        <p className="mt-6 text-xs leading-5 text-neutral-500">
          You can manage notification permissions in your browser settings.
        </p>
      </div>
    </main>
  )
}

export default NotificationPermission