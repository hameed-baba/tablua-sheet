<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1>My Profile</h1>
        <p>View and update your personal information</p>
      </div>
    </div>

    <div class="profile-container">
      <!-- Profile Header Card -->
      <div class="profile-header-card">
        <div class="profile-avatar-section">
          <div class="profile-avatar-large">
            {{ getInitials(user.full_name) }}
          </div>
          <div class="profile-header-info">
            <h2>{{ user.full_name }}</h2>
            <p class="profile-role">{{ user.role?.role_name || 'User' }}</p>
            <span class="status-badge status-active">Active</span>
          </div>
        </div>
      </div>

      <!-- Profile Form -->
      <div class="profile-form-card">
        <div class="card-header">
          <h3>Personal Information</h3>
          <button 
            v-if="!isEditing" 
            class="btn-edit" 
            @click="enableEdit"
          >
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit Profile
          </button>
        </div>

        <form @submit.prevent="handleSubmit" class="profile-form">
          <!-- Personal Information -->
          <div class="form-section">
            <h4 class="section-title">Personal Information</h4>
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Full Name</label>
                <input
                  type="text"
                  v-model="formData.full_name"
                  class="form-input"
                  :disabled="!isEditing"
                  required
                />
              </div>
              <div class="form-group">
                <label class="form-label">Email Address</label>
                <input
                  type="email"
                  v-model="formData.email"
                  class="form-input"
                  :disabled="!isEditing"
                  required
                />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Phone Number</label>
                <input
                  type="tel"
                  v-model="formData.phone_number"
                  class="form-input"
                  :disabled="!isEditing"
                />
              </div>
              <div class="form-group">
                <label class="form-label">Gender</label>
                <select
                  v-model="formData.gender"
                  class="form-select"
                  :disabled="!isEditing"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Date of Birth</label>
                <input
                  type="date"
                  v-model="formData.date_of_birth"
                  class="form-input"
                  :disabled="!isEditing"
                />
              </div>
              <div class="form-group">
                <label class="form-label">Employee ID</label>
                <input
                  type="text"
                  v-model="formData.employee_id"
                  class="form-input"
                  disabled
                />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group full-width">
                <label class="form-label">Address</label>
                <textarea
                  v-model="formData.address"
                  class="form-textarea"
                  :disabled="!isEditing"
                  rows="3"
                ></textarea>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">State</label>
                <input
                  type="text"
                  v-model="formData.state"
                  class="form-input"
                  :disabled="!isEditing"
                />
              </div>
              <div class="form-group">
                <label class="form-label">Local Government</label>
                <input
                  type="text"
                  v-model="formData.local_gov"
                  class="form-input"
                  :disabled="!isEditing"
                />
              </div>
            </div>
          </div>

          <!-- Employment Information -->
          <div class="form-section">
            <h4 class="section-title">Employment Information</h4>
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Date of Employment</label>
                <input
                  type="date"
                  v-model="formData.date_of_employment"
                  class="form-input"
                  disabled
                />
              </div>
              <div class="form-group">
                <label class="form-label">Employment Type</label>
                <input
                  type="text"
                  v-model="formData.employment_type"
                  class="form-input"
                  disabled
                />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Salary</label>
                <input
                  type="number"
                  v-model="formData.salary"
                  class="form-input"
                  disabled
                />
              </div>
              <div class="form-group">
                <label class="form-label">Specializations</label>
                <input
                  type="text"
                  v-model="formData.specializations"
                  class="form-input"
                  :disabled="!isEditing"
                />
              </div>
            </div>
          </div>

          <!-- Qualifications -->
          <div class="form-section">
            <h4 class="section-title">Qualifications & Experience</h4>
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Highest Qualification</label>
                <input
                  type="text"
                  v-model="formData.qualifications"
                  class="form-input"
                  :disabled="!isEditing"
                />
              </div>
              <div class="form-group">
                <label class="form-label">Qualification Title</label>
                <input
                  type="text"
                  v-model="formData.qualification_title"
                  class="form-input"
                  :disabled="!isEditing"
                />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Institution</label>
                <input
                  type="text"
                  v-model="formData.institution"
                  class="form-input"
                  :disabled="!isEditing"
                />
              </div>
              <div class="form-group">
                <label class="form-label">Year Obtained</label>
                <input
                  type="text"
                  v-model="formData.year_obtained"
                  class="form-input"
                  :disabled="!isEditing"
                />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Years of Experience</label>
                <input
                  type="text"
                  v-model="formData.year_of_experience"
                  class="form-input"
                  :disabled="!isEditing"
                />
              </div>
              <div class="form-group">
                <!-- Empty for alignment -->
              </div>
            </div>
          </div>

          <!-- Emergency Contact -->
          <div class="form-section">
            <h4 class="section-title">Emergency Contact</h4>
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Contact Name</label>
                <input
                  type="text"
                  v-model="formData.emergency_contact_name"
                  class="form-input"
                  :disabled="!isEditing"
                />
              </div>
              <div class="form-group">
                <label class="form-label">Contact Number</label>
                <input
                  type="tel"
                  v-model="formData.emergency_contact"
                  class="form-input"
                  :disabled="!isEditing"
                />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Relationship</label>
                <input
                  type="text"
                  v-model="formData.emergency_contact_relation"
                  class="form-input"
                  :disabled="!isEditing"
                />
              </div>
              <div class="form-group">
                <!-- Empty for alignment -->
              </div>
            </div>
          </div>

          <div class="form-section" v-if="isEditing">
            <h4 class="section-title">Change Password (Optional)</h4>
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Current Password</label>
                <input
                  type="password"
                  v-model="formData.current_password"
                  class="form-input"
                  placeholder="Enter current password"
                />
              </div>
              <div class="form-group">
                <label class="form-label">New Password</label>
                <input
                  type="password"
                  v-model="formData.new_password"
                  class="form-input"
                  placeholder="Enter new password"
                />
              </div>
            </div>
          </div>

          <div class="form-actions" v-if="isEditing">
            <button type="button" class="btn btn-cancel" @click="cancelEdit">
              Cancel
            </button>
            <button type="submit" class="btn btn-submit" :disabled="loading">
              <span v-if="loading" class="spinner"></span>
              {{ loading ? 'Saving...' : 'Save Changes' }}
            </button>
          </div>
        </form>
      </div>

      <!-- Account Information Card -->
      <div class="profile-info-card">
        <h3>Account Information</h3>
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">Role</span>
            <span class="info-value">{{ user.role?.role_name || 'N/A' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Status</span>
            <span class="info-value">
              <span class="status-badge status-active">Active</span>
            </span>
          </div>
          <div class="info-item">
            <span class="info-label">Member Since</span>
            <span class="info-value">{{ formatDate(user.createdAt) }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Last Updated</span>
            <span class="info-value">{{ formatDate(user.updatedAt) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useLoginStore } from '../store/loginStore';
import { useToast } from '../composables/useToast';

const loginStore = useLoginStore();
const toast = useToast();

const user = computed(() => loginStore.user || {});
const isEditing = ref(false);
const loading = ref(false);

const formData = ref({
  full_name: '',
  email: '',
  phone_number: '',
  gender: '',
  date_of_birth: '',
  address: '',
  state: '',
  local_gov: '',
  employee_id: '',
  date_of_employment: '',
  salary: '',
  employment_type: '',
  qualifications: '',
  qualification_title: '',
  institution: '',
  year_obtained: '',
  year_of_experience: '',
  specializations: '',
  emergency_contact_name: '',
  emergency_contact: '',
  emergency_contact_relation: '',
  current_password: '',
  new_password: '',
});

const getInitials = (name) => {
  if (!name) return 'U';
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const formatDate = (date) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const loadUserData = () => {
  formData.value = {
    full_name: user.value.full_name || '',
    email: user.value.email || '',
    phone_number: user.value.phone_number || '',
    gender: user.value.gender || '',
    date_of_birth: user.value.date_of_birth || '',
    address: user.value.address || '',
    state: user.value.state || '',
    local_gov: user.value.local_gov || '',
    employee_id: user.value.employee_id || '',
    date_of_employment: user.value.date_of_employment || '',
    salary: user.value.salary || '',
    employment_type: user.value.employment_type || '',
    qualifications: user.value.qualifications || '',
    qualification_title: user.value.qualification_title || '',
    institution: user.value.institution || '',
    year_obtained: user.value.year_obtained || '',
    year_of_experience: user.value.year_of_experience || '',
    specializations: user.value.specializations || '',
    emergency_contact_name: user.value.emergency_contact_name || '',
    emergency_contact: user.value.emergency_contact || '',
    emergency_contact_relation: user.value.emergency_contact_relation || '',
    current_password: '',
    new_password: '',
  };
};

const enableEdit = () => {
  isEditing.value = true;
};

const cancelEdit = () => {
  isEditing.value = false;
  loadUserData();
  formData.value.current_password = '';
  formData.value.new_password = '';
};

const handleSubmit = async () => {
  loading.value = true;

  try {
    // TODO: Replace with actual API call
    // await apiServices.updateProfile(formData.value);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Update local store
    loginStore.updateUser({
      ...user.value,
      full_name: formData.value.full_name,
      email: formData.value.email,
      phone_number: formData.value.phone_number,
      gender: formData.value.gender,
      date_of_birth: formData.value.date_of_birth,
      address: formData.value.address,
      state: formData.value.state,
      local_gov: formData.value.local_gov,
      qualifications: formData.value.qualifications,
      qualification_title: formData.value.qualification_title,
      institution: formData.value.institution,
      year_obtained: formData.value.year_obtained,
      year_of_experience: formData.value.year_of_experience,
      specializations: formData.value.specializations,
      emergency_contact_name: formData.value.emergency_contact_name,
      emergency_contact: formData.value.emergency_contact,
      emergency_contact_relation: formData.value.emergency_contact_relation,
    });

    toast.success(
      'Profile Updated',
      'Your profile has been updated successfully.'
    );

    isEditing.value = false;
    formData.value.current_password = '';
    formData.value.new_password = '';
  } catch (error) {
    toast.error(
      'Update Failed',
      error.message || 'Failed to update profile. Please try again.'
    );
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadUserData();
});
</script>

<style scoped>
.profile-container {
  display: grid;
  gap: 24px;
  max-width: 1200px;
}

.profile-header-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  padding: 32px;
  color: white;
  box-shadow: 0 8px 32px rgba(102, 126, 234, 0.3);
}

.profile-avatar-section {
  display: flex;
  align-items: center;
  gap: 24px;
}

.profile-avatar-large {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  font-weight: 700;
  color: white;
  border: 4px solid rgba(255, 255, 255, 0.3);
}

.profile-header-info h2 {
  font-size: 28px;
  font-weight: 700;
  margin: 0 0 8px 0;
}

.profile-role {
  font-size: 16px;
  opacity: 0.9;
  margin: 0 0 12px 0;
}

.profile-form-card,
.profile-info-card {
  background: white;
  border-radius: 12px;
  padding: 28px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 2px solid rgba(102, 126, 234, 0.1);
}

.card-header h3 {
  font-size: 20px;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.btn-edit {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.btn-edit:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.profile-form {
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #475569;
  margin-bottom: 18px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(102, 126, 234, 0.1);
}

.form-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-input:disabled,
.form-select:disabled,
.form-textarea:disabled {
  background: #f8fafc;
  cursor: not-allowed;
  opacity: 0.7;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.info-label {
  font-size: 13px;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-value {
  font-size: 15px;
  font-weight: 500;
  color: #1e293b;
}

@media (max-width: 768px) {
  .profile-avatar-section {
    flex-direction: column;
    text-align: center;
  }

  .profile-avatar-large {
    width: 80px;
    height: 80px;
    font-size: 28px;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .card-header {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }
}
</style>
