<template>
  <div v-if="visible" :class="['toast', `toast-${type}`, { 'toast-show': visible }]">
    <div class="toast-icon">
      <svg
        v-if="type === 'success'"
        width="16"
        height="16"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M5 13l4 4L19 7"
        />
      </svg>
      <svg
        v-else-if="type === 'error'"
        width="16"
        height="16"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
      <svg
        v-else-if="type === 'warning'"
        width="16"
        height="16"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
        />
      </svg>
      <svg
        v-else
        width="16"
        height="16"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    </div>
    <div class="toast-content">
      <div class="toast-title">{{ title }}</div>
      <div v-if="message" class="toast-message">{{ message }}</div>
    </div>
    <button @click="close" class="toast-close">
      <svg
        width="12"
        height="12"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";

const props = defineProps({
  type: {
    type: String,
    default: "info",
    validator: (value) =>
      ["success", "error", "warning", "info"].includes(value),
  },
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    default: "",
  },
  duration: {
    type: Number,
    default: 4000,
  },
  persistent: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["close"]);

const visible = ref(false);
let timeoutId = null;

const show = () => {
  visible.value = true;

  if (!props.persistent && props.duration > 0) {
    timeoutId = setTimeout(() => {
      close();
    }, props.duration);
  }
};

const close = () => {
  visible.value = false;
  if (timeoutId) {
    clearTimeout(timeoutId);
  }
  emit("close");
};

onMounted(() => {
  show();
});

onUnmounted(() => {
  if (timeoutId) {
    clearTimeout(timeoutId);
  }
});
</script>

<style scoped>
.toast {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  min-width: 280px;
  max-width: 360px;
  padding: 10px 12px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.5);
  pointer-events: auto;
  transform: translateX(100%);
  opacity: 0;
  transition: all 0.3s ease;
  margin-bottom: 8px;
}

.toast-show {
  transform: translateX(0);
  opacity: 1;
}

.toast-success {
  border-left: 3px solid #10b981;
}

.toast-success .toast-icon {
  color: #10b981;
}

.toast-error {
  border-left: 3px solid #ef4444;
}

.toast-error .toast-icon {
  color: #ef4444;
}

.toast-warning {
  border-left: 3px solid #f59e0b;
}

.toast-warning .toast-icon {
  color: #f59e0b;
}

.toast-info {
  border-left: 3px solid #3b82f6;
}

.toast-info .toast-icon {
  color: #3b82f6;
}

.toast-icon {
  flex-shrink: 0;
  margin-top: 1px;
}

.toast-content {
  flex: 1;
}

.toast-title {
  font-weight: 600;
  font-size: 13px;
  color: #1e293b;
  margin-bottom: 2px;
}

.toast-message {
  font-size: 12px;
  color: #64748b;
  line-height: 1.4;
}

.toast-close {
  flex-shrink: 0;
  background: none;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  padding: 2px;
  border-radius: 3px;
  transition: all 0.2s ease;
}

.toast-close:hover {
  color: #64748b;
  background: rgba(148, 163, 184, 0.1);
}

@media (max-width: 640px) {
  .toast {
    min-width: auto;
    max-width: none;
  }
}
</style>