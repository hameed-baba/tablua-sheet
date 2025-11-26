<template>
  <div class="page">
    <div class="page-header mb-0">
      <div>
        <h1>Role Management</h1>
        <p>Manage user roles and permissions</p>
      </div>
      <button class="add-btn" @click="navigateToRegister">
        <i class="fa fa-plus"></i>
        Add New Role
      </button>
    </div>

    <div class="data-table-container">
      <div class="table-header">
        <h2 class="table-title">All Roles</h2>
        <div class="search-container">
          <input
            type="text"
            class="search-box"
            placeholder="Search roles..."
            v-model="searchTerm"
            @keyup.enter="handleSearch"
          />
          <button class="search-btn" @click="handleSearch">
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Roles Table -->
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>SN</th>
              <th>Role Name</th>
              <th class="d-none d-md-table-cell">Permissions</th>
              <th class="d-none d-lg-table-cell">Created Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td class="text-center" colspan="5">
                <i class="fa fa-spinner fa-spin"></i>
              </td>
            </tr>
            <tr v-if="!loading && filteredRoles.length === 0">
              <td class="text-center" colspan="5">No data</td>
            </tr>
            <tr v-for="(role, index) in filteredRoles" :key="role.id">
              <td>{{ index + 1 }}</td>
              <td>
                {{ role.role_name }}
                <div class="d-md-none">
                  <small class="text-muted">
                    {{ role.permissions?.length || 0 }} permissions
                  </small>
                </div>
              </td>

              <td class="d-none d-md-table-cell">
                <div class="permissions-list">
                  <span
                    v-for="permission in role.permissions.slice(0, 3)"
                    :key="permission.id"
                    class="status-badge status-active"
                  >
                    {{ permission.permission_name }}
                  </span>
                  <span
                    v-if="role.permissions.length > 3"
                    class="status-badge status-active"
                  >
                    +{{ role.permissions.length - 3 }} more
                  </span>
                </div>
              </td>

              <td class="d-none d-lg-table-cell">
                {{ formatDate(role.createdAt) }}
              </td>

              <td>
                <button class="action-btn view" @click="openViewModal(role)">
                  View
                </button>
                <button class="action-btn edit" @click="editRole(role.id)">
                  Edit
                </button>
                <button
                  class="action-btn delete"
                  @click="deleteRoleConfirm(role)"
                >
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  <ConfirmDeleteModal
    :show="showDeleteModal"
    @confirm="deleteRole"
    @cancel="showDeleteModal = false"
  />
  <ViewRoleModal
    :show="showViewModal"
    :role="selectedRole"
    @close="showViewModal = false"
  />
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import apiServices from "../services/apiServices";
import ConfirmDeleteModal from "../components/public/ConfirmDeleteModal.vue";
import ViewRoleModal from "./role/ViewRoleModal.vue";
import { useToast } from "../composables/useToast";

const router = useRouter();
const toast = useToast();
const searchTerm = ref("");
const roles = ref([]);
const loading = ref(false);
const showDeleteModal = ref(false);
const showViewModal = ref(false);
const selectedRole = ref({});

/** Fetch all roles using .then().catch() */
const getAllRoles = () => {
  loading.value = true;
  apiServices
    .getAllRoles()
    .then((response) => {
      // The array of roles is inside response.data.data
      roles.value = response.data.data || [];
    })
    .catch((error) => {
      console.error("Error fetching roles:", error);
    })
    .finally(() => {
      loading.value = false;
    });
};

/** Filter roles by search term */
const filteredRoles = computed(() => {
  if (!searchTerm.value) return roles.value;
  return roles.value.filter((role) =>
    role.role_name.toLowerCase().includes(searchTerm.value.toLowerCase())
  );
});

/** Navigate to create role page */
const navigateToRegister = () => {
  router.push("/roles/register");
};

/** Navigate to edit role page */
const editRole = (roleId) => {
  router.push(`/roles/update/${roleId}`);
};

const openViewModal = (role) => {
  selectedRole.value = role;
  showViewModal.value = true;
};

const deleteRoleConfirm = (role) => {
  selectedRole.value = role;
  showDeleteModal.value = true;
};

const deleteRole = () => {
  apiServices
    .deleteRole(selectedRole.value.id)
    .then((response) => {
      if (response.status === 200) {
        toast.success(
          "Role Deleted Successfully",
          `The role has been deleted successfully.`
        );
        getAllRoles();
      } else {
        toast.error("Failed Deleted Role", `Failed to delete the role`);
      }
      // remove role from list or reload data
    })
    .catch((err) => {
      toast.error(
        "Failed Deleted Role",
        `An error occurred while deleting the role `
      );
    })
    .finally(() => {
      showDeleteModal.value = false;
    });
};

/** Format date for display */
const formatDate = (date) => {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
};

/** Handle search action */
const handleSearch = () => {
  // Search is already reactive through computed property
  console.log('Searching for:', searchTerm.value);
};

/** Load roles when component mounts */
onMounted(() => {
  getAllRoles();
});
</script>

<style scoped>
</style>
