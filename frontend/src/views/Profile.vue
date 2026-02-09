<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1>My Profile</h1>
        <p>View your personal and professional information</p>
      </div>
    </div>

    <div class="profile-container">
      <!-- Profile Header Card -->
      <div class="profile-header-card">
        <div class="profile-avatar-section">
          <div class="profile-avatar-large">
            {{ getInitials(staffMember.full_name) }}
          </div>
          <div class="profile-header-info">
            <h2>{{ user.full_name || "User Name" }}</h2>
            <p class="mb-0 status-badge status-active">{{ staffMember.Role?.role_name || "User" }}</p>
          </div>
        </div>
        <div class="profile-stats">
          <div class="stat-item">
            <span class="stat-value">{{
              formatDate(staffMember.date_of_employment)
            }}</span>
            <span class="stat-label">Employment Date</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{
              staffMember.year_of_experience || "N/A"
            }}</span>
            <span class="stat-label">Years Experience</span>
          </div>
        </div>
      </div>

      <div class="profile-content">
        <!-- Personal Information Card -->
        <div class="info-card">
          <div class="card-header">
            <h3>Personal Information</h3>
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
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">Full Name</span>
              <span class="info-value">{{ staffMember.full_name || "N/A" }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Email Address</span>
              <span class="info-value">{{ staffMember.email || "N/A" }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Phone Number</span>
              <span class="info-value">{{ staffMember.phone_number || "N/A" }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Gender</span>
              <span class="info-value capitalize">{{
                staffMember.gender || "N/A"
              }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Date of Birth</span>
              <span class="info-value">{{
                formatDate(staffMember.date_of_birth)
              }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Employee ID</span>
              <span class="info-value">{{ staffMember.employee_id || "N/A" }}</span>
            </div>
            <div class="info-item full-width">
              <span class="info-label">Address</span>
              <span class="info-value">{{ staffMember.address || "N/A" }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">State</span>
              <span class="info-value text-capitalize">{{ staffMember.state || "N/A" }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Local Government</span>
              <span class="info-value text-capitalize">{{ staffMember.local_gov || "N/A" }}</span>
            </div>
          </div>
        </div>

        <!-- Employment Information Card -->
        <div class="info-card">
          <div class="card-header">
            <h3>Employment Information</h3>
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
                d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6z"
              />
            </svg>
          </div>
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">Role</span>
              <span class="info-value">{{
                staffMember.Role?.role_name || "N/A"
              }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Employment Type</span>
              <span class="info-value capitalize">{{
                staffMember.employment_type || "N/A"
              }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Date of Employment</span>
              <span class="info-value">{{
                formatDate(staffMember.date_of_employment)
              }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Years of Experience</span>
              <span class="info-value">{{
                staffMember.year_of_experience || "N/A"
              }}</span>
            </div>
            <div class="info-item full-width">
              <span class="info-label">Specializations</span>
              <span class="info-value">{{
                staffMember.specializations || "N/A"
              }}</span>
            </div>
          </div>
        </div>

        <!-- Qualifications Card -->
        <div class="info-card">
          <div class="card-header">
            <h3>Qualifications & Education</h3>
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
                d="M12 14l9-5-9-5-9 5 9 5z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
              />
            </svg>
          </div>
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">Highest Qualification</span>
              <span class="info-value">{{ staffMember.qualifications || "N/A" }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Qualification Title</span>
              <span class="info-value">{{
                staffMember.qualification_title || "N/A"
              }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Institution</span>
              <span class="info-value">{{ staffMember.institution || "N/A" }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Year Obtained</span>
              <span class="info-value">{{ staffMember.year_obtained || "N/A" }}</span>
            </div>
          </div>
        </div>

        <!-- Emergency Contact Card -->
        <div class="info-card">
          <div class="card-header">
            <h3>Emergency Contact</h3>
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
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
          </div>
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">Contact Name</span>
              <span class="info-value">{{
                staffMember.emergency_contact_name || "N/A"
              }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Contact Number</span>
              <span class="info-value">{{
                staffMember.emergency_contact || "N/A"
              }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Relationship</span>
              <span class="info-value capitalize">{{
                staffMember.emergency_contact_relation || "N/A"
              }}</span>
            </div>
          </div>
        </div>

        <!-- Account Information Card -->
        <div class="info-card">
          <div class="card-header">
            <h3>Account Information</h3>
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
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          </div>
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">Account Status</span>
              <span class="info-value">
                <span class="status-badge status-active">Active</span>
              </span>
            </div>
            <div class="info-item">
              <span class="info-label">Member Since</span>
              <span class="info-value">{{ formatDate(staffMember.createdAt) }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Last Updated</span>
              <span class="info-value">{{ formatDate(staffMember.updatedAt) }}</span>
            </div>
         
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useLoginStore } from "../store/loginStore";
import apiServices from "../services/apiServices";
import { useToast } from "../composables/useToast";

const loginStore = useLoginStore();
const toast = useToast()
const user = computed(() => loginStore.user || {});
const staffMember = ref({})
const loading = ref(false)

const getInitials = (name) => {
  if (!name) return "U";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

const formatDate = (date) => {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

  const getStaffById = () => {
  loading.value = true;
  return apiServices
    .getStaffProfile(user.value.id)
    .then((response) => {
      // The array of roles is inside response.data.data
      staffMember.value = response.data.data || {};

      // Format salary for display
      // if (staffMember.value.salary) {
      //   displaySalary.value = formatNumber(staffMember.value.salary.toString());
      // }

  
      
    })
    .catch((error) => {
      console.error("Error fetching staff:", error);
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
onMounted(()=>{
  getStaffById()
})
</script>

<style scoped>
.profile-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-width: 1200px;
}

.profile-header-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  padding: 32px;
  color: white;
  box-shadow: 0 10px 40px rgba(102, 126, 234, 0.3);
  display: flex;
  justify-content: space-between;
  align-items: center;
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

.profile-badges {
  display: flex;
  gap: 12px;
  align-items: center;
}

.role-badge {
  background: rgba(255, 255, 255, 0.2);
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  backdrop-filter: blur(10px);
}

.profile-stats {
  display: flex;
  gap: 32px;
}

.stat-item {
  text-align: center;
}

.stat-value {
  display: block;
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 12px;
  opacity: 0.8;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.profile-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 24px;
}

.info-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(102, 126, 234, 0.1);
  transition: all 0.3s ease;
}

.info-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 2px solid rgba(102, 126, 234, 0.1);
}

.card-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.card-header svg {
  color: #667eea;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.info-item.full-width {
  grid-column: 1 / -1;
}

.info-label {
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-value {
  font-size: 14px;
  font-weight: 500;
  color: #1e293b;
  word-break: break-word;
}

.capitalize {
  text-transform: capitalize;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-active {
  background-color: #d1fae5;
  color: #065f46;
}

.access-badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.access-granted {
  background-color: #dbeafe;
  color: #1e40af;
}

.access-limited {
  background-color: #fef3c7;
  color: #92400e;
}

@media (max-width: 1024px) {
  .profile-content {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .profile-header-card {
    flex-direction: column;
    gap: 24px;
    text-align: center;
  }

  .profile-avatar-section {
    flex-direction: column;
    text-align: center;
  }

  .profile-avatar-large {
    width: 80px;
    height: 80px;
    font-size: 28px;
  }

  .profile-stats {
    justify-content: center;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .profile-content {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .profile-header-card {
    padding: 20px;
  }

  .info-card {
    padding: 16px;
  }

  .profile-stats {
    gap: 20px;
  }
}
</style>
