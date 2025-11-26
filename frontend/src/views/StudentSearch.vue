<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1>Student Search</h1>
        <p>Search and filter students across all sessions</p>
      </div>
      <button class="add-btn" @click="$router.push('/students')">
        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Current Students
      </button>
    </div>

    <!-- Advanced Search Filters -->
    <div class="search-filters-card">
      <h3 class="filter-title">
        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
        Advanced Filters
      </h3>

      <div class="filters-grid">
        <!-- Search by Name/Reg No -->
        <div class="filter-group">
          <label class="filter-label">Search Student</label>
          <div class="search-input-wrapper">
            <svg class="search-icon" width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              v-model="filters.search"
              class="filter-input search-input"
              placeholder="Search by name or admission number..."
              @input="handleSearch"
            />
            <button 
              v-if="filters.search" 
              class="clear-btn"
              @click="clearSearch"
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Session Filter -->
        <div class="filter-group">
          <label class="filter-label">Session</label>
          <select v-model="filters.session" class="filter-select" @change="applyFilters">
            <option value="">All Sessions</option>
            <option v-for="session in sessions" :key="session.id" :value="session.id">
              {{ session.session_name }}
            </option>
          </select>
        </div>

        <!-- Class Filter -->
        <div class="filter-group">
          <label class="filter-label">Class</label>
          <select v-model="filters.class" class="filter-select" @change="applyFilters">
            <option value="">All Classes</option>
            <option v-for="cls in classes" :key="cls.id" :value="cls.id">
              {{ cls.class_name }}
            </option>
          </select>
        </div>

        <!-- Status Filter -->
        <div class="filter-group">
          <label class="filter-label">Status</label>
          <select v-model="filters.status" class="filter-select" @change="applyFilters">
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="graduated">Graduated</option>
            <option value="suspended">Suspended</option>
            <option value="transferred">Transferred</option>
          </select>
        </div>

        <!-- Gender Filter -->
        <div class="filter-group">
          <label class="filter-label">Gender</label>
          <select v-model="filters.gender" class="filter-select" @change="applyFilters">
            <option value="">All Genders</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        <!-- Action Buttons -->
        <div class="filter-actions">
          <button class="btn-filter" @click="applyFilters">
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Apply Filters
          </button>
          <button class="btn-reset" @click="resetFilters">
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Reset
          </button>
        </div>
      </div>

      <!-- Active Filters Display -->
      <div v-if="hasActiveFilters" class="active-filters">
        <span class="active-filter-label">Active Filters:</span>
        <span v-if="filters.search" class="filter-tag">
          Search: "{{ filters.search }}"
          <button @click="filters.search = ''; applyFilters()">×</button>
        </span>
        <span v-if="filters.session" class="filter-tag">
          Session: {{ getSessionName(filters.session) }}
          <button @click="filters.session = ''; applyFilters()">×</button>
        </span>
        <span v-if="filters.class" class="filter-tag">
          Class: {{ getClassName(filters.class) }}
          <button @click="filters.class = ''; applyFilters()">×</button>
        </span>
        <span v-if="filters.status" class="filter-tag">
          Status: {{ filters.status }}
          <button @click="filters.status = ''; applyFilters()">×</button>
        </span>
        <span v-if="filters.gender" class="filter-tag">
          Gender: {{ filters.gender }}
          <button @click="filters.gender = ''; applyFilters()">×</button>
        </span>
      </div>
    </div>

    <!-- Results Summary -->
    <div class="results-summary">
      <div class="summary-item">
        <span class="summary-label">Total Results:</span>
        <span class="summary-value">{{ filteredStudents.length }}</span>
      </div>
      <div class="summary-item">
        <span class="summary-label">Showing:</span>
        <span class="summary-value">
          {{ filteredStudents.length > 0 ? 1 : 0 }} - {{ filteredStudents.length }}
        </span>
      </div>
    </div>

    <!-- Students Table -->
    <div class="data-table-container">
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>SN</th>
              <th>Name</th>
              <th class="d-none d-md-table-cell">Admission No.</th>
              <th class="d-none d-lg-table-cell">Class</th>
              <th class="d-none d-xl-table-cell">Session</th>
              <th class="d-none d-xl-table-cell">Gender</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td colspan="8" class="text-center">
                <div class="loading-spinner">
                  <div class="spinner-large"></div>
                  <p>Loading students...</p>
                </div>
              </td>
            </tr>
            <tr v-else-if="filteredStudents.length === 0">
              <td colspan="8" class="text-center">
                <div class="no-results">
                  <svg width="64" height="64" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3>No students found</h3>
                  <p>Try adjusting your filters or search criteria</p>
                </div>
              </td>
            </tr>
            <tr v-else v-for="(student, index) in filteredStudents" :key="student.id">
              <td>{{ index + 1 }}</td>
              <td>
                <div class="student-info">
                  <strong>{{ student.full_name }}</strong>
                  <div class="d-md-none">
                    <small class="text-muted">{{ student.admission_number }}</small>
                  </div>
                </div>
              </td>
              <td class="d-none d-md-table-cell">{{ student.admission_number }}</td>
              <td class="d-none d-lg-table-cell">{{ student.school_class.class_name }}</td>
              <td class="d-none d-xl-table-cell">{{ student.session.session_name }}</td>
              <td class="d-none d-xl-table-cell">
                <span class="capitalize">{{ student.gender }}</span>
              </td>
              <td>
                <span :class="['status-badge', getStatusClass(student.status)]">
                  {{ student.status }}
                </span>
              </td>
              <td>
                <button class="action-btn info" @click="viewStudent(student)">
                  View
                </button>
                <button class="action-btn edit" @click="editStudent(student)">
                  Edit
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const loading = ref(false);

// Mock data - Replace with API calls
const allStudents = ref([
  {
    id: 1,
    full_name: "Aminu Bello",
    gender: "male",
    admission_number: "AGP/SS/2022/045",
    status: "active",
    school_class: { id: 3, class_name: "SS2" },
    session: { id: 5, session_name: "2025/2026" },
  },
  {
    id: 2,
    full_name: "Fatima Sani",
    gender: "female",
    admission_number: "AGP/JS/2021/023",
    status: "active",
    school_class: { id: 2, class_name: "JSS3" },
    session: { id: 4, session_name: "2024/2025" },
  },
  {
    id: 3,
    full_name: "Usman Lawal",
    gender: "male",
    admission_number: "AGP/SS/2020/055",
    status: "graduated",
    school_class: { id: 5, class_name: "Alumni" },
    session: { id: 3, session_name: "2023/2024" },
  },
  {
    id: 4,
    full_name: "Aisha Abdullahi",
    gender: "female",
    admission_number: "AGP/JS/2022/019",
    status: "active",
    school_class: { id: 1, class_name: "JSS2" },
    session: { id: 5, session_name: "2025/2026" },
  },
]);

const sessions = ref([
  { id: 3, session_name: "2023/2024" },
  { id: 4, session_name: "2024/2025" },
  { id: 5, session_name: "2025/2026" },
]);

const classes = ref([
  { id: 1, class_name: "JSS1" },
  { id: 2, class_name: "JSS2" },
  { id: 3, class_name: "JSS3" },
  { id: 4, class_name: "SS1" },
  { id: 5, class_name: "SS2" },
  { id: 6, class_name: "SS3" },
]);

const filters = ref({
  search: '',
  session: '',
  class: '',
  status: '',
  gender: '',
});

const filteredStudents = computed(() => {
  let result = allStudents.value;

  // Search filter
  if (filters.value.search) {
    const searchLower = filters.value.search.toLowerCase();
    result = result.filter(student =>
      student.full_name.toLowerCase().includes(searchLower) ||
      student.admission_number.toLowerCase().includes(searchLower)
    );
  }

  // Session filter
  if (filters.value.session) {
    result = result.filter(student => student.session.id == filters.value.session);
  }

  // Class filter
  if (filters.value.class) {
    result = result.filter(student => student.school_class.id == filters.value.class);
  }

  // Status filter
  if (filters.value.status) {
    result = result.filter(student => student.status === filters.value.status);
  }

  // Gender filter
  if (filters.value.gender) {
    result = result.filter(student => student.gender === filters.value.gender);
  }

  return result;
});

const hasActiveFilters = computed(() => {
  return filters.value.search || filters.value.session || filters.value.class || 
         filters.value.status || filters.value.gender;
});

const getStatusClass = (status) => {
  const statusMap = {
    'active': 'status-active',
    'graduated': 'status-info',
    'suspended': 'status-inactive',
    'transferred': 'status-warning'
  };
  return statusMap[status] || 'status-inactive';
};

const getSessionName = (sessionId) => {
  const session = sessions.value.find(s => s.id == sessionId);
  return session ? session.session_name : '';
};

const getClassName = (classId) => {
  const cls = classes.value.find(c => c.id == classId);
  return cls ? cls.class_name : '';
};

const handleSearch = () => {
  // Search is reactive, no need for additional action
};

const clearSearch = () => {
  filters.value.search = '';
};

const applyFilters = () => {
  // Filters are reactive, this is just for explicit button action
  console.log('Filters applied:', filters.value);
};

const resetFilters = () => {
  filters.value = {
    search: '',
    session: '',
    class: '',
    status: '',
    gender: '',
  };
};

const viewStudent = (student) => {
  console.log('View student:', student);
  // Implement view logic
};

const editStudent = (student) => {
  router.push(`/students/update/${student.id}`);
};

onMounted(() => {
  // Load data from API
  // loadStudents();
  // loadSessions();
  // loadClasses();
});
</script>

<style scoped>
.search-filters-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.filter-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 20px;
}

.filters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
  margin-bottom: 16px;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.filter-label {
  font-size: 13px;
  font-weight: 600;
  color: #475569;
}

.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 12px;
  color: #64748b;
  pointer-events: none;
}

.search-input {
  padding-left: 40px !important;
  padding-right: 40px !important;
}

.clear-btn {
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  color: #64748b;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s;
}

.clear-btn:hover {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.filter-input,
.filter-select {
  padding: 10px 14px;
  border: 2px solid rgba(102, 126, 234, 0.2);
  border-radius: 8px;
  font-size: 13px;
  background: rgba(255, 255, 255, 0.8);
  color: #1e293b;
  transition: all 0.3s ease;
}

.filter-input:focus,
.filter-select:focus {
  outline: none;
  border-color: #667eea;
  background: white;
  box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
}

.filter-actions {
  display: flex;
  gap: 10px;
  align-items: flex-end;
}

.btn-filter,
.btn-reset {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 18px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-filter {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.btn-filter:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.btn-reset {
  background: white;
  color: #64748b;
  border: 2px solid #e2e8f0;
}

.btn-reset:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
}

.active-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  padding-top: 16px;
  border-top: 1px solid rgba(102, 126, 234, 0.1);
}

.active-filter-label {
  font-size: 13px;
  font-weight: 600;
  color: #475569;
}

.filter-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 500;
}

.filter-tag button {
  background: none;
  border: none;
  color: #667eea;
  font-size: 18px;
  line-height: 1;
  cursor: pointer;
  padding: 0 2px;
  transition: color 0.2s;
}

.filter-tag button:hover {
  color: #ef4444;
}

.results-summary {
  display: flex;
  gap: 24px;
  padding: 16px 20px;
  background: rgba(102, 126, 234, 0.05);
  border-radius: 8px;
  margin-bottom: 20px;
}

.summary-item {
  display: flex;
  gap: 8px;
  align-items: center;
}

.summary-label {
  font-size: 13px;
  color: #64748b;
  font-weight: 500;
}

.summary-value {
  font-size: 15px;
  color: #1e293b;
  font-weight: 700;
}

.student-info strong {
  display: block;
  margin-bottom: 2px;
}

.capitalize {
  text-transform: capitalize;
}

.loading-spinner {
  padding: 60px 20px;
  text-align: center;
}

.loading-spinner p {
  margin-top: 16px;
  color: #64748b;
  font-size: 14px;
}

.no-results {
  padding: 60px 20px;
  text-align: center;
}

.no-results svg {
  color: #cbd5e1;
  margin-bottom: 16px;
}

.no-results h3 {
  font-size: 18px;
  color: #475569;
  margin-bottom: 8px;
}

.no-results p {
  color: #64748b;
  font-size: 14px;
}

@media (max-width: 768px) {
  .filters-grid {
    grid-template-columns: 1fr;
  }

  .filter-actions {
    grid-column: 1;
    flex-direction: column;
  }

  .btn-filter,
  .btn-reset {
    width: 100%;
    justify-content: center;
  }

  .results-summary {
    flex-direction: column;
    gap: 12px;
  }
}
</style>
