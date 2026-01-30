<template>
  <div class="page">
    <div class="page-header mt-4">
      <div>
        <h1>Students Management</h1>
        <p>Current session students - {{ currentSession }}</p>
      </div>
      <div class="header-actions">
        <button class="btn-secondary" @click="router.push('/students/search')">
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
          Advanced Search
        </button>
        <button class="add-btn" @click="openModal">
          <svg
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          Add New Student
        </button>
      </div>
    </div>

    <!-- Quick Filters -->
    <div class="quick-filters">
      <div class="filter-item">
        <label>Class:</label>
        <select
          v-model="quickFilters.class"
          @change="loadStudents(1)"
          class="quick-filter-select"
        >
          <option value="">All Classes</option>
          <option
            v-for="(sClass, index) in allRowClasses"
            :key="index"
            :value="sClass.id"
          >
            {{ sClass.class_name }}
          </option>
        </select>
      </div>
      <div class="filter-item">
        <label>Gender:</label>
        <select
          v-model="quickFilters.gender"
          @change="loadStudents(1)"
          class="quick-filter-select"
        >
          <option value="">All</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
      </div>
      <button
        v-if="hasQuickFilters"
        class="btn-clear-filters"
        @click="clearQuickFilters"
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
        Clear Filters
      </button>
    </div>

    <div class="data-table-container">
      <div class="table-header">
        <h2 class="table-title">All Students</h2>
        <div class="search-container">
          <input
            type="text"
            class="search-box"
            placeholder="Search students..."
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
        </div>
      </div>
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>SN</th>
              <th>Name</th>
              <th class="d-none d-md-table-cell">Admission No.</th>
              <th class="d-none d-lg-table-cell">Class</th>
              <th class="d-none d-xl-table-cell">Gender</th>
              <th class="d-none d-xl-table-cell">Parent</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <no-results-row v-if="loading" :loading="loading" :colspan="8" />
            <no-results-row v-else-if="allStudents.length === 0" :colspan="8" />
            <tr v-for="(student, index) in allStudents" :key="student.id">
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
                {{ student.Class?.class_name }}
              </td>
              <td class="d-none d-xl-table-cell text-capitalize">
                {{ student.gender }}
              </td>
              <td class="d-none d-xl-table-cell">
                {{ student.Parent?.full_name }}
              </td>
              <td>
                <span
                  :class="['status-badge', `status-${student.student_status}`]"
                >
                  {{ student.student_status }}
                </span>
              </td>
              <td>
                <button class="action-btn edit" @click="editStudent(student)">
                  Edit
                </button>
                <button
                  class="action-btn delete"
                  @click="deleteStudentConfirm(student)"
                >
                  Delete
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
  </div>
  <ConfirmDeleteModal
    :show="showDeleteModal"
    @confirm="deleteStudent"
    @cancel="showDeleteModal = false"
  />
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import apiServices from "../../services/apiServices";
import Pagination from "../../components/public/Pagination.vue";
import ConfirmDeleteModal from "../../components/public/ConfirmDeleteModal.vue";
import { useToast } from "../../composables/useToast";

const router = useRouter();
const toast = useToast();
const allRowClasses = ref([]);
const loading = ref(false);
const hasSearched = ref(false);
const currentSession = ref("2025/2026");
const isLoadingRowClasses = ref(false);
const showDeleteModal = ref(false);
const selectedStudent = ref({});
const pagination = ref({
  currentPage: 1,
  totalPages: 0,
  totalCount: 0,
  limit: 25,
  hasNextPage: false,
  hasPrevPage: false,
});
const allStudents = ref([]);
const quickFilters = ref({
  class: "",
  gender: "",
});

const searchTerm = ref("");

// Note: Filtering is now done on the backend via getActivSessionStudents
// The filteredStudents computed property has been removed

const hasQuickFilters = computed(() => {
  return quickFilters.value.class !== "" || quickFilters.value.gender !== "";
});

const clearQuickFilters = () => {
  quickFilters.value.class = "";
  quickFilters.value.gender = "";
  // Reload students without filters
  loadStudents(1);
};

const openModal = () => {
  router.push("/students/register");
};

const editStudent = (student) => {
  router.push({
    path: `/students/update/${student.id}`,
    query: { from: "students" },
  });
};

const deleteStudentConfirm = (student) => {
  selectedStudent.value = student;
  showDeleteModal.value = true;
};

const deleteStudent = () => {
  apiServices
    .deleteStudent(selectedStudent.value.id)
    .then((response) => {
      if (response.status === 200) {
        toast.success(
          "Student Deleted Successfully",
          `${selectedStudent.value.full_name} has been deleted successfully.`
        );
        loadStudents(pagination.value.currentPage);
      } else {
        toast.error("Failed to Delete Student", `Failed to delete the student`);
      }
    })
    .catch((err) => {
      toast.error(
        "Failed to Delete Student",
        err.response?.data?.message ||
          `An error occurred while deleting the student`
      );
    })
    .finally(() => {
      showDeleteModal.value = false;
    });
};

const clearSearch = () => {
  searchTerm.value = "";
  hasSearched.value = false;
  loadStudents(1);
};

const loadStudents = (page = 1) => {
  loading.value = true;

  // Build query parameters from filters
  const params = {
    page,
    limit: pagination.value.limit,
  };

  // Add filters if they exist
  if (quickFilters.value.class) {
    params.current_class_id = quickFilters.value.class;
  }
  if (quickFilters.value.gender) {
    params.gender = quickFilters.value.gender;
  }

  apiServices
    .getActivSessionStudents(params)
    .then((response) => handleStudentResponse(response))
    .catch((error) => console.log(error))
    .finally(() => (loading.value = false));
};

const searchStudents = (search = "") => {
  loading.value = true;
  hasSearched.value = true;

  // Build query parameters with search term and filters
  const params = {
    page: 1,
    limit: pagination.value.limit,
  };

  // Add search term if it exists (searches both full_name and admission_number)
  if (search) {
    params.search = search.trim();
  }

  // Add filters if they exist
  if (quickFilters.value.class) {
    params.current_class_id = quickFilters.value.class;
  }
  if (quickFilters.value.gender) {
    params.gender = quickFilters.value.gender;
  }

  apiServices
    .getActivSessionStudents(params)
    .then((response) => handleStudentResponse(response))
    .finally(() => (loading.value = false));
};

const handleStudentResponse = (response) => {
  allStudents.value = response.data.data?.students || [];

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

const getSerialNumber = (index) => {
  const currentPage = Number(pagination.value.currentPage) || 1;
  const limit = Number(pagination.value.limit) || 25;
  return (currentPage - 1) * limit + index + 1;
};

const handlePageChange = (page) => {
  loadStudents(page);
  window.scrollTo({ top: 0, behavior: "smooth" });
};

onMounted(() => {
  // Load students data
  loadStudents();
  getAllRowClases();
});
</script>

<style scoped>
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
