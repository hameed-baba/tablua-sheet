<template>
  <div class="chart-container">
    <div class="chart-header" v-if="title">
      <h3 class="chart-title">{{ title }}</h3>
      <p class="chart-subtitle" v-if="subtitle">{{ subtitle }}</p>
    </div>
    <div class="chart-content">
      <div v-if="loading" class="chart-loading">
        <div class="spinner"></div>
        <p>Loading chart data...</p>
      </div>
      <div v-else-if="error" class="chart-error">
        <i class="fa fa-exclamation-triangle"></i>
        <p>{{ error }}</p>
      </div>
      <div v-else class="chart-wrapper">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  subtitle: String,
  loading: {
    type: Boolean,
    default: false
  },
  error: String
})
</script>

<style scoped>
.chart-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.chart-header {
  padding: 1.5rem 1.5rem 0 1.5rem;
  border-bottom: 1px solid #f1f5f9;
  margin-bottom: 1rem;
}

.chart-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 0.25rem 0;
}

.chart-subtitle {
  font-size: 0.875rem;
  color: #64748b;
  margin: 0;
}

.chart-content {
  padding: 0 1.5rem 1.5rem 1.5rem;
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chart-loading,
.chart-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  color: #64748b;
}

.chart-error {
  color: #ef4444;
}

.chart-error i {
  font-size: 2rem;
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #f1f5f9;
  border-top: 3px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.chart-wrapper {
  width: 100%;
  height: 100%;
}
</style>