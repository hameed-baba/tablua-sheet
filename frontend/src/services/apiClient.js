import axios from 'axios'
import router from '../router'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_TEBULA_SHEETS_LOCAL,
  withCredentials: true,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

// Response interceptor to handle 401 and 403 errors
apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid - clear session and redirect to login
      // Import store dynamically to avoid circular dependency
      import('../store/loginStore').then(({ useLoginStore }) => {
        const loginStore = useLoginStore()
        loginStore.SILENT_LOGOUT()
      })
      
      // Redirect to login page
      router.push({ name: 'login' })
    } else if (error.response && error.response.status === 403) {
      // Redirect to 403 forbidden page
      router.push('/forbidden')
    }
    return Promise.reject(error)
  }
)

export default apiClient