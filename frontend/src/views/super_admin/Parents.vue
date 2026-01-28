<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1>Parents Management</h1>
        <p>Manage parent and guardian information</p>
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
        Add New Parent
      </button>
    </div>

    <div class="data-table-container">
      <div class="table-header">
        <h2 class="table-title">All Parents</h2>
        <div class="search-container">
          <input
            type="text"
            class="search-box"
            placeholder="Search parents..."
            v-model="searchTerm"
            @keyup.enter="handleSearch"
          />
          <button class="search-btn" @click="handleSearch">
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
      </div>
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>SN</th>
              <th>Name</th>
              <th class="d-none d-lg-table-cell">Gender</th>
              <th class="d-none d-md-table-cell">Phone</th>
              <th class="d-none d-xl-table-cell">Address</th>
              <th class="d-none d-xl-table-cell">State</th>
              <th class="d-none d-lg-table-cell">Religion</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <no-results-row v-if="loading" :loading="loading" :colspan="8" />
            <no-results-row v-else-if="parents.length === 0" :colspan="8" />
            <tr v-for="(parent, index) in parents" :key="parent.id">
              <td>{{ getSerialNumber(index) }}</td>
              <td>
                {{ parent.full_name }}
                <div class="d-lg-none">
                  <small class="text-muted">{{ parent.gender }}</small>
                </div>
                <div class="d-md-none">
                  <small class="text-muted d-block">{{
                    parent.phone_number
                  }}</small>
                </div>
                <div class="d-xl-none">
                  <small class="text-muted d-block">{{ parent.address }}</small>
                  <small class="text-muted d-block"
                    >{{ parent.state }} • {{ parent.religion }}</small
                  >
                </div>
              </td>
              <td class="d-none d-lg-table-cell text-capitalize">
                {{ parent.gender }}
              </td>
              <td class="d-none d-md-table-cell">{{ parent.phone_number }}</td>
              <td class="d-none d-xl-table-cell">{{ parent.address }}</td>
              <td class="d-none d-xl-table-cell text-capitalize">
                {{ parent.state }}
              </td>
              <td class="d-none d-lg-table-cell text-capitalize">
                {{ parent.religion }}
              </td>
              <td>
                <button class="action-btn edit" @click="editParent(parent)">
                  Edit
                </button>
                <button
                  class="action-btn delete"
                  @click="deleteParent(parent.id)"
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
  <RegisterParent ref="parentRef" @send-status="getStatus" />
  <UpdateParent
    ref="parentUpdRef"
    @send-status="getStatus"
    :parent-to-update="selectedParent"
  />
  <ConfirmDeleteModal
    :show="showDeleteModal"
    @confirm="confirmDelete"
    @cancel="showDeleteModal = false"
  />
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import RegisterParent from "./parent/RegisterParent.vue";
import UpdateParent from "./parent/UpdateParent.vue";
import ConfirmDeleteModal from "../../components/public/ConfirmDeleteModal.vue";
import { useToast } from "../../composables/useToast";
import apiServices from "../../services/apiServices";
import Pagination from "../../components/public/Pagination.vue";

const toast = useToast();
const parentRef = ref(null);
const parentUpdRef = ref(null);
const selectedParent = ref({});
const showDeleteModal = ref(false);
const loading = ref(false);
const pagination = ref({
  currentPage: 1,
  totalPages: 0,
  totalCount: 0,
  limit: 25,
  hasNextPage: false,
  hasPrevPage: false,
});
const parents = ref([]);
const searchTerm = ref("");
const hasQuickFilters = ref(false);

const getSerialNumber = (index) => {
  return (
    (pagination.value.currentPage - 1) * pagination.value.limit + index + 1
  );
};

const handleParentResponse = (response) => {
  parents.value = response.data.data.parents || [];

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

const loadParents = (page = 1) => {
  loading.value = true;

  apiServices
    .getParents(page)
    .then((response) => handleParentResponse(response))
    .catch((error) => console.log(error))
    .finally(() => (loading.value = false));
};

const searchParents = (term = "") => {
  loading.value = true;

  apiServices
    .searchParents(term)
    .then((response) => handleParentResponse(response))
    .catch((error) => console.log(error))
    .finally(() => (loading.value = false));
};

const handlePageChange = (page) => {
  loadParents(page);
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const openModal = () => {
  parentRef.value.toggleModal();
};

const getStatus = (status) => {
  if (status === "success") {
    loadParents();
  }
};

const editParent = (parent) => {
  selectedParent.value = parent;
  parentUpdRef.value.toggleModal();
};

const deleteParent = (id) => {
  selectedParent.value = parents.value.find((p) => p.id === id);
  showDeleteModal.value = true;
};

const confirmDelete = () => {
  // TODO: Replace with actual API call when backend is ready
  apiServices
    .deleteParent(selectedParent.value.id)
    .then((response) => {
      if (response.status === 200) {
        loadParents();
        toast.success(
          "Parent Deleted Successfully",
          `${selectedParent.value.full_name} has been deleted successfully.`
        );
      }
    })
    .catch((error) => {
      toast.error(
        "Failed to Delete Parent",
        error.response?.data?.message ||
          "An error occurred while deleting the parent."
      );
    })
    .finally(() => {
      showDeleteModal.value = false;
    });
};

const handleSearch = () => {
  hasQuickFilters.value = true;
  searchParents(searchTerm.value);
};
const clearQuickFilters = () => {
  loadParents();
  hasQuickFilters.value = false;
};
onMounted(() => {
  loadParents();
});
</script>