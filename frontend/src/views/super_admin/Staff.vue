<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1>Staff Management</h1>
        <p>Manage teaching and administrative staff</p>
      </div>
      <button @click="navigateToRegister" class="add-btn">
        <i class="fa fa-plus"></i>
        Add New Staff
      </button>
    </div>

    <div class="data-table-container">
      <div class="table-header">
        <h2 class="table-title">All Staff Members</h2>
        <div class="search-container">
          <input
            type="text"
            class="search-box"
            placeholder="Search staff..."
            v-model="searchTerm"
            @keyup.enter="searchStaff"
          />
          <button class="search-btn" @click="searchStaff">
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
              <th class="d-none d-lg-table-cell">Role</th>
              <th class="d-none d-xl-table-cell">Email</th>
              <th class="d-none d-xl-table-cell">Phone</th>
              <th class="d-none d-lg-table-cell">Employment Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
           
            <no-results-row v-if="loading" :loading="loading" :colspan="8" />
            <no-results-row v-else-if="staffs.length === 0" :colspan="8" />
            <tr v-for="(staff, index) in staffs" :key="staff.id">
              <td>{{ getSerialNumber(index) }}</td>
              <td>
                {{ staff.full_name }}
                <div class="d-lg-none">
                  <small class="text-muted">{{ staff.Role?.role_name }}</small>
                </div>
                <div class="d-xl-none">
                  <small class="text-muted d-block">{{ staff.email }}</small>
                  <small class="text-muted d-block">{{
                    staff.phone_number
                  }}</small>
                </div>
              </td>
              <td class="d-none d-lg-table-cell">
                {{ staff.Role?.role_name }}
              </td>
              <td class="d-none d-xl-table-cell">{{ staff.email }}</td>
              <td class="d-none d-xl-table-cell">{{ staff.phone_number }}</td>
              <td class="d-none d-lg-table-cell">
                {{ staff.date_of_employment }}
              </td>
              <td>
                <span
                  :class="[
                    'status-badge',
                    staff.status == true ? 'status-active' : 'status-inactive',
                  ]"
                  >{{ staff.status == true ? "ACTIVE" : "IN-ACTIVE" }}</span
                >
              </td>
              <td>
                <button @click="editStaff(staff.id)" class="action-btn edit">
                  Edit
                </button>
                <button
                  class="action-btn delete"
                  @click="deleteStaffConfirm(staff)"
                >
                  Delete
                </button>
                <button
                  class="action-btn info"
                  @click="navigateToProfile(staff.id)"
                >
                  View Profile
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
    @confirm="deleteStaff"
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

const toast = useToast();
const router = useRouter();
const loading = ref(false);
const staffs = ref([]);
const searchTerm = ref("");
const pagination = ref({
  currentPage: 1,
  totalPages: 0,
  totalCount: 0,
  limit: 25,
  hasNextPage: false,
  hasPrevPage: false,
});
const showDeleteModal = ref(false);
const selectedStaff = ref({});

const navigateToRegister = () => {
  router.push("/staff/register");
};

const editStaff = (id) => {
  router.push({ name: "staff-update", params: { id } });
};

const navigateToProfile = (staffId) => {
  router.push(`/staff/profile/${staffId}`);
};

const getAllStffs = (page = 1) => {
  loading.value = true;
  apiServices
    .getAllStaffs(page)
    .then((response) => {
      // The array of roles is inside response.data.data
      staffs.value = response.data.data.staff || [];
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
      console.error("Error fetching roles:", error);
    })
    .finally(() => {
      loading.value = false;
    });
};

const searchStaff = () => {
  loading.value = true;
  apiServices
    .searchStaff(searchTerm.value)
    .then((response) => {
      // The array of roles is inside response.data.data
      staffs.value = response.data.data.staff || [];
    })
    .catch((error) => {
      console.error("Error fetching roles:", error);
    })
    .finally(() => {
      loading.value = false;
    });
};

const handlePageChange = (page) => {
  getAllStffs(page);
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const deleteStaffConfirm = (staff) => {
  selectedStaff.value = staff;
  showDeleteModal.value = true;
};

const deleteStaff = () => {
  apiServices
    .deleteStaff(selectedStaff.value.id)
    .then((response) => {
      if (response.status === 200) {
        toast.success(
          "Staff Deleted Successfully",
          `The staff ${selectedStaff.value.full_name} has been deleted successfully.`
        );
        getAllStffs();
      }
      // remove role from list or reload data
    })
    .catch((error) => {
      toast.error(
        "Failed Deleted Staff",
        error.response?.data?.message ||
          `An error occurred while deleting the staff `
      );
    })
    .finally(() => {
      showDeleteModal.value = false;
    });
};

const getSerialNumber = (index) => {
  return (
    (pagination.value.currentPage - 1) * pagination.value.limit + index + 1
  );
};

const handleSearch = () => {
  // Implement search functionality
  console.log("Searching for:", searchTerm.value);
  // You can add API call here to search staff
};

onMounted(() => {
  // Load staff data
  getAllStffs();
});
</script>