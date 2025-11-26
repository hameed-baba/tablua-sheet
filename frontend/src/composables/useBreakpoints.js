import { ref, onMounted, onUnmounted } from 'vue'

export function useBreakpoints() {
  const windowWidth = ref(0)
  const isMobile = ref(false)
  const isTablet = ref(false)
  const isDesktop = ref(false)

  const updateBreakpoints = () => {
    windowWidth.value = window.innerWidth
    isMobile.value = windowWidth.value < 768
    isTablet.value = windowWidth.value >= 768 && windowWidth.value < 1024
    isDesktop.value = windowWidth.value >= 1024
  }

  const handleResize = () => {
    updateBreakpoints()
  }

  onMounted(() => {
    updateBreakpoints()
    window.addEventListener('resize', handleResize)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
  })

  return {
    windowWidth,
    isMobile,
    isTablet,
    isDesktop
  }
}