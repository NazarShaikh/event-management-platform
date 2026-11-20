import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://event-management-platform-3bf3.onrender.com/api'

const reviewApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
})

reviewApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const getEventReviews = async (eventId) => {
  try {
    const response = await reviewApi.get(`/reviews/${eventId}`)
    return response.data?.reviews || []
  } catch (err) {
    console.warn('Reviews fetch:', err.message)
    return []
  }
}

export const createReview = async (eventId, { rating, comment }) => {
  const response = await reviewApi.post(`/reviews/${eventId}`, { rating, comment })
  return response.data
}

export default reviewApi
