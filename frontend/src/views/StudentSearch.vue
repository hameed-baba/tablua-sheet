<template>
  <div class="page">
    <div class="page-header mt-4">
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
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
        Advanced Filters
      </h3>

      <div class="filters-grid">
        <!-- Search by Name/Reg No -->
        <div class="filter-group">
          <label class="filter-label">Search Student</label>
          <div class="search-input-wrapper">
            <svg class="search-icon" width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input type="text" v-model="filters.search" class="filter-input search-input"
              placeholder="Search by name or admission number..." />
            <button v-if="filters.search" class="clear-btn" @click="clearSearch">
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
            <option v-for="session in allRowSessions" :key="session.id" :value="session.id">
              {{ session.session_name }}
            </option>
          </select>
        </div>

        <!-- Class Filter -->
        <div class="filter-group">
          <label class="filter-label">Class</label>
          <select v-model="filters.class" class="filter-select" @change="applyFilters">
            <option value="">All Classes</option>
            <option v-for="cls in allRowClasses" :key="cls.id" :value="cls.id">
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
            <option value="transferred">Transferred</option>
            <option value="suspended">Suspended</option>
            <option value="withdrawn">Withdrawn</option>
            <option value="leave">Leave</option>
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
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Apply Filters
          </button>
          <button class="btn-reset" @click="resetFilters">
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
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
          <button @click="
            filters.search = '';
          applyFilters();
          ">
            ×
          </button>
        </span>
        <span v-if="filters.session" class="filter-tag">
          Session: {{ getSessionName(filters.session) }}
          <button @click="
            filters.session = '';
          applyFilters();
          ">
            ×
          </button>
        </span>
        <span v-if="filters.class" class="filter-tag">
          Class: {{ getClassName(filters.class) }}
          <button @click="
            filters.class = '';
          applyFilters();
          ">
            ×
          </button>
        </span>
        <span v-if="filters.status" class="filter-tag">
          Status: {{ filters.status }}
          <button @click="
            filters.status = '';
          applyFilters();
          ">
            ×
          </button>
        </span>
        <span v-if="filters.gender" class="filter-tag">
          Gender: {{ filters.gender }}
          <button @click="
            filters.gender = '';
          applyFilters();
          ">
            ×
          </button>
        </span>
      </div>
    </div>

    <!-- Results Summary -->
    <!-- <div class="results-summary">
      <div class="summary-item">
        <span class="summary-label">Total Results:</span>
        <span class="summary-value">{{ filteredStudents.length }}</span>
      </div>
      <div class="summary-item">
        <span class="summary-label">Showing:</span>
        <span class="summary-value">
          {{ filteredStudents.length > 0 ? 1 : 0 }} -
          {{ filteredStudents.length }}
        </span>
      </div>
    </div> -->

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
            <no-results-row v-if="loading" :loading="loading" :colspan="8" />
            <no-results-row v-else-if="allStudents.length === 0" :colspan="8" />

            <!-- <tr v-if="true">
              <td colspan="8" class="text-center">
                <div class="loading-spinner">
                  <div class="spinner-large"></div>
                  <p>Loading students...</p>
                </div>
              </td>
            </tr> -->
            <tr v-else-if="filteredStudents.length === 0">
              <td colspan="8" class="text-center">
                <div class="no-results">
                  <svg width="64" height="64" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3>No students found</h3>
                  <p>Try adjusting your filters or search criteria</p>
                </div>
              </td>
            </tr>
            <tr v-else v-for="(student, index) in filteredStudents" :key="student.id">
              <td>{{ getSerialNumber(index) }}</td>
              <td>
                <div class="student-info">
                  <strong>{{ student.full_name }}</strong>
                  <div class="d-md-none">
                    <small class="text-muted">{{
                      student.admission_number
                      }}</small>
                  </div>
                </div>
              </td>
              <td class="d-none d-md-table-cell">
                {{ student.admission_number }}
              </td>
              <td class="d-none d-lg-table-cell">
                {{ student.Class?.class_name }}
              </td>
              <td class="d-none d-xl-table-cell">
                {{ student.Session?.session_name }}
              </td>
              <td class="d-none d-xl-table-cell">
                <span class="capitalize">{{ student.gender }}</span>
              </td>
              <td>
                <span :class="['status-badge', `status-${student.student_status}`]">
                  {{ student.student_status }}
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
    <div class="ps-5 pe-5">
      <Pagination v-if="pagination.totalPages > 0" :currentPage="pagination.currentPage"
        :totalPages="pagination.totalPages" :totalCount="pagination.totalCount" :limit="pagination.limit"
        :hasNextPage="pagination.currentPage < pagination.totalPages" :hasPrevPage="pagination.currentPage > 1"
        @page-change="handlePageChange" />
    </div>
  </div>
  <!-- Student Quick View Modal -->
  <StudentQuickViewModal ref="quickView" @edit-student="onEditStudent" @manage-subjects="onManageSubjects" />
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import apiServices from "../services/apiServices";
import Pagination from "../components/public/Pagination.vue";

const router = useRouter();
const loading = ref(false);
const isLoadingRowSessions = ref(false);
const isLoadingRowClasses = ref(false);
const allRowSessions = ref([]);
const allRowClasses = ref([]);

// Mock data - Replace with API calls
const allStudents = ref([]);
// paging and meta (single pagination object)
const pagination = ref({
  currentPage: 1,
  totalPages: 0,
  totalCount: 0,
  limit: 25,
  hasNextPage: false,
  hasPrevPage: false,
});

const filters = ref({
  search: "",
  session: "",
  class: "",
  status: "",
  gender: "",
});

// When data comes from server we show server results directly
const filteredStudents = computed(() => allStudents.value || []);

const hasActiveFilters = computed(() => {
  return (
    filters.value.search ||
    filters.value.session ||
    filters.value.class ||
    filters.value.status ||
    filters.value.gender
  );
});

const clearSearch = () => {
  filters.value.search = "";
};

const applyFilters = () => {
  pagination.value.currentPage = 1;
  loadStudents();
};

const resetFilters = () => {
  filters.value = {
    search: "",
    session: "",
    class: "",
    status: "",
    gender: "",
  };
  pagination.value.currentPage = 1;
  loadStudents();
};

// Quick view modal (uses shared StudentQuickViewModal)
import StudentQuickViewModal from "./class/StudentQuickViewModal.vue";
const quickView = ref(null);

const viewStudent = (student) => {
  // open the reusable quick view modal and pass the student object
  if (quickView.value && typeof quickView.value.toggleModal === "function") {
    quickView.value.toggleModal(student);
    return;
  }
  // fallback: navigate to edit page if modal not available
  router.push({
    path: `/students/update/${student.id}`,
    query: { from: 'search' }
  });
};

const onEditStudent = (student) => {
  router.push({
    path: `/students/update/${student.id}`,
    query: { from: 'search' }
  });
};

const onManageSubjects = (student) => {
  // route to manage subjects page if exists; adjust path as needed
  router.push(`/students/${student.id}/subjects`);
};

const editStudent = (student) => {
  router.push({
    path: `/students/update/${student.id}`,
    query: { from: 'search' }
  });
};

const getAllRowClases = () => {
  isLoadingRowClasses.value = true;
  apiServices
    .getAllRowClases()
    .then((response) => {
      allRowClasses.value = response.data.data || [];
    })
    .catch((error) => {
      console.error("Error fetching classes:", error);
    })
    .finally(() => {
      isLoadingRowClasses.value = false;
    });
};

const getAllRowSessions = () => {
  isLoadingRowSessions.value = true;
  apiServices
    .getAllRowSessions()
    .then((response) => {
      allRowSessions.value = response.data.data || [];
    })
    .catch((error) => {
      console.error("Error fetching sessions:", error);
    })
    .finally(() => {
      isLoadingRowSessions.value = false;
    });
};

function getSessionName(id) {
  if (!id) return "";
  const s = allRowSessions.value.find((x) => String(x.id) === String(id));
  return s ? s.session_name : "";
}

function getClassName(id) {
  if (!id) return "";
  const c = allRowClasses.value.find((x) => String(x.id) === String(id));
  return c ? c.class_name : "";
}



// Load students from backend using apiServices.getStudents
function buildQueryParams() {
  const params = {};


  if (filters.value.search) params.admission_number = filters.value.search;
  if (filters.value.class) params.current_class_id = filters.value.class;
  if (filters.value.session) params.current_session_id = filters.value.session;
  if (filters.value.status) params.student_status = filters.value.status;
  if (filters.value.gender) params.gender = filters.value.gender;

  params.page = pagination.value.currentPage;
  params.limit = pagination.value.limit;

  return params;
}

function loadStudents(extraParams = {}) {
  loading.value = true;
  const params = Object.assign({}, buildQueryParams(), extraParams);

  return apiServices
    .getStudents(params)
    .then((response) => {
      const data = response.data && response.data.data;
      allStudents.value = (data && data.students) || [];
      if (data && data.pagination) {
        pagination.value = {
          currentPage: data.pagination.currentPage,
          totalPages: data.pagination.totalPages,
          totalCount: data.pagination.totalItems || allStudents.value.length,
          limit: data.pagination.limit || pagination.value.limit,
          hasNextPage: data.pagination.hasNextPage || false,
          hasPrevPage: data.pagination.hasPrevPage || false,
        };
      }
    })
    .catch((err) => {
      console.error("Error loading students:", err);
    })
    .finally(() => {
      loading.value = false;
    });
}




function handlePageChange(p) {
  const pageNum = parseInt(p, 10) || 1;
  pagination.value.currentPage = pageNum;
  loadStudents();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// Serial number helper that respects current page and limit
function getSerialNumber(index) {
  return (
    (pagination.value.currentPage - 1) * pagination.value.limit + index + 1
  );
}


onMounted(() => {
  getAllRowClases();
  getAllRowSessions();
  loadStudents();
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

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: capitalize;
  display: inline-block;
  white-space: nowrap;
}

/* Active - Green */
.status-active {
  background-color: #d1fae5;
  color: #065f46;
}

/* Graduated - Blue */
.status-graduated {
  background-color: #dbeafe;
  color: #1e40af;
}

/* Transferred - Purple */
.status-transferred {
  background-color: #e9d5ff;
  color: #6b21a8;
}

/* Suspended - Orange */
.status-suspended {
  background-color: #fed7aa;
  color: #9a3412;
}

/* Withdrawn - Red */
.status-withdrawn {
  background-color: #fecaca;
  color: #991b1b;
}

/* Leave - Yellow */
.status-leave {
  background-color: #fef3c7;
  color: #92400e;
}
</style>
