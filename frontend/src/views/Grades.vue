<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1>Grades Management</h1>
        <p>Manage student grades and academic performance</p>
      </div>
      <button class="add-btn" @click="openModal">
        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Add Grade Entry
      </button>
    </div>

    <div class="stats-grid" style="margin-bottom: 32px;">
      <div class="stat-card">
        <div class="stat-card-header">
          <span class="stat-card-title">Class Average</span>
          <div class="stat-card-icon" style="background: rgba(139, 92, 246, 0.1); color: #8b5cf6;">
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
        </div>
        <div class="stat-card-value">84.7%</div>
        <div class="stat-card-change positive">+4.2% this term</div>
      </div>

      <div class="stat-card">
        <div class="stat-card-header">
          <span class="stat-card-title">Top Performer</span>
          <div class="stat-card-icon" style="background: rgba(245, 158, 11, 0.1); color: #f59e0b;">
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </div>
        </div>
        <div class="stat-card-value">Emma Wilson</div>
        <div class="stat-card-change positive">97.8% average</div>
      </div>

      <div class="stat-card">
        <div class="stat-card-header">
          <span class="stat-card-title">Students at Risk</span>
          <div class="stat-card-icon" style="background: rgba(239, 68, 68, 0.1); color: #ef4444;">
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
        </div>
        <div class="stat-card-value">12</div>
        <div class="stat-card-change negative">Need intervention</div>
      </div>
    </div>

    <div class="data-table-container">
      <div class="table-header">
        <h2 class="table-title">Student Grades</h2>
        <div style="display: flex; gap: 12px;">
          <select v-model="selectedClass" class="form-select" style="width: 120px;">
            <option value="">All Classes</option>
            <option value="Grade 7">Grade 7</option>
            <option value="Grade 8">Grade 8</option>
            <option value="Grade 9">Grade 9</option>
          </select>
          <select v-model="selectedSubject" class="form-select" style="width: 120px;">
            <option value="">All Subjects</option>
            <option value="Mathematics">Mathematics</option>
            <option value="English">English</option>
            <option value="Science">Science</option>
          </select>
        </div>
      </div>
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>SN</th>
              <th>Student Name</th>
              <th class="d-none d-lg-table-cell">Class</th>
              <th class="d-none d-md-table-cell">Subject</th>
              <th class="d-none d-xl-table-cell">Test Score</th>
              <th class="d-none d-xl-table-cell">Assignment</th>
              <th>Final Grade</th>
              <th class="d-none d-sm-table-cell">Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(grade, index) in filteredGrades" :key="grade.id">
              <td>{{ index + 1 }}</td>
              <td>
                {{ grade.studentName }}
                <div class="d-lg-none">
                  <small class="text-muted">{{ grade.class }}</small>
                </div>
                <div class="d-md-none">
                  <small class="text-muted d-block">{{ grade.subject }}</small>
                </div>
                <div class="d-xl-none">
                  <small class="text-muted d-block">Test: {{ grade.testScore }}% • Assignment: {{ grade.assignment }}%</small>
                </div>
                <div class="d-sm-none">
                  <small class="text-muted d-block">{{ grade.status }}</small>
                </div>
              </td>
              <td class="d-none d-lg-table-cell">{{ grade.class }}</td>
              <td class="d-none d-md-table-cell">{{ grade.subject }}</td>
              <td class="d-none d-xl-table-cell">{{ grade.testScore }}%</td>
              <td class="d-none d-xl-table-cell">{{ grade.assignment }}%</td>
              <td>
                <span class="grade-badge" :class="getGradeClass(grade.finalGrade)">
                  {{ grade.finalGrade }}
                </span>
              </td>
              <td class="d-none d-sm-table-cell">
                <span class="status-badge" :class="getStatusClass(grade.status)">
                  {{ grade.status }}
                </span>
              </td>
              <td>
                <div class="d-flex flex-column flex-sm-row gap-1">
                  <button class="action-btn edit btn-sm" @click="editGrade(grade)">Edit</button>
                  <button class="action-btn delete btn-sm" @click="deleteGrade(grade.id)">Delete</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const selectedClass = ref('')
const selectedSubject = ref('')

const grades = ref([
  {
    id: 1,
    studentName: 'Emma Wilson',
    class: 'Grade 9',
    subject: 'Mathematics',
    testScore: 95,
    assignment: 98,
    finalGrade: 'A+',
    status: 'Excellent'
  },
  {
    id: 2,
    studentName: 'John Smith',
    class: 'Grade 8',
    subject: 'English',
    testScore: 87,
    assignment: 85,
    finalGrade: 'B+',
    status: 'Good'
  },
  {
    id: 3,
    studentName: 'Michael Brown',
    class: 'Grade 7',
    subject: 'Science',
    testScore: 72,
    assignment: 78,
    finalGrade: 'C+',
    status: 'Average'
  },
  {
    id: 4,
    studentName: 'Sarah Davis',
    class: 'Grade 9',
    subject: 'Mathematics',
    testScore: 91,
    assignment: 89,
    finalGrade: 'A',
    status: 'Excellent'
  },
  {
    id: 5,
    studentName: 'James Wilson',
    class: 'Grade 8',
    subject: 'Science',
    testScore: 58,
    assignment: 62,
    finalGrade: 'D',
    status: 'Needs Help'
  }
])

const filteredGrades = computed(() => {
  let filtered = grades.value
  
  if (selectedClass.value) {
    filtered = filtered.filter(grade => grade.class === selectedClass.value)
  }
  
  if (selectedSubject.value) {
    filtered = filtered.filter(grade => grade.subject === selectedSubject.value)
  }
  
  return filtered
})

const getGradeClass = (grade) => {
  const gradeMap = {
    'A+': 'grade-a',
    'A': 'grade-a',
    'B+': 'grade-b',
    'B': 'grade-b',
    'C+': 'grade-c',
    'C': 'grade-c',
    'D': 'grade-d',
    'F': 'grade-f'
  }
  return gradeMap[grade] || 'grade-f'
}

const getStatusClass = (status) => {
  const statusMap = {
    'Excellent': 'status-active',
    'Good': 'status-active',
    'Average': 'status-pending',
    'Needs Help': 'status-inactive'
  }
  return statusMap[status] || 'status-inactive'
}

const openModal = () => {
  // Modal logic here
}

const editGrade = (grade) => {
  // Edit logic here
}

const deleteGrade = (id) => {
  if (confirm('Are you sure you want to delete this grade?')) {
    grades.value = grades.value.filter(g => g.id !== id)
  }
}

onMounted(() => {
  // Load grades data
})
</script>