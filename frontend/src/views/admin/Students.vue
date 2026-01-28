<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1>Student Management</h1>
        <p>Manage student records and information</p>
      </div>
      <div class="header-actions">
        <router-link to="/admin/student/register" class="btn btn-primary">
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
          </svg>
          Add Student
        </router-link>
      </div>
    </div>

    <!-- Filters -->
    <div class="filters-card">
      <div class="filters-grid">
        <div class="form-group">
          <label>Search Students</label>
          <input 
            v-model="filters.search" 
            type="text" 
            placeholder="Search by name or admission number"
            class="form-input"
          />
        </div>
        <div class="form-group">
          <label>Class</label>
          <select v-model="filters.class" class="form-select">
            <option value="">All Classes</option>
            <option v-for="cls in mockData.classes" :key="cls.id" :value="cls.id">
              {{ cls.name }}
            </option>
          </select>
        </div>
        <div class="form-group">
          <label>Status</label>
          <select v-model="filters.status" class="form-select">
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Students Table -->
    <div class="table-card">
      <div class="table-header">
        <h3>Students List</h3>
        <div class="table-actions">
          <button class="btn-export">Export</button>
        </div>
      </div>
      
      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Student Info</th>
              <th>Admission No.</th>
              <th>Class</th>
              <th>Parent Contact</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="student in filteredStudents" :key="student.id">
              <td>
                <div class="student-info">
                  <div class="student-avatar">
                    <span>{{ getInitials(student.name) }}</span>
                  </div>
                  <div class="student-details">
                    <h4>{{ student.name }}</h4>
                    <p>{{ student.email }}</p>
                  </div>
                </div>
              </td>
              <td>{{ student.admissionNumber }}</td>
              <td>{{ student.class }}</td>
              <td>{{ student.parentContact }}</td>
              <td>
                <span class="status-badge" :class="student.status">
                  {{ student.status }}
                </span>
              </td>
              <td>
                <div class="action-buttons">
                  <button class="btn-action view" @click="viewStudent(student)">
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                    </svg>
                  </button>
                  <button class="btn-action edit" @click="editStudent(student)">
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                    </svg>
                  </button>
                  <button class="btn-action delete" @click="deleteStudent(student)">
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="pagination">
        <button class="btn-page" :disabled="currentPage === 1" @click="currentPage--">
          Previous
        </button>
        <span class="page-info">
          Page {{ currentPage }} of {{ totalPages }}
        </span>
        <button class="btn-page" :disabled="currentPage === totalPages" @click="currentPage++">
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const filters = ref({
  search: '',
  class: '',
  status: ''
})

const currentPage = ref(1)
const itemsPerPage = 10

const mockData = ref({
  classes: [
    { id: 1, name: 'JSS 1A' },
    { id: 2, name: 'JSS 1B' },
    { id: 3, name: 'JSS 2A' },
    { id: 4, name: 'JSS 2B' },
    { id: 5, name: 'JSS 3A' },
    { id: 6, name: 'JSS 3B' }
  ],
  students: [
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@email.com',
      admissionNumber: 'AGP/SS/2022/001',
      class: 'JSS 2A',
      parentContact: '+234 801 234 5678',
      status: 'active'
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane.smith@email.com',
      admissionNumber: 'AGP/SS/2022/002',
      class: 'JSS 2A',
      parentContact: '+234 802 345 6789',
      status: 'active'
    },
    {
      id: 3,
      name: 'Mike Johnson',
      email: 'mike.johnson@email.com',
      admissionNumber: 'AGP/SS/2022/003',
      class: 'JSS 1B',
      parentContact: '+234 803 456 7890',
      status: 'active'
    },
    {
      id: 4,
      name: 'Sarah Wilson',
      email: 'sarah.wilson@email.com',
      admissionNumber: 'AGP/SS/2022/004',
      class: 'JSS 3A',
      parentContact: '+234 804 567 8901',
      status: 'inactive'
    },
    {
      id: 5,
      name: 'David Brown',
      email: 'david.brown@email.com',
      admissionNumber: 'AGP/SS/2022/005',
      class: 'JSS 2B',
      parentContact: '+234 805 678 9012',
      status: 'active'
    }
  ]
})

const filteredStudents = computed(() => {
  let filtered = mockData.value.students

  if (filters.value.search) {
    filtered = filtered.filter(student => 
      student.name.toLowerCase().includes(filters.value.search.toLowerCase()) ||
      student.admissionNumber.toLowerCase().includes(filters.value.search.toLowerCase())
    )
  }

  if (filters.value.class) {
    const className = mockData.value.classes.find(c => c.id == filters.value.class)?.name
    filtered = filtered.filter(student => student.class === className)
  }

  if (filters.value.status) {
    filtered = filtered.filter(student => student.status === filters.value.status)
  }

  return filtered
})

const totalPages = computed(() => {
  return Math.ceil(filteredStudents.value.length / itemsPerPage)
})

const getInitials = (name) => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase()
}

const viewStudent = (student) => {
  console.log('View student:', student)
  // Navigate to student details
}

const editStudent = (student) => {
  console.log('Edit student:', student)
  // Navigate to edit form
}

const deleteStudent = (student) => {
  if (confirm(`Are you sure you want to delete ${student.name}?`)) {
    console.log('Delete student:', student)
    // Handle deletion
  }
}
</script>

<style scoped>
.filters-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.filters-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 20px;
}

.table-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid #f1f5f9;
}

.table-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.btn-export {
  padding: 8px 16px;
  background: #f8fafc;
  color: #64748b;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
}

.table-container {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th {
  background: #f8fafc;
  padding: 16px;
  text-align: left;
  font-weight: 600;
  color: #475569;
  font-size: 14px;
  border-bottom: 1px solid #e2e8f0;
}

.data-table td {
  padding: 16px;
  border-bottom: 1px solid #f1f5f9;
}

.student-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.student-avatar {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 14px;
}

.student-details h4 {
  margin: 0 0 4px 0;
  color: #1e293b;
  font-size: 14px;
  font-weight: 600;
}

.student-details p {
  margin: 0;
  color: #64748b;
  font-size: 12px;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  text-transform: capitalize;
}

.status-badge.active {
  background: rgba(16, 185, 129, 0.1);
  color: #059669;
}

.status-badge.inactive {
  background: rgba(239, 68, 68, 0.1);
  color: #dc2626;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.btn-action {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-action.view {
  background: rgba(59, 130, 246, 0.1);
  color: #2563eb;
}

.btn-action.edit {
  background: rgba(245, 158, 11, 0.1);
  color: #d97706;
}

.btn-action.delete {
  background: rgba(239, 68, 68, 0.1);
  color: #dc2626;
}

.btn-action:hover {
  transform: scale(1.1);
}

.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-top: 1px solid #f1f5f9;
}

.btn-page {
  padding: 8px 16px;
  background: white;
  color: #667eea;
  border: 1px solid #667eea;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
}

.btn-page:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  color: #64748b;
  font-size: 14px;
}

@media (max-width: 768px) {
  .filters-grid {
    grid-template-columns: 1fr;
  }
  
  .table-header {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }
}
</style>