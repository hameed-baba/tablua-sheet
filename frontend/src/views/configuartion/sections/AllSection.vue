<template>
  <div class="data-table-container">
    <div class="table-header">
      <h2 class="table-title">
        <svg
          width="24"
          height="24"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          style="
            display: inline-block;
            vertical-align: middle;
            margin-right: 0.5rem;
          "
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
        All Sections
      </h2>
      <button class="add-btn" @click="sectionRef.toggleModal()">
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
        Add New Section
      </button>
    </div>
    <div class="table-responsive">
      <table class="data-table">
        <thead>
          <tr>
            <th>Secton Name</th>
            <th class="d-none d-lg-table-cell">Created Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading">
            <td class="text-center" colspan="3">
              <i class="fa fa-spinner fa-spin"></i>
            </td>
          </tr>
          <tr v-if="!loading && allSections.length === 0">
            <td class="text-center" colspan="3">No data</td>
          </tr>
          <tr v-for="(section, index) in allSections" :key="index">
            <td>
              {{ section.section_name }}
              <div class="d-lg-none">
                <small class="text-muted">
                  {{
                    section.createdAt ? section.createdAt.substring(0, 10) : ""
                  }}
                </small>
              </div>
            </td>
            <td class="d-none d-lg-table-cell">
              {{ section.createdAt ? section.createdAt.substring(0, 10) : "" }}
            </td>
            <td>
              <button
                class="action-btn edit"
                @click="getSelectedSection(section.id)"
              >
                Edit
              </button>
              <button
                class="action-btn delete"
                @click="deleteSectionConfirm(section)"
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
  <RegisterSection ref="sectionRef" @send-status="getStatus" />
  <UpdateSection
    ref="sectionUpdRef"
    @send-status="getStatus"
    :sectionToUpdate="selectedSections"
  />
  <ConfirmDeleteModal
    :show="showDeleteModal"
    @confirm="deleteSection"
    @cancel="showDeleteModal = false"
  />
</template>

<script setup>
import { onMounted, ref } from "vue";
import apiServices from "../../../services/apiServices";
import RegisterSection from "./RegisterSection.vue";
import UpdateSection from "./UpdateSection.vue";
import ConfirmDeleteModal from "../../../components/public/ConfirmDeleteModal.vue";
import { useToast } from "../../../composables/useToast";
import Pagination from "../../../components/public/Pagination.vue";

const toast = useToast();
const loading = ref(false);
const allSections = ref([]);
const sectionRef = ref(null);
const sectionUpdRef = ref(null);
const selectedSections = ref({});
const showDeleteModal = ref(false);
const selectedSection = ref({});

const pagination = ref({
  currentPage: 1,
  totalPages: 0,
  totalCount: 0,
  limit: 25,
  hasNextPage: false,
  hasPrevPage: false,
});

const getAllSections = (page = 1) => {
  loading.value = true;
  apiServices
    .getAllSections(page)
    .then((response) => {
      // The array of roles is inside response.data.data
      allSections.value = response.data.data?.schoolsections || [];
      let paginate = response.data.data?.pagination;

      // Update pagination data
      if (paginate) {
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
      console.error("Error fetching sections:", error);
    })
    .finally(() => {
      loading.value = false;
    });
};

const handlePageChange = (page) => {
  getAllSections(page);
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const getStatus = (status) => {
  if (status === "success") {
    getAllSections();
  }
};

const getSelectedSection = (id) => {
  selectedSections.value = allSections.value.find((s) => s.id === id);
  // return selectedSections.value;

  if (selectedSections.value) {
    sectionUpdRef.value.toggleUpdateModal();
  }
};

const deleteSectionConfirm = (staff) => {
  selectedSection.value = staff;
  showDeleteModal.value = true;
};

const deleteSection = () => {
  apiServices
    .deleteSection(selectedSection.value.id)
    .then((response) => {
      if (response.status === 200) {
        toast.success(
          "Section Deleted Successfully",
          `The section ${selectedSection.value.section_name} has been deleted successfully.`
        );
        getAllSections();
      }
      // remove role from list or reload data
    })
    .catch((error) => {
      toast.error(
        "Failed Deleted Section",
        error.response?.data?.message ||
          `An error occurred while deleting the section `
      );
    })
    .finally(() => {
      showDeleteModal.value = false;
    });
};

onMounted(() => {
  getAllSections();
});
</script>

<style lang="scss" scoped>
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