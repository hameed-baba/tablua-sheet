<template>
  <div class="form-group">
    <label class="form-label">{{ label }}</label>
    <div class="multi-select-container" ref="containerRef">
      <!-- Dropdown -->
      <div class="multi-select-dropdown" @click.stop="toggleDropdown">
        <span v-if="internalValue.length === 0" class="placeholder">
          {{ placeholder }}
        </span>
        <span v-else class="selected-count">
          {{ internalValue.length }} item(s) selected
        </span>
        <i class="fa fa-chevron-down dropdown-icon"></i>
      </div>

      <!-- Options -->
      <div v-if="showDropdown" class="multi-select-options">
        <div v-if="loading" class="loading-state">
          <i class="fa fa-spinner fa-spin"></i>
        </div>
        <template v-else>
          <label
            v-for="(item, index) in items"
            :key="index"
            class="permission-checkbox"
          >
            <input type="checkbox" :value="item[idKey]" v-model="internalValue" />
            <span class="checkmark"></span>
            <span class="permission-label">{{ item[labelKey] }}</span>
          </label>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from "vue";

// Props
const props = defineProps({
  items: { type: Array, default: () => [] },
  label: { type: String, default: "Select Items" },
  placeholder: { type: String, default: "Select Items" },
  modelValue: { type: Array, default: () => [] },
  idKey: { type: String, default: "id" },
  labelKey: { type: String, default: "name" },
  loading: { type: Boolean, default: false }, // <-- NEW
});

const emit = defineEmits(["update:modelValue"]);

const internalValue = ref([...props.modelValue]);
const showDropdown = ref(false);
const containerRef = ref(null);

// Toggle dropdown
const toggleDropdown = () => {
  // if (!props.loading) showDropdown.value = !showDropdown.value;
   showDropdown.value = !showDropdown.value;

};

// Watch internalValue and emit changes
watch(internalValue, (newVal) => {
  emit("update:modelValue", newVal);
});


// Close dropdown when clicking outside
const handleClickOutside = (event) => {
  if (containerRef.value && !containerRef.value.contains(event.target)) {
    showDropdown.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<style scoped>
.multi-select-container {
  position: relative;
  width: 100%;
}

.multi-select-dropdown {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid rgba(102, 126, 234, 0.2);
  border-radius: 8px;
  font-size: 0.95rem;
  background-color: white;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.2s ease;
}

.multi-select-dropdown:hover {
  border-color: #d1d5db;
}

.multi-select-dropdown:focus-within {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.multi-select-dropdown .placeholder {
  color: #9ca3af;
}

.multi-select-dropdown .selected-count {
  color: #374151;
  font-weight: 500;
}

.dropdown-icon {
  font-size: 0.75rem;
  color: #6b7280;
  transition: transform 0.2s;
}

.multi-select-options {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 0.5rem;
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  max-height: 250px;
  overflow-y: auto;
  z-index: 1000;
}

.permission-label {
  font-size: 0.9rem;
  color: #374151;
  font-weight: 500;
}

.loading-state {
  padding: 1rem;
  text-align: center;
  color: #6b7280;
  font-style: italic;
}
</style>
