<template>
  <BaseChart :title="title" :subtitle="subtitle" :loading="loading" :error="error">
    <div class="bar-chart" v-if="chartData.length > 0">
      <div class="chart-bars">
        <div 
          v-for="(item, index) in chartData" 
          :key="index"
          class="bar-item"
        >
          <div class="bar-container">
            <div 
              class="bar"
              :style="{ 
                height: `${(item.value / maxValue) * 100}%`,
                backgroundColor: getBarColor(index)
              }"
            >
              <span class="bar-value">{{ item.value }}</span>
            </div>
          </div>
          <div class="bar-label">{{ item.label }}</div>
        </div>
      </div>
    </div>
    <div v-else class="no-data">
      <i class="fa fa-chart-bar"></i>
      <p>No data available</p>
    </div>
  </BaseChart>
</template>

<script setup>
import { computed } from 'vue'
import BaseChart from './BaseChart.vue'

const props = defineProps({
  title: String,
  subtitle: String,
  data: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  error: String,
  colors: {
    type: Array,
    default: () => ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4']
  }
})

const chartData = computed(() => {
  return props.data.map(item => ({
    label: item.label || item.name || item.className || item.status,
    value: item.value || item.count || 0
  }))
})

const maxValue = computed(() => {
  return Math.max(...chartData.value.map(item => item.value), 1)
})

const getBarColor = (index) => {
  return props.colors[index % props.colors.length]
}
</script>

<style scoped>
.bar-chart {
  width: 100%;
  height: 300px;
  display: flex;
  align-items: flex-end;
  padding: 1rem 0;
}

.chart-bars {
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  width: 100%;
  height: 100%;
  gap: 0.5rem;
}

.bar-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  max-width: 80px;
}

.bar-container {
  height: 200px;
  width: 100%;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  margin-bottom: 0.5rem;
}

.bar {
  width: 100%;
  max-width: 40px;
  border-radius: 4px 4px 0 0;
  position: relative;
  transition: all 0.3s ease;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 0.5rem;
  min-height: 20px;
}

.bar:hover {
  opacity: 0.8;
  transform: translateY(-2px);
}

.bar-value {
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.bar-label {
  font-size: 0.75rem;
  color: #64748b;
  text-align: center;
  font-weight: 500;
  line-height: 1.2;
  max-width: 100%;
  word-wrap: break-word;
}

.no-data {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  color: #94a3b8;
  padding: 2rem;
}

.no-data i {
  font-size: 3rem;
}

@media (max-width: 768px) {
  .bar-chart {
    height: 250px;
  }
  
  .bar-container {
    height: 150px;
  }
  
  .bar-label {
    font-size: 0.6875rem;
  }
}
</style>