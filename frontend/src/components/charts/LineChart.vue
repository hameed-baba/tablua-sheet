<template>
  <BaseChart :title="title" :subtitle="subtitle" :loading="loading" :error="error">
    <div class="line-chart" v-if="chartData.length > 0">
      <svg :width="width" :height="height" class="line-svg">
        <!-- Grid lines -->
        <g class="grid">
          <line
            v-for="i in 5"
            :key="`h-${i}`"
            :x1="padding"
            :y1="padding + (i - 1) * ((height - 2 * padding) / 4)"
            :x2="width - padding"
            :y2="padding + (i - 1) * ((height - 2 * padding) / 4)"
            stroke="#f1f5f9"
            stroke-width="1"
          />
          <line
            v-for="(point, i) in chartData"
            :key="`v-${i}`"
            :x1="getX(i)"
            :y1="padding"
            :x2="getX(i)"
            :y2="height - padding"
            stroke="#f8fafc"
            stroke-width="1"
          />
        </g>
        
        <!-- Line path -->
        <path
          :d="linePath"
          fill="none"
          :stroke="lineColor"
          stroke-width="3"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        
        <!-- Area fill -->
        <path
          :d="areaPath"
          :fill="`url(#gradient-${chartId})`"
          opacity="0.1"
        />
        
        <!-- Data points -->
        <circle
          v-for="(point, index) in chartData"
          :key="index"
          :cx="getX(index)"
          :cy="getY(point.value)"
          r="4"
          :fill="lineColor"
          stroke="white"
          stroke-width="2"
          class="data-point"
          @mouseover="showTooltip(index, $event)"
          @mouseleave="hideTooltip"
        />
        
        <!-- Y-axis labels -->
        <text
          v-for="i in 5"
          :key="`y-label-${i}`"
          :x="padding - 10"
          :y="padding + (i - 1) * ((height - 2 * padding) / 4) + 5"
          text-anchor="end"
          class="axis-label"
        >
          {{ Math.round(maxValue - (i - 1) * (maxValue / 4)) }}
        </text>
        
        <!-- X-axis labels -->
        <text
          v-for="(point, index) in chartData"
          :key="`x-label-${index}`"
          :x="getX(index)"
          :y="height - padding + 20"
          text-anchor="middle"
          class="axis-label"
        >
          {{ point.label }}
        </text>
        
        <!-- Gradient definition -->
        <defs>
          <linearGradient :id="`gradient-${chartId}`" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" :stop-color="lineColor" stop-opacity="0.3"/>
            <stop offset="100%" :stop-color="lineColor" stop-opacity="0"/>
          </linearGradient>
        </defs>
      </svg>
      
      <!-- Tooltip -->
      <div
        v-if="tooltip.show"
        class="chart-tooltip"
        :style="{ left: tooltip.x + 'px', top: tooltip.y + 'px' }"
      >
        <div class="tooltip-content">
          <div class="tooltip-label">{{ tooltip.label }}</div>
          <div class="tooltip-value">{{ tooltip.value }}</div>
        </div>
      </div>
    </div>
    <div v-else class="no-data">
      <i class="fa fa-chart-line"></i>
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
  width: {
    type: Number,
    default: 600
  },
  height: {
    type: Number,
    default: 300
  },
  lineColor: {
    type: String,
    default: '#3b82f6'
  }
})

const padding = 50
const chartId = ref(Math.random().toString(36).substr(2, 9))
const tooltip = ref({
  show: false,
  x: 0,
  y: 0,
  label: '',
  value: 0
})

const chartData = computed(() => {
  return props.data.map(item => ({
    label: item.label || item.month || item.name,
    value: item.value || item.count || 0
  }))
})

const maxValue = computed(() => {
  const max = Math.max(...chartData.value.map(item => item.value), 1)
  return Math.ceil(max * 1.1) // Add 10% padding
})

const getX = (index) => {
  const chartWidth = props.width - 2 * padding
  return padding + (index * chartWidth) / (chartData.value.length - 1)
}

const getY = (value) => {
  const chartHeight = props.height - 2 * padding
  return props.height - padding - (value / maxValue.value) * chartHeight
}

const linePath = computed(() => {
  if (chartData.value.length === 0) return ''
  
  let path = `M ${getX(0)} ${getY(chartData.value[0].value)}`
  
  for (let i = 1; i < chartData.value.length; i++) {
    path += ` L ${getX(i)} ${getY(chartData.value[i].value)}`
  }
  
  return path
})

const areaPath = computed(() => {
  if (chartData.value.length === 0) return ''
  
  let path = `M ${getX(0)} ${getY(chartData.value[0].value)}`
  
  for (let i = 1; i < chartData.value.length; i++) {
    path += ` L ${getX(i)} ${getY(chartData.value[i].value)}`
  }
  
  // Close the area
  path += ` L ${getX(chartData.value.length - 1)} ${props.height - padding}`
  path += ` L ${getX(0)} ${props.height - padding}`
  path += ' Z'
  
  return path
})

const showTooltip = (index, event) => {
  const point = chartData.value[index]
  tooltip.value = {
    show: true,
    x: event.offsetX + 10,
    y: event.offsetY - 10,
    label: point.label,
    value: point.value
  }
}

const hideTooltip = () => {
  tooltip.value.show = false
}
</script>

<style scoped>
.line-chart {
  position: relative;
  display: flex;
  justify-content: center;
  padding: 1rem;
}

.line-svg {
  overflow: visible;
}

.data-point {
  cursor: pointer;
  transition: r 0.2s ease;
}

.data-point:hover {
  r: 6;
}

.axis-label {
  font-size: 0.75rem;
  fill: #64748b;
}

.chart-tooltip {
  position: absolute;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  font-size: 0.875rem;
  pointer-events: none;
  z-index: 10;
}

.tooltip-content {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.tooltip-label {
  font-weight: 500;
}

.tooltip-value {
  font-weight: 700;
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
  .line-chart {
    overflow-x: auto;
  }
}
</style>