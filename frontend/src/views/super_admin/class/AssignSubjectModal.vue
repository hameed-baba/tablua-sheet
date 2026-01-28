<template>
  <BaseModal
    :show="showModal"
    @close="toggleModal"
    title="Assign Subjects to Class"
    size="large"
  >
    <div class="assignment-container">
      <!-- Assignment Form -->
      <div class="assignment-form">
        <div class="form-header">
          <h4>Add Subject Assignment</h4>
          <p>Select a subject and teacher, then click "Add" to include it in your assignments</p>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
              </svg>
              Subject <span class="required">*</span>
            </label>
            <select
              v-model="currentAssignment.school_subject_id"
              class="form-input"
              :disabled="loadingSubjects"
            >
              <option value="">Select Subject</option>
              <option
                v-for="subject in availableSubjects"
                :key="subject.id"
                :value="subject.id"
                :disabled="isSubjectAlreadyAssigned(subject.id)"
              >
                {{ subject.subject_name }}
                <span v-if="isSubjectAlreadyAssigned(subject.id)"> (Already assigned)</span>
              </option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
              Teacher <span class="required">*</span>
            </label>
            <select
              v-model="currentAssignment.school_staff_id"
              class="form-input"
              :disabled="loadingSubjects"
            >
              <option value="">Select Teacher</option>
              <option
                v-for="teacher in teachers"
                :key="teacher.id"
                :value="teacher.id"
              >
                {{ teacher.full_name }}
              </option>
            </select>
          </div>

          <div class="form-actions">
            <button 
              type="button" 
              class="btn-add"
              @click="addAssignment"
              :disabled="!canAddAssignment"
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
              </svg>
              Add Assignment
            </button>
          </div>
        </div>

        <div v-if="validationError" class="error-message">
          {{ validationError }}
        </div>
      </div>

      <!-- Assignments List -->
      <div v-if="pendingAssignments.length > 0" class="assignments-list">
        <div class="list-header">
          <h5>
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/>
            </svg>
            Pending Assignments ({{ pendingAssignments.length }})
          </h5>
          <button 
            type="button" 
            class="btn-clear-all"
            @click="clearAllAssignments"
          >
            Clear All
          </button>
        </div>

        <div class="assignments-grid">
          <div 
            v-for="(assignment, index) in pendingAssignments" 
            :key="index"
            class="assignment-item"
          >
            <div class="assignment-content">
              <div class="assignment-subject">
                <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                </svg>
                {{ getSubjectName(assignment.school_subject_id) }}
              </div>
              <div class="assignment-arrow">→</div>
              <div class="assignment-staff">
                <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
                {{ getStaffName(assignment.school_staff_id) }}
              </div>
            </div>
            <button 
              type="button" 
              class="btn-remove"
              @click="removeAssignment(index)"
              title="Remove assignment"
            >
              <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="empty-state">
        <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
        </svg>
        <h4>No assignments added yet</h4>
        <p>Select a subject and teacher above, then click "Add" to create assignments</p>
      </div>

      <!-- Modal Actions -->
      <div class="modal-actions">
        <button type="button" class="btn btn-cancel" @click="toggleModal">
          Cancel
        </button>
        <button 
          type="button" 
          class="btn btn-success" 
          :disabled="submitting || pendingAssignments.length === 0"
          @click="saveAllAssignments"
        >
          <span v-if="submitting" class="spinner"></span>
          {{ submitting ? "Saving..." : `Save ${pendingAssignments.length} Assignment${pendingAssignments.length !== 1 ? 's' : ''}` }}
        </button>
      </div>

      <p class="text-danger text-center">{{ errorMessage }}</p>
      <p v-if="loadingSubjects" class="text-muted">
        <i class="fa fa-spinner fa-spin"></i> Loading...
      </p>
    </div>
  </BaseModal>
</template>

<script setup>
import { computed, ref } from "vue";
import { useRoute } from "vue-router";
import BaseModal from "../../../components/public/BaseModal.vue";
import { useToast } from "../../../composables/useToast";
import apiServices from "../../../services/apiServices";

const emit = defineEmits(["send-status"]);

const loadingSubjects = ref(false);
const route = useRoute();
const classId = computed(() => route.params.id);

const errorMessage = ref("");
const validationError = ref("");
const toast = useToast();
const showModal = ref(false);
const submitting = ref(false);
const availableSubjects = ref([]);
const teachers = ref([]);

// Current assignment being built
const currentAssignment = ref({
  school_subject_id: "",
  school_staff_id: "",
});

// List of pending assignments to be saved
const pendingAssignments = ref([]);

// Computed properties
const canAddAssignment = computed(() => {
  return currentAssignment.value.school_subject_id && 
         currentAssignment.value.school_staff_id &&
         !isAssignmentDuplicate();
});

// Helper functions
const getSubjectName = (subjectId) => {
  const subject = availableSubjects.value.find(s => s.id == subjectId);
  return subject ? subject.subject_name : '';
};

const getStaffName = (staffId) => {
  const staff = teachers.value.find(t => t.id == staffId);
  return staff ? staff.full_name : '';
};

const isSubjectAlreadyAssigned = (subjectId) => {
  return pendingAssignments.value.some(assignment => 
    assignment.school_subject_id == subjectId
  );
};

const isAssignmentDuplicate = () => {
  return pendingAssignments.value.some(assignment => 
    assignment.school_subject_id == currentAssignment.value.school_subject_id &&
    assignment.school_staff_id == currentAssignment.value.school_staff_id
  );
};

const toggleModal = () => {
  showModal.value = !showModal.value;

  if (showModal.value) {
    getClassSubjects();
  }
};

const resetForm = () => {
  currentAssignment.value = {
    school_subject_id: "",
    school_staff_id: "",
  };
  pendingAssignments.value = [];
  validationError.value = "";
  errorMessage.value = "";
};

const addAssignment = () => {
  validationError.value = "";
  
  // Validate current assignment
  if (!currentAssignment.value.school_subject_id) {
    validationError.value = "Please select a subject";
    return;
  }
  
  if (!currentAssignment.value.school_staff_id) {
    validationError.value = "Please select a teacher";
    return;
  }
  
  // Check for duplicates
  if (isAssignmentDuplicate()) {
    validationError.value = "This assignment already exists in your list";
    return;
  }
  
  // Check if subject is already assigned (one subject can only have one teacher)
  if (isSubjectAlreadyAssigned(currentAssignment.value.school_subject_id)) {
    validationError.value = "This subject is already assigned to another teacher";
    return;
  }
  
  // Add to pending assignments
  pendingAssignments.value.push({
    school_class_id: parseInt(classId.value),
    school_subject_id: currentAssignment.value.school_subject_id,
    school_staff_id: currentAssignment.value.school_staff_id,
  });
  
  // Reset current assignment form
  currentAssignment.value = {
    school_subject_id: "",
    school_staff_id: "",
  };
  
  // toast.success("Assignment Added", "Assignment added to the list successfully");
};

const removeAssignment = (index) => {
  const assignment = pendingAssignments.value[index];
  const subjectName = getSubjectName(assignment.school_subject_id);
  
  pendingAssignments.value.splice(index, 1);
  toast.info("Assignment Removed", `${subjectName} assignment removed from the list`);
};

const clearAllAssignments = () => {
  if (confirm("Are you sure you want to clear all pending assignments?")) {
    pendingAssignments.value = [];
    toast.info("All Cleared", "All pending assignments have been cleared");
  }
};

const getClassSubjects = async (id) => {
  loadingSubjects.value = true;

  apiServices
    .getStaffWithSubjectsByClassId(classId.value)
    .then((response) => {
      if (response.status === 200) {
        availableSubjects.value = response.data.data?.subjects;
        teachers.value = response.data.data?.staff;
      }
    })
    .catch((error) => {
      console.log(error);
    })
    .finally(() => {
      loadingSubjects.value = false;
    });
};

const saveAllAssignments = async () => {
  if (pendingAssignments.value.length === 0) {
    validationError.value = "No assignments to save";
    return;
  }

  submitting.value = true;
  errorMessage.value = "";

  try {
    const formDataPayload = {
      assignments: pendingAssignments.value,
      school_class_id: parseInt(classId.value),
    };

    // Use bulk API
    const response = await apiServices.createBulkClassSubjectAssignment(formDataPayload);

    if (response.status === 201) {
      const { createdCount, duplicateCount, totalRequested } = response.data.data;
      
      let message = `${createdCount} assignment${createdCount !== 1 ? 's' : ''} created successfully`;
      if (duplicateCount > 0) {
        message += `. ${duplicateCount} duplicate${duplicateCount !== 1 ? 's' : ''} were skipped`;
      }

      toast.success("Assignments Saved", message);
      resetForm();
      toggleModal();
      emit("send-status", "success");
    }
  } catch (error) {
    console.error("Error saving assignments:", error);
    errorMessage.value =
      error.response?.data?.message || "An error occurred while saving assignments.";

    setTimeout(() => {
      errorMessage.value = "";
    }, 5000);
  } finally {
    submitting.value = false;
  }
};

defineExpose({
  toggleModal,
});
</script>

<style scoped>
.assignment-container {
  max-height: 75vh;
  overflow-y: auto;
}

/* Assignment Form */
.assignment-form {
  margin-bottom: 24px;
  padding: 20px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
}

.form-header {
  margin-bottom: 20px;
}

.form-header h4 {
  margin: 0 0 8px 0;
  color: #1e293b;
  font-size: 18px;
  font-weight: 600;
}

.form-header p {
  margin: 0;
  color: #64748b;
  font-size: 14px;
}

.form-row {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
  font-size: 14px;
}

.required {
  color: #ef4444;
}

.form-input {
  padding: 12px 14px;
  border: 2px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.2s ease;
  background: white;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-input:disabled {
  background: #f3f4f6;
  cursor: not-allowed;
}

.form-actions {
  display: flex;
  justify-content: center;
}

.btn-add {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 32px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  white-space: nowrap;
  min-width: 160px;
}

.btn-add:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.btn-add:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.error-message {
  color: #ef4444;
  font-size: 13px;
  margin-top: 8px;
  padding: 8px 12px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 6px;
}

/* Assignments List */
.assignments-list {
  margin-bottom: 24px;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 2px solid #e2e8f0;
}

.list-header h5 {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
  color: #1e293b;
  font-size: 16px;
  font-weight: 600;
}

.btn-clear-all {
  padding: 6px 12px;
  background: #f1f5f9;
  color: #64748b;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-clear-all:hover {
  background: #ef4444;
  color: white;
  border-color: #ef4444;
}

.assignments-grid {
  display: grid;
  gap: 12px;
  max-height: 300px;
  overflow-y: auto;
}

.assignment-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.assignment-item:hover {
  border-color: #667eea;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.1);
}

.assignment-content {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.assignment-subject,
.assignment-staff {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 500;
}

.assignment-subject {
  color: #1e40af;
}

.assignment-staff {
  color: #059669;
}

.assignment-arrow {
  color: #6b7280;
  font-weight: bold;
  font-size: 16px;
}

.btn-remove {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: #fef2f2;
  color: #ef4444;
  border: 1px solid #fecaca;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-remove:hover {
  background: #ef4444;
  color: white;
  border-color: #ef4444;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #64748b;
}

.empty-state svg {
  margin-bottom: 16px;
  opacity: 0.5;
}

.empty-state h4 {
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: 600;
}

.empty-state p {
  margin: 0;
  font-size: 14px;
}

/* Modal Actions */
.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid #e2e8f0;
}

/* Responsive Design */
@media (max-width: 768px) {
  .btn-add {
    width: 100%;
    min-width: unset;
  }
  
  .assignment-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .assignment-arrow {
    display: none;
  }
  
  .list-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
}

@media (max-width: 480px) {
  .assignment-form {
    padding: 16px;
  }
  
  .form-row {
    gap: 16px;
  }
}
</style>