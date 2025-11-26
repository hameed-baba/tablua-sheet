<template>
  <footer class="footer">
    <span>{{ configStore.footerText }}</span> |
    <a href="#" target="_blank" rel="noopener noreferrer">Privacy Policy</a> |
    <a href="#" target="_blank" rel="noopener noreferrer">Terms and Conditions</a> |
    <a href="#" target="_blank" rel="noopener noreferrer">Contact</a>
  </footer>
</template>

<script setup>
import { useConfigStore } from '../../store/configStore'

const configStore = useConfigStore()
</script>