<template>
  <BaseModal
    :show="show"
    :title="`Permissions for ${role?.role_name || 'Role'}`"
    @close="closeModal"
    :modalStyle="{ maxWidth: '900px', width: '95%' }"
  >
    <div v-if="loading" class="loading-state">
      <i class="fa fa-spinner fa-spin"></i> Loading permissions...
    </div>

    <div v-else class="permissions-table-container">
      <table class="permissions-table">
        <thead>
          <tr>
            <th class="permission-name-col">PERMISSION</th>
            <th class="permission-action-col">VIEW</th>
            <th class="permission-action-col">CREATE</th>
            <th class="permission-action-col">EDIT</th>
            <th class="permission-action-col">DELETE</th>
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
              <div class="status-indicator" :class="{ active: hasPermission(category.name, 'read') }">
                <i v-if="hasPermission(category.name, 'read')" class="fa fa-check"></i>
                <i v-else class="fa fa-times"></i>
              </div>
            </td>
            <td class="permission-action">
              <div class="status-indicator" :class="{ active: hasPermission(category.name, 'create') }">
                <i v-if="hasPermission(category.name, 'create')" class="fa fa-check"></i>
                <i v-else class="fa fa-times"></i>
              </div>
            </td>
            <td class="permission-action">
              <div class="status-indicator" :class="{ active: hasPermission(category.name, 'update') }">
                <i v-if="hasPermission(category.name, 'update')" class="fa fa-check"></i>
                <i v-else class="fa fa-times"></i>
              </div>
            </td>
            <td class="permission-action">
              <div class="status-indicator" :class="{ active: hasPermission(category.name, 'delete') }">
                <i v-if="hasPermission(category.name, 'delete')" class="fa fa-check"></i>
                <i v-else class="fa fa-times"></i>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <template #footer>
      <div class="modal-actions">
        <button class="btn btn-secondary" @click="closeModal">Close</button>
      </div>
    </template>
  </BaseModal>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import BaseModal from '../../components/public/BaseModal.vue';
import apiServices from '../../services/apiServices';

const props = defineProps({
  show: Boolean,
  role: Object
});

const emit = defineEmits(['close']);

const loading = ref(false);
const permissionCategories = ref([]);

const closeModal = () => {
  emit('close');
};

const getAllPermissions = () => {
  loading.value = true;
  apiServices.getAllPermissions()
    .then(response => {
      const data = response.data?.data?.permissions || [];
      
      // Group permissions logic (reused from RegisterRole)
      const grouped = {};
      data.forEach(perm => {
        const [prefix, action] = perm.permission_name.split('.');
        if (!grouped[prefix]) grouped[prefix] = [];
        grouped[prefix].push({
          id: perm.id,
          key: perm.permission_name,
          label: action.charAt(0).toUpperCase() + action.slice(1),
          action: action
        });
      });

      permissionCategories.value = Object.keys(grouped).map(key => ({
        name: key.charAt(0).toUpperCase() + key.slice(1) + ' Management',
        permissions: grouped[key]
      }));
    })
    .catch(error => console.error('Error fetching permissions:', error))
    .finally(() => loading.value = false);
};

const hasPermission = (categoryName, action) => {
  if (!props.role || !props.role.permissions) return false;

  const category = permissionCategories.value.find(cat => cat.name === categoryName);
  if (!category) return false;

  const permission = category.permissions.find(perm => perm.action === action);
  if (!permission) return false;

  // Check if role has this permission (role.permissions is array of objects with id/name)
  return props.role.permissions.some(p => p.id === permission.id);
};

onMounted(() => {
  getAllPermissions();
});
</script>

<style scoped>
.loading-state {
  text-align: center;
  padding: 2rem;
  color: #64748b;
}

.permissions-table-container {
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

.permissions-table td {
  padding: 12px 20px;
  border-bottom: 1px solid #f3f4f6;
}

.permission-name {
  font-weight: 500;
  color: #374151;
  font-size: 14px;
}

.permission-action {
  text-align: center;
}

.status-indicator {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #f1f5f9;
  color: #94a3b8;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
}

.status-indicator.active {
  background: #dcfce7;
  color: #16a34a;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
}

@media (max-width: 768px) {
  .permissions-table {
    font-size: 12px;
  }
  
  .permissions-table th, .permissions-table td {
    padding: 8px 4px;
  }
  
  .status-indicator {
    width: 20px;
    height: 20px;
    font-size: 10px;
  }
}
</style>
