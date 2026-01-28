<template>
  <BaseModal
    :show="showModal"
    @close="toggleModal"
    title="Manage Student Subjects"
    :modal-style="{
      background: 'white',
      maxWidth: '1200px',
      width: '95%',
      maxHeight: '90vh',
      overflow: 'hidden',
    }"
  >
    <!-- Instructions -->
    <div class="info-card">
      <svg
        width="20"
        height="20"
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
      <p>
        Select or deselect subjects for each term. Unchecked subjects will not
        be included in the student's assessment for that term.
      </p>
    </div>

    <!-- Student Info Header -->
    <div class="student-header" v-if="studentName">
      <div class="student-avatar">
        <div class="avatar-placeholder">
          {{ getInitials(studentName) }}
        </div>
      </div>
      <div class="student-basic-info">
        <h3>{{ studentName }}</h3>
        <div class="info-badges">
          <span class="badge badge-primary">{{ studentId }}</span>
          <span class="badge badge-info">{{ className }}</span>
          <span class="badge" :class="getStatusClass(studentStatus)">
            {{ studentStatus || "Active" }}
          </span>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-container">
      <div class="spinner"></div>
      <p>Loading subjects...</p>
    </div>

    <!-- Subjects by Term -->
    <div v-else class="terms-container">
      <div v-for="term in terms" :key="term.id" class="term-card">
        <div class="term-header">
          <h4>{{ term.term_name }}</h4>
          <span class="term-badge" :class="{ active: term.is_active }">
            {{ term.is_active ? "Active" : "Inactive" }}
          </span>
        </div>

        <div class="subjects-grid">
          <div
            v-for="subject in getTermSubjects(term.id)"
            :key="subject.id"
            class="subject-checkbox-card"
          >
            <label class="checkbox-label">
              <input
                type="checkbox"
                :checked="subject.is_enrolled"
                @change="
                  toggleSubject(term.id, subject.id, $event.target.checked)
                "
                class="subject-checkbox"
              />
              <div class="subject-info">
                <span class="subject-name">{{ subject.subject_name }}</span>
                <span class="subject-code">{{ subject.subject_code }}</span>
                <span class="subject-teacher"
                  >Teacher: {{ subject.teacher_name || "N/A" }}</span
                >
              </div>
            </label>
          </div>

          <div v-if="getTermSubjects(term.id).length === 0" class="no-subjects">
            <svg
              width="48"
              height="48"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
            <p>No subjects assigned for this term</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="modal-actions">
      <button type="button" class="btn btn-secondary" @click="toggleModal">
        Cancel
      </button>
      <button
        type="button"
        class="btn btn-success"
        @click="saveChanges"
        :disabled="saving || !hasChanges"
      >
        <svg
          v-if="!saving"
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
        <span v-if="saving" class="spinner-small"></span>
        {{ saving ? "Saving..." : "Save Changes" }}
      </button>
    </div>
  </BaseModal>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import BaseModal from "../../../components/public/BaseModal.vue";
import { useToast } from "../../../composables/useToast";
import apiServices from "../../../services/apiServices";

const emit = defineEmits(["subjects-updated"]);
const toast = useToast();

const showModal = ref(false);
const studentId = ref(null);
const studentName = ref("");
const className = ref("");
const studentStatus = ref("active");
const loading = ref(false);
const saving = ref(false);
const terms = ref([]);
const subjectsByTerm = ref({});
const changes = ref([]);

const hasChanges = computed(() => changes.value.length > 0);

const toggleModal = (studentData = null) => {
  showModal.value = !showModal.value;
  if (showModal.value && studentData) {
    studentId.value = studentData.id;
    studentName.value = studentData.full_name;
    className.value = studentData.Class?.class_name;
    studentStatus.value = studentData.student_status || "active";
    loadStudentSubjects();
  } else {
    resetData();
  }
};

const getInitials = (name) => {
  if (!name) return "NA";
  const names = name.split(" ");
  return names.length >= 2
    ? `${names[0][0]}${names[1][0]}`.toUpperCase()
    : name.substring(0, 2).toUpperCase();
};

const getStatusClass = (status) => {
  const statusClasses = {
    active: "badge-success",
    graduated: "badge-primary",
    transferred: "badge-info",
    suspended: "badge-warning",
    withdrawn: "badge-danger",
    leave: "badge-secondary",
  };
  return statusClasses[status?.toLowerCase()] || "badge-secondary";
};

const getTermSubjects = (termId) => {
  return subjectsByTerm.value[termId] || [];
};

const toggleSubject = (termId, subjectId, isEnrolled) => {
  const subjects = subjectsByTerm.value[termId];
  if (subjects) {
    const subject = subjects.find((s) => s.id === subjectId);
    if (subject) {
      subject.is_enrolled = isEnrolled;
    }
  }

  const existingChangeIndex = changes.value.findIndex(
    (c) => c.term_id === termId && c.subject_id === subjectId
  );

  if (existingChangeIndex >= 0) {
    changes.value[existingChangeIndex].is_enrolled = isEnrolled;
  } else {
    changes.value.push({
      term_id: termId,
      subject_id: subjectId,
      is_enrolled: isEnrolled,
    });
  }
};

const loadStudentSubjects = async () => {
  loading.value = true;

  apiServices
    .getStudentSubjects(studentId.value)
    .then((response) => {
      const data = response.data.data;
      terms.value = data.terms || [];
      subjectsByTerm.value = data.subjectsByTerm || {};
    })
    .catch((error) => {
      console.error("Error fetching student subjects:", error);
      toast.error("Error", "Failed to load student subjects.");
    })
    .finally(() => {
      loading.value = false;
    });
};

const saveChanges = async () => {
  if (changes.value.length === 0) return;

  saving.value = true;

  apiServices
    .updateStudentSubjects(studentId.value, { changes: changes.value })
    .then(() => {
      toast.success(
        "Subjects Updated",
        "Student subject enrollment has been updated successfully."
      );
      changes.value = [];
      loadStudentSubjects();
      emit("subjects-updated");
    })
    .catch((error) => {
      console.error("Error updating subjects:", error);
      toast.error("Error", "Failed to update subjects.");
    })
    .finally(() => {
      saving.value = false;
    });
};

const resetData = () => {
  studentId.value = null;
  studentName.value = "";
  className.value = "";
  studentStatus.value = "active";
  terms.value = [];
  subjectsByTerm.value = {};
  changes.value = [];
  loading.value = false;
  saving.value = false;
};

defineExpose({
  toggleModal,
});
</script>

<style scoped>
.student-details {
  max-height: calc(90vh - 120px);
  overflow-y: auto;
  padding-right: 4px;
}

.student-details::-webkit-scrollbar {
  width: 6px;
}

.student-details::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.student-details::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.student-details::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

.info-card {
  background: #ebf8ff;
  border-left: 4px solid #4299e1;
  padding: 0.75rem 1rem;
  border-radius: 6px;
  margin-bottom: 1rem;
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
}

.info-card svg {
  flex-shrink: 0;
  color: #4299e1;
  margin-top: 0.125rem;
}

.info-card p {
  margin: 0;
  color: #2c5282;
  font-size: 0.875rem;
  line-height: 1.4;
}

.student-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 0;
  margin-bottom: 1rem;
  border-bottom: 1px solid #e2e8f0;
}

.student-avatar {
  flex-shrink: 0;
}

.avatar-placeholder {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  font-weight: 600;
}

.student-basic-info h3 {
  margin: 0 0 0.375rem 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #2d3748;
}

.info-badges {
  display: flex;
  gap: 0.375rem;
  flex-wrap: wrap;
}

.badge {
  padding: 0.25rem 0.625rem;
  border-radius: 10px;
  font-size: 0.75rem;
  font-weight: 500;
}

.badge-primary {
  background: #e6f2ff;
  color: #0066cc;
}

.badge-success {
  background: #c6f6d5;
  color: #22543d;
}

.badge-danger {
  background: #fed7d7;
  color: #742a2a;
}

.badge-warning {
  background: #feebc8;
  color: #744210;
}

.badge-info {
  background: #bee3f8;
  color: #2c5282;
}

.badge-secondary {
  background: #e2e8f0;
  color: #4a5568;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 2rem;
  gap: 0.75rem;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #e2e8f0;
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.terms-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1rem;
}

.term-card {
  background: #f8fafc;
  border-radius: 8px;
  padding: 0.875rem;
  border: 1px solid #e2e8f0;
}

.term-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.75rem;
  padding-bottom: 0.625rem;
  border-bottom: 1px solid #e2e8f0;
}

.term-header h4 {
  font-size: 1rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0;
}

.term-badge {
  padding: 0.125rem 0.5rem;
  border-radius: 8px;
  font-size: 0.6875rem;
  font-weight: 500;
  background: #e2e8f0;
  color: #718096;
}

.term-badge.active {
  background: #c6f6d5;
  color: #22543d;
}

.subjects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 0.5rem;
}

.subject-checkbox-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 0.5rem 0.625rem;
  transition: all 0.2s;
}

.subject-checkbox-card:hover {
  border-color: #cbd5e0;
  background: #f7fafc;
}

.checkbox-label {
  display: flex;
  align-items: flex-start;
  gap: 0.375rem;
  cursor: pointer;
}

.subject-checkbox {
  width: 16px;
  height: 16px;
  margin-top: 0.125rem;
  cursor: pointer;
  flex-shrink: 0;
  accent-color: #667eea;
}

.subject-info {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  flex: 1;
  min-width: 0;
}

.subject-name {
  font-size: 0.8125rem;
  font-weight: 600;
  color: #2d3748;
  line-height: 1.3;
}

.subject-code {
  font-size: 0.6875rem;
  color: #718096;
  line-height: 1.2;
}

.subject-teacher {
  font-size: 0.625rem;
  color: #a0aec0;
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.no-subjects {
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  color: #a0aec0;
}

.no-subjects svg {
  margin-bottom: 0.5rem;
}

.no-subjects p {
  margin: 0;
  font-size: 0.875rem;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.625rem;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
  margin-top: 1rem;
}

.btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-secondary {
  background: #e2e8f0;
  color: #4a5568;
}

.btn-secondary:hover {
  background: #cbd5e0;
}

.btn-success {
  background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
  color: white;
  box-shadow: 0 2px 4px rgba(72, 187, 120, 0.3);
}

.btn-success:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(72, 187, 120, 0.4);
}

.btn-success:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.spinner-small {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@media (max-width: 768px) {
  .subjects-grid {
    grid-template-columns: 1fr;
  }

  .term-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .student-header {
    flex-direction: column;
    text-align: center;
  }

  .modal-actions {
    flex-direction: column;
  }

  .btn {
    width: 100%;
    justify-content: center;
  }
}
</style>