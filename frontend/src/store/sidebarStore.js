import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSidebarStore = defineStore('sidebar', () => {
  // Initialize based on screen size
  const isOpen = ref(typeof window !== 'undefined' ? window.innerWidth >= 1024 : true)

  const toggle = () => {
    isOpen.value = !isOpen.value
  }

  const open = () => {
    isOpen.value = true
  }

  const close = () => {
    isOpen.value = false
  }

  return {
    isOpen,
    toggle,
    open,
    close
  }
})