import { ref, createApp } from 'vue'
import Toast from '../components/Toast.vue'

const toasts = ref([])
let toastContainer = null

// Create a single container for all toasts
function getToastContainer() {
  if (!toastContainer) {
    toastContainer = document.createElement('div')
    toastContainer.id = 'toast-container'
    toastContainer.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 9999;
      pointer-events: none;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
    `
    document.body.appendChild(toastContainer)
    
    // Add responsive styles
    const mediaQuery = window.matchMedia('(max-width: 640px)')
    const updateStyles = (e) => {
      if (e.matches) {
        toastContainer.style.top = '10px'
        toastContainer.style.right = '10px'
        toastContainer.style.left = '10px'
      } else {
        toastContainer.style.top = '20px'
        toastContainer.style.right = '20px'
        toastContainer.style.left = 'auto'
      }
    }
    updateStyles(mediaQuery)
    mediaQuery.addEventListener('change', updateStyles)
  }
  return toastContainer
}

export function useToast() {
  const showToast = (options) => {
    const {
      type = 'info',
      title,
      message = '',
      duration = 6000,
      persistent = false
    } = options

    // Create a unique ID for this toast
    const id = Date.now() + Math.random()
    
    // Get or create the main toast container
    const mainContainer = getToastContainer()
    
    // Create a wrapper for this specific toast
    const wrapper = document.createElement('div')
    wrapper.id = `toast-${id}`
    wrapper.style.cssText = 'pointer-events: auto; width: 100%;'
    mainContainer.appendChild(wrapper)

    // Create the toast app
    const toastApp = createApp(Toast, {
      type,
      title,
      message,
      duration,
      persistent,
      onClose: () => {
        // Clean up when toast is closed
        toastApp.unmount()
        if (wrapper.parentNode) {
          wrapper.parentNode.removeChild(wrapper)
        }
        // Remove from toasts array
        const index = toasts.value.findIndex(t => t.id === id)
        if (index > -1) {
          toasts.value.splice(index, 1)
        }
      }
    })

    // Mount the toast
    toastApp.mount(wrapper)

    // Add to toasts array
    toasts.value.push({
      id,
      app: toastApp,
      container: wrapper
    })

    return id
  }

  const success = (title, message = '', options = {}) => {
    return showToast({
      type: 'success',
      title,
      message,
      ...options
    })
  }

  const error = (title, message = '', options = {}) => {
    return showToast({
      type: 'error',
      title,
      message,
      ...options
    })
  }

  const warning = (title, message = '', options = {}) => {
    return showToast({
      type: 'warning',
      title,
      message,
      ...options
    })
  }

  const info = (title, message = '', options = {}) => {
    return showToast({
      type: 'info',
      title,
      message,
      ...options
    })
  }

  const closeToast = (id) => {
    const toast = toasts.value.find(t => t.id === id)
    if (toast) {
      toast.app.unmount()
      if (toast.container.parentNode) {
        toast.container.parentNode.removeChild(toast.container)
      }
      const index = toasts.value.findIndex(t => t.id === id)
      if (index > -1) {
        toasts.value.splice(index, 1)
      }
    }
  }

  const closeAllToasts = () => {
    toasts.value.forEach(toast => {
      toast.app.unmount()
      if (toast.container.parentNode) {
        toast.container.parentNode.removeChild(toast.container)
      }
    })
    toasts.value.length = 0
  }

  return {
    showToast,
    success,
    error,
    warning,
    info,
    closeToast,
    closeAllToasts,
    toasts: toasts.value
  }
}