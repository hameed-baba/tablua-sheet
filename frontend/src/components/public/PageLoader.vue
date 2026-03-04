<template>
  <div v-if="loading" class="spinner-container">
    <div class="spinner"></div>
  </div>
</template>

<script setup>
</script>

<style lang="css" scoped>
.spinner-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  /* height: 250px; */
  gap: 1rem;
  color: #555;
}

/* Modern smooth spinner */
.spinner {
  width: 48px;
  height: 48px;
  border: 4px solid #e0e0e0;
  /* border-top: 4px solid #3498db; */
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 0.9s linear infinite;
  background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* Optional fade animation for data load */
.table-responsive {
  animation: fadeIn 0.4s ease-in-out;
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>