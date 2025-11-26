<template>
  <div class="page">
    <div class="page-header mb-4">
      <div class="row align-items-center">
        <div class="col-12 col-lg-6">
          <h1 class="h2 mb-1">Attendance Management</h1>
          <p class="text-muted mb-0">Track and manage student attendance</p>
        </div>
        <div class="col-12 col-lg-6 mt-3 mt-lg-0">
          <div class="d-flex flex-column flex-sm-row gap-2 justify-content-lg-end">
            <select v-model="selectedClass" class="form-select" style="max-width: 200px;">
              <option value="">All Classes</option>
              <option value="Grade 7">Grade 7</option>
              <option value="Grade 8">Grade 8</option>
              <option value="Grade 9">Grade 9</option>
            </select>
            <button class="btn btn-success" @click="markAllPresent">
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" class="me-2">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              Mark All Present
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="row g-4 mb-4">
      <div class="col-12 col-md-4">
        <div class="card h-100">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <span class="text-muted small fw-semibold">Today's Attendance</span>
              <div class="rounded-3 p-2" style="background: rgba(16, 185, 129, 0.1); color: #10b981;">
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <div class="h2 fw-bold mb-2">{{ attendanceStats.percentage }}%</div>
            <div class="small text-success">+3.2% from yesterday</div>
          </div>
        </div>
      </div>

      <div class="col-12 col-md-4">
        <div class="card h-100">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <span class="text-muted small fw-semibold">Present Students</span>
              <div class="rounded-3 p-2" style="background: rgba(59, 130, 246, 0.1); color: #3b82f6;">
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
            <div class="h2 fw-bold mb-2">{{ attendanceStats.present }}</div>
            <div class="small text-success">Out of {{ attendanceStats.total }} students</div>
          </div>
        </div>
      </div>

      <div class="col-12 col-md-4">
        <div class="card h-100">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <span class="text-muted small fw-semibold">Absent Students</span>
              <div class="rounded-3 p-2" style="background: rgba(239, 68, 68, 0.1); color: #ef4444;">
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </div>
            <div class="h2 fw-bold mb-2">{{ attendanceStats.absent }}</div>
            <div class="small text-danger">Need follow-up</div>
          </div>
        </div>
      </div>
    </div>

    <div class="data-table-container">
      <div class="table-header">
        <h2 class="table-title">Student Attendance - Today</h2>
        <input type="date" v-model="selectedDate" class="form-input" style="width: 150px;">
      </div>
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>SN</th>
              <th>Student Name</th>
              <th class="d-none d-md-table-cell">Class</th>
              <th class="d-none d-lg-table-cell">Admission No.</th>
              <th>Status</th>
              <th class="d-none d-sm-table-cell">Time In</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(student, index) in filteredStudents" :key="student.id">
              <td>{{ index + 1 }}</td>
              <td>
                {{ student.name }}
                <div class="d-md-none">
                  <small class="text-muted">{{ student.class }}</small>
                </div>
                <div class="d-lg-none">
                  <small class="text-muted d-block">{{ student.admissionNo }}</small>
                </div>
                <div class="d-sm-none">
                  <small class="text-muted d-block">{{ student.timeIn }}</small>
                </div>
              </td>
              <td class="d-none d-md-table-cell">{{ student.class }}</td>
              <td class="d-none d-lg-table-cell">{{ student.admissionNo }}</td>
              <td>
                <span class="status-badge" :class="getStatusClass(student.status)">
                  {{ student.status }}
                </span>
              </td>
              <td class="d-none d-sm-table-cell">{{ student.timeIn }}</td>
              <td>
                <div class="d-flex flex-column flex-sm-row gap-1">
                  <button 
                    class="action-btn present btn-sm" 
                    @click="markAttendance(student.id, 'Present')"
                  >
                    Present
                  </button>
                  <button 
                    class="action-btn absent btn-sm" 
                    @click="markAttendance(student.id, 'Absent')"
                  >
                    Absent
                  </button>
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
const selectedDate = ref(new Date().toISOString().split('T')[0])

const students = ref([
  {
    id: 1,
    name: 'Emma Wilson',
    class: 'Grade 9',
    admissionNo: 'GWA001',
    status: 'Present',
    timeIn: '08:15 AM'
  },
  {
    id: 2,
    name: 'John Smith',
    class: 'Grade 8',
    admissionNo: 'GWA002',
    status: 'Present',
    timeIn: '08:22 AM'
  },
  {
    id: 3,
    name: 'Michael Brown',
    class: 'Grade 7',
    admissionNo: 'GWA003',
    status: 'Absent',
    timeIn: '-'
  },
  {
    id: 4,
    name: 'Sarah Davis',
    class: 'Grade 9',
    admissionNo: 'GWA004',
    status: 'Late',
    timeIn: '09:45 AM'
  },
  {
    id: 5,
    name: 'James Wilson',
    class: 'Grade 8',
    admissionNo: 'GWA005',
    status: 'Present',
    timeIn: '08:10 AM'
  }
])

const filteredStudents = computed(() => {
  if (!selectedClass.value) return students.value
  return students.value.filter(student => student.class === selectedClass.value)
})

const attendanceStats = computed(() => {
  const total = students.value.length
  const present = students.value.filter(s => s.status === 'Present' || s.status === 'Late').length
  const absent = total - present
  const percentage = total > 0 ? ((present / total) * 100).toFixed(1) : 0
  
  return { total, present, absent, percentage }
})

const getStatusClass = (status) => {
  const statusMap = {
    'Present': 'status-present',
    'Absent': 'status-absent',
    'Late': 'status-late'
  }
  return statusMap[status] || 'status-absent'
}

const markAttendance = (studentId, status) => {
  const student = students.value.find(s => s.id === studentId)
  if (student) {
    student.status = status
    if (status === 'Present') {
      student.timeIn = new Date().toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      })
    } else {
      student.timeIn = '-'
    }
  }
}

const markAllPresent = () => {
  students.value.forEach(student => {
    student.status = 'Present'
    student.timeIn = new Date().toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    })
  })
}

onMounted(() => {
  // Load attendance data
})
</script>