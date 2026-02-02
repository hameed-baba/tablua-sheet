import apiClient from '../services/apiClient'

class SessionManager {
  constructor() {
    this.setupEventListeners()
  }

  setupEventListeners() {
    // Handle browser close/refresh
    window.addEventListener('beforeunload', this.handleBeforeUnload.bind(this))
    
    // Handle page visibility changes (tab switching, minimizing)
    // document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this))
    
    // Handle browser back/forward navigation
    window.addEventListener('pagehide', this.handlePageHide.bind(this))
  }

  handleBeforeUnload(event) {
    // Try to send logout request when user closes browser/tab
    this.sendLogoutRequest()
  }

  handlePageHide(event) {
    // Handle when page is being unloaded
    this.sendLogoutRequest()
  }

  // handleVisibilityChange() {
  //   if (document.visibilityState === 'hidden') {
  //     // Page is hidden (tab switched, browser minimized, etc.)
  //     // We don't logout here as user might come back
  //     console.log('Page hidden - user might be switching tabs')
  //   } else if (document.visibilityState === 'visible') {
  //     // Page is visible again
  //     console.log('Page visible - user is back')
  //   }
  // }

  sendLogoutRequest() {
    try {
      // Use sendBeacon for reliable delivery during page unload
      if (navigator.sendBeacon) {
        const token = localStorage.getItem('tebulasheet_active_user')
        if (token) {
          const userData = JSON.parse(token)
          const logoutData = JSON.stringify({
            staff_id: userData.user?.id,
            session_token: userData.accessToken
          })
          
          navigator.sendBeacon('/api/auth/logout', logoutData)
        }
      } else {
        // Fallback for browsers that don't support sendBeacon
        apiClient.post('/auth/logout').catch(() => {
          // Ignore errors during page unload
        })
      }
    } catch (error) {
      console.error('Error sending logout request:', error)
    }
  }

  // Manual logout method
  async logout() {
    try {
      await apiClient.post('/auth/logout')
    } catch (error) {
      console.error('Error during manual logout:', error)
    }
  }

  // Clean up event listeners
  destroy() {
    window.removeEventListener('beforeunload', this.handleBeforeUnload)
    // document.removeEventListener('visibilitychange', this.handleVisibilityChange)
    window.removeEventListener('pagehide', this.handlePageHide)
  }
}

export default new SessionManager()