<template>
  <BaseModal :show="showModal" title="Grade System Details" @close="toggleModal" size="large">
    <div class="grade-view-container">
      <!-- Header Card -->
      <div class="header-card">
        <div class="header-content">
          <div class="title-section">
            <h2 class="system-title">{{ gradeToView?.grade_name }}</h2>
            <div class="meta-info">
              <span class="type-pill">{{ formatGradeType(gradeToView?.grade_type) }}</span>
              <span class="count-pill">{{ gradeToView?.GradeSystems?.length || 0 }} Ranges</span>
            </div>
          </div>
          <div class="dates-section">
            <div class="date-item">
              <i class="fa fa-calendar"></i>
              <span>Created: {{ formatDate(gradeToView?.createdAt) }}</span>
            </div>
            <div class="date-item">
              <i class="fa fa-clock"></i>
              <span>Updated: {{ formatDate(gradeToView?.updatedAt) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Grade Ranges Grid -->
      <div class="ranges-grid">
        <div
          v-for="(system, index) in gradeToView?.GradeSystems"
          :key="index"
          class="range-card"
          :class="getRangeColorClass(index)"
        >
          <div class="range-card-header">
            <div class="range-badge">
              <span class="range-icon">{{ index + 1 }}</span>
            </div>
            <div class="marks-display">
              <span class="marks-value">{{ system.from_mark }}-{{ system.to_mark }}</span>
              <span class="marks-label">marks</span>
            </div>
          </div>

          <div class="range-card-body">
            <div class="grade-display" v-if="system.grade">
              <div class="grade-label">Grade</div>
              <div class="grade-value">{{ system.grade }}</div>
            </div>
            <div class="remark-display">
              <div class="remark-label">Remark</div>
              <div class="remark-value">{{ system.remark }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </BaseModal>
</template>

<script setup>
import BaseModal from "@/components/public/BaseModal.vue";
import { ref } from "vue";

const props = defineProps({
  gradeToView: {
    type: Object,
    default: () => ({}),
  },
});

const showModal = ref(false);

const toggleModal = () => {
  showModal.value = !showModal.value;
};

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const formatGradeType = (type) => {
  const typeMap = {
    letter_grade: "Letter Grade",
    letter_rank_grade: "Letter Rank Grade",
    rank_grade: "Rank Grade",
    remark_grade: "Remark Grade",
  };
  return typeMap[type] || type;
};

const getRangeColorClass = (index) => {
  const colors = ['color-purple', 'color-blue', 'color-green', 'color-yellow', 'color-orange', 'color-red', 'color-pink'];
  return colors[index % colors.length];
};

defineExpose({
  toggleModal,
});
</script>

<style lang="scss" scoped>
.grade-view-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-height: 75vh;
  overflow-y: auto;
  padding: 0.25rem;
}

// Header Card
.header-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
  padding: 1rem;
  color: white;
  box-shadow: 0 3px 8px rgba(102, 126, 234, 0.3);
}

.header-content {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.title-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.system-title {
  font-size: 1.125rem;
  font-weight: 700;
  margin: 0;
  color: white;
}

.meta-info {
  display: flex;
  gap: 0.375rem;
  flex-wrap: wrap;
}

.type-pill,
.count-pill {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.625rem;
  background-color: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  font-size: 0.688rem;
  font-weight: 600;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.dates-section {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  padding-top: 0.375rem;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}

.date-item {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.75rem;
  opacity: 0.95;

  i {
    font-size: 0.75rem;
  }
}

// Ranges Grid
.ranges-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 0.5rem;
}

.range-card {
  background: white;
  border-radius: 6px;
  padding: 0.625rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  border: 1.5px solid transparent;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: currentColor;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
  }

  &.color-purple {
    color: #8b5cf6;
    &:hover { border-color: #8b5cf6; }
  }

  &.color-blue {
    color: #3b82f6;
    &:hover { border-color: #3b82f6; }
  }

  &.color-green {
    color: #10b981;
    &:hover { border-color: #10b981; }
  }

  &.color-yellow {
    color: #f59e0b;
    &:hover { border-color: #f59e0b; }
  }

  &.color-orange {
    color: #f97316;
    &:hover { border-color: #f97316; }
  }

  &.color-red {
    color: #ef4444;
    &:hover { border-color: #ef4444; }
  }

  &.color-pink {
    color: #ec4899;
    &:hover { border-color: #ec4899; }
  }
}

.range-card-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.range-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  background: currentColor;
  border-radius: 5px;
  flex-shrink: 0;
}

.range-icon {
  font-size: 0.813rem;
  font-weight: 700;
  color: white;
}

.marks-display {
  display: flex;
  flex-direction: column;
}

.marks-value {
  font-size: 0.875rem;
  font-weight: 700;
  color: #111827;
  line-height: 1.2;
}

.marks-label {
  font-size: 0.625rem;
  font-weight: 500;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.range-card-body {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.grade-display,
.remark-display {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.grade-label,
.remark-label {
  font-size: 0.563rem;
  font-weight: 600;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.grade-value {
  font-size: 0.938rem;
  font-weight: 800;
  color: currentColor;
  line-height: 1;
}

.remark-value {
  font-size: 0.75rem;
  font-weight: 600;
  color: #374151;
}

@media (max-width: 768px) {
  .ranges-grid {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  }

  .system-title {
    font-size: 1rem;
  }

  .header-card {
    padding: 0.875rem;
  }

  .dates-section {
    flex-direction: column;
    gap: 0.375rem;
  }
}

@media (max-width: 640px) {
  .grade-view-container {
    gap: 0.75rem;
  }

  .ranges-grid {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  }

  .range-card {
    padding: 0.5rem;
  }

  .marks-value {
    font-size: 0.813rem;
  }

  .grade-value {
    font-size: 0.875rem;
  }
}
</style>
