<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1>Classes Management</h1>
        <p>Manage school classes and sections</p>
      </div>
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
        Add New Class
      </button>
    </div>

    <!-- Filters Section -->
    <div class="filters-section">
      <div class="filter-group">
        <label class="filter-label">Section:</label>
        <select class="filter-select" v-model="filters.section">
          <option value="">All Sections</option>
          <option
            v-for="(section, index) in allSections"
            :key="index"
            :value="section.id"
          >
            {{ section.section_name }}
          </option>
        </select>
      </div>
    </div>

    <div class="data-table-container">
      <div class="table-header">
        <h2 class="table-title">All Classes</h2>
      </div>
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>SN</th>
              <th>Class</th>
              <th class="d-none d-md-table-cell">Teacher Name</th>
              <th class="d-none d-lg-table-cell">Section</th>
              <th class="d-none d-xl-table-cell">Grading System</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <no-results-row v-if="loading" :loading="loading" :colspan="6" />
            <no-results-row
              v-else-if="filteredClasses.length === 0"
              :colspan="6"
            />
            <tr
              v-else
              v-for="(teacher, index) in filteredClasses"
              :key="teacher.id"
            >
              <td>{{ getSerialNumber(index) }}</td>
              <td>
                <strong>{{ teacher.class_name }}</strong>
                <div class="d-md-none">
                  <small class="text-muted">{{
                    teacher.SchoolStaff?.full_name
                  }}</small>
                </div>
              </td>
              <td class="d-none d-md-table-cell">
                {{ teacher.SchoolStaff?.full_name }}
              </td>
              <td class="d-none d-lg-table-cell">
                <span
                  class="section-badge"
                  :class="getSectionClass(teacher.Section?.section_name)"
                >
                  {{ teacher.Section?.section_name }}
                </span>
              </td>
              <td class="d-none d-xl-table-cell">
                <span class="status-badge status-active">{{
                  teacher.GradeList?.grade_name
                }}</span>
              </td>
              <td>
                <button class="action-btn edit" @click="editClass(teacher.id)">
                  Edit
                </button>
                <button
                  class="action-btn delete"
                  @click="deleteClassConfirmation(teacher)"
                >
                  Delete
                </button>
                <button
                  class="action-btn info"
                  @click="viewClassStudents(teacher)"
                >
                  View
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
  <RegisterClass ref="classRef" @send-status="getStatus" />
  <UpdateClass
    ref="classUpdRef"
    @send-status="getStatus"
    :class-to-update="selectedClass"
  />
  <ConfirmDeleteModal
    :show="showDeleteModal"
    @confirm="deleteClass"
    @cancel="showDeleteModal = false"
  />
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import RegisterClass from "./class/RegisterClass.vue";
import UpdateClass from "./class/UpdateClass.vue";
import ConfirmDeleteModal from "../../components/public/ConfirmDeleteModal.vue";
import { useToast } from "../../composables/useToast";
import apiServices from "../../services/apiServices";
import Pagination from "../../components/public/Pagination.vue";

const router = useRouter();

const toast = useToast();
const classRef = ref(null);
const classUpdRef = ref(null);
const selectedClass = ref({});
const showDeleteModal = ref(false);
const loading = ref(false);
const allClasses = ref([]);
const allSections = ref([]);
const isLoadingSection = ref(false);

const pagination = ref({
  currentPage: 1,
  totalPages: 0,
  totalCount: 0,
  limit: 25,
  hasNextPage: false,
  hasPrevPage: false,
});

const filters = ref({
  section: "",
});

const openModal = () => {
  classRef.value.toggleModal();
};

const getStatus = (status) => {
  if (status === "success") {
    getAllClases();
  }
};

const editClass = (id) => {
  selectedClass.value = allClasses.value.find((c) => c.id == id);
  classUpdRef.value.toggleModal();
};

const deleteClassConfirmation = (data) => {
  selectedClass.value = data;
  console.log(data);
  showDeleteModal.value = true;
};

const getAllSections = (page = 1) => {
  isLoadingSection.value = true;
  apiServices
    .getAllSections(page)
    .then((response) => {
      // The array of roles is inside response.data.data
      allSections.value = response.data.data?.schoolsections || [];
    })
    .catch((error) => {
      console.error("Error fetching sections:", error);
    })
    .finally(() => {
      isLoadingSection.value = false;
    });
};

const getSectionClass = (sectionName) => {
  if (!sectionName) return "section-default";

  const name = sectionName.toLowerCase().trim();

  // 1️⃣ KG / Nursery
  if (/kg|nursery|nur|pre|early/.test(name)) {
    return "section-kg";
  }

  // 2️⃣ Primary
  if (/pri|primary|basic|p\s?[1-6]/.test(name)) {
    return "section-primary";
  }

  // 3️⃣ JSS (must check BEFORE SS)
  if (/\bjss\b|junior/.test(name)) {
    return "section-jss";
  }

  // 4️⃣ SS (Senior Secondary)
  if (/\bss\b|senior/.test(name)) {
    return "section-ss";
  }

  // fallback
  return "section-primary";
};

const deleteClass = () => {
  // TODO: Replace with actual API call when backend is ready
  apiServices
    .deleteClass(selectedClass.value.id)
    .then((response) => {
      if (response.status === 200) {
        getAllClases();
        toast.success(
          "Class Deleted Successfully",
          `The class for ${selectedClass.value.name} has been deleted successfully.`
        );
        // Reload data
      }
    })
    .catch((error) => {
      toast.error(
        "Failed to Delete Class",
        error.response?.data?.message ||
          "An error occurred while deleting the class."
      );
    })
    .finally(() => {
      showDeleteModal.value = false;
    });
};

const getAllClases = (page = 1) => {
  loading.value = true;
  apiServices
    .getAllClases(page)
    .then((response) => {
      // The array of roles is inside response.data.data
      allClasses.value = response.data.data.schoolclasses || [];
      let paginate = response.data.data.pagination;

      // Update pagination data
      if (response.data.data.pagination) {
        pagination.value = {
          currentPage: paginate.currentPage || 1,
          totalPages: paginate.totalPages || 1,
          totalCount: paginate.totalCount || 0,
          limit: paginate.limit || 25,
          hasNextPage: paginate.hasNextPage || false,
          hasPrevPage: paginate.hasPrevPage || false,
        };
      }
    })
    .catch((error) => {
      console.error("Error fetching classes:", error);
    })
    .finally(() => {
      loading.value = false;
    });
};

const handlePageChange = (page) => {
  getAllStffs(page);
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const getSerialNumber = (index) => {
  return (
    (pagination.value.currentPage - 1) * pagination.value.limit + index + 1
  );
};

const filteredClasses = computed(() => {
  let result = allClasses.value;

  // Filter by section
  if (filters.value.section) {
    result = result.filter((item) => item.section_id == filters.value.section);
  }

  return result;
});

const viewClassStudents = (classItem) => {
  router.push({
    name: "class-students",
    params: {
      id: classItem.id,
      classData: classItem,
    },
  });
};

onMounted(() => {
  // Load classes data
  getAllClases();
  getAllSections();
});
</script>