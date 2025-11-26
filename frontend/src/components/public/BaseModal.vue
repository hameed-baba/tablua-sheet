<template>
  <div v-if="show" class="custom-modal-overlay show" @click="handleOverlayClick">
    <div class="custom-modal" @click.stop :style="modalStyle">
      <div class="custom-modal-header">
        <h2 class="custom-modal-title">{{ title }}</h2>
        <button class="custom-close-btn" @click="closeModal">×</button>
      </div>

      <div class="custom-modal-body">
        <slot></slot>
      </div>

      <div v-if="$slots.footer" class="custom-modal-footer">
        <slot name="footer"></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Modal",
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "",
    },
    modalStyle: {
      type: Object,
      default: () => ({ background: "white" }),
    },
    closeOnOverlay: {
      type: Boolean,
      default: true,
    },
  },
  emits: ["close"],
  methods: {
    closeModal() {
      this.$emit("close");
    },
    handleOverlayClick() {
      if (this.closeOnOverlay) {
        this.closeModal();
      }
    },
  },
};
</script>

<style scoped>
/* Enhanced Modal Styles */
.custom-modal-overlay {
  position: fixed;
  inset: 0; /* top, right, bottom, left */
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  overflow-y: auto;
  z-index: 1100;
  opacity: 1;
  visibility: visible;
}

.custom-modal-overlay.show {
  display: flex !important;
}

.custom-modal {
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 2rem;
  width: 90%;
  max-width: 600px;
  max-height: 95vh;
  overflow: visible;
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.5);
  transform: scale(0.95);
  transition: all 0.3s ease;
  position: relative;
  height: auto;
}

.custom-modal-overlay.show .custom-modal {
  transform: scale(1);
}

.custom-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.custom-modal-title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: #111827;
}

.custom-close-btn {
  background: none;
  border: none;
  font-size: 2rem;
  color: #6b7280;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.custom-close-btn:hover {
  background-color: #f3f4f6;
  color: #111827;
}

.custom-modal-body {
  padding: 1rem 0;
}

.custom-modal-footer {
  padding: 1rem 0 0;
}
</style>
