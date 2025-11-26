import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useConfigStore = defineStore('config', () => {
  const schoolName = ref('Greenwood Academy')
  const userName = ref('Mrs. Sarah Johnson')
  const userRole = ref('Principal')
  const footerText = ref('© 2024 Greenwood Academy')

  const updateConfig = (config) => {
    if (config.schoolName) schoolName.value = config.schoolName
    if (config.userName) userName.value = config.userName
    if (config.userRole) userRole.value = config.userRole
    if (config.footerText) footerText.value = config.footerText
  }

  return {
    schoolName,
    userName,
    userRole,
    footerText,
    updateConfig
  }
})