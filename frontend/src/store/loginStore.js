import { defineStore } from 'pinia'
import apiClient from '../services/apiClient'

export const useLoginStore = defineStore('loginStore', {
  state: () => ({
    isLoggedIn: false,
    accessToken: '',
    user: null,
    role: null,
    permissions: [],
  }),

  getters: {
    isAuthenticated: (state) => state.isLoggedIn,
    currentUser: (state) => state.user,
    userRole: (state) => state.role,
    userPermissions: (state) => state.permissions,
    authToken: (state) => state.accessToken,
  },

  actions: {
    // Set login state
    SET_LOGIN_STATE(payload) {
      this.isLoggedIn = payload.isLoggedIn
      this.user = payload.user || null
      this.role = payload.role || null
      this.permissions = payload.permissions || []
    },

    // Save both tokens
    SAVE_TOKENS({ accessToken }) {
      this.accessToken = accessToken
      this.isLoggedIn = !!accessToken

      // Set Authorization header globally for API requests
      if (accessToken) {
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
      } else {
        delete apiClient.defaults.headers.common['Authorization']
      }
    },

    // Handle login process
    async login({ user, accessToken }) {
      this.SET_LOGIN_STATE({
        isLoggedIn: true,
        user,
        role: user.role || null,
        permissions: user.permissions || [],
      })

      this.SAVE_TOKENS({ accessToken })

      // Persist in localStorage
      localStorage.setItem(
        'tebulasheet_active_user',
        JSON.stringify({
          user,
          role: user.role,
          permissions: user.permissions,
          accessToken,
        })
      )
    },

    // Restore saved session on reload
    restoreSession() {
      const storedUser = localStorage.getItem('tebulasheet_active_user')
      if (storedUser) {
        const parsed = JSON.parse(storedUser)
        this.login({
          user: parsed.user,
          accessToken: parsed.accessToken,
        })
      }
    },

    // Logout
    LOGOUT() {
      this.accessToken = ''
      this.isLoggedIn = false
      this.user = null
      this.role = null
      this.permissions = []

      localStorage.removeItem('tebulasheet_active_user')
      delete apiClient.defaults.headers.common['Authorization']
      location.reload()
    },

    logout() {
      this.LOGOUT()
    },

    // Update user information
    updateUser(updatedUser) {
      this.user = { ...this.user, ...updatedUser }
      
      // Update localStorage
      const storedData = JSON.parse(localStorage.getItem('tebulasheet_active_user') || '{}')
      storedData.user = this.user
      localStorage.setItem('tebulasheet_active_user', JSON.stringify(storedData))
    },
  },
})