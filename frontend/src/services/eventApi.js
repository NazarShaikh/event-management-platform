import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://event-management-platform-3bf3.onrender.com/api'

const eventApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
})

// Attach auth token to requests if available
eventApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// 1. Get published events from deployed backend
export const getEvents = async ({
  search = '',
  category = '',
  venue = '',
  page = 1,
  limit = 20,
} = {}) => {
  const params = {
    page,
    limit,
  }

  if (search && search.trim()) {
    params.search = search.trim()
  }

  if (category && category !== 'All') {
    params.category = category.trim()
  }

  if (venue && venue.trim()) {
    params.venue = venue.trim()
  }

  const response = await eventApi.get('/events', { params })
  return response.data
}

// 2. Get single event by ID from deployed backend
export const getEventById = async (eventId) => {
  const response = await eventApi.get(`/events/${eventId}`)
  return response.data?.event || response.data
}

// 3. Create new event (Organizer only)
export const createEvent = async (eventData) => {
  const response = await eventApi.post('/events', eventData)
  return response.data
}

// 4. Update event (Organizer only)
export const updateEvent = async (eventId, updateData) => {
  const response = await eventApi.patch(`/events/${eventId}`, updateData)
  return response.data
}

// 5. Publish event (Organizer only)
export const publishEvent = async (eventId) => {
  const response = await eventApi.patch(`/events/${eventId}/publish`)
  return response.data
}

// 6. Cancel event (Organizer only)
export const cancelEvent = async (eventId) => {
  const response = await eventApi.patch(`/events/${eventId}/cancel`)
  return response.data
}

// 7. Get Organizer Dashboard (Organizer only)
export const getOrganizerDashboard = async () => {
  const response = await eventApi.get('/events/organizer/dashboard')
  return response.data
}

export default eventApi
