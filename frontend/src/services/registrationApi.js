import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://event-management-platform-3bf3.onrender.com/api'

const registrationApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
})

// Attach auth token to requests
registrationApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// 1. Register for an event on deployed backend
export const registerForEvent = async (eventId) => {
  const token = localStorage.getItem('token')
  if (!token) {
    throw new Error('Please log in to register for events.')
  }

  const response = await registrationApi.post(`/registrations/${eventId}`)
  return response.data
}

// 2. Get user registrations from deployed backend
export const getMyRegistrations = async () => {
  const token = localStorage.getItem('token')
  if (!token) {
    return []
  }

  try {
    const response = await registrationApi.get('/registrations/my')
    return response.data?.registrations || []
  } catch (err) {
    console.error('Error fetching registrations from backend:', err.response?.data?.message || err.message)
    return []
  }
}

// 3. Get Attendee Dashboard from deployed backend
export const getAttendeeDashboard = async () => {
  const token = localStorage.getItem('token')
  if (!token) {
    return {
      totalRegistrations: 0,
      confirmedRegistrations: 0,
      cancelledRegistrations: 0,
      upcomingEvents: [],
      pastEvents: [],
    }
  }

  try {
    const response = await registrationApi.get('/registrations/my/dashboard')
    return response.data?.dashboard || null
  } catch (err) {
    console.error('Error fetching attendee dashboard:', err.response?.data?.message || err.message)
    return null
  }
}

// 4. Cancel a registration on deployed backend
export const cancelRegistration = async (registrationId) => {
  const response = await registrationApi.patch(`/registrations/${registrationId}/cancel`)
  return response.data
}

// 5. Get Event Attendees (Organizer only)
export const getEventAttendees = async (eventId) => {
  const response = await registrationApi.get(`/registrations/event/${eventId}/attendees`)
  return response.data
}

export default registrationApi
