<template>
  <div class="page">
    <div class="page-header mt-4">
      <div>
        <h1>Student Management</h1>
        <p>Manage student status and class promotions</p>
      </div>
    </div>

    <!-- Class Selection -->
    <div class="class-selection-section">
      <div class="class-selection-header">
        <h3>Select Class to Manage Students</h3>
        <p>Choose a class to view and manage its students</p>
      </div>
      <div class="class-selection-filters">
        <div class="filter-item">
          <label>Class: <span class="required">*</span></label>
          <select
            v-model="quickFilters.class"
            @change="onClassChange"
            class="quick-filter-select class-select"
          >
            <option value="">Select a class...</option>
            <option v-for="cls in classes" :key="cls.id" :value="cls.id">
              {{ cls.class_name }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <!-- Bulk Actions -->
    <div v-if="selectedStudents.length > 0" class="bulk-actions-bar">
      <div class="bulk-info">
        <strong>{{ selectedStudents.length }}</strong> student(s) selected
        <span
          v-if="selectedStudents.length > students.length"
          class="cross-page-info"
        >
          ({{ currentPageSelectedCount }}/{{ students.length }} on this page)
        </span>
      </div>
      <div class="bulk-buttons">
        <button class="btn-clear" @click="clearAllSelections">
          <svg
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
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
          Clear All
        </button>
        <button class="btn-secondary" @click="showBulkStatusModal = true">
          <svg
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
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
          Change Status
        </button>
        <button class="add-btn" @click="showBulkPromoteModal = true">
          <svg
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
              d="M7 11l5-5m0 0l5 5m-5-5v12"
            />
          </svg>
          Bulk Promote
        </button>
      </div>
    </div>

    <!-- No Class Selected State -->
    <div v-if="!quickFilters.class" class="no-class-selected">
      <div class="no-class-content">
        <svg
          width="64"
          height="64"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          class="no-class-icon"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
        <h3>Select a Class</h3>
        <p>
          Please select a class from the dropdown above to view and manage its
          students.
        </p>
      </div>
    </div>

    <!-- Students Data Table (only show when class is selected) -->
    <div v-else class="data-table-container">
      <div class="table-header">
        <h2 class="table-title">
          {{ getSelectedClassName() }} Students
          <span class="class-badge">{{ students.length }} student(s)</span>
        </h2>
        <div
          v-if="selectedStudents.length > currentPageSelectedCount"
          class="selection-info"
        >
          <small class="text-muted">
            {{ selectedStudents.length - currentPageSelectedCount }} student(s)
            selected from other pages
          </small>
        </div>
        <div class="search-container">
          <input
            type="text"
            class="search-box"
            placeholder="Search by name or admission number..."
            v-model="searchTerm"
            @keyup.enter="searchStudents(searchTerm)"
          />
          <button class="search-btn" @click="searchStudents(searchTerm)">
            <svg
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
          <button
            v-if="hasSearched"
            class="btn-clear-filters"
            @click="clearSearch"
          >
            <svg
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            Clear
          </button>
        </div>
      </div>

      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  @change="toggleSelectAllCurrentPage"
                  :checked="isCurrentPageFullySelected"
                  :indeterminate="isCurrentPagePartiallySelected"
                  ref="selectAllCheckbox"
                />
              </th>
              <th>SN</th>
              <th>Name</th>
              <th class="d-none d-md-table-cell">Admission No.</th>
              <th class="d-none d-lg-table-cell">Class</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <no-results-row v-if="loading" :loading="loading" :colspan="7" />
            <no-results-row v-else-if="students.length === 0" :colspan="7" />
            <tr v-for="(student, index) in students" :key="student.id">
              <td>
                <input
                  type="checkbox"
                  :checked="selectedStudents.includes(student.id)"
                  @change="toggleStudentSelection(student)"
                />
              </td>
              <td>{{ getSerialNumber(index) }}</td>
              <td>
                <strong>{{ student.full_name }}</strong>
                <div class="d-md-none">
                  <small class="text-muted"
                    >{{ student.admission_number }} •
                    {{ student.Class?.class_name }}</small
                  >
                </div>
              </td>
              <td class="d-none d-md-table-cell">
                {{ student.admission_number }}
              </td>
              <td class="d-none d-lg-table-cell">
                {{ student.Class?.class_name || "N/A" }}
              </td>
              <td>
                <span
                  :class="[
                    'status-badge',
                    `status-${student.student_status || 'active'}`,
                  ]"
                >
                  {{ student.student_status || "active" }}
                </span>
              </td>
              <td>
                <button
                  class="action-btn edit"
                  @click="openStatusModal(student)"
                  :disabled="loading"
                >
                  Status
                </button>
                <button
                  class="action-btn promote"
                  @click="openPromoteModal(student)"
                  :disabled="loading"
                >
                  Promote
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="ps-5 pe-5">
        <Pagination
          v-if="pagination.totalPages > 0"
          :currentPage="pagination.currentPage"
          :totalPages="pagination.totalPages"
          :totalCount="pagination.totalCount"
          :limit="pagination.limit"
          :hasNextPage="pagination.hasNextPage"
          :hasPrevPage="pagination.hasPrevPage"
          @page-change="handlePageChange"
        />
      </div>
    </div>

    <!-- Status Change Modal -->
    <div v-if="showStatusModal" class="modal-overlay">
      <div class="modal-box">
        <h2 class="modal-title">Change Student Status</h2>
        <div class="modal-content-body">
          <p class="modal-text">
            <strong>Student:</strong> {{ selectedStudent?.full_name }}<br />
            <strong>Current Status:</strong>
            <span
              :class="[
                'status-badge',
                `status-${selectedStudent?.student_status || 'active'}`,
              ]"
            >
              {{ selectedStudent?.student_status || "active" }}
            </span>
          </p>
          <div class="form-group">
            <label for="newStatus">New Status</label>
            <select id="newStatus" v-model="newStatus" class="form-select">
              <option value="active">Active</option>
              <option value="graduated">Graduated</option>
              <option value="transferred">Transfer</option>
              <option value="suspended">Suspend</option>
              <option value="withdrawn">Withdrawn</option>
              <option value="leave">Leave</option>
            </select>
          </div>
        </div>
        <div class="modal-actions">
          <button class="btn-cancel" @click="closeStatusModal">Cancel</button>
          <button class="btn-delete" @click="updateStatus" :disabled="loading">
            <i v-if="loading" class="fa fa-spinner fa-spin me-1"></i>
            {{ loading ? "Updating..." : "Update Status" }}
          </button>
        </div>
      </div>
    </div>

    <!-- Promote Modal -->
    <div v-if="showPromoteModal" class="modal-overlay">
      <div class="modal-box promote-modal">
        <h2 class="modal-title">Promote Student</h2>
        <div class="modal-content-body">
          <p class="modal-text">
            <strong>Student:</strong> {{ selectedStudent?.full_name }}<br />
            <strong>Current Class:</strong>
            {{ selectedStudent?.Class?.class_name }}
          </p>
          <div class="form-group">
            <label for="newClass">New Class</label>
            <select id="newClass" v-model="newClassId" class="form-select">
              <option value="">Select New Class</option>
              <option v-for="cls in classes" :key="cls.id" :value="cls.id">
                {{ cls.class_name }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label for="newSession">New Session (Optional)</label>
            <select id="newSession" v-model="newSessionId" class="form-select">
              <option value="">Keep Current Session</option>
              <option
                v-for="session in sessions"
                :key="session.id"
                :value="session.id"
              >
                {{ session.session_name }}
              </option>
            </select>
          </div>
        </div>
        <div class="modal-actions">
          <button class="btn-cancel" @click="closePromoteModal">Cancel</button>
          <button
            class="btn-promote"
            @click="promoteStudent"
            :disabled="loading || !newClassId"
          >
            <i v-if="loading" class="fa fa-spinner fa-spin me-1"></i>
            {{ loading ? "Promoting..." : "Promote Student" }}
          </button>
        </div>
      </div>
    </div>

    <!-- Bulk Status Modal -->
    <div v-if="showBulkStatusModal" class="modal-overlay">
      <div class="modal-box">
        <h2 class="modal-title">Bulk Status Change</h2>
        <div class="modal-content-body">
          <p class="modal-text">
            Change status for
            <strong>{{ selectedStudents.length }}</strong> selected students
          </p>
          <div class="form-group">
            <label for="bulkStatus">New Status</label>
            <select id="bulkStatus" v-model="bulkStatus" class="form-select">
              <option value="active">Active</option>
              <option value="graduated">Graduated</option>
              <option value="transferred">Transfer</option>
              <option value="suspended">Suspend</option>
              <option value="withdrawn">Withdrawn</option>
              <option value="leave">Leave</option>
            </select>
          </div>
        </div>
        <div class="modal-actions">
          <button class="btn-cancel" @click="closeBulkStatusModal">
            Cancel
          </button>
          <button
            class="btn-delete"
            @click="bulkUpdateStatus"
            :disabled="loading"
          >
            <i v-if="loading" class="fa fa-spinner fa-spin me-1"></i>
            {{ loading ? "Updating..." : "Update Status" }}
          </button>
        </div>
      </div>
    </div>

    <!-- Bulk Promote Modal -->
    <div v-if="showBulkPromoteModal" class="modal-overlay">
      <div class="modal-box promote-modal">
        <h2 class="modal-title">Bulk Promotion</h2>
        <div class="modal-content-body">
          <p class="modal-text">
            Promote <strong>{{ selectedStudents.length }}</strong> selected
            students
          </p>
          <div class="form-group">
            <label for="bulkNewClass">New Class</label>
            <select
              id="bulkNewClass"
              v-model="bulkNewClassId"
              class="form-select"
            >
              <option value="">Select New Class</option>
              <option v-for="cls in classes" :key="cls.id" :value="cls.id">
                {{ cls.class_name }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label for="bulkNewSession">New Session (Optional)</label>
            <select
              id="bulkNewSession"
              v-model="bulkNewSessionId"
              class="form-select"
            >
              <option value="">Keep Current Session</option>
              <option
                v-for="session in sessions"
                :key="session.id"
                :value="session.id"
              >
                {{ session.session_name }}
              </option>
            </select>
          </div>
        </div>
        <div class="modal-actions">
          <button class="btn-cancel" @click="closeBulkPromoteModal">
            Cancel
          </button>
          <button
            class="btn-promote"
            @click="bulkPromoteStudents"
            :disabled="loading || !bulkNewClassId"
          >
            <i v-if="loading" class="fa fa-spinner fa-spin me-1"></i>
            {{ loading ? "Promoting..." : "Promote Students" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch, nextTick } from "vue";
import { useToast } from "../../composables/useToast";
import apiServices from "../../services/apiServices";
import Pagination from "../../components/public/Pagination.vue";
import NoResultsRow from "../../components/public/NoResultsRow.vue";

const toast = useToast();

// Data
const students = ref([]);
const classes = ref([]);
const sessions = ref([]);
const selectedStudents = ref([]); // Array of selected student IDs across all pages
const selectedStudentsData = ref(new Map()); // Map to store full student data for selected students
const loading = ref(false);
const hasSearched = ref(false);

// Search and filters
const searchTerm = ref("");
const quickFilters = ref({
  status: "",
  class: "",
});

// Pagination
const pagination = ref({
  currentPage: 1,
  totalPages: 0,
  totalCount: 0,
  limit: 25,
  hasNextPage: false,
  hasPrevPage: false,
});

// Modals
const showStatusModal = ref(false);
const showPromoteModal = ref(false);
const showBulkStatusModal = ref(false);
const showBulkPromoteModal = ref(false);

// Selected student and form data
const selectedStudent = ref(null);
const newStatus = ref("");
const newClassId = ref("");
const newSessionId = ref("");

// Bulk operations
const bulkStatus = ref("");
const bulkNewClassId = ref("");
const bulkNewSessionId = ref("");

// Refs
const selectAllCheckbox = ref(null);

// Computed
const hasQuickFilters = computed(() => {
  return quickFilters.value.status !== "";
});

const currentPageSelectedCount = computed(() => {
  return students.value.filter((student) =>
    selectedStudents.value.includes(student.id)
  ).length;
});

const isCurrentPageFullySelected = computed(() => {
  return (
    students.value.length > 0 &&
    currentPageSelectedCount.value === students.value.length
  );
});

const isCurrentPagePartiallySelected = computed(() => {
  return (
    currentPageSelectedCount.value > 0 &&
    currentPageSelectedCount.value < students.value.length
  );
});

// Methods
const loadStudents = (page = 1) => {
  // Don't load students if no class is selected
  if (!quickFilters.value.class) {
    students.value = [];
    return;
  }

  loading.value = true;

  const params = {
    page,
    limit: pagination.value.limit,
    current_class_id: quickFilters.value.class, // Always include class filter
    student_status: "active", // Only fetch active students
  };

  // Override with custom status filter if selected
  if (quickFilters.value.status) {
    params.student_status = quickFilters.value.status;
  }

  apiServices
    .searchStudentsByQuery(params)
    .then((response) => handleStudentResponse(response))
    .finally(() => (loading.value = false));
};

const searchStudents = (search = "") => {
  // Don't search if no class is selected
  if (!quickFilters.value.class) {
    return;
  }

  loading.value = true;
  hasSearched.value = true;

  const params = {
    page: 1,
    limit: pagination.value.limit,
    current_class_id: quickFilters.value.class, // Always include class filter
    student_status: "active", // Only fetch active students
  };

  // Add search by admission number if search term exists
  if (search) {
    params.admission_number = search;
  }

  // Override with custom status filter if selected
  if (quickFilters.value.status) {
    params.student_status = quickFilters.value.status;
  }

  apiServices
    .searchStudentsByQuery(params)
    .then((response) => handleStudentResponse(response))
    .finally(() => (loading.value = false));
};

const handleStudentResponse = (response) => {
  students.value = response.data.data?.students || [];

  const paginate = response.data.data.pagination;

  if (paginate) {
    pagination.value = {
      currentPage: paginate.currentPage,
      totalPages: paginate.totalPages,
      totalCount: paginate.totalCount,
      limit: paginate.limit,
      hasNextPage: paginate.hasNextPage,
      hasPrevPage: paginate.hasPrevPage,
    };
  }
};

const fetchClasses = () => {
  apiServices
    .getAllRowClases()
    .then((response) => {
      classes.value = response.data.data || [];
    })
    .catch((error) => {
      console.error("Error fetching classes:", error);
    });
};

const fetchSessions = () => {
  apiServices
    .getAllRowSessions()
    .then((response) => {
      sessions.value = response.data.data || [];
    })
    .catch((error) => {
      console.error("Error fetching sessions:", error);
    });
};

const onClassChange = () => {
  if (quickFilters.value.class) {
    clearAllSelections(); // Clear selections when class changes
    quickFilters.value.status = ""; // Reset status filter
    searchTerm.value = ""; // Reset search
    hasSearched.value = false;
    loadStudents(1);
  } else {
    // If no class selected, clear everything
    students.value = [];
    clearAllSelections();
  }
};

const clearFilters = () => {
  quickFilters.value.status = "";
  clearAllSelections(); // Clear selections when filters change
  loadStudents(1);
};

const getSelectedClassName = () => {
  const selectedClass = classes.value.find(
    (cls) => cls.id == quickFilters.value.class
  );
  return selectedClass ? selectedClass.class_name : "Class";
};

const clearSearch = () => {
  searchTerm.value = "";
  hasSearched.value = false;
  clearAllSelections(); // Clear selections when search changes
  loadStudents(1);
};

const toggleSelectAllCurrentPage = () => {
  if (isCurrentPageFullySelected.value) {
    // Deselect all students on current page
    students.value.forEach((student) => {
      const index = selectedStudents.value.indexOf(student.id);
      if (index > -1) {
        selectedStudents.value.splice(index, 1);
        selectedStudentsData.value.delete(student.id);
      }
    });
  } else {
    // Select all students on current page
    students.value.forEach((student) => {
      if (!selectedStudents.value.includes(student.id)) {
        selectedStudents.value.push(student.id);
        selectedStudentsData.value.set(student.id, student);
      }
    });
  }
};

const toggleStudentSelection = (student) => {
  const index = selectedStudents.value.indexOf(student.id);
  if (index > -1) {
    // Deselect student
    selectedStudents.value.splice(index, 1);
    selectedStudentsData.value.delete(student.id);
  } else {
    // Select student
    selectedStudents.value.push(student.id);
    selectedStudentsData.value.set(student.id, student);
  }
};

const getSerialNumber = (index) => {
  const currentPage = Number(pagination.value.currentPage) || 1;
  const limit = Number(pagination.value.limit) || 25;
  return (currentPage - 1) * limit + index + 1;
};

const handlePageChange = (page) => {
  loadStudents(page);
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const clearAllSelections = () => {
  selectedStudents.value = [];
  selectedStudentsData.value.clear();
};

const getSelectedStudentsInfo = () => {
  return Array.from(selectedStudentsData.value.values());
};

// Watch for changes in selection to update indeterminate state
watch([isCurrentPagePartiallySelected, isCurrentPageFullySelected], () => {
  nextTick(() => {
    if (selectAllCheckbox.value) {
      selectAllCheckbox.value.indeterminate =
        isCurrentPagePartiallySelected.value;
    }
  });
});

// Status Modal Methods
const openStatusModal = (student) => {
  selectedStudent.value = student;
  newStatus.value = student.student_status;
  showStatusModal.value = true;
};

const closeStatusModal = () => {
  showStatusModal.value = false;
  selectedStudent.value = null;
  newStatus.value = "";
};

const updateStatus = async () => {
  if (!newStatus.value) {
    toast.error("Please select a status", "Please select a status");
    return;
  }

  try {
    loading.value = true;
    await apiServices.updateStudentStatus(
      selectedStudent.value.id,
      newStatus.value
    );

    toast.success(
      "Status Updated",
      `Student status updated to ${newStatus.value}`
    );
    closeStatusModal();
    loadStudents(pagination.value.currentPage);
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Error updating student status";
    toast.error("Update Failed", errorMessage);
    console.error("Error:", error);
  } finally {
    loading.value = false;
  }
};

// Promote Modal Methods
const openPromoteModal = (student) => {
  selectedStudent.value = student;
  newClassId.value = "";
  newSessionId.value = "";
  showPromoteModal.value = true;
};

const closePromoteModal = () => {
  showPromoteModal.value = false;
  selectedStudent.value = null;
  newClassId.value = "";
  newSessionId.value = "";
};

const promoteStudent = async () => {
  if (!newClassId.value) {
    toast.error("Please select a new class", "Please select a new class");
    return;
  }

  try {
    loading.value = true;
    const data = {
      new_class_id: parseInt(newClassId.value),
    };

    if (newSessionId.value) {
      data.new_session_id = parseInt(newSessionId.value);
    }

    await apiServices.promoteStudent(selectedStudent.value.id, data);

    const newClassName = classes.value.find(
      (c) => c.id == newClassId.value
    )?.class_name;
    toast.success(
      "Student Promoted",
      `Student promoted to ${newClassName} successfully`
    );
    closePromoteModal();
    loadStudents(pagination.value.currentPage);
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Error promoting student";
    toast.error("Promotion Failed", errorMessage);
    console.error("Error:", error);
  } finally {
    loading.value = false;
  }
};

// Bulk Status Methods
const closeBulkStatusModal = () => {
  showBulkStatusModal.value = false;
  bulkStatus.value = "";
};

const bulkUpdateStatus = async () => {
  try {
    loading.value = true;

    // Update each student individually since we don't have a bulk status endpoint
    const promises = selectedStudents.value.map((studentId) =>
      apiServices.updateStudentStatus(studentId, bulkStatus.value)
    );

    await Promise.all(promises);

    toast.success(
      "Bulk Update Complete",
      `${selectedStudents.value.length} students status updated successfully`
    );
    closeBulkStatusModal();
    clearAllSelections();
    loadStudents(pagination.value.currentPage);
  } catch (error) {
    toast.error("Bulk Update Failed", "Error updating students status");
    console.error("Error:", error);
  } finally {
    loading.value = false;
  }
};

// Bulk Promote Methods
const closeBulkPromoteModal = () => {
  showBulkPromoteModal.value = false;
  bulkNewClassId.value = "";
  bulkNewSessionId.value = "";
};

const bulkPromoteStudents = async () => {
  try {
    loading.value = true;

    const data = {
      student_ids: selectedStudents.value,
      new_class_id: parseInt(bulkNewClassId.value),
    };

    if (bulkNewSessionId.value) {
      data.new_session_id = parseInt(bulkNewSessionId.value);
    }

    await apiServices.bulkPromoteStudents(data);

    const newClassName = classes.value.find(
      (c) => c.id == bulkNewClassId.value
    )?.class_name;
    toast.success(
      "Bulk Promotion Complete",
      `${selectedStudents.value.length} students promoted to ${newClassName} successfully`
    );
    closeBulkPromoteModal();
    clearAllSelections();
    loadStudents(pagination.value.currentPage);
  } catch (error) {
    toast.error("Bulk Promotion Failed", "Error promoting students");
    console.error("Error:", error);
  } finally {
    loading.value = false;
  }
};

// Lifecycle
onMounted(() => {
  // Don't load students by default - wait for class selection
  fetchClasses();
  fetchSessions();
});
</script>

<style scoped>
/* Class Selection Section */
.class-selection-section {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
  border: 1px solid rgba(102, 126, 234, 0.1);
}

.class-selection-header {
  text-align: center;
  margin-bottom: 2rem;
}

.class-selection-header h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.class-selection-header p {
  color: #64748b;
  font-size: 1rem;
}

.class-selection-filters {
  display: flex;
  align-items: end;
  gap: 1.5rem;
  justify-content: center;
  flex-wrap: wrap;
}

.class-select {
  min-width: 200px;
}

.required {
  color: #ef4444;
  font-weight: bold;
}

/* No Class Selected State */
.no-class-selected {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 12px;
  border: 1px solid rgba(102, 126, 234, 0.1);
}

.no-class-content {
  text-align: center;
  max-width: 400px;
  padding: 2rem;
}

.no-class-icon {
  color: #9ca3af;
  margin: 0 auto 1.5rem;
}

.no-class-content h3 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.75rem;
}

.no-class-content p {
  color: #6b7280;
  font-size: 1rem;
  line-height: 1.6;
}

/* Class Badge */
.class-badge {
  font-size: 0.875rem;
  font-weight: 500;
  color: #667eea;
  background: rgba(102, 126, 234, 0.1);
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  margin-left: 1rem;
}

/* Bulk Actions Bar */
.bulk-actions-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(102, 126, 234, 0.1);
  padding: 1rem 1.5rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  border: 1px solid rgba(102, 126, 234, 0.2);
}

.bulk-info {
  color: #1e293b;
  font-weight: 600;
}

.bulk-buttons {
  display: flex;
  gap: 0.75rem;
}

.cross-page-info {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: normal;
}

.btn-clear {
  background: #f3f4f6;
  color: #6b7280;
  border: 1px solid #d1d5db;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-clear:hover {
  background: #e5e7eb;
  border-color: #9ca3af;
}

.selection-info {
  font-size: 0.75rem;
  color: #6b7280;
  font-style: italic;
}

/* Status badges matching system design */
.status-active {
  background-color: #d1fae5;
  color: #065f46;
}

.status-graduated {
  background-color: #dbeafe;
  color: #1e40af;
}

.status-transfer {
  background-color: #e9d5ff;
  color: #6b21a8;
}

.status-expell {
  background-color: #fecaca;
  color: #991b1b;
}

.status-leave {
  background-color: #fef3c7;
  color: #92400e;
}

/* Action buttons */
.action-btn.promote {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  margin-left: 0.5rem;
}

.action-btn.promote:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

/* Modal styles matching system design */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1100;
  animation: fadeIn 0.25s ease-in-out;
}

.modal-box {
  background: #fff;
  padding: 2rem;
  border-radius: 12px;
  width: 420px;
  max-width: 90vw;
  text-align: left;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  animation: slideUp 0.3s ease-out;
}

.modal-box.promote-modal {
  width: 480px;
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 1rem;
  text-align: center;
}

.modal-content-body {
  margin-bottom: 1.5rem;
}

.modal-text {
  font-size: 0.95rem;
  color: #6b7280;
  margin-bottom: 1rem;
  line-height: 1.5;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
}

.form-select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.875rem;
  background-color: white;
  transition: border-color 0.2s;
}

.form-select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.checkbox-group {
  margin-top: 1rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  font-size: 0.875rem;
  color: #374151;
}

.checkbox-label input[type="checkbox"] {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  width: 0;
  height: 0;
}

.checkbox-label .checkmark {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(102, 126, 234, 0.2);
  border-radius: 4px;
  position: relative;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.8);
  flex-shrink: 0;
}

.checkbox-label:hover .checkmark {
  border-color: #667eea;
  background: white;
}

.checkbox-label input[type="checkbox"]:checked + .checkmark {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: #667eea;
}

.checkbox-label input[type="checkbox"]:checked + .checkmark::after {
  content: "";
  position: absolute;
  left: 5px;
  top: 1px;
  width: 5px;
  height: 9px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.modal-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.btn-cancel {
  background: #f3f4f6;
  color: #111827;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s;
}

.btn-cancel:hover {
  background: #e5e7eb;
}

.btn-delete {
  background: #ef4444;
  color: #fff;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.25s;
}

.btn-delete:hover:not(:disabled) {
  background: #dc2626;
}

.btn-promote {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s;
}

.btn-promote:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.btn-delete:disabled,
.btn-promote:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    transform: translateY(15px);
    opacity: 0.9;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* Mobile responsive */
@media (max-width: 768px) {
  .class-selection-section {
    padding: 1.5rem;
  }

  .class-selection-filters {
    flex-direction: column;
    align-items: stretch;
  }

  .class-select {
    min-width: auto;
    width: 100%;
  }

  .bulk-actions-bar {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .bulk-buttons {
    justify-content: center;
  }

  .modal-box {
    width: 95vw;
    padding: 1.5rem;
  }

  .modal-actions {
    flex-direction: column;
  }

  .btn-cancel,
  .btn-delete,
  .btn-promote {
    width: 100%;
  }

  .no-class-content {
    padding: 1.5rem;
  }

  .class-badge {
    display: block;
    margin: 0.5rem auto 0;
    width: fit-content;
  }
}
</style>