<template>
  <div v-if="show" class="modal-overlay">
    <div class="modal-box">
      <h2 class="modal-title">Confirm Delete</h2>
      <p class="modal-text">
        Are you sure you want to delete this item? This action cannot be undone.
      </p>

      <div class="modal-actions">
        <button class="btn-cancel" @click="cancelDelete">Cancel</button>
        <button class="btn-delete" @click="confirmDelete" :disabled="loading">
          <i v-if="loading" class="fa fa-spinner fa-spin me-1"></i> Delete
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { watch } from "vue";
const props = defineProps({
  show: Boolean,
  loading: Boolean,
});

const emits = defineEmits(["confirm", "cancel"]);

const confirmDelete = () => {
  emits("confirm");
};

const cancelDelete = () => {
  emits("cancel");
};

watch(
  () => props.show,
  (newVal) => {
    if (newVal) {
      document.body.style.overflow = "hidden"; // stop background scroll
    } else {
      document.body.style.overflow = ""; // restore scrolling
    }
  }
);
</script>

<style scoped>
/* Overlay */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1100;
  animation: fadeIn 0.25s ease-in-out;
}

/* Modal Box */
.modal-box {
  background: #fff;
  padding: 2rem;
  border-radius: 12px;
  width: 380px;
  text-align: center;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  animation: slideUp 0.3s ease-out;
}

/* Title & Text */
.modal-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 0.5rem;
}

.modal-text {
  font-size: 0.95rem;
  color: #6b7280;
  margin-bottom: 1.5rem;
}

/* Buttons */
.modal-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.btn-cancel {
  background: #f3f4f6;
  color: #111827;
  border: none;
  padding: 0.6rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s;
}

.btn-cancel:hover {
  background: #e5e7eb;
}

.btn-delete {
  background: #ef4444;
  color: #fff;
  border: none;
  padding: 0.6rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.25s;
}

.btn-delete:hover {
  background: #dc2626;
}

/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    transform: translateY(15px);
    opacity: 0.9;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>
