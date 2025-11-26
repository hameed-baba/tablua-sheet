<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1>Manage Student Subjects</h1>
        <p v-if="studentName">
          Student: <strong>{{ studentName }}</strong> | Class: <strong>{{ className }}</strong>
        </p>
      </div>
      <button class="add-btn" @click="goBack">
        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back
      </button>
    </div>

    <!-- Instructions -->
    <div class="info-card">
      <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <p>
        Select or deselect subjects for each term. Unchecked subjects will not be included in the student's assessment for that term.
      </p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-container">
      <div class="spinner"></div>
      <p>Loading subjects...</p>
    </div>

    <!-- Subjects by Term -->
    <div v-else class="terms-container">
      <div 
        v-for="term in terms" 
        :key="term.id" 
        class="term-card"
      >
        <div class="term-header">
          <h2>{{ term.term_name }}</h2>
          <span class="term-badge" :class="{ active: term.is_active }">
            {{ term.is_active ? 'Active' : 'Inactive' }}
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
                @change="toggleSubject(term.id, subject.id, $event.target.checked)"
                class="subject-checkbox"
              />
              <div class="subject-info">
                <span class="subject-name">{{ subject.subject_name }}</span>
                <span class="subject-code">{{ subject.subject_code }}</span>
                <span class="subject-teacher">Teacher: {{ subject.teacher_name || 'N/A' }}</span>
              </div>
            </label>
          </div>

          <div v-if="getTermSubjects(term.id).length === 0" class="no-subjects">
            <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <p>No subjects assigned for this term</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Save Button -->
    <div v-if="!loading && hasChanges" class="save-section">
      <button class="save-btn" @click="saveChanges" :disabled="saving">
        <svg v-if="!saving" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
        <span v-if="saving" class="spinner-small"></span>
        {{ saving ? 'Saving...' : 'Save Changes' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from '../../composables/useToast';
import apiServices from '../../services/apiServices';

const route = useRoute();
const router = useRouter();
const toast = useToast();

const studentId = ref(null);
const studentName = ref('');
const className = ref('');
const loading = ref(false);
const saving = ref(false);
const terms = ref([]);
const subjectsByTerm = ref({});
const changes = ref([]);

const hasChanges = computed(() => changes.value.length > 0);

const getTermSubjects = (termId) => {
  return subjectsByTerm.value[termId] || [];
};

const toggleSubject = (termId, subjectId, isEnrolled) => {
  // Update the subject enrollment status in the UI
  const subjects = subjectsByTerm.value[termId];
  if (subjects) {
    const subject = subjects.find(s => s.id === subjectId);
    if (subject) {
      subject.is_enrolled = isEnrolled;
    }
  }

  // Track the change
  const existingChangeIndex = changes.value.findIndex(
    c => c.term_id === termId && c.subject_id === subjectId
  );

  if (existingChangeIndex >= 0) {
    changes.value[existingChangeIndex].is_enrolled = isEnrolled;
  } else {
    changes.value.push({
      term_id: termId,
      subject_id: subjectId,
      is_enrolled: isEnrolled
    });
  }
};

const loadStudentSubjects = async () => {
  loading.value = true;
  
  apiServices.getStudentSubjects(studentId.value)
    .then(response => {
      const data = response.data.data;
      terms.value = data.terms || [];
      subjectsByTerm.value = data.subjectsByTerm || {};
    })
    .catch(error => {
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
  
  apiServices.updateStudentSubjects(studentId.value, { changes: changes.value })
    .then(() => {
      toast.success(
        'Subjects Updated',
        'Student subject enrollment has been updated successfully.'
      );
      changes.value = [];
      // Reload to ensure sync
      loadStudentSubjects();
    })
    .catch(error => {
      console.error("Error updating subjects:", error);
      toast.error("Error", "Failed to update subjects.");
    })
    .finally(() => {
      saving.value = false;
    });
};

const goBack = () => {
  router.back();
};

const fetchStudentDetails = () => {
  apiServices.getStudentById(studentId.value)
    .then(response => {
      const student = response.data.data;
      studentName.value = student.full_name;
      className.value = student.Class?.class_name;
    })
    .catch(error => {
      console.error("Error fetching student details:", error);
    });
};

onMounted(() => {
  studentId.value = route.params.studentId;
  
  // Use query params for immediate display if available
  if (route.query.studentName) studentName.value = route.query.studentName;
  if (route.query.className) className.value = route.query.className;

  if (studentId.value) {
    loadStudentSubjects();
    // Fetch fresh details to ensure accuracy
    fetchStudentDetails();
  } else {
    toast.error('Invalid Student', 'No student ID provided.');
    router.back();
  }
});
</script>

<style scoped>
.info-card {
  background: #ebf8ff;
  border-left: 4px solid #4299e1;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.info-card svg {
  flex-shrink: 0;
  color: #4299e1;
  margin-top: 0.125rem;
}

.info-card p {
  margin: 0;
  color: #2c5282;
  font-size: 0.9375rem;
  line-height: 1.5;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  gap: 1rem;
}

.spinner {
  width: 48px;
  height: 48px;
  border: 4px solid #e2e8f0;
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.terms-container {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.term-card {
  background: white;
  border-radius: 10px;
  padding: 1rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
}

.term-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid #e2e8f0;
}

.term-header h2 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0;
}

.term-badge {
  padding: 0.25rem 0.625rem;
  border-radius: 10px;
  font-size: 0.75rem;
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
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 0.625rem;
}

.subject-checkbox-card {
  background: #f7fafc;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 0.625rem 0.75rem;
  transition: all 0.2s;
}

.subject-checkbox-card:hover {
  border-color: #cbd5e0;
  background: #edf2f7;
}

.checkbox-label {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  cursor: pointer;
}

.subject-checkbox {
  width: 18px;
  height: 18px;
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
  font-size: 0.875rem;
  font-weight: 600;
  color: #2d3748;
  line-height: 1.3;
}

.subject-code {
  font-size: 0.75rem;
  color: #718096;
  line-height: 1.2;
}

.subject-teacher {
  font-size: 0.6875rem;
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
  padding: 3rem 2rem;
  color: #a0aec0;
}

.no-subjects svg {
  margin-bottom: 1rem;
}

.no-subjects p {
  margin: 0;
  font-size: 1rem;
}

.save-section {
  position: sticky;
  bottom: 2rem;
  display: flex;
  justify-content: center;
  margin-top: 2rem;
  padding-top: 2rem;
}

.save-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  transition: all 0.2s;
}

.save-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.5);
}

.save-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.spinner-small {
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
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
    gap: 0.75rem;
  }

  .save-section {
    bottom: 1rem;
  }

  .save-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>
