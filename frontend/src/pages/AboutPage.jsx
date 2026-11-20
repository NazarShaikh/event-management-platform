import { Link } from 'react-router-dom'
import {
  Calendar,
  Sparkles,
  Users,
  ShieldCheck,
  Zap,
  MapPin,
  Ticket,
  ArrowRight,
  Award,
  Globe,
  HeartHandshake,
} from 'lucide-react'
import Header from '../components/layout/header'
import Navbar from '../components/layout/navbar'
import Footer from '../components/layout/footer'
import BottomNav from '../components/layout/BottomNav'
import Sidebar from '../components/layout/Sidebar'

function AboutPage() {
  const stats = [
    { label: 'Community Attendees', value: '50K+', icon: Users, color: 'text-blue-400' },
    { label: 'Events Hosted', value: '1,200+', icon: Calendar, color: 'text-fuchsia-400' },
    { label: 'Cities Covered', value: '15+', icon: MapPin, color: 'text-teal-400' },
    { label: 'Satisfaction Rate', value: '99.4%', icon: Award, color: 'text-amber-400' },
  ]

  const pillars = [
    {
      title: 'Seamless Digital Passes',
      desc: 'Instant ticket booking with real-time seat tracking and downloadable passes, with zero friction.',
      icon: Ticket,
      color: 'bg-blue-600/20 text-blue-400 border-blue-500/30',
    },
    {
      title: 'Verified Hosts & Events',
      desc: 'All workshops, summits, and concerts are curated and authenticated for reliable experiences.',
      icon: ShieldCheck,
      color: 'bg-emerald-600/20 text-emerald-400 border-emerald-500/30',
    },
    {
      title: 'Attendee & Organizer Synergy',
      desc: 'A unified ecosystem designed specifically for two roles: discovering as an Attendee or hosting as an Organizer.',
      icon: HeartHandshake,
      color: 'bg-fuchsia-600/20 text-fuchsia-400 border-fuchsia-500/30',
    },
    {
      title: 'Community Driven Growth',
      desc: 'From technical masterclasses to music festivals, we empower communities to learn, celebrate, and connect.',
      icon: Zap,
      color: 'bg-purple-600/20 text-purple-400 border-purple-500/30',
    },
  ]

  return (
    <div className="min-h-screen bg-black pb-24 text-white">
      <Sidebar />

      {/* Desktop Header and Navbar */}
      <div className="hidden md:block mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 border-b border-gray-900">
        <Header />
        <Navbar />
      </div>

      {/* Main Container */}
      <main className="mx-auto max-w-xl px-4 py-4 sm:max-w-2xl sm:px-6 md:max-w-7xl md:px-8 md:py-8">
        
        {/* Mobile App Title Bar */}
        <div className="flex md:hidden items-center justify-between pb-4">
          <Link to="/" className="flex items-center gap-2">
            <img
              src="/images/app-logo.png"
              alt="AllEvents logo"
              className="h-8 w-8 rounded-xl object-contain shadow-md"
            />
            <span className="text-lg font-bold">all<span className="text-blue-500">events</span></span>
          </Link>
          <span className="rounded-full bg-blue-950/60 px-3 py-1 text-xs font-semibold text-blue-300 border border-blue-500/30">
            About Us
          </span>
        </div>

        {/* Hero Section */}
        <section className="relative overflow-hidden rounded-3xl border border-gray-800 bg-gradient-to-b from-[#091522] via-[#050e18] to-black p-6 sm:p-10 md:p-16 text-center">
          <div className="mx-auto max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-950/50 px-4 py-1.5 text-xs font-bold text-blue-300">
              <Sparkles className="h-4 w-4 text-blue-400" />
              <span>THE FUTURE OF EVENT EXPERIENCES</span>
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight">
              Bringing People Together Through{' '}
              <span className="bg-gradient-to-r from-blue-400 via-fuchsia-400 to-purple-400 bg-clip-text text-transparent">
                Unforgettable Events.
              </span>
            </h1>

            <p className="mt-6 text-sm sm:text-base md:text-lg text-gray-300 leading-relaxed">
              <strong className="text-white">AllEvents</strong> is the modern event management and ticketing platform designed to bridge passionate communities with extraordinary organizers. From cutting-edge artificial intelligence conferences to live cultural festivals, we turn moments into lifelong memories.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/events"
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/30 transition hover:bg-blue-500 hover:scale-105"
              >
                <span>Explore Events</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-xl border border-gray-700 bg-black/60 px-6 py-3 text-sm font-semibold text-gray-200 transition hover:border-gray-500 hover:bg-white/10 hover:text-white"
              >
                <span>Contact Team</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
          {stats.map((s) => {
            const Icon = s.icon
            return (
              <div
                key={s.label}
                className="rounded-2xl border border-gray-800 bg-[#0c1017] p-5 text-center transition hover:border-gray-700 hover:-translate-y-0.5"
              >
                <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white/5">
                  <Icon className={`h-5 w-5 ${s.color}`} />
                </div>
                <p className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {s.value}
                </p>
                <p className="mt-1 text-xs text-gray-400">{s.label}</p>
              </div>
            )
          })}
        </section>

        {/* Our Mission & Story */}
        <section className="mt-12 md:mt-16 grid gap-8 md:grid-cols-2 md:items-center">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-fuchsia-400">
              Our Vision & Purpose
            </span>
            <h2 className="mt-2 text-2xl sm:text-4xl font-extrabold text-white">
              Built for seamless connection between Attendee and Organizer.
            </h2>
            <p className="mt-4 text-sm sm:text-base text-gray-300 leading-relaxed">
              We started AllEvents with a straightforward observation: discoverability and ticketing were fragmented, filled with technical overhead and clunky interfaces. 
            </p>
            <p className="mt-3 text-sm sm:text-base text-gray-300 leading-relaxed">
              Our platform streamlines every touchpoint—providing live server updates, verified attendance rosters, instant pass generation, and transparent seat capacities. Whether you join as an <strong className="text-teal-300">Attendee</strong> looking for your next passion or an <strong className="text-fuchsia-300">Organizer</strong> curating the next summit, AllEvents is your dedicated companion.
            </p>

            <div className="mt-6 flex items-center gap-4 text-xs sm:text-sm text-gray-400">
              <span className="flex items-center gap-1.5">
                <Globe className="h-4 w-4 text-blue-400" />
                Regional & Global Reach
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                Data Protected
              </span>
            </div>
          </div>

          <div className="relative rounded-3xl overflow-hidden border border-gray-800 shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=80"
              alt="Audience at an AllEvents conference"
              className="h-80 w-full object-cover sm:h-96"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <p className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
                Live Community Impact
              </p>
              <h3 className="mt-1 text-lg sm:text-xl font-bold text-white">
                "Connecting over 50,000 learners, creators, and innovators."
              </h3>
            </div>
          </div>
        </section>

        {/* 4 Core Pillars */}
        <section className="mt-14 md:mt-20">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-400">
              Why AllEvents
            </span>
            <h2 className="mt-2 text-2xl sm:text-4xl font-extrabold text-white">
              What sets our platform apart
            </h2>
            <p className="mt-3 text-sm text-gray-400">
              Carefully engineered to empower both individual attendees and event teams with clarity, speed, and confidence.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {pillars.map((pillar) => {
              const Icon = pillar.icon
              return (
                <div
                  key={pillar.title}
                  className="rounded-2xl border border-gray-800 bg-[#0e121a] p-6 transition duration-300 hover:border-gray-700 hover:-translate-y-1 flex flex-col justify-between"
                >
                  <div>
                    <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border ${pillar.color}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-white">
                      {pillar.title}
                    </h3>
                    <p className="mt-2 text-xs sm:text-sm text-gray-400 leading-relaxed">
                      {pillar.desc}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* Roles Comparison: Attendee vs Organizer */}
        <section className="mt-14 md:mt-20 rounded-3xl border border-gray-800 bg-gradient-to-r from-[#07131d] via-[#091b24] to-[#041217] p-6 sm:p-10">
          <div className="mb-8 text-center max-w-xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-teal-400">
              Dual Persona Architecture
            </span>
            <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-white">
              Two Roles. One Unified Platform.
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Attendee */}
            <div className="rounded-2xl border border-teal-500/30 bg-black/50 p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/20 text-teal-400 text-xl">
                    🎟️
                  </span>
                  <div>
                    <h3 className="text-lg font-bold text-white">For Attendees</h3>
                    <p className="text-xs text-teal-300">Discover & Participate</p>
                  </div>
                </div>
                <ul className="mt-5 space-y-2.5 text-xs sm:text-sm text-gray-300">
                  <li className="flex items-center gap-2">
                    <span className="text-teal-400">✓</span> Instant registration and pass generation
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-teal-400">✓</span> Personal dashboard with registered tickets
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-teal-400">✓</span> Bookmarking and favoriting upcoming sessions
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-teal-400">✓</span> Verified attendee reviews & ratings
                  </li>
                </ul>
              </div>

              <Link
                to="/events"
                className="mt-6 block w-full rounded-xl bg-teal-600 py-2.5 text-center text-xs font-semibold text-white hover:bg-teal-500 transition"
              >
                Browse as Attendee
              </Link>
            </div>

            {/* Organizer */}
            <div className="rounded-2xl border border-fuchsia-500/30 bg-black/50 p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-fuchsia-500/20 text-fuchsia-400 text-xl">
                    🎤
                  </span>
                  <div>
                    <h3 className="text-lg font-bold text-white">For Organizers</h3>
                    <p className="text-xs text-fuchsia-300">Host & Scale</p>
                  </div>
                </div>
                <ul className="mt-5 space-y-2.5 text-xs sm:text-sm text-gray-300">
                  <li className="flex items-center gap-2">
                    <span className="text-fuchsia-400">✓</span> Publish and manage summits, workshops & expos
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-fuchsia-400">✓</span> Real-time seat capacity & attendance tracking
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-fuchsia-400">✓</span> Live organizer metrics dashboard
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-fuchsia-400">✓</span> Direct attendee communication and review insight
                  </li>
                </ul>
              </div>

              <Link
                to="/select-role"
                className="mt-6 block w-full rounded-xl bg-fuchsia-600 py-2.5 text-center text-xs font-semibold text-white hover:bg-fuchsia-500 transition"
              >
                Start as Organizer
              </Link>
            </div>
          </div>
        </section>

        {/* Bottom Call to Action */}
        <section className="mt-14 md:mt-20 text-center py-10 border-t border-gray-900">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
            Ready to explore what's happening?
          </h2>
          <p className="mt-3 text-sm text-gray-400 max-w-lg mx-auto">
            Join thousands of active attendees experiencing top tier events every week.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link
              to="/events"
              className="rounded-xl bg-blue-600 px-6 py-3 text-xs sm:text-sm font-semibold text-white hover:bg-blue-500 transition shadow-lg shadow-blue-600/30"
            >
              Explore Live Events
            </Link>
            <Link
              to="/contact"
              className="rounded-xl border border-gray-700 px-6 py-3 text-xs sm:text-sm font-semibold text-gray-300 hover:text-white hover:bg-gray-800 transition"
            >
              Get in Touch
            </Link>
          </div>
        </section>
      </main>

      {/* Desktop Footer */}
      <div className="hidden md:block mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-12 border-t border-gray-900">
        <Footer />
      </div>

      <BottomNav />
    </div>
  )
}

export default AboutPage

