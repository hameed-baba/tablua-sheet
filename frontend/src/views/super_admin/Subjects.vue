<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1>Subjects Management</h1>
        <p>Manage academic subjects and curriculum</p>
      </div>
      <button class="add-btn" @click="subjectRef.toggleModal()">
        <i class="fa fa-plus"></i>
        Add New Subject
      </button>
    </div>

    <div class="data-table-container">
      <div class="table-header">
        <h2 class="table-title">All Subjects</h2>
      </div>
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>SN</th>
              <th>Subject Name</th>
              <th class="d-none d-lg-table-cell">Total Sections Assign</th>
              <th class="d-none d-lg-table-cell">Created Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <no-results-row v-if="loading" :loading="loading" :colspan="5" />
            <no-results-row
              v-else-if="allSubjects.length === 0"
              :colspan="5"
            />

            <tr v-for="(subject, index) in allSubjects" :key="subject.id">
              <td>{{ (pagination.currentPage - 1) * pagination.limit + index + 1 }}</td>
              <td>
                <strong>
                  {{ subject.subject_name }}
                </strong>
                <div class="d-lg-none">
                  <small class="text-muted">
                    {{ subject.section_ids.length }} section{{
                      subject.section_ids.length !== 1 ? "s" : ""
                    }}
                    assigned
                  </small>
                </div>
              </td>
              <td class="d-none d-lg-table-cell">
                <div class="sections-list">
                  <span class="status-badge status-active">
                    {{ subject.section_ids.length }} Section{{
                      subject.section_ids.length !== 1 ? "s" : ""
                    }}
                  </span>
                </div>
              </td>
              <td class="d-none d-lg-table-cell">
                {{
                  subject.createdAt ? subject.createdAt.substring(0, 10) : ""
                }}
              </td>
              <td>
                <button
                  class="action-btn edit"
                  @click="getSelectedSubject(subject.id)"
                >
                  Edit
                </button>
                <button
                  class="action-btn delete"
                  @click="deleteSubjectConfirmation(subject)"
                >
                  Delete
                </button>
                <button @click="viewSubject(subject)" class="action-btn info">
                  View
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination Component -->
      <Pagination
        v-if="!loading && allSubjects.length > 0"
        :current-page="pagination.currentPage"
        :total-pages="pagination.totalPages"
        :total-count="pagination.totalCount"
        :limit="pagination.limit"
        :has-next-page="pagination.hasNextPage"
        :has-prev-page="pagination.hasPrevPage"
        @page-change="handlePageChange"
      />
    </div>
  </div>
  <RegisterSubject ref="subjectRef" @send-status="getStatus" />
  <UpdateSubject
    ref="subjectUpdRef"
    :subject-to-update="selectedSubject"
    @send-status="getStatus"
  />
  <ViewSubjectInfo :subject-to-view="selectedSubject" ref="viewRef" />
  <ConfirmDeleteModal
    :show="showDeleteModal"
    @confirm="deleteSubject"
    @cancel="showDeleteModal = false"
    :loading="isDeleteing"
  />
</template>

<script setup>
import { ref, onMounted } from "vue";
import apiServices from "../../services/apiServices";
import RegisterSubject from "./subject/RegisterSubject.vue";
import UpdateSubject from "./subject/UpdateSubject.vue";
import ConfirmDeleteModal from "../../components/public/ConfirmDeleteModal.vue";
import Pagination from "../../components/public/Pagination.vue";
import { useToast } from "../../composables/useToast";
import ViewSubjectInfo from "./subject/ViewSubjectInfo.vue";

const toast = useToast();
const loading = ref(false);
const allSubjects = ref([]);
const subjectRef = ref(null);
const subjectUpdRef = ref(null);
const selectedSubject = ref({});
const showDeleteModal = ref(false);
const isDeleteing = ref(false);
const viewRef = ref(null);

// Pagination state
const pagination = ref({
  currentPage: 1,
  totalPages: 1,
  totalCount: 0,
  limit: 25,
  hasNextPage: false,
  hasPrevPage: false,
});

const getAllSubject = (page = 1) => {
  loading.value = true;
  apiServices
    .getAllSubject(page)
    .then((response) => {
      // Convert section_ids string to array
      allSubjects.value =
        response.data.data?.schoolsubjects.map((subject) => ({
          ...subject,
          section_ids: subject.section_ids
            ? subject.section_ids.split(",").map((id) => Number(id)) // convert to numbers if needed
            : [],
        })) || [];
      
      // Update pagination data
      if (response.data.data?.pagination) {
        pagination.value = response.data.data.pagination;
      }
    })
    .catch((error) => {
      console.error("Error fetching subjects:", error);
      toast.error(
        "Failed to Load Subjects",
        error.response?.data?.message || "An error occurred while loading subjects"
      );
    })
    .finally(() => {
      loading.value = false;
    });
};

const handlePageChange = (page) => {
  getAllSubject(page);
};

const getStatus = (status) => {
  if (status === "success") {
    getAllSubject(pagination.value.currentPage);
  }
};

const getSelectedSubject = (id) => {
  selectedSubject.value = allSubjects.value.find((s) => s.id === id);
  subjectUpdRef.value.toggleModal();
};

const deleteSubjectConfirmation = (subject) => {
  selectedSubject.value = subject;
  showDeleteModal.value = true;
};

const viewSubject = (subject) => {
  selectedSubject.value = subject;
  viewRef.value.toggleModal();
};

const deleteSubject = () => {
  isDeleteing.value = true;
  apiServices
    .deleteSubject(selectedSubject.value.id)
    .then((response) => {
      if (response.status === 200) {
        toast.success(
          "Subject Deleted Successfully",
          `The subject ${selectedSubject.value.subject_name} has been deleted successfully.`
        );
        getAllSubject(pagination.value.currentPage);
      }
      // remove role from list or reload data
    })
    .catch((error) => {
      toast.error(
        "Failed Deleted Subject",
        error.response?.data?.message ||
          `An error occurred while deleting the subject `
      );
    })
    .finally(() => {
      isDeleteing.value = false;
      showDeleteModal.value = false;
    });
};

onMounted(() => {
  getAllSubject();
});
</script>
<style
 scoped>
.sections-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
}

.text-muted {
  color: #6b7280;
}

.d-lg-none {
  @media (min-width: 1024px) {
    display: none;
  }
}

.d-none {
  display: none;
}

.d-lg-table-cell {
  @media (min-width: 1024px) {
    display: table-cell;
  }
}
</style>
