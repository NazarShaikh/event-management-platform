import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://event-management-platform-3bf3.onrender.com/api'

const authApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
})

export const registerUser = async (registrationData) => {
  const response = await authApi.post('/auth/register', registrationData)
  return response.data
}

export const loginUser = async (credentials) => {
  const response = await authApi.post('/auth/login', credentials)
  return response.data
}

export default authApi
