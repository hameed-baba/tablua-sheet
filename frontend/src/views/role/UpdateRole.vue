<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1>Update Role</h1>
        <p>Modify role permissions and access levels</p>
      </div>
      <button @click="goBack" class="add-btn">
        <i class="fa fa-angle-left"></i>
        Back to Roles
      </button>
    </div>

    <div v-if="loading" class="data-table-container">
      <div class="loading">
        <p>Loading role data...</p>
      </div>
    </div>

    <div v-else class="data-table-container p-5">
      <form @submit.prevent="submitForm">
        <div class="form-grid">
          <div class="form-group">
            <label class="form-label">Role Name *</label>
            <input
              v-model="form.role_name"
              type="text"
              class="form-input"
              :class="{ error: errors.role_name }"
              placeholder="Enter role name"
              required
            />
            <span v-if="errors.role_name" class="error-message">{{
              errors.role_name
            }}</span>
          </div>
        </div>

        <div class="form-group">
          <div class="permissions-header">
            <label class="form-label">Permissions *</label>
            <label class="check-all-main">
              <input
                type="checkbox"
                :checked="areAllPermissionsChecked"
                @change="toggleAllPermissions"
              />
              <span class="checkmark"></span>
              <span class="permission-label">Check All</span>
            </label>
          </div>

          <div class="permissions-table-container">
            <table class="permissions-table">
              <thead>
                <tr>
                  <th class="permission-name-col">PERMISSION</th>
                  <th class="permission-action-col">VIEW</th>
                  <th class="permission-action-col">CREATE</th>
                  <th class="permission-action-col">EDIT</th>
                  <th class="permission-action-col">DELETE</th>
                  <th class="permission-action-col">CHECK ALL</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="category in permissionCategories"
                  :key="category.name"
                  class="permission-row"
                >
                  <td class="permission-name">{{ category.name }}</td>
                  <td class="permission-action">
                    <label class="table-checkbox">
                      <input
                        type="checkbox"
                        :checked="hasPermission(category.name, 'read')"
                        @change="togglePermission(category.name, 'read')"
                      />
                      <span class="table-checkmark"></span>
                    </label>
                  </td>
                  <td class="permission-action">
                    <label class="table-checkbox">
                      <input
                        type="checkbox"
                        :checked="hasPermission(category.name, 'create')"
                        @change="togglePermission(category.name, 'create')"
                      />
                      <span class="table-checkmark"></span>
                    </label>
                  </td>
                  <td class="permission-action">
                    <label class="table-checkbox">
                      <input
                        type="checkbox"
                        :checked="hasPermission(category.name, 'update')"
                        @change="togglePermission(category.name, 'update')"
                      />
                      <span class="table-checkmark"></span>
                    </label>
                  </td>
                  <td class="permission-action">
                    <label class="table-checkbox">
                      <input
                        type="checkbox"
                        :checked="hasPermission(category.name, 'delete')"
                        @change="togglePermission(category.name, 'delete')"
                      />
                      <span class="table-checkmark"></span>
                    </label>
                  </td>
                  <td class="permission-action">
                    <label class="table-checkbox">
                      <input
                        type="checkbox"
                        :checked="isRowFullyChecked(category.name)"
                        @change="toggleRowPermissions(category.name)"
                      />
                      <span class="table-checkmark"></span>
                    </label>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <span v-if="errors.permissions" class="error-message">{{
            errors.permissions
          }}</span>
        </div>

        <div class="modal-actions">
          <button type="button" @click="goBack" class="btn btn-cancel">
            Cancel
          </button>
          <button type="submit" class="btn btn-submit" :disabled="isSubmitting">
            <span v-if="isSubmitting" class="spinner"></span>
            {{ isSubmitting ? "Updating..." : "Update Role" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import apiServices from "../../services/apiServices";
import { useToast } from "../../composables/useToast";

const router = useRouter();
const route = useRoute();
const toast = useToast();
const loading = ref(true);
const isSubmitting = ref(false);

const form = reactive({
  role_name: "",
  permissions: [],
});

const errors = reactive({
  role_name: "",
  permissions: "",
});

const permissions = ref([]);
const permissionCategories = ref([]);

const validateForm = () => {
  errors.role_name = "";
  errors.permissions = "";

  if (!form.role_name.trim()) {
    errors.role_name = "Role name is required";
    return false;
  }

  if (form.permissions.length === 0) {
    errors.permissions = "At least one permission must be selected";
    return false;
  }

  return true;
};

const submitForm = () => {
  if (!validateForm()) return;

  isSubmitting.value = true;

  const roleData = {
    role_name: form.role_name.trim(),
    permissions: form.permissions,
  };

  apiServices
    .updateRole(route.params.id, roleData)
    .then((response) => {
      if (response.status === 200) {
        // Show success toast
        toast.success(
          "Role Updated Successfully",
          `The role "${form.role_name.trim()}" has been updated successfully.`
        );

        // Redirect to roles page
        router.push("/roles");
      }
    })
    .catch((error) => {
      console.error("Error updating role:", error);

      // Show error toast
      toast.error(
        "Failed to Update Role",
        error.response?.data?.message ||
          "An error occurred while updating the role. Please try again."
      );
    })
    .finally(() => {
      isSubmitting.value = false;
    });
};

const goBack = () => {
  router.push("/roles");
};

// Fetch all permissions using API
const getAllPermissions = () => {
  apiServices
    .getAllPermissions()
    .then((response) => {
      const data = response.data?.data?.permissions || [];
      permissions.value = data;

      // Group permissions by category (prefix before '.')
      const grouped = {};
      data.forEach((perm) => {
        const [prefix, action] = perm.permission_name.split(".");
        if (!grouped[prefix]) grouped[prefix] = [];
        grouped[prefix].push({
          id: perm.id,
          key: perm.permission_name,
          label: action.charAt(0).toUpperCase() + action.slice(1),
          action: action,
        });
      });

      // Convert grouped object to array for v-for with consistent naming
      permissionCategories.value = Object.keys(grouped).map((key) => ({
        name: key.charAt(0).toUpperCase() + key.slice(1) + " Management",
        permissions: grouped[key],
      }));
    })
    .catch((error) => {
      console.error("Error fetching permissions:", error);
    });
};

// Check if a specific permission exists
const hasPermission = (categoryName, action) => {
  const category = permissionCategories.value.find(
    (cat) => cat.name === categoryName
  );
  if (!category) return false;

  const permission = category.permissions.find(
    (perm) => perm.action === action
  );
  if (!permission) return false;

  return form.permissions.includes(permission.id);
};

// Toggle specific permission
const togglePermission = (categoryName, action) => {
  const category = permissionCategories.value.find(
    (cat) => cat.name === categoryName
  );
  if (!category) return;

  const permission = category.permissions.find(
    (perm) => perm.action === action
  );
  if (!permission) return;

  const index = form.permissions.indexOf(permission.id);

  if (index > -1) {
    form.permissions.splice(index, 1);
  } else {
    form.permissions.push(permission.id);
  }
};

// Check if all permissions in a row are checked
const isRowFullyChecked = (categoryName) => {
  const actions = ["read", "create", "update", "delete"];
  return actions.every((action) => hasPermission(categoryName, action));
};

// Toggle all permissions for a specific row
const toggleRowPermissions = (categoryName) => {
  const actions = ["read", "create", "update", "delete"];
  const isFullyChecked = isRowFullyChecked(categoryName);
  const category = permissionCategories.value.find(
    (cat) => cat.name === categoryName
  );

  if (!category) return;

  actions.forEach((action) => {
    const permission = category.permissions.find(
      (perm) => perm.action === action
    );
    if (!permission) return;

    const index = form.permissions.indexOf(permission.id);

    if (isFullyChecked) {
      // Remove all permissions for this row
      if (index > -1) {
        form.permissions.splice(index, 1);
      }
    } else {
      // Add all permissions for this row
      if (index === -1) {
        form.permissions.push(permission.id);
      }
    }
  });
};

// Check if all permissions are checked
const areAllPermissionsChecked = computed(() => {
  if (permissionCategories.value.length === 0) return false;

  const allActions = ["read", "create", "update", "delete"];
  return permissionCategories.value.every((category) =>
    allActions.every((action) => hasPermission(category.name, action))
  );
});

// Toggle all permissions in the entire table
const toggleAllPermissions = () => {
  const allActions = ["read", "create", "update", "delete"];
  const shouldCheckAll = !areAllPermissionsChecked.value;

  if (shouldCheckAll) {
    // Add all permissions
    permissionCategories.value.forEach((category) => {
      allActions.forEach((action) => {
        const permission = category.permissions.find(
          (perm) => perm.action === action
        );
        if (permission && !form.permissions.includes(permission.id)) {
          form.permissions.push(permission.id);
        }
      });
    });
  } else {
    // Remove all permissions
    form.permissions.length = 0;
  }
};

const getRolePermissions = () => {
  apiServices
    .getRolePermission(route.params.id)
    .then((response) => {
      const data = response.data?.data || {};
      form.role_name = data.role_name || "";
      form.permissions = data.permissions.map((perm) => perm.id) || [];
    })
    .catch((error) => {
      console.error("Error fetching role data:", error);
      if(error.response?.status === 404){
          toast.error(
        "Failed to get the Role",
        error.response?.data?.message ||
          "An error occurred while getting the role. Please try again."
      );
      router.push("/roles")
      }
    })
    .finally(() => {
      loading.value = false;
    });
};

const updateRole = () => {};

onMounted(() => {
  getAllPermissions();
  getRolePermissions();
});
</script>
<style scoped>
.error-message {
  display: block;
  margin-top: 8px;
  color: #ef4444;
  font-size: 14px;
  font-weight: 500;
}

.loading {
  text-align: center;
  padding: 3rem;
  color: #6b7280;
  font-size: 16px;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  margin-bottom: 10px;
}

/* Permissions Header Styles */
.permissions-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.check-all-main {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 6px 12px;
  border-radius: 6px;
  transition: background-color 0.2s ease;
  font-size: 14px;
  font-weight: 500;
  color: #667eea;
  position: relative;
}

.check-all-main:hover {
  background-color: rgba(102, 126, 234, 0.05);
}

.check-all-main input[type="checkbox"] {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  width: 0;
  height: 0;
}

.check-all-main .checkmark {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(102, 126, 234, 0.2);
  border-radius: 6px;
  position: relative;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.8);
  flex-shrink: 0;
}

.check-all-main:hover .checkmark {
  border-color: #667eea;
  background: white;
}

.check-all-main input[type="checkbox"]:checked + .checkmark {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: #667eea;
}

.check-all-main input[type="checkbox"]:checked + .checkmark::after {
  content: "";
  position: absolute;
  left: 6px;
  top: 2px;
  width: 6px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.permission-label {
  font-size: 14px;
  color: #1e293b;
  user-select: none;
  font-weight: 500;
}

/* Permissions Table Styles */
.permissions-table-container {
  margin-top: 20px;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #e5e7eb;
  background: white;
}

.permissions-table {
  width: 100%;
  border-collapse: collapse;
}

.permissions-table thead {
  background: #f8fafc;
}

.permissions-table th {
  padding: 16px 20px;
  text-align: left;
  font-weight: 600;
  font-size: 14px;
  color: #374151;
  border-bottom: 1px solid #e5e7eb;
}

.permission-name-col {
  width: 35%;
}

.permission-action-col {
  width: 13%;
  text-align: center;
}

.permissions-table td {
  padding: 16px 20px;
  border-bottom: 1px solid #f3f4f6;
}

.permission-row:hover {
  background: #f9fafb;
}

.permission-name {
  font-weight: 500;
  color: #374151;
  font-size: 14px;
}

.permission-action {
  text-align: center;
}

/* Table Checkbox Styles */
.table-checkbox {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
}

.table-checkbox input[type="checkbox"] {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  width: 0;
  height: 0;
}

.table-checkmark {
  width: 20px;
  height: 20px;
  border: 2px solid #d1d5db;
  border-radius: 4px;
  position: relative;
  transition: all 0.2s ease;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
}

.table-checkbox:hover .table-checkmark {
  border-color: #667eea;
}

.table-checkbox input[type="checkbox"]:checked + .table-checkmark {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: #667eea;
}

.table-checkbox input[type="checkbox"]:checked + .table-checkmark::after {
  content: "";
  position: absolute;
  left: 6px;
  top: 2px;
  width: 6px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.table-checkbox input[type="checkbox"]:focus + .table-checkmark {
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

@media (max-width: 768px) {
  .permissions-table {
    font-size: 11px;
    min-width: 100%;
  }

  .permissions-table th,
  .permissions-table td {
    padding: 8px 4px;
    text-align: center;
  }

  .permission-name-col {
    width: 25%;
    text-align: left !important;
  }

  .permission-action-col {
    width: 12.5%;
    min-width: 40px;
  }

  .permissions-table-container {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }

  .permission-name {
    font-size: 11px;
    line-height: 1.2;
  }

  .permissions-table th {
    font-size: 10px;
    font-weight: 600;
    white-space: nowrap;
  }
}
</style>