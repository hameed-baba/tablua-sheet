<template>
  <BaseChart :title="title" :subtitle="subtitle" :loading="loading" :error="error">
    <div class="donut-chart" v-if="chartData.length > 0">
      <div class="chart-container">
        <svg :width="size" :height="size" class="donut-svg">
          <g :transform="`translate(${size/2}, ${size/2})`">
            <path
              v-for="(segment, index) in segments"
              :key="index"
              :d="segment.path"
              :fill="getSegmentColor(index)"
              :stroke="'white'"
              :stroke-width="2"
              class="donut-segment"
              @mouseover="hoveredSegment = index"
              @mouseleave="hoveredSegment = null"
            />
          </g>
          
          <!-- Center text -->
          <text 
            :x="size/2" 
            :y="size/2 - 5" 
            text-anchor="middle" 
            class="center-total"
          >
            {{ totalValue }}
          </text>
          <text 
            :x="size/2" 
            :y="size/2 + 15" 
            text-anchor="middle" 
            class="center-label"
          >
            Total
          </text>
        </svg>
        
        <!-- Legend -->
        <div class="chart-legend">
          <div 
            v-for="(item, index) in chartData" 
            :key="index"
            class="legend-item"
            :class="{ active: hoveredSegment === index }"
            @mouseover="hoveredSegment = index"
            @mouseleave="hoveredSegment = null"
          >
            <div 
              class="legend-color"
              :style="{ backgroundColor: getSegmentColor(index) }"
            ></div>
            <div class="legend-content">
              <span class="legend-label">{{ item.label }}</span>
              <span class="legend-value">{{ item.value }} ({{ getPercentage(item.value) }}%)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="no-data">
      <i class="fa fa-chart-pie"></i>
      <p>No data available</p>
    </div>
  </BaseChart>
</template>

<script setup>
import { computed, ref } from 'vue'
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
  size: {
    type: Number,
    default: 200
  },
  colors: {
    type: Array,
    default: () => ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4']
  }
})

const hoveredSegment = ref(null)

const chartData = computed(() => {
  console.log('DonutChart received data:', props.data)
  const processed = props.data.map(item => ({
    label: item.label || item.name || item.className || item.status || item.role,
    value: item.value || item.count || 0
  }))
  console.log('DonutChart processed data:', processed)
  return processed
})

const totalValue = computed(() => {
  return chartData.value.reduce((sum, item) => sum + item.value, 0)
})

const segments = computed(() => {
  if (totalValue.value === 0) return []
  
  const radius = props.size / 2 - 20
  const innerRadius = radius * 0.6
  let currentAngle = 0
  
  return chartData.value.filter(item => item.value > 0).map(item => {
    const percentage = item.value / totalValue.value
    const angle = percentage * 2 * Math.PI
    
    // Handle very small segments
    if (angle < 0.01) return null
    
    const startAngle = currentAngle
    const endAngle = currentAngle + angle
    
    const x1 = Math.cos(startAngle) * radius
    const y1 = Math.sin(startAngle) * radius
    const x2 = Math.cos(endAngle) * radius
    const y2 = Math.sin(endAngle) * radius
    
    const x3 = Math.cos(endAngle) * innerRadius
    const y3 = Math.sin(endAngle) * innerRadius
    const x4 = Math.cos(startAngle) * innerRadius
    const y4 = Math.sin(startAngle) * innerRadius
    
    const largeArcFlag = angle > Math.PI ? 1 : 0
    
    const path = [
      `M ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
      `L ${x3} ${y3}`,
      `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x4} ${y4}`,
      'Z'
    ].join(' ')
    
    currentAngle += angle
    
    return { path, percentage }
  }).filter(Boolean)
})

const getSegmentColor = (index) => {
  return props.colors[index % props.colors.length]
}

const getPercentage = (value) => {
  return Math.round((value / totalValue.value) * 100)
}
</script>

<style scoped>
.donut-chart {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.chart-container {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.donut-svg {
  flex-shrink: 0;
}

.donut-segment {
  cursor: pointer;
  transition: opacity 0.2s ease;
}

.donut-segment:hover {
  opacity: 0.8;
}

.center-total {
  font-size: 1.5rem;
  font-weight: 700;
  fill: #1e293b;
}

.center-label {
  font-size: 0.875rem;
  fill: #64748b;
}

.chart-legend {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  min-width: 200px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.legend-item:hover,
.legend-item.active {
  background-color: #f8fafc;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  flex-shrink: 0;
}

.legend-content {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.legend-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

.legend-value {
  font-size: 0.75rem;
  color: #6b7280;
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
  .chart-container {
    flex-direction: column;
    gap: 1.5rem;
  }
  
  .chart-legend {
    min-width: auto;
    width: 100%;
  }
}
</style>