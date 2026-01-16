<template>
  <TeacherLayout>
    <div class="teacher-dashboard">
      <!-- Welcome Section -->
      <div class="welcome-section">
        <div class="welcome-content">
          <h1>Good morning, {{ teacherName }}</h1>
          <p>{{ currentSession }} • {{ currentTerm }}</p>
        </div>
        <div class="quick-stats">
          <div class="stat-item">
            <span class="stat-number">{{ assignedClasses.length }}</span>
            <span class="stat-label">Classes</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">{{ totalSubjects }}</span>
            <span class="stat-label">Subjects</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">{{ totalStudents }}</span>
            <span class="stat-label">Students</span>
          </div>
        </div>
      </div>

      <!-- Classes Grid -->
      <div class="classes-container">
        <div class="section-header">
          <h2>My Classes</h2>
          <span class="section-subtitle">{{ assignedClasses.length }} classes assigned</span>
        </div>
        
        <div class="classes-grid">
          <div 
            v-for="classItem in assignedClasses" 
            :key="classItem.id"
            class="class-card"
          >
            <div class="class-info">
              <h3>{{ classItem.class_name }}</h3>
              <p>{{ classItem.student_count }} students</p>
            </div>
            
            <div class="subjects-grid">
              <div 
                v-for="subject in classItem.subjects" 
                :key="subject.id"
                class="subject-card"
                @click="openMarksModal(classItem, subject)"
              >
                <div class="subject-header">
                  <h4>{{ subject.subject_name }}</h4>
                  <div class="progress-indicator" :class="getProgressClass(subject)">
                    {{ getProgressPercentage(subject) }}%
                  </div>
                </div>
                <div class="subject-stats">
                  <span class="completed">{{ subject.marks_entered || 0 }} completed</span>
                  <span class="pending">{{ subject.pending_marks || 0 }} pending</span>
                </div>
                <button class="enter-marks-btn">
                  Enter Marks
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Marks Entry Modal -->
      <MarksEntryModal
        v-if="showMarksModal"
        :show="showMarksModal"
        :selectedClass="selectedClass"
        :selectedSubject="selectedSubject"
        :students="classStudents"
        @close="closeMarksModal"
        @save="saveMarks"
      />
    </div>
  </TeacherLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useToast } from '../composables/useToast'
import apiServices from '../services/apiServices'
import MarksEntryModal from '../components/teacher/MarksEntryModal.vue'
import TeacherLayout from '../components/teacher/TeacherLayout.vue'

const toast = useToast()

// Reactive data
const teacherName = ref('John Doe') // This would come from auth context
const currentSession = ref('2025/2026')
const currentTerm = ref('First Term')
const assignedClasses = ref([])
const classStudents = ref([])
const showMarksModal = ref(false)
const selectedClass = ref(null)
const selectedSubject = ref(null)
const loading = ref(false)

// Computed properties
const totalSubjects = computed(() => {
  return assignedClasses.value.reduce((total, classItem) => {
    return total + classItem.subjects.length
  }, 0)
})

const totalStudents = computed(() => {
  return assignedClasses.value.reduce((total, classItem) => {
    return total + classItem.student_count
  }, 0)
})

const pendingMarks = computed(() => {
  return assignedClasses.value.reduce((total, classItem) => {
    return total + classItem.subjects.reduce((subTotal, subject) => {
      return subTotal + (subject.pending_marks || 0)
    }, 0)
  }, 0)
})

// Methods
const loadTeacherData = async () => {
  loading.value = true
  try {
    // This would call an API to get teacher's assigned classes and subjects
    // For now, using mock data
    assignedClasses.value = [
      {
        id: 1,
        class_name: 'JSS 1A',
        student_count: 35,
        subjects: [
          {
            id: 1,
            subject_name: 'Mathematics',
            pending_marks: 12,
            total_students: 35,
            marks_entered: 23
          },
          {
            id: 2,
            subject_name: 'English Language',
            pending_marks: 5,
            total_students: 35,
            marks_entered: 30
          }
        ]
      },
      {
        id: 2,
        class_name: 'JSS 2B',
        student_count: 32,
        subjects: [
          {
            id: 3,
            subject_name: 'Mathematics',
            pending_marks: 8,
            total_students: 32,
            marks_entered: 24
          }
        ]
      }
    ]
  } catch (error) {
    toast.error('Error', 'Failed to load teacher data')
    console.error('Error loading teacher data:', error)
  } finally {
    loading.value = false
  }
}

const openMarksModal = async (classItem, subject) => {
  selectedClass.value = classItem
  selectedSubject.value = subject
  
  try {
    // Load students for this class
    const response = await apiServices.getStudentsByClassId(classItem.id)
    classStudents.value = response.data.data.students || []
    showMarksModal.value = true
  } catch (error) {
    toast.error('Error', 'Failed to load class students')
    console.error('Error loading students:', error)
  }
}

const closeMarksModal = () => {
  showMarksModal.value = false
  selectedClass.value = null
  selectedSubject.value = null
  classStudents.value = []
}

const saveMarks = async (marksData) => {
  try {
    // This would call API to save marks
    // await apiServices.saveStudentMarks(marksData)
    
    toast.success('Success', 'Marks saved successfully')
    closeMarksModal()
    
    // Refresh teacher data to update pending marks count
    await loadTeacherData()
  } catch (error) {
    toast.error('Error', 'Failed to save marks')
    console.error('Error saving marks:', error)
  }
}

const getProgressClass = (subject) => {
  const percentage = getProgressPercentage(subject)
  if (percentage === 100) return 'complete'
  if (percentage >= 70) return 'high'
  if (percentage >= 40) return 'medium'
  return 'low'
}

const getProgressPercentage = (subject) => {
  if (!subject.total_students) return 0
  return Math.round((subject.marks_entered / subject.total_students) * 100)
}

// Lifecycle
onMounted(() => {
  loadTeacherData()
})
</script>

<style scoped>
.teacher-dashboard {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  background: #fafbfc;
  min-height: calc(100vh - 70px);
}

.welcome-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3rem;
  padding: 2rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.welcome-content h1 {
  font-size: 2rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 0.5rem 0;
}

.welcome-content p {
  color: #666;
  margin: 0;
  font-size: 1rem;
}

.quick-stats {
  display: flex;
  gap: 2rem;
}

.stat-item {
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 2rem;
  font-weight: 700;
  color: #2563eb;
  line-height: 1;
}

.stat-label {
  font-size: 0.875rem;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.classes-container {
  margin-bottom: 2rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-header h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
}

.section-subtitle {
  color: #666;
  font-size: 0.875rem;
}

.classes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 1.5rem;
}

.class-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  border: 1px solid #e5e7eb;
  transition: all 0.2s ease;
}

.class-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-1px);
}

.class-info {
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #f3f4f6;
}

.class-info h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 0.25rem 0;
}

.class-info p {
  color: #666;
  margin: 0;
  font-size: 0.875rem;
}

.subjects-grid {
  display: grid;
  gap: 1rem;
}

.subject-card {
  padding: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: #fafbfc;
}

.subject-card:hover {
  border-color: #2563eb;
  background: white;
  transform: translateY(-1px);
}

.subject-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.subject-header h4 {
  font-size: 1rem;
  font-weight: 500;
  color: #1a1a1a;
  margin: 0;
}

.progress-indicator {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.progress-indicator.complete {
  background: #dcfce7;
  color: #166534;
}

.progress-indicator.high {
  background: #dbeafe;
  color: #1d4ed8;
}

.progress-indicator.medium {
  background: #fef3c7;
  color: #d97706;
}

.progress-indicator.low {
  background: #fee2e2;
  color: #dc2626;
}

.subject-stats {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  font-size: 0.875rem;
}

.completed {
  color: #059669;
}

.pending {
  color: #dc2626;
}

.enter-marks-btn {
  width: 100%;
  padding: 0.75rem;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.enter-marks-btn:hover {
  background: #1d4ed8;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .teacher-dashboard {
    padding: 1rem;
  }

  .welcome-section {
    flex-direction: column;
    text-align: center;
    gap: 1.5rem;
  }

  .quick-stats {
    gap: 1.5rem;
  }

  .classes-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .welcome-content h1 {
    font-size: 1.5rem;
  }

  .quick-stats {
    gap: 1rem;
  }

  .stat-number {
    font-size: 1.5rem;
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .class-card {
    padding: 1rem;
  }
}
</style>