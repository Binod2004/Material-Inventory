import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api'

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' }
})

const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => {
    localStorage.removeItem('token')
  },
  isAuthenticated: () => Boolean(localStorage.getItem('token'))
}

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const responseData = error.response?.data
    if (error.response?.status === 401) {
      authService.logout()
      window.location.href = '/login'
      return Promise.reject({ message: 'Unauthorized. Please log in again.' })
    }

    return Promise.reject(responseData || { message: error.message || 'Network error' })
  }
)

const dashboardService = {
  getMetrics: () => api.get('/dashboard')
}

const materialsService = {
  getAll: () => api.get('/materials'),
  create: (payload) => api.post('/materials', payload),
  update: (id, payload) => api.put(`/materials/${id}`, payload),
  remove: (id) => api.delete(`/materials/${id}`)
}

const suppliersService = {
  getAll: () => api.get('/suppliers'),
  create: (payload) => api.post('/suppliers', payload),
  update: (id, payload) => api.put(`/suppliers/${id}`, payload),
  remove: (id) => api.delete(`/suppliers/${id}`)
}

const stockService = {
  getAll: () => api.get('/stock'),
  getLowStock: () => api.get('/stock/low'),
  create: (payload) => api.post('/stock', payload),
  update: (id, payload) => api.put(`/stock/${id}`, payload),
  remove: (id) => api.delete(`/stock/${id}`)
}

export default api
export { authService, dashboardService, materialsService, suppliersService, stockService }
