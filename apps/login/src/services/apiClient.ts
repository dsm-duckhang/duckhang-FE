import axios from 'axios'

const apiBaseUrl = (
  import.meta.env.VITE_API_BASE_URL || 'https://keenness-kinetic-improper.ngrok-free.dev'
).replace(/\/+$/, '')

const apiClient = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true,
  headers: {
    'ngrok-skip-browser-warning': 'true',
  },
})

export default apiClient
