<template>
  <div class="page">
    <!-- Page Header -->
    <div class="page-header">
      <div>
        <h1>Student Management</h1>
        <p>Manage student status and class promotions</p>
      </div>
      <div class="header-actions">
        <button
          class="add-btn"
          @click="showBulkPromotionModal = true"
          :disabled="selectedStudents.length === 0"
        >
          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"/>
          </svg>
          Bulk Promote ({{ selectedStudents.length }})
        </button>
      </div>
    </div>

    <!-- Filters Section -->
    <div class="filters-section">
      <div class="filter-group">
        <label>Status Filter</label>
        <select v-model="selectedStatus" @change="loadStudents" class="form-select">
          <option value="">All Students</option>
          <option value="active">Active</option>
          <option value="graduated">Graduated</option>
          <option value="transfer">Transfer</option>
          <option value="expell">Expelled</option>
          <option value="leave">Leave</option>
        </select>
      </div>

      <div class="filter-group">
        <label>Class Filter</label>
        <select v-model="selectedClass" @change="loadStudents" class="form-select">
          <option value="">All Classes</option>
          <option v-for="cls in classes" :key="cls.id" :value="cls.id">
            {{ cls.class_name }}
          </option>
        </select>
      </div>

      <div class="filter-group">
        <label>Search</label>
        <input
          v-model="searchQuery"
          @input="debounceSearch"
          type="text"
          placeholder="Search by name or admission number..."
          class="form-input"
        />
      </div>
    </div>

    <!-- Students Table -->
    <div class="table-container">
      <div class="table-header">
        <div class="table-title">
          <h3>Students List</h3>
          <span class="record-count">{{ totalStudents }} students</span>
        </div>
        <div class="table-actions">
          <button
            @click="selectAll"
            class="select-all-btn"
            :class="{ active: allSelected }"
          >
            {{ allSelected ? 'Deselect All' : 'Select All' }}
          </button>
        </div>
      </div>

      <div class="table-wrapper">
        <table class="students-table">
          <thead>
            <tr>
              <th class="checkbox-col">
                <input
                  type="checkbox"
                  :checked="allSelected"
                  @change="selectAll"
                />
              </th>
              <th>Student Info</th>
              <th>Class</th>
              <th>Status</th>
              <th>Session</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="student in students" :key="student.id" class="student-row">
              <td class="checkbox-col">
                <input
                  type="checkbox"
                  :value="student.id"
                  v-model="selectedStudents"
                />
              </td>
              <td class="student-info">
                <div class="student-details">
                  <div class="student-name">{{ student.full_name }}</div>
                  <div class="student-admission">{{ student.admission_number }}</div>
                </div>
              </td>
              <td class="class-info">
                <span class="class-badge">{{ student.Class?.class_name || 'N/A' }}</span>
              </td>
              <td class="status-col">
                <select
                  :value="student.student_status"
                  @change="updateStudentStatus(student.id, $event.target.value)"
                  class="status-select"
                  :class="`status-${student.student_status}`"
                >
                  <option value="active">Active</option>
                  <option value="graduated">Graduated</option>
                  <option value="transfer">Transfer</option>
                  <option value="expell">Expelled</option>
                  <option value="leave">Leave</option>
                </select>
              </td>
              <td class="session-info">
                {{ student.Session?.session_name || 'N/A' }}
              </td>
              <td class="actions-col">
                <button
                  @click="openPromotionModal(student)"
                  class="action-btn promote-btn"
                  title="Promote Student"
                >
                  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"/>
                  </svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="pagination" v-if="totalPages > 1">
        <button
          @click="changePage(currentPage - 1)"
          :disabled="currentPage === 1"
          class="page-btn"
        >
          Previous
        </button>
        <span class="page-info">
          Page {{ currentPage }} of {{ totalPages }}
        </span>
        <button
          @click="changePage(currentPage + 1)"
          :disabled="currentPage === totalPages"
          class="page-btn"
        >
          Next
        </button>
      </div>
    </div>

    <!-- Single Student Promotion Modal -->
    <div v-if="showPromotionModal" class="modal-overlay" @click="closePromotionModal">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h3>Promote Student</h3>
          <button @click="closePromotionModal" class="close-btn">&times;</button>
        </div>
        <div class="modal-body">
          <div class="student-info-card">
            <h4>{{ selectedStudent?.full_name }}</h4>
            <p>Admission No: {{ selectedStudent?.admission_number }}</p>
            <p>Current Class: {{ selectedStudent?.Class?.class_name }}</p>
          </div>

          <div class="form-group">
            <label>New Class</label>
            <select v-model="promotionForm.new_class_id" class="form-select" required>
              <option value="">Select New Class</option>
              <option v-for="cls in classes" :key="cls.id" :value="cls.id">
                {{ cls.class_name }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label>New Session (Optional)</label>
            <select v-model="promotionForm.new_session_id" class="form-select">
              <option value="">Keep Current Session</option>
              <option v-for="session in sessions" :key="session.id" :value="session.id">
                {{ session.session_name }}
              </option>
            </select>
          </div>


        </div>
        <div class="modal-footer">
          <button @click="closePromotionModal" class="btn-secondary">Cancel</button>
          <button
            @click="promoteStudent"
            :disabled="!promotionForm.new_class_id || isPromoting"
            class="btn-primary"
          >
            {{ isPromoting ? 'Promoting...' : 'Promote Student' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Bulk Promotion Modal -->
    <div v-if="showBulkPromotionModal" class="modal-overlay" @click="closeBulkPromotionModal">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h3>Bulk Promote Students</h3>
          <button @click="closeBulkPromotionModal" class="close-btn">&times;</button>
        </div>
        <div class="modal-body">
          <div class="bulk-info">
            <p><strong>{{ selectedStudents.length }}</strong> students selected for promotion</p>
          </div>

          <div class="form-group">
            <label>New Class</label>
            <select v-model="bulkPromotionForm.new_class_id" class="form-select" required>
              <option value="">Select New Class</option>
              <option v-for="cls in classes" :key="cls.id" :value="cls.id">
                {{ cls.class_name }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label>New Session (Optional)</label>
            <select v-model="bulkPromotionForm.new_session_id" class="form-select">
              <option value="">Keep Current Session</option>
              <option v-for="session in sessions" :key="session.id" :value="session.id">
                {{ session.session_name }}
              </option>
            </select>
          </div>


        </div>
        <div class="modal-footer">
          <button @click="closeBulkPromotionModal" class="btn-secondary">Cancel</button>
          <button
            @click="bulkPromoteStudents"
            :disabled="!bulkPromotionForm.new_class_id || isBulkPromoting"
            class="btn-primary"
          >
            {{ isBulkPromoting ? 'Promoting...' : `Promote ${selectedStudents.length} Students` }}
          </button>
        </div>
      </div>
    </div>

    <!-- Loading Overlay -->
    <div v-if="loading" class="loading-overlay">
      <div class="loading-spinner"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import apiServices from '../../services/apiServices';
import { useToast } from '../../composables/useToast';

const toast = useToast();

// Reactive data
const students = ref([]);
const classes = ref([]);
const sessions = ref([]);
const selectedStudents = ref([]);
const selectedStudent = ref(null);
const loading = ref(false);
const isPromoting = ref(false);
const isBulkPromoting = ref(false);

// Filters
const selectedStatus = ref('');
const selectedClass = ref('');
const searchQuery = ref('');

// Pagination
const currentPage = ref(1);
const totalPages = ref(1);
const totalStudents = ref(0);
const itemsPerPage = 25;

// Modals
const showPromotionModal = ref(false);
const showBulkPromotionModal = ref(false);

// Forms
const promotionForm = ref({
  new_class_id: '',
  new_session_id: ''
});

const bulkPromotionForm = ref({
  new_class_id: '',
  new_session_id: ''
});

// Computed
const allSelected = computed(() => {
  return students.value.length > 0 && selectedStudents.value.length === students.value.length;
});

// Methods
const loadStudents = async () => {
  loading.value = true;
  try {
    const params = {
      page: currentPage.value,
      limit: itemsPerPage,
      search: searchQuery.value,
    };

    if (selectedClass.value) {
      params.current_class_id = selectedClass.value;
    }

    let response;
    if (selectedStatus.value) {
      response = await apiServices.getStudentsByStatus(selectedStatus.value, params);
    } else {
      response = await apiServices.getStudents(params);
    }

    students.value = response.data.data.students;
    totalStudents.value = response.data.data.pagination.totalCount;
    totalPages.value = response.data.data.pagination.totalPages;
    currentPage.value = response.data.data.pagination.currentPage;
  } catch (error) {
    console.error('Error loading students:', error);
    toast.error('Error', 'Failed to load students');
  } finally {
    loading.value = false;
  }
};

const loadClasses = async () => {
  try {
    const response = await apiServices.getAllRowClases();
    classes.value = response.data.data || [];
  } catch (error) {
    console.error('Error loading classes:', error);
    toast.error('Error', 'Failed to load classes');
  }
};

const loadSessions = async () => {
  try {
    const response = await apiServices.getAllRowSessions();
    sessions.value = response.data.data || [];
  } catch (error) {
    console.error('Error loading sessions:', error);
    toast.error('Error', 'Failed to load sessions');
  }
};

const updateStudentStatus = async (studentId, newStatus) => {
  try {
    await apiServices.updateStudentStatus(studentId, newStatus);
    toast.success('Success', `Student status updated to ${newStatus}`);
    
    // Update local student data
    const student = students.value.find(s => s.id === studentId);
    if (student) {
      student.student_status = newStatus;
    }
  } catch (error) {
    console.error('Error updating student status:', error);
    toast.error('Error', 'Failed to update student status');
    // Reload to revert changes
    loadStudents();
  }
};

const openPromotionModal = (student) => {
  selectedStudent.value = student;
  promotionForm.value = {
    new_class_id: '',
    new_session_id: ''
  };
  showPromotionModal.value = true;
};

const closePromotionModal = () => {
  showPromotionModal.value = false;
  selectedStudent.value = null;
};

const promoteStudent = async () => {
  if (!promotionForm.value.new_class_id) return;

  isPromoting.value = true;
  try {
    const data = {
      new_class_id: parseInt(promotionForm.value.new_class_id)
    };

    if (promotionForm.value.new_session_id) {
      data.new_session_id = parseInt(promotionForm.value.new_session_id);
    }

    await apiServices.promoteStudent(selectedStudent.value.id, data);
    toast.success('Success', 'Student promoted successfully');
    closePromotionModal();
    loadStudents();
  } catch (error) {
    console.error('Error promoting student:', error);
    toast.error('Error', 'Failed to promote student');
  } finally {
    isPromoting.value = false;
  }
};

const closeBulkPromotionModal = () => {
  showBulkPromotionModal.value = false;
  bulkPromotionForm.value = {
    new_class_id: '',
    new_session_id: ''
  };
};

const bulkPromoteStudents = async () => {
  if (!bulkPromotionForm.value.new_class_id || selectedStudents.value.length === 0) return;

  isBulkPromoting.value = true;
  try {
    const data = {
      student_ids: selectedStudents.value,
      new_class_id: parseInt(bulkPromotionForm.value.new_class_id)
    };

    if (bulkPromotionForm.value.new_session_id) {
      data.new_session_id = parseInt(bulkPromotionForm.value.new_session_id);
    }

    await apiServices.bulkPromoteStudents(data);
    toast.success('Success', `${selectedStudents.value.length} students promoted successfully`);
    closeBulkPromotionModal();
    selectedStudents.value = [];
    loadStudents();
  } catch (error) {
    console.error('Error bulk promoting students:', error);
    toast.error('Error', 'Failed to promote students');
  } finally {
    isBulkPromoting.value = false;
  }
};

const selectAll = () => {
  if (allSelected.value) {
    selectedStudents.value = [];
  } else {
    selectedStudents.value = students.value.map(s => s.id);
  }
};

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    loadStudents();
  }
};

// Debounced search
let searchTimeout;
const debounceSearch = () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    currentPage.value = 1;
    loadStudents();
  }, 500);
};

// Lifecycle
onMounted(() => {
  loadStudents();
  loadClasses();
  loadSessions();
});

// Watchers
watch([selectedStatus, selectedClass], () => {
  currentPage.value = 1;
  selectedStudents.value = [];
});
</script>

<style scoped>
/* Page Layout */
.page {
  padding: 20px;
  background: #f8fafc;
  min-height: 100vh;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.page-header h1 {
  margin: 0 0 4px 0;
  color: #1f2937;
  font-size: 24px;
}

.page-header p {
  margin: 0;
  color: #6b7280;
  font-size: 14px;
}

.header-actions {
  display: flex;
  gap: 8px;
}

.add-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.add-btn:hover:not(:disabled) {
  background: #2563eb;
}

.add-btn:disabled {
  background: #d1d5db;
  cursor: not-allowed;
  opacity: 0.6;
}

/* Filters */
.filters-section {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 200px;
}

.filter-group label {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

.form-select,
.form-input {
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  background: white;
  color: #374151;
}

.form-select:focus,
.form-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* Table */
.table-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e5e7eb;
}

.table-title h3 {
  margin: 0 0 4px 0;
  color: #1f2937;
  font-size: 18px;
}

.record-count {
  color: #6b7280;
  font-size: 14px;
}

.select-all-btn {
  padding: 8px 16px;
  border: 1px solid #d1d5db;
  background: white;
  color: #374151;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.select-all-btn:hover {
  background: #f9fafb;
}

.select-all-btn.active {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

.table-wrapper {
  overflow-x: auto;
}

.students-table {
  width: 100%;
  border-collapse: collapse;
}

.students-table th {
  background: #f9fafb;
  padding: 12px 16px;
  text-align: left;
  font-weight: 600;
  color: #374151;
  font-size: 14px;
  border-bottom: 1px solid #e5e7eb;
}

.students-table td {
  padding: 16px;
  border-bottom: 1px solid #f3f4f6;
  font-size: 14px;
}

.checkbox-col {
  width: 50px;
  text-align: center;
}

.student-info {
  min-width: 200px;
}

.student-name {
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 4px;
}

.student-admission {
  color: #6b7280;
  font-size: 13px;
}

.class-badge {
  display: inline-block;
  padding: 4px 12px;
  background: #dbeafe;
  color: #1e40af;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
}

.status-select {
  padding: 6px 10px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 13px;
  background: white;
}

.status-active { border-color: #10b981; color: #10b981; }
.status-graduated { border-color: #3b82f6; color: #3b82f6; }
.status-transfer { border-color: #f59e0b; color: #f59e0b; }
.status-expell { border-color: #ef4444; color: #ef4444; }
.status-leave { border-color: #6b7280; color: #6b7280; }

.actions-col {
  width: 80px;
}

.action-btn {
  padding: 8px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s;
}

.promote-btn {
  background: #10b981;
  color: white;
}

.promote-btn:hover {
  background: #059669;
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  padding: 20px;
  border-top: 1px solid #e5e7eb;
}

.page-btn {
  padding: 8px 16px;
  border: 1px solid #d1d5db;
  background: white;
  color: #374151;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.page-btn:hover:not(:disabled) {
  background: #f9fafb;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  color: #6b7280;
  font-size: 14px;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  border-radius: 8px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h3 {
  margin: 0;
  color: #1f2937;
  font-size: 18px;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  color: #6b7280;
  cursor: pointer;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  color: #374151;
}

.modal-body {
  padding: 20px;
}

.student-info-card {
  background: #f9fafb;
  padding: 16px;
  border-radius: 6px;
  margin-bottom: 20px;
}

.student-info-card h4 {
  margin: 0 0 8px 0;
  color: #1f2937;
}

.student-info-card p {
  margin: 4px 0;
  color: #6b7280;
  font-size: 14px;
}

.bulk-info {
  background: #dbeafe;
  padding: 16px;
  border-radius: 6px;
  margin-bottom: 20px;
  text-align: center;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  font-weight: 500;
  color: #374151;
  font-size: 14px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.checkbox-label input[type="checkbox"] {
  margin: 0;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 20px;
  border-top: 1px solid #e5e7eb;
}

.btn-secondary {
  padding: 10px 16px;
  border: 1px solid #d1d5db;
  background: white;
  color: #374151;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
}

.btn-secondary:hover {
  background: #f9fafb;
}

.btn-primary {
  padding: 10px 16px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
}

.btn-primary:hover:not(:disabled) {
  background: #2563eb;
}

.btn-primary:disabled {
  background: #d1d5db;
  cursor: not-allowed;
}

/* Loading */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e5e7eb;
  border-top: 4px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Responsive */
@media (max-width: 768px) {
  .filters-section {
    flex-direction: column;
  }

  .filter-group {
    min-width: auto;
  }

  .table-header {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }

  .page-header {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }
}
</style>