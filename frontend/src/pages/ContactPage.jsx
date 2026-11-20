import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  HelpCircle,
  MessageSquare,
  Sparkles,
  ChevronDown,
} from 'lucide-react'
import Header from '../components/layout/header'
import Navbar from '../components/layout/navbar'
import Footer from '../components/layout/footer'
import BottomNav from '../components/layout/BottomNav'
import Sidebar from '../components/layout/Sidebar'

function ContactPage() {
  // Read logged-in user if available to prefill form
  const [formData, setFormData] = useState(() => {
    try {
      const stored = localStorage.getItem('user')
      if (stored) {
        const u = JSON.parse(stored)
        return {
          name: u.name || '',
          email: u.email || '',
          role: u.role?.toLowerCase() === 'organizer' ? 'Organizer' : 'Attendee',
          subject: '',
          inquiryType: 'Ticket & Booking Support',
          message: '',
        }
      }
    } catch {
      // ignore
    }
    return {
      name: '',
      email: '',
      role: 'Attendee',
      subject: '',
      inquiryType: 'Ticket & Booking Support',
      message: '',
    }
  })

  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [ticketId, setTicketId] = useState('')
  const [openFaq, setOpenFaq] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitting(true)

    // Simulate reliable form submission
    setTimeout(() => {
      const generatedTicket = `AE-${Math.floor(100000 + Math.random() * 900000)}`
      setTicketId(generatedTicket)
      setSubmitting(false)
      setSubmitted(true)
    }, 800)
  }

  const handleReset = () => {
    setSubmitted(false)
    setFormData((prev) => ({
      ...prev,
      subject: '',
      message: '',
    }))
  }

  const faqs = [
    {
      q: 'How do I download or view my booked ticket pass?',
      a: 'Go to your Profile page by clicking Profile in the navigation. Under the "My Tickets" tab, you will find all your active passes with a direct download button.',
    },
    {
      q: 'Can I cancel an event booking if my schedule changes?',
      a: 'Yes. Attendees can cancel their confirmed bookings anytime before the event starts directly from the Profile page under "My Tickets".',
    },
    {
      q: 'How can I publish an event as an Organizer?',
      a: 'Switch your active role to Organizer using the role selector or visit the Organizer sign-up section to access the event creation dashboard.',
    },
    {
      q: 'Are attendee event registrations free?',
      a: 'Many workshops, academic forums, and community summits on AllEvents are completely free of charge. Paid concert or premium masterclass passes are clearly marked with their ticket prices.',
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
            Contact
          </span>
        </div>

        {/* Hero / Introduction */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-950/50 px-4 py-1.5 text-xs font-bold text-blue-300">
            <MessageSquare className="h-4 w-4 text-blue-400" />
            <span>WE ARE HERE TO HELP</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            Get in Touch with{' '}
            <span className="bg-gradient-to-r from-blue-400 via-fuchsia-400 to-purple-400 bg-clip-text text-transparent">
              AllEvents
            </span>
          </h1>

          <p className="mt-4 text-sm sm:text-base text-gray-300 leading-relaxed">
            Have questions about booking tickets, hosting events, or partnering with us? Our regional support team in Pune is ready to assist you.
          </p>
        </div>

        {/* Two-Column Grid: Contact Details & Contact Form */}
        <div className="grid gap-8 lg:grid-cols-12">
          
          {/* Left Column (5 cols): Contact Cards & Info */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Direct Email Card */}
            <div className="rounded-2xl border border-gray-800 bg-[#0d1118] p-5 transition hover:border-gray-700">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
                  <Mail className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Email Us</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Quick responses within 2 to 4 hours</p>
                  <a
                    href="mailto:support@allevents.com"
                    className="mt-2 inline-block text-xs sm:text-sm font-semibold text-blue-400 hover:underline"
                  >
                    support@allevents.com
                  </a>
                  <p className="text-[11px] text-gray-500 mt-0.5">organizers: host@allevents.com</p>
                </div>
              </div>
            </div>

            {/* Direct Phone Card */}
            <div className="rounded-2xl border border-gray-800 bg-[#0d1118] p-5 transition hover:border-gray-700">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-teal-600/20 text-teal-400 border border-teal-500/30">
                  <Phone className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Call / WhatsApp</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Direct hotline support</p>
                  <p className="mt-2 text-xs sm:text-sm font-semibold text-teal-300">
                    +91 (020) 4123-5678
                  </p>
                  <p className="text-[11px] text-gray-400 mt-0.5">Mobile: +91 98765 43210</p>
                </div>
              </div>
            </div>

            {/* Regional Office Card */}
            <div className="rounded-2xl border border-gray-800 bg-[#0d1118] p-5 transition hover:border-gray-700">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-fuchsia-600/20 text-fuchsia-400 border border-fuchsia-500/30">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Regional Headquarters</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Visit our team</p>
                  <p className="mt-2 text-xs sm:text-sm text-gray-300 leading-relaxed">
                    AllEvents Technology Hub, 4th Floor, Balewadi High Street, Pune, Maharashtra 411045
                  </p>
                </div>
              </div>
            </div>

            {/* Operating Hours Card */}
            <div className="rounded-2xl border border-gray-800 bg-[#0d1118] p-5 transition hover:border-gray-700">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-600/20 text-amber-400 border border-amber-500/30">
                  <Clock className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Support Schedule</h3>
                  <p className="text-xs text-gray-400 mt-0.5">When we are active</p>
                  <p className="mt-2 text-xs sm:text-sm text-gray-300">
                    Monday &ndash; Saturday: 9:00 AM &ndash; 8:00 PM IST
                  </p>
                  <p className="text-[11px] text-amber-300/80 mt-0.5">Live Event Days: 24/7 Monitoring</p>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column (7 cols): Interactive Contact Form */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl border border-gray-800 bg-gradient-to-b from-[#0a0f16] to-[#05070a] p-6 sm:p-8 shadow-2xl">
              
              {submitted ? (
                <div className="py-12 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                    <CheckCircle2 className="h-9 w-9" />
                  </div>
                  <h3 className="mt-4 text-2xl font-bold text-white">
                    Message Received!
                  </h3>
                  <p className="mt-2 text-sm text-gray-300 max-w-md mx-auto">
                    Thank you for reaching out, <strong className="text-white">{formData.name || 'there'}</strong>. Your inquiry has been routed to our support desk with reference code:
                  </p>
                  <div className="mt-4 inline-block rounded-xl border border-blue-500/40 bg-blue-950/60 px-4 py-2 font-mono text-sm font-bold text-blue-300">
                    #{ticketId}
                  </div>
                  <p className="mt-3 text-xs text-gray-400">
                    We will reply to <span className="text-white">{formData.email}</span> within 2-4 hours.
                  </p>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="mt-6 rounded-xl bg-blue-600 px-6 py-2.5 text-xs font-semibold text-white hover:bg-blue-500 transition shadow"
                  >
                    Send Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="border-b border-gray-800 pb-4 mb-4">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                      <Send className="h-5 w-5 text-blue-400" />
                      Send Us a Message
                    </h2>
                    <p className="text-xs text-gray-400 mt-1">
                      Fill out the details below and our team will get back to you promptly.
                    </p>
                  </div>

                  {/* Name & Email Row */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-1.5">
                        Your Full Name <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="e.g. Rahul Sharma"
                        className="w-full rounded-xl border border-gray-700 bg-black/60 px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-gray-500 focus:border-blue-400 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-1.5">
                        Your Email Address <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="e.g. rahul@example.com"
                        className="w-full rounded-xl border border-gray-700 bg-black/60 px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-gray-500 focus:border-blue-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Role & Inquiry Type Row */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-1.5">
                        Your Platform Role
                      </label>
                      <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-gray-700 bg-black/60 px-3.5 py-2.5 text-xs sm:text-sm text-white focus:border-blue-400 focus:outline-none"
                      >
                        <option value="Attendee">Attendee</option>
                        <option value="Organizer">Organizer</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-1.5">
                        Inquiry Topic
                      </label>
                      <select
                        name="inquiryType"
                        value={formData.inquiryType}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-gray-700 bg-black/60 px-3.5 py-2.5 text-xs sm:text-sm text-white focus:border-blue-400 focus:outline-none"
                      >
                        <option value="Ticket & Booking Support">Ticket & Booking Support</option>
                        <option value="Hosting & Organizing Events">Hosting & Organizing Events</option>
                        <option value="Partnership & Sponsorships">Partnership & Sponsorships</option>
                        <option value="Feedback & Suggestions">Feedback & Suggestions</option>
                        <option value="General Inquiry">General Inquiry</option>
                      </select>
                    </div>
                  </div>

                  {/* Subject */}
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1.5">
                      Subject <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      placeholder="Brief summary of your inquiry"
                      className="w-full rounded-xl border border-gray-700 bg-black/60 px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-gray-500 focus:border-blue-400 focus:outline-none"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1.5">
                      Message Details <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      name="message"
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      required
                      placeholder="Please describe how we can assist you..."
                      className="w-full rounded-xl border border-gray-700 bg-black/60 p-3.5 text-xs sm:text-sm text-white placeholder-gray-500 focus:border-blue-400 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/30 transition hover:bg-blue-500 disabled:opacity-50"
                  >
                    {submitting ? 'Sending Message...' : 'Send Message to AllEvents Support'}
                  </button>
                </form>
              )}

            </div>
          </div>

        </div>

        {/* Quick FAQ Section */}
        <section className="mt-14 md:mt-20 border-t border-gray-900 pt-10">
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="text-xs font-bold uppercase tracking-widest text-fuchsia-400">
              Frequently Asked Questions
            </span>
            <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-white">
              Instant answers to common questions
            </h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index
              return (
                <div
                  key={faq.q}
                  className="rounded-2xl border border-gray-800 bg-[#0c1017] overflow-hidden transition"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="flex w-full items-center justify-between p-4 sm:p-5 text-left group"
                  >
                    <span className="text-xs sm:text-sm font-semibold text-white group-hover:text-blue-300 transition">
                      {faq.q}
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 text-gray-400 transition-transform duration-200 shrink-0 ${
                        isOpen ? 'rotate-180 text-blue-400' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-5 sm:px-5 text-xs sm:text-sm text-gray-300 leading-relaxed border-t border-gray-800/60 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              )
            })}
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

export default ContactPage

