<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1>Staff Profile</h1>
        <p>View detailed staff information</p>
      </div>
      <div class="header-actions">
        <button @click="downloadPDF" class="add-btn" style="margin-right: 10px">
          <i class="fa fa-download"></i>
          Download PDF
        </button>
        <button @click="$router.go(-1)" class="add-btn">
          <i class="fa fa-arrow-left"></i>
          Back to Staff
        </button>
      </div>
    </div>

    <pre>{{}}</pre>

    <div class="profile-layout">
      <!-- Left Sidebar -->
      <div class="profile-sidebar">
        <div class="sidebar-card">
          <div class="profile-avatar-section">
            <div class="avatar-large">
              <span class="avatar-initials">{{
                getInitials(staffData.full_name)
              }}</span>
            </div>
            <span
              :class="['status-dot', staffData.status ? 'active' : 'inactive']"
            ></span>
          </div>

          <div class="profile-name-section">
            <h2 class="staff-name">{{ staffData.full_name }}</h2>
            <p class="staff-role">{{ staffData.Role?.role_name }}</p>
            <span class="staff-id">{{ staffData.employee_id }}</span>
          </div>

          <div class="basic-info-section">
            <h3 class="section-heading">Basic Information</h3>

            <div class="info-item">
              <i class="fa fa-envelope info-icon"></i>
              <div class="info-details">
                <span class="info-label">Email</span>
                <span class="info-text">{{ staffData.email }}</span>
              </div>
            </div>

            <div class="info-item">
              <i class="fa fa-phone info-icon"></i>
              <div class="info-details">
                <span class="info-label">Mobile Phone</span>
                <span class="info-text">{{ staffData.phone_number }}</span>
              </div>
            </div>

            <div class="info-item">
              <i class="fa fa-map-marker info-icon"></i>
              <div class="info-details">
                <span class="info-label">State</span>
                <span class="info-text">{{ staffData.state }}</span>
              </div>
            </div>

            <div class="info-item">
              <i class="fa fa-venus-mars info-icon"></i>
              <div class="info-details">
                <span class="info-label">Gender</span>
                <span class="info-text">{{ staffData.gender }}</span>
              </div>
            </div>

            <div class="info-item">
              <i class="fa fa-calendar info-icon"></i>
              <div class="info-details">
                <span class="info-label">Date of Birth</span>
                <span class="info-text">{{ staffData.date_of_birth }}</span>
              </div>
            </div>

            <div class="info-item">
              <i class="fa fa-briefcase info-icon"></i>
              <div class="info-details">
                <span class="info-label">Employment Type</span>
                <span class="info-text">{{ staffData.employment_type }}</span>
              </div>
            </div>

            <div class="info-item info-item-with-toggle">
              <i class="fa fa-circle info-icon"></i>
              <div class="info-details">
                <span class="info-label">Staff Status</span>
                <span
                  :class="[
                    'status-badge',
                    staffData.status ? 'active' : 'inactive',
                  ]"
                >
                  {{ staffData.status ? "Active" : "Inactive" }}
                </span>
              </div>
              <label class="toggle-switch-small">
                <input
                  type="checkbox"
                  :disabled="loading"
                  v-model="staffData.status"
                  @change="toggleStatus()"
                />
                <span class="toggle-slider-small"></span>
              </label>
            </div>

            <div class="info-item info-item-with-toggle">
              <i class="fa fa-circle info-icon"></i>
              <div class="info-details">
                <span class="info-label">Account Status</span>
                <span
                  :class="[
                    'status-badge',
                    staffData.has_school_access ? 'active' : 'inactive',
                  ]"
                >
                  {{ staffData.has_school_access ? "Active" : "Blocked" }}
                </span>
              </div>
              <label class="toggle-switch-small">
                <input
                  type="checkbox"
                  :disabled="loading"
                  v-model="staffData.has_school_access"
                  @change="toggleAccount()"
                />
                <span class="toggle-slider-small"></span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Content Area -->
      <div class="profile-content">
        <!-- Tab Navigation -->
        <div class="tab-navigation">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            :class="['tab-btn', { active: activeTab === tab.id }]"
            @click="activeTab = tab.id"
          >
            {{ tab.label }}
          </button>
        </div>

        <!-- Tab Content -->
        <div class="tab-content-area">
          <!-- Personal Information Tab -->
          <div v-if="activeTab === 'personal'">
            <!-- Professional Information -->
            <div class="info-card">
              <div class="info-card-header">
                <i class="fa fa-briefcase"></i>
                <h3>Professional Information</h3>
                <button class="edit-btn" @click="editStaff">
                  <i class="fa fa-edit"></i>
                </button>
              </div>
              <div class="info-grid">
                <div class="grid-item">
                  <span class="grid-label">Employee ID</span>
                  <span class="grid-value">{{ staffData.employee_id }}</span>
                </div>
                <div class="grid-item">
                  <span class="grid-label">Role</span>
                  <span class="grid-value">{{
                    staffData.Role?.role_name
                  }}</span>
                </div>
                <div class="grid-item">
                  <span class="grid-label">Date of Employment</span>
                  <span class="grid-value">{{
                    staffData.date_of_employment
                  }}</span>
                </div>
                <div class="grid-item">
                  <span class="grid-label">Salary</span>
                  <span class="grid-value"
                    >₦{{ formatNumber(staffData.salary) }}</span
                  >
                </div>
                <div class="grid-item full-width">
                  <span class="grid-label">Sections</span>
                  <div class="sections-container">
                    <span
                      class="section-badge"
                      v-for="(section, index) in staffData.sections"
                      :key="index"
                      :title="section.section_name"
                      >{{ section.section_name }}</span
                    >
                  </div>
                </div>
                <div class="grid-item">
                  <span class="grid-label">Employment Type</span>
                  <span class="grid-value">{{
                    staffData.employment_type
                  }}</span>
                </div>
              </div>
            </div>

            <!-- Home Address -->
            <div class="info-card">
              <div class="info-card-header">
                <i class="fa fa-home"></i>
                <h3>Home Address</h3>
                <button class="edit-btn" @click="editStaff">
                  <i class="fa fa-edit"></i>
                </button>
              </div>
              <div class="info-grid">
                <div class="grid-item">
                  <span class="grid-label">Address</span>
                  <span class="grid-value">{{ staffData.address }}</span>
                </div>
                <div class="grid-item">
                  <span class="grid-label">City</span>
                  <span class="grid-value">{{ staffData.local_gov }}</span>
                </div>
                <div class="grid-item">
                  <span class="grid-label">State</span>
                  <span class="grid-value">{{ staffData.state }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Qualifications Tab -->
          <div v-if="activeTab === 'qualifications'">
            <div class="info-card">
              <div class="info-card-header">
                <i class="fa fa-graduation-cap"></i>
                <h3>Education & Qualifications</h3>
                <button class="edit-btn" @click="editStaff">
                  <i class="fa fa-edit"></i>
                </button>
              </div>
              <div class="info-grid">
                <div class="grid-item">
                  <span class="grid-label">Highest Qualification</span>
                  <span class="grid-value">{{ staffData.qualifications }}</span>
                </div>
                <div class="grid-item">
                  <span class="grid-label">Qualification Title</span>
                  <span class="grid-value">{{
                    staffData.qualification_title
                  }}</span>
                </div>
                <div class="grid-item">
                  <span class="grid-label">Institution</span>
                  <span class="grid-value">{{ staffData.institution }}</span>
                </div>
                <div class="grid-item">
                  <span class="grid-label">Year Obtained</span>
                  <span class="grid-value">{{ staffData.year_obtained }}</span>
                </div>
                <div class="grid-item">
                  <span class="grid-label">Years of Experience</span>
                  <span class="grid-value">{{
                    staffData.year_of_experience
                  }}</span>
                </div>
                <div class="grid-item full-width">
                  <span class="grid-label">Specializations</span>
                  <span class="grid-value">{{
                    staffData.specializations
                  }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Emergency Contact Tab -->
          <div v-if="activeTab === 'emergency'">
            <div class="info-card">
              <div class="info-card-header">
                <i class="fa fa-phone"></i>
                <h3>Emergency Contact</h3>
                <button class="edit-btn" @click="editStaff">
                  <i class="fa fa-edit"></i>
                </button>
              </div>
              <div class="info-grid">
                <div class="grid-item">
                  <span class="grid-label">Contact Name</span>
                  <span class="grid-value">{{
                    staffData.emergency_contact_name
                  }}</span>
                </div>
                <div class="grid-item">
                  <span class="grid-label">Contact Number</span>
                  <span class="grid-value">{{
                    staffData.emergency_contact
                  }}</span>
                </div>
                <div class="grid-item">
                  <span class="grid-label">Relationship</span>
                  <span class="grid-value">{{
                    staffData.emergency_contact_relation
                  }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import apiServices from "../../services/apiServices";
import { useToast } from "../../composables/useToast";
import { generateStaffProfilePDF } from "../../PDF/staffProfilePDF";

const toast = useToast();
const router = useRouter();
const route = useRoute();

const activeTab = ref("personal");

const tabs = [
  { id: "personal", label: "Personal Information" },
  { id: "qualifications", label: "Qualifications" },
  { id: "emergency", label: "Emergency Contact" },
];

const formatNumber = (num) => {
  return new Intl.NumberFormat("en-NG").format(num);
};

const editStaff = () => {
  router.push(`/staff/update/${route.params.id}`);
};


const getInitials = (name) => {
  if (!name) return "?";
  const names = name.split(" ");
  if (names.length >= 2) {
    return (names[0][0] + names[names.length - 1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

const staffData = ref({});
const loading = ref(false);

const getStaffProfile = () => {
  loading.value = true;
  apiServices
    .getStaffProfile(route.params.id)
    .then((response) => {
      // The array of roles is inside response.data.data
      staffData.value = response.data.data || {};
    })
    .catch((error) => {
      console.error("Error fetching roles:", error);
      toast.error(
        "Failed to get the Staff",
        error.response?.data?.message ||
          "An error occurred while getting the staff. Please try again."
      );
      if (error.response?.status == 404) {
        router.push("/staff");
      }
    })
    .finally(() => {
      loading.value = false;
    });
};

const toggleAccount = () => {
  loading.value = true;
  apiServices
    .toggleAccount(route.params.id)
    .then((response) => {
      if (response.status === 200) {
        const message =
          response.data?.message || "Account access updated successfully";
        toast.success("Success", message);

        // Update the local data with the response
        if (response.data?.data) {
          staffData.value.has_school_access =
            response.data.data.has_school_access;
        }
      }
    })
    .catch((error) => {
      console.error("Error toggling account access:", error);

      // Revert the toggle on error
      staffData.value.has_school_access = !staffData.value.has_school_access;

      toast.error(
        "Failed to update access",
        error.response?.data?.message ||
          "An error occurred while updating account access. Please try again."
      );
    })
    .finally(() => {
      loading.value = false;
    });
};

const toggleStatus = () => {
  loading.value = true;
  apiServices
    .toggleStaffStatus(route.params.id)
    .then((response) => {
      if (response.status === 200) {
        const message =
          response.data?.message || "Staff status updated successfully";
        toast.success("Success", message);

        // Update the local data with the response
        if (response.data?.data) {
          staffData.value.status = response.data.data.status;
          staffData.value.has_school_access = response.data.data.has_school_access;
        }
      }
    })
    .catch((error) => {
      console.error("Error toggling staff status:", error);

      // Revert the toggle on error
      staffData.value.status = !staffData.value.status;

      toast.error(
        "Failed to update status",
        error.response?.data?.message ||
          "An error occurred while updating staff status. Please try again."
      );
    })
    .finally(() => {
      loading.value = false;
    });
};

const downloadPDF = () => {
  if (!staffData.value || !staffData.value.id) {
    toast.error("Error", "Staff data not available");
    return;
  }
  generateStaffProfilePDF(staffData.value);
};

onMounted(() => {
  getStaffProfile();
});
</script>

<style scoped>
.header-actions {
  display: flex;
  gap: 10px;
  align-items: center;
}

.profile-layout {
  display: grid;
  grid-template-columns: 380px 1fr;
  gap: 2rem;
  max-width: 1600px;
  margin: 0 auto;
}

/* Left Sidebar */
.profile-sidebar {
  position: sticky;
  top: 2rem;
  height: fit-content;
}

.sidebar-card {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.profile-avatar-section {
  position: relative;
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.avatar-large {
  width: 140px;
  height: 140px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);
  position: relative;
  overflow: hidden;
}

.avatar-large::before {
  content: "";
  position: absolute;
  top: -50%;
  right: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(
    circle,
    rgba(255, 255, 255, 0.1) 0%,
    transparent 70%
  );
  animation: shimmer 3s infinite;
}

@keyframes shimmer {
  0%,
  100% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(180deg);
  }
}

.avatar-initials {
  font-size: 3rem;
  font-weight: 700;
  letter-spacing: 2px;
  z-index: 1;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.status-dot {
  position: absolute;
  bottom: 8px;
  right: calc(50% - 70px);
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 4px solid white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.status-dot.active {
  background-color: #10b981;
  animation: pulse-glow 2s infinite;
}

.status-dot.inactive {
  background-color: #ef4444;
}

@keyframes pulse-glow {
  0%,
  100% {
    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7), 0 2px 8px rgba(0, 0, 0, 0.2);
  }
  50% {
    box-shadow: 0 0 0 8px rgba(16, 185, 129, 0), 0 2px 8px rgba(0, 0, 0, 0.2);
  }
}

.profile-name-section {
  text-align: center;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 1.5rem;
}

.staff-name {
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 0.5rem 0;
}

.staff-role {
  font-size: 1rem;
  color: #667eea;
  margin: 0 0 0.5rem 0;
  font-weight: 500;
}

.staff-id {
  display: inline-block;
  font-size: 0.875rem;
  color: #6b7280;
  background: #f3f4f6;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
}

.section-heading {
  font-size: 0.875rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 1rem 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-item {
  display: flex;
  gap: 1rem;
  padding: 0.875rem 0;
  border-bottom: 1px solid #f3f4f6;
}

.info-item:last-child {
  border-bottom: none;
}

.info-icon {
  width: 20px;
  color: #9ca3af;
  font-size: 1rem;
  flex-shrink: 0;
  margin-top: 0.25rem;
}

.info-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.info-label {
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: 500;
}

.info-text {
  font-size: 0.875rem;
  color: #111827;
  font-weight: 500;
}

.status-badge {
  display: inline-block;
  padding: 0.25rem 0.625rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.status-badge.active {
  background: #d1fae5;
  color: #065f46;
}

.status-badge.inactive {
  background: #fee2e2;
  color: #991b1b;
}

/* Right Content Area */
.profile-content {
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.tab-navigation {
  display: flex;
  gap: 0.5rem;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #e5e7eb;
  overflow-x: auto;
}

.tab-btn {
  padding: 0.625rem 1.25rem;
  border: 1px solid #d1d5db;
  background: white;
  color: #374151;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.2s;
  white-space: nowrap;
}

.tab-btn:hover {
  background: #f3f4f6;
  border-color: #9ca3af;
}

.tab-btn.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-color: #667eea;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.tab-content-area {
  padding: 2rem;
}

.info-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  margin-bottom: 1.5rem;
  overflow: hidden;
}

.info-card-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1.25rem 1.5rem;
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
}

.info-card-header i {
  color: #667eea;
  font-size: 1.125rem;
}

.info-card-header h3 {
  flex: 1;
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.edit-btn {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #6b7280;
  transition: all 0.2s;
}

.edit-btn:hover {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  padding: 1.5rem;
}

.grid-item {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.grid-item.full-width {
  grid-column: 1 / -1;
}

.grid-label {
  font-size: 0.8125rem;
  color: #6b7280;
  font-weight: 500;
}

.grid-value {
  font-size: 0.9375rem;
  color: #111827;
  font-weight: 600;
}

/* Sections Container */
.sections-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.25rem;
}

.section-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 0.875rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-size: 0.8125rem;
  font-weight: 600;
  border-radius: 8px;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  box-shadow: 0 2px 4px rgba(102, 126, 234, 0.2);
  transition: all 0.2s;
  cursor: default;
}

.section-badge:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(102, 126, 234, 0.3);
  max-width: none;
  white-space: normal;
  word-break: break-word;
}

/* Access Grid */
.access-grid {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.access-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem;
  background: #f9fafb;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
}

.access-label {
  display: block;
  font-size: 0.9375rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 0.25rem;
}

.access-desc {
  display: block;
  font-size: 0.8125rem;
  color: #6b7280;
}

/* Toggle Switch */
.toggle-switch {
  position: relative;
  display: inline-block;
  width: 52px;
  height: 28px;
  cursor: pointer;
  flex-shrink: 0;
}

.toggle-switch input[type="checkbox"] {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #cbd5e1;
  border-radius: 28px;
  transition: all 0.3s;
}

.toggle-slider::before {
  content: "";
  position: absolute;
  height: 22px;
  width: 22px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  border-radius: 50%;
  transition: all 0.3s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.toggle-switch input[type="checkbox"]:checked + .toggle-slider {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.toggle-switch input[type="checkbox"]:checked + .toggle-slider::before {
  transform: translateX(24px);
}

/* Small Toggle Switch for Sidebar */
.info-item-with-toggle {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.info-item-with-toggle .info-details {
  flex: 1;
}

.toggle-switch-small {
  position: relative;
  display: inline-block;
  width: 40px;
  height: 22px;
  cursor: pointer;
  flex-shrink: 0;
  margin-top: 20px;
}

.toggle-switch-small input[type="checkbox"] {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider-small {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #cbd5e1;
  border-radius: 22px;
  transition: all 0.3s;
}

.toggle-slider-small::before {
  content: "";
  position: absolute;
  height: 16px;
  width: 16px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  border-radius: 50%;
  transition: all 0.3s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.toggle-switch-small input[type="checkbox"]:checked + .toggle-slider-small {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.toggle-switch-small
  input[type="checkbox"]:checked
  + .toggle-slider-small::before {
  transform: translateX(18px);
}

/* Responsive */
@media (max-width: 1024px) {
  .profile-layout {
    grid-template-columns: 1fr;
  }

  .profile-sidebar {
    position: relative;
    top: 0;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .tab-content-area {
    padding: 1rem;
  }

  .info-card-header {
    padding: 1rem;
  }

  .info-grid {
    padding: 1rem;
    gap: 1rem;
  }
}
</style>
