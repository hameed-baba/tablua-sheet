<template>
  <BaseModal :show="showModal" title="Subject Information" @close="toggleModal">
    <div class="subject-info-container">
      <!-- Subject Header -->
      <div class="subject-header">
        <div class="subject-icon">
          <i class="fa fa-book"></i>
        </div>
        <div class="subject-details">
          <h3 class="subject-name">{{ subjectToView?.subject_name }}</h3>
          <span class="section-count">
            {{ subjectToView?.sections?.length || 0 }} Section{{ (subjectToView?.sections?.length || 0) !== 1 ? 's' : '' }} Assigned
          </span>
        </div>
      </div>

      <!-- Subject Metadata -->
      <div class="metadata-section">
        <div class="metadata-item">
          <span class="metadata-label">Created Date:</span>
          <span class="metadata-value">{{ formatDate(subjectToView?.createdAt) }}</span>
        </div>
        <div class="metadata-item">
          <span class="metadata-label">Last Updated:</span>
          <span class="metadata-value">{{ formatDate(subjectToView?.updatedAt) }}</span>
        </div>
      </div>

      <!-- Assigned Sections -->
      <div class="sections-section">
        <h4 class="section-title">
          <i class="fa fa-layer-group"></i>
          Assigned Sections
        </h4>
        
        <div v-if="subjectToView?.sections && subjectToView.sections.length > 0" class="sections-grid">
          <div 
            v-for="section in subjectToView.sections" 
            :key="section.id"
            class="section-card"
          >
            <div class="section-card-icon">
              <i class="fa fa-graduation-cap"></i>
            </div>
            <div class="section-card-content">
              <span class="section-card-name">{{ section.section_name }}</span>
            </div>
          </div>
        </div>

        <div v-else class="no-sections">
          <i class="fa fa-inbox"></i>
          <p>No sections assigned to this subject</p>
        </div>
      </div>
    </div>
  </BaseModal>
</template>

<script setup>
import BaseModal from "@/components/public/BaseModal.vue";
import { ref } from "vue";

const props = defineProps({
  subjectToView: Object,
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

defineExpose({
  toggleModal,
});
</script>

<style lang="scss" scoped>
.subject-info-container {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  max-height: 70vh;
  overflow-y: auto;
}

.subject-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e5e7eb;
}

.subject-icon {
  width: 3.5rem;
  height: 3.5rem;
  background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  flex-shrink: 0;
}

.subject-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.subject-name {
  font-size: 1.375rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.section-count {
  font-size: 0.875rem;
  font-weight: 600;
  color: #6b7280;
  background-color: #f3f4f6;
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
  display: inline-block;
  width: fit-content;
}

.metadata-section {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  padding: 0.875rem;
  background-color: #f9fafb;
  border-radius: 10px;
}

.metadata-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.metadata-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #6b7280;
}

.metadata-value {
  font-size: 0.875rem;
  font-weight: 600;
  color: #111827;
}

.sections-section {
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
}

.section-title {
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  i {
    color: #667eea;
  }
}

.sections-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 0.75rem;
}

.section-card {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem;
  background: linear-gradient(135deg, #ffffff 0%, #f9fafb 100%);
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  transition: all 0.3s ease;
  cursor: default;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    border-color: #667eea;
    transform: translateY(-2px);
  }
}

.section-card-icon {
  width: 2.5rem;
  height: 2.5rem;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.15) 100%);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #667eea;
  font-size: 1rem;
  flex-shrink: 0;
}

.section-card-content {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
}

.section-card-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: #111827;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.no-sections {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2.5rem 1rem;
  background-color: #f9fafb;
  border-radius: 10px;
  border: 2px dashed #e5e7eb;

  i {
    font-size: 2.5rem;
    color: #d1d5db;
    margin-bottom: 0.75rem;
  }

  p {
    margin: 0;
    font-size: 0.938rem;
    color: #6b7280;
    font-weight: 500;
  }
}

@media (max-width: 640px) {
  .subject-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .subject-icon {
    width: 3rem;
    height: 3rem;
    font-size: 1.25rem;
  }

  .subject-name {
    font-size: 1.125rem;
  }

  .sections-grid {
    grid-template-columns: 1fr;
  }

  .metadata-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
  }
}
</style>
