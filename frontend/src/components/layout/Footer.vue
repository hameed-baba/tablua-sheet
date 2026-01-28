<template>
  <footer class="footer">
    <span>{{ "©" + new Date().getFullYear() + " " + getSchoolName() }}</span> |
    <a href="#" target="_blank" rel="noopener noreferrer">Privacy Policy</a> |
    <a href="#" target="_blank" rel="noopener noreferrer"
      >Terms and Conditions</a
    >
    |
    <a href="#" target="_blank" rel="noopener noreferrer">Contact</a>
  </footer>
</template>

<script setup>
import { getSchoolName } from "../../utils/schoolInfo";
</script>