<template>
  <BaseModal
    :show="showModal"
    @close="toggleModal"
    title="Update Subject Assignments"
    size="large"
  >
    <div class="assignment-container">
      <!-- Assignment Form -->
      <div class="assignment-form">
        <div class="form-header">
          <h4>Update Assignment</h4>
          <p>Modify the subject or teacher for this assignment</p>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">
              <svg
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
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
              Subject <span class="required">*</span>
            </label>
            <select
              v-model="subjectInfo.school_subject_id"
              class="form-input"
              :disabled="loadingSubjects"
            >
              <option value="">Select Subject</option>
              <option
                v-for="subject in availableSubjects"
                :key="subject.id"
                :value="subject.id"
                :disabled="isSubjectTaken(subject.id)"
              >
                {{ subject.subject_name }}
                <span v-if="isSubjectTaken(subject.id)">
                  (Already assigned)</span
                >
              </option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">
              <svg
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
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              Teacher <span class="required">*</span>
            </label>
            <select
              v-model="subjectInfo.school_staff_id"
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
        </div>

        <div v-if="validationError" class="error-message">
          {{ validationError }}
        </div>
      </div>

      <!-- Modal Actions -->
      <div class="modal-actions">
        <button type="button" class="btn btn-cancel" @click="toggleModal">
          Cancel
        </button>
        <button
          type="button"
          class="btn btn-success"
          :disabled="submitting || !canUpdate"
          @click="handleSubmit"
        >
          <span v-if="submitting" class="spinner"></span>
          {{ submitting ? "Updating..." : "Update Assignment" }}
        </button>
      </div>

      <p class="text-danger text-center">{{ errorMessage }}</p>
      <p v-if="loadingSubjects" class="text-muted">
        <i class="fa fa-spinner fa-spin"></i> Loading...
      </p>
    </div>
    <pre>{{ subjectInfo }}</pre>
  </BaseModal>
</template>

<script setup>
import { computed, ref } from "vue";
import { useRoute } from "vue-router";
import BaseModal from "../../../components/public/BaseModal.vue";
import { useToast } from "../../../composables/useToast";
import apiServices from "../../../services/apiServices";

const emit = defineEmits(["send-status"]);

const props = defineProps({
  subjectInfo: {
    type: Object,
    default: () => ({}),
  },
});

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
const existingAssignments = ref([]);

// Computed properties
const canUpdate = computed(() => {
  return (
    props.subjectInfo.school_subject_id &&
    props.subjectInfo.school_staff_id &&
    !isDuplicateAssignment()
  );
});

// Helper functions
const isSubjectTaken = (subjectId) => {
  // Check if subject is already assigned to another assignment (excluding current one)
  return existingAssignments.value.some(
    (assignment) =>
      assignment.school_subject_id == subjectId &&
      assignment.id != props.subjectInfo.id
  );
};

const isDuplicateAssignment = () => {
  // Check if this exact combination already exists (excluding current assignment)
  return existingAssignments.value.some(
    (assignment) =>
      assignment.school_subject_id == props.subjectInfo.school_subject_id &&
      assignment.school_staff_id == props.subjectInfo.school_staff_id &&
      assignment.id != props.subjectInfo.id
  );
};

const toggleModal = () => {
  showModal.value = !showModal.value;

  if (showModal.value) {
    getClassSubjects();
    loadExistingAssignments();
  } else {
    resetForm();
  }
};

const resetForm = () => {
  validationError.value = "";
  errorMessage.value = "";
};

const getClassSubjects = async () => {
  loadingSubjects.value = true;

  try {
    const response = await apiServices.getStaffWithSubjectsByClassId(
      classId.value
    );
    if (response.status === 200) {
      availableSubjects.value = response.data.data?.subjects || [];
      teachers.value = response.data.data?.staff || [];
    }
  } catch (error) {
    console.error("Error loading subjects and staff:", error);
    errorMessage.value = "Failed to load subjects and staff";
  } finally {
    loadingSubjects.value = false;
  }
};

const loadExistingAssignments = async () => {
  try {
    const response = await apiServices.getClassAssignedSubject(classId.value);
    existingAssignments.value = response.data.data || [];
  } catch (error) {
    console.error("Error loading existing assignments:", error);
  }
};

const handleSubmit = async () => {
  validationError.value = "";

  // Validate form
  if (!props.subjectInfo.school_subject_id) {
    validationError.value = "Please select a subject";
    return;
  }

  if (!props.subjectInfo.school_staff_id) {
    validationError.value = "Please select a teacher";
    return;
  }

  // Check for duplicates
  if (isDuplicateAssignment()) {
    validationError.value = "This assignment combination already exists";
    return;
  }

  submitting.value = true;
  errorMessage.value = "";

  const data = {
    school_class_id: classId.value,
    school_subject_id: props.subjectInfo.school_subject_id,
    school_staff_id: props.subjectInfo.school_staff_id,
  };

  try {
    const response = await apiServices.updateClassSubjectAssignment(
      props.subjectInfo.id,
      data
    );

    if (response.status === 200) {
      toast.success(
        "Assignment Updated Successfully",
        "Subject assignment updated successfully."
      );
      resetForm();
      toggleModal();
      emit("send-status", "success");
    }
  } catch (error) {
    console.error("Error updating assignment:", error);
    errorMessage.value =
      error.response?.data?.message ||
      "An error occurred while updating the assignment.";

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

.error-message {
  color: #ef4444;
  font-size: 13px;
  margin-top: 8px;
  padding: 8px 12px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 6px;
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
  .assignment-form {
    padding: 16px;
  }

  .form-row {
    gap: 16px;
  }
}
</style>