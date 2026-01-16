<template>
  <div v-if="show" class="modal-overlay" @click="closeModal">
    <div class="modal-container" @click.stop>
      <div class="modal-header">
        <h2>Enter Marks</h2>
        <div class="class-subject-info">
          <span class="class-name">{{ selectedClass?.class_name }}</span>
          <span class="separator">•</span>
          <span class="subject-name">{{ selectedSubject?.subject_name }}</span>
        </div>
        <button class="close-btn" @click="closeModal">
          <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <div class="modal-body">
        <!-- Assessment Type Selector -->
        <div class="assessment-selector">
          <label>Assessment Type:</label>
          <select v-model="selectedAssessment" class="assessment-select">
            <option value="ca">CA</option>
            <option value="exam">Exam</option>
          </select>
          <div class="max-score-info">
            Max Score: {{ getMaxScore() }}
          </div>
        </div>

        <!-- Search and Filter -->
        <div class="search-filter">
          <div class="search-box">
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <input 
              type="text" 
              placeholder="Search students..." 
              v-model="searchTerm"
            />
          </div>
          <button 
            class="bulk-action-btn"
            @click="showBulkEntry = !showBulkEntry"
            :class="{ active: showBulkEntry }"
          >
            Bulk Entry
          </button>
        </div>

        <!-- Bulk Entry Section -->
        <div v-if="showBulkEntry" class="bulk-entry-section">
          <div class="bulk-entry-form">
            <input 
              type="number" 
              v-model="bulkScore" 
              :max="getMaxScore()"
              :min="0"
              placeholder="Enter score for all students"
              class="bulk-score-input"
            />
            <button @click="applyBulkScore" class="apply-bulk-btn">
              Apply to All
            </button>
          </div>
        </div>

        <!-- Students List -->
        <div class="students-container">
          <div class="students-header">
            <div class="header-row">
              <span class="col-sn">S/N</span>
              <span class="col-name">Student Name</span>
              <span class="col-admission">Admission No.</span>
              <span class="col-score">{{ getAssessmentLabel() }} Score</span>
              <span class="col-status">Status</span>
            </div>
          </div>

          <div class="students-list">
            <div 
              v-for="(student, index) in filteredStudents" 
              :key="student.id"
              class="student-row"
              :class="{ 'has-score': studentMarks[student.id]?.[selectedAssessment] !== null }"
            >
              <span class="col-sn">{{ index + 1 }}</span>
              <span class="col-name">
                <strong>{{ student.full_name }}</strong>
              </span>
              <span class="col-admission">{{ student.admission_number }}</span>
              <div class="col-score">
                <input 
                  type="number" 
                  v-model="studentMarks[student.id][selectedAssessment]"
                  :max="getMaxScore()"
                  :min="0"
                  step="0.5"
                  class="score-input"
                  @input="validateScore(student.id)"
                  @blur="formatScore(student.id)"
                />
              </div>
              <span class="col-status">
                <span 
                  class="status-badge"
                  :class="getScoreStatusClass(student.id)"
                >
                  {{ getScoreStatusText(student.id) }}
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <div class="progress-info">
          <span>{{ completedCount }}/{{ filteredStudents.length }} completed</span>
          <div class="progress-bar">
            <div 
              class="progress-fill" 
              :style="{ width: progressPercentage + '%' }"
            ></div>
          </div>
        </div>
        <div class="footer-actions">
          <button class="btn-cancel" @click="closeModal">Cancel</button>
          <button 
            class="btn-save" 
            @click="saveMarks"
            :disabled="!hasChanges"
          >
            Save Marks
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'

const props = defineProps({
  show: Boolean,
  selectedClass: Object,
  selectedSubject: Object,
  students: Array
})

const emit = defineEmits(['close', 'save'])

// Reactive data
const selectedAssessment = ref('ca')
const searchTerm = ref('')
const showBulkEntry = ref(false)
const bulkScore = ref('')
const studentMarks = ref({})
const originalMarks = ref({})

// Assessment configuration
const assessmentConfig = {
  ca: { label: 'CA', maxScore: 40 },
  exam: { label: 'Exam', maxScore: 60 }
}

// Computed properties
const filteredStudents = computed(() => {
  if (!props.students) return []
  
  if (!searchTerm.value) return props.students
  
  return props.students.filter(student => 
    student.full_name.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
    student.admission_number.toLowerCase().includes(searchTerm.value.toLowerCase())
  )
})

const completedCount = computed(() => {
  return filteredStudents.value.filter(student => 
    studentMarks.value[student.id]?.[selectedAssessment.value] !== null &&
    studentMarks.value[student.id]?.[selectedAssessment.value] !== undefined &&
    studentMarks.value[student.id]?.[selectedAssessment.value] !== ''
  ).length
})

const progressPercentage = computed(() => {
  if (filteredStudents.value.length === 0) return 0
  return (completedCount.value / filteredStudents.value.length) * 100
})

const hasChanges = computed(() => {
  return JSON.stringify(studentMarks.value) !== JSON.stringify(originalMarks.value)
})

// Methods
const initializeMarks = () => {
  const marks = {}
  props.students?.forEach(student => {
    marks[student.id] = {
      ca: null,
      exam: null
    }
  })
  studentMarks.value = marks
  originalMarks.value = JSON.parse(JSON.stringify(marks))
}

const getMaxScore = () => {
  return assessmentConfig[selectedAssessment.value].maxScore
}

const getAssessmentLabel = () => {
  return assessmentConfig[selectedAssessment.value].label
}

const validateScore = (studentId) => {
  const score = studentMarks.value[studentId][selectedAssessment.value]
  const maxScore = getMaxScore()
  
  if (score !== null && score !== '') {
    if (parseFloat(score) > maxScore) {
      studentMarks.value[studentId][selectedAssessment.value] = maxScore
    } else if (parseFloat(score) < 0) {
      studentMarks.value[studentId][selectedAssessment.value] = 0
    }
  }
}

const formatScore = (studentId) => {
  const score = studentMarks.value[studentId][selectedAssessment.value]
  if (score !== null && score !== '') {
    studentMarks.value[studentId][selectedAssessment.value] = parseFloat(score).toFixed(1)
  }
}

const applyBulkScore = () => {
  if (bulkScore.value === '' || bulkScore.value === null) return
  
  const score = parseFloat(bulkScore.value)
  const maxScore = getMaxScore()
  
  if (score > maxScore || score < 0) {
    alert(`Score must be between 0 and ${maxScore}`)
    return
  }
  
  filteredStudents.value.forEach(student => {
    studentMarks.value[student.id][selectedAssessment.value] = score.toFixed(1)
  })
  
  bulkScore.value = ''
  showBulkEntry.value = false
}

const getScoreStatusClass = (studentId) => {
  const score = studentMarks.value[studentId]?.[selectedAssessment.value]
  if (score === null || score === undefined || score === '') return 'status-pending'
  
  const percentage = (parseFloat(score) / getMaxScore()) * 100
  if (percentage >= 70) return 'status-excellent'
  if (percentage >= 50) return 'status-good'
  if (percentage >= 40) return 'status-fair'
  return 'status-poor'
}

const getScoreStatusText = (studentId) => {
  const score = studentMarks.value[studentId]?.[selectedAssessment.value]
  if (score === null || score === undefined || score === '') return 'Pending'
  
  const percentage = (parseFloat(score) / getMaxScore()) * 100
  if (percentage >= 70) return 'Excellent'
  if (percentage >= 50) return 'Good'
  if (percentage >= 40) return 'Fair'
  return 'Poor'
}

const saveMarks = () => {
  const marksData = {
    classId: props.selectedClass.id,
    subjectId: props.selectedSubject.id,
    assessmentType: selectedAssessment.value,
    marks: studentMarks.value
  }
  
  emit('save', marksData)
}

const closeModal = () => {
  emit('close')
}

// Watchers
watch(() => props.students, () => {
  if (props.students) {
    initializeMarks()
  }
}, { immediate: true })

watch(() => props.show, (newVal) => {
  if (newVal) {
    searchTerm.value = ''
    showBulkEntry.value = false
    bulkScore.value = ''
  }
})

// Lifecycle
onMounted(() => {
  if (props.students) {
    initializeMarks()
  }
})
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-container {
  background: white;
  border-radius: 12px;
  width: 100%;
  max-width: 900px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.modal-header {
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fafbfc;
  border-radius: 12px 12px 0 0;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a1a1a;
}

.class-subject-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #666;
}

.separator {
  opacity: 0.6;
}

.close-btn {
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: #f3f4f6;
  color: #1a1a1a;
}

.modal-body {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.assessment-selector {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  gap: 1rem;
  background: white;
}

.assessment-selector label {
  font-weight: 500;
  color: #1a1a1a;
  font-size: 0.875rem;
}

.assessment-select {
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: white;
  font-size: 0.875rem;
  color: #1a1a1a;
}

.max-score-info {
  color: #666;
  font-size: 0.75rem;
  margin-left: auto;
}

.search-filter {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  gap: 1rem;
  background: white;
}

.search-box {
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
}

.search-box svg {
  position: absolute;
  left: 0.75rem;
  color: #9ca3af;
}

.search-box input {
  width: 100%;
  padding: 0.5rem 0.75rem 0.5rem 2.5rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.875rem;
}

.bulk-action-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: white;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.2s;
  color: #374151;
}

.bulk-action-btn:hover,
.bulk-action-btn.active {
  background: #2563eb;
  color: white;
  border-color: #2563eb;
}

.bulk-entry-section {
  padding: 1rem 1.5rem;
  background: #f8fafc;
  border-bottom: 1px solid #e5e7eb;
}

.bulk-entry-form {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.bulk-score-input {
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  width: 200px;
  font-size: 0.875rem;
}

.apply-bulk-btn {
  padding: 0.5rem 1rem;
  background: #059669;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
}

.apply-bulk-btn:hover {
  background: #047857;
}

.students-container {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.students-header {
  padding: 1rem 1.5rem;
  background: #fafbfc;
  border-bottom: 1px solid #e5e7eb;
}

.header-row {
  display: grid;
  grid-template-columns: 60px 1fr 120px 120px 100px;
  gap: 1rem;
  font-weight: 500;
  color: #374151;
  font-size: 0.875rem;
}

.students-list {
  flex: 1;
  overflow-y: auto;
  padding: 0 1.5rem;
}

.student-row {
  display: grid;
  grid-template-columns: 60px 1fr 120px 120px 100px;
  gap: 1rem;
  padding: 1rem 0;
  border-bottom: 1px solid #f3f4f6;
  align-items: center;
  transition: background-color 0.2s;
}

.student-row:hover {
  background-color: #fafbfc;
}

.student-row.has-score {
  background-color: #f0fdf4;
}

.col-sn {
  color: #6b7280;
  font-size: 0.875rem;
}

.col-name strong {
  color: #1a1a1a;
  font-size: 0.875rem;
}

.col-admission {
  color: #6b7280;
  font-size: 0.875rem;
}

.score-input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  text-align: center;
  font-size: 0.875rem;
}

.score-input:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.status-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
}

.status-pending {
  background: #f3f4f6;
  color: #6b7280;
}

.status-excellent {
  background: #dcfce7;
  color: #166534;
}

.status-good {
  background: #dbeafe;
  color: #1d4ed8;
}

.status-fair {
  background: #fef3c7;
  color: #d97706;
}

.status-poor {
  background: #fee2e2;
  color: #dc2626;
}

.modal-footer {
  padding: 1.5rem;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fafbfc;
}

.progress-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  color: #6b7280;
  font-size: 0.875rem;
}

.progress-bar {
  width: 200px;
  height: 6px;
  background: #e5e7eb;
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #2563eb;
  transition: width 0.3s ease;
}

.footer-actions {
  display: flex;
  gap: 1rem;
}

.btn-cancel {
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: white;
  cursor: pointer;
  font-size: 0.875rem;
  color: #374151;
}

.btn-cancel:hover {
  background: #f9fafb;
}

.btn-save {
  padding: 0.5rem 1.5rem;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
}

.btn-save:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-save:not(:disabled):hover {
  background: #1d4ed8;
}

/* Responsive Design */
@media (max-width: 768px) {
  .modal-container {
    margin: 0.5rem;
    max-height: 95vh;
  }

  .header-row,
  .student-row {
    grid-template-columns: 40px 1fr 80px 80px;
    gap: 0.5rem;
  }

  .col-admission {
    display: none;
  }

  .modal-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .close-btn {
    position: absolute;
    top: 1rem;
    right: 1rem;
  }

  .search-filter {
    flex-direction: column;
    align-items: stretch;
    gap: 0.5rem;
  }

  .bulk-entry-form {
    flex-direction: column;
    align-items: stretch;
  }

  .modal-footer {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .progress-info {
    justify-content: center;
  }
}
</style>