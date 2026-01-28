<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1>Configuration</h1>
        <p>Manage student grades and academic performance</p>
      </div>
    </div>

    <div class="configuration-container p-5 rounded-lg bg-white">
      <!-- Sidebar Navigation -->
      <div class="config-sidebar">
        <nav class="config-nav">
          <button v-for="tab in configTabs" :key="tab.id" @click="activeTab = tab.id" class="config-nav-item"
            :class="{ active: activeTab === tab.id }">
            <svg class="config-nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="tab.icon" />
            </svg>
            <span>{{ tab.label }}</span>
          </button>
        </nav>
      </div>

      <!-- Main Content Area -->
      <div class="config-content">
        <!-- General Settings -->
        <div v-if="activeTab === 'sections'" class="config-section">
          <div class="d-flex align-items-center justify-content-between">
            <h2 class="section-title">School Sections</h2>
          </div>
          <AllSection />
        </div>

        <!-- Security Settings -->
        <div v-if="activeTab === 'sessions'" class="config-section">
          <h2 class="section-title">School Sessions</h2>
          <AllSession />
        </div>

        <!-- Email Settings -->
        <div v-if="activeTab === 'email'" class="config-section">
          <h2 class="section-title">School Terms</h2>
          <AllTerms />
        </div>

        <!-- Notifications Settings -->
        <div v-if="activeTab === 'notifications'" class="config-section">
          <h2 class="section-title">School Grading System</h2>

          <AllGrade />
        </div>

        <!-- Notifications Settings -->
        <div v-if="activeTab === 'caConfig'" class="config-section">
          <h2 class="section-title">CA Config</h2>

          <CaConfig />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import AllSection from "./configuartion/sections/AllSection.vue";
import AllSession from "./configuartion/sessions/AllSession.vue";
import AllTerms from "./configuartion/terms/AllTerms.vue";
import AllGrade from "./configuartion/grades/AllGrade.vue";
import CaConfig from "./caConfig/CaConfig.vue";

const activeTab = ref("sections");
const isSaving = ref(false);

const configTabs = [
  {
    id: "sections",
    label: "Sections",
    icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10",
  },
  {
    id: "sessions",
    label: "Session",
    icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
  },
  {
    id: "email",
    label: "Terms",
    icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
  },
  {
    id: "notifications",
    label: "Grade Systems",
    icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4",
  },
  // {
  //   id: "caConfig",
  //   label: "CA Config",
  //   icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4",
  // },
];

const settings = reactive({
  general: {
    schoolName: "Springfield Elementary School",
    schoolAddress: "123 Education Street\nSpringfield, ST 12345",
    phoneNumber: "+1 (555) 123-4567",
    email: "admin@springfield-elementary.edu",
    academicYear: "2024-2025",
  },
  security: {
    requireUppercase: true,
    requireNumbers: true,
    requireSpecialChars: false,
    minPasswordLength: 8,
    sessionTimeout: 60,
  },
  email: {
    smtpServer: "smtp.gmail.com",
    smtpPort: 587,
    encryption: "tls",
    username: "",
    password: "",
  },
  notifications: {
    newStudentRegistration: true,
    attendanceAlerts: true,
    gradeUpdates: false,
    systemAlerts: true,
  },
  backup: {
    autoBackup: true,
    frequency: "weekly",
  },
  advanced: {
    language: "en",
    dateFormat: "MM/DD/YYYY",
    timezone: "America/New_York",
  },
});

const saveSettings = async () => {
  isSaving.value = true;
  try {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Settings saved:", settings);
    // Show success message
  } catch (error) {
    console.error("Error saving settings:", error);
  } finally {
    isSaving.value = false;
  }
};

const resetForm = () => {
  // Reset to default values
  console.log("Form reset");
};

const testEmailConnection = async () => {
  console.log("Testing email connection...");
  // Implement email test
};

const createBackup = async () => {
  console.log("Creating backup...");
  // Implement backup creation
};

const restoreBackup = async () => {
  console.log("Restoring backup...");
  // Implement backup restoration
};

const resetSettings = async () => {
  if (
    confirm(
      "Are you sure you want to reset all settings? This action cannot be undone."
    )
  ) {
    console.log("Resetting all settings...");
    // Implement settings reset
  }
};

const clearAllData = async () => {
  if (
    confirm(
      "Are you sure you want to clear all data? This action cannot be undone and will delete all records."
    )
  ) {
    console.log("Clearing all data...");
    // Implement data clearing
  }
};
</script>
<style scoped>
.configuration-container {
  display: grid;
  grid-template-columns: 280px 1fr;
  grid-template-areas: "sidebar content";
  /* max-width: 1200px; */
  /* margin: 0 auto; */
  gap: 2rem;
  padding: 0 2rem 2rem;
  background: white;
  border-radius: 0 0 20px 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  margin-top: 0;
}

/* Sidebar Styles */
.config-sidebar {
  grid-area: sidebar;
  width: 280px;
}

.config-nav {
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  overflow: hidden;
  border: 1px solid #e2e8f0;
}

.config-nav-item {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 1rem 1.5rem;
  border: none;
  background: white;
  color: #64748b;
  font-size: 0.95rem;
  font-weight: 500;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s ease;
  border-bottom: 1px solid #f1f5f9;
}

.config-nav-item:last-child {
  border-bottom: none;
}

.config-nav-item:hover {
  background-color: #f8fafc;
  color: #475569;
}

.config-nav-item.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.config-nav-item.active .config-nav-icon {
  color: white;
}

.config-nav-icon {
  width: 20px;
  height: 20px;
  margin-right: 0.75rem;
  color: #94a3b8;
  transition: color 0.2s ease;
}

.config-nav-item:hover .config-nav-icon {
  color: #64748b;
}

/* Content Area Styles */
.config-content {
  grid-area: content;
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
  overflow: hidden;
}

.config-section {
  padding: 2rem;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a202c;
  margin: 0 0 2rem 0;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f1f5f9;
}

/* Form Styles */
.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  font-size: 0.9rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
}

.form-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.95rem;
  transition: all 0.2s ease;
  background-color: white;
}

.form-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-input:hover {
  border-color: #d1d5db;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

/* Checkbox Styles */
.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.permission-checkbox {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 6px;
  transition: background-color 0.2s ease;
}

.permission-checkbox:hover {
  background-color: #f8fafc;
}

.permission-checkbox input[type="checkbox"] {
  margin: 0;
  margin-right: 0.75rem;
  width: 18px;
  height: 18px;
  accent-color: #3b82f6;
  cursor: pointer;
}

.permission-label {
  font-size: 0.9rem;
  color: #374151;
  font-weight: 500;
}

/* Button Styles */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  gap: 0.5rem;
}

.btn-primary {
  background-color: #3b82f6;
  color: white;
}

.btn-primary:hover {
  background-color: #2563eb;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.btn-secondary {
  background-color: #6b7280;
  color: white;
}

.btn-secondary:hover {
  background-color: #4b5563;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(107, 114, 128, 0.3);
}

.btn-submit {
  background-color: #10b981;
  color: white;
}

.btn-submit:hover:not(:disabled) {
  background-color: #059669;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.btn-cancel {
  background-color: #f3f4f6;
  color: #374151;
  border: 2px solid #e5e7eb;
}

.btn-cancel:hover {
  background-color: #e5e7eb;
  border-color: #d1d5db;
}

.btn-danger {
  background-color: #ef4444;
  color: white;
}

.btn-danger:hover {
  background-color: #dc2626;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}

/* Backup Actions */
.backup-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
}

/* Danger Zone */
.danger-zone {
  margin-top: 3rem;
  padding: 1.5rem;
  background-color: #fef2f2;
  border: 2px solid #fecaca;
  border-radius: 8px;
}

.danger-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #dc2626;
  margin: 0 0 0.5rem 0;
}

.danger-description {
  color: #7f1d1d;
  margin: 0 0 1rem 0;
  font-size: 0.9rem;
}

.danger-actions {
  display: flex;
  gap: 1rem;
}

/* Config Actions */
.config-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1.5rem 2rem;
  background-color: #f8fafc;
  border-top: 1px solid #e2e8f0;
}

/* Spinner */
.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Responsive Design */

@media (max-width: 768px) {
  .configuration-container {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    padding: 1.5rem 1rem;
    margin: 1rem;
    border-radius: 16px;
    background: white;
  }

  /* Stack tabs above content */
  .config-sidebar {
    width: 100%;
    order: 1;
  }

  .config-content {
    order: 2;
    border-radius: 12px;
  }

  /* Tabs layout on mobile */
  .config-nav {
    display: flex;
    flex-wrap: wrap;
    /* allow wrapping to multiple rows */
    justify-content: flex-start;
    gap: 0.5rem;
    background: #f8fafc;
    border-radius: 12px;
    padding: 0.5rem;
    border: 1px solid #e2e8f0;
  }

  .config-nav-item {
    flex: 1 1 48%;
    /* make two per row */
    text-align: center;
    justify-content: center;
    padding: 0.75rem;
    border-bottom: none;
    border: 1px solid #f1f5f9;
    border-radius: 8px;
  }

  .config-nav-item.active {
    border-color: #667eea;
  }

  /* Adjust icon and label spacing */
  .config-nav-icon {
    margin-right: 0.5rem;
  }

  .config-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .backup-actions,
  .danger-actions {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .page-header {
    padding: 1.5rem 1rem;
  }

  .page-title {
    font-size: 1.75rem;
  }

  .page-description {
    font-size: 0.95rem;
  }

  .config-nav {
    padding: 0.25rem;
    gap: 0.25rem;
  }

  .config-nav-item {
    padding: 0.5rem 0.75rem;
    min-width: 80px;
  }

  .config-nav-item span {
    font-size: 0.8rem;
  }

  .config-nav-icon {
    width: 14px;
    height: 14px;
    margin-right: 0.25rem;
  }

  .config-section {
    padding: 1rem;
  }

  .section-title {
    font-size: 1.125rem;
  }

  .form-input,
  .form-select,
  .form-textarea {
    padding: 0.625rem;
    font-size: 0.875rem;
  }

  .btn {
    padding: 0.625rem 1rem;
    font-size: 0.875rem;
  }

  .config-actions {
    padding: 1rem;
  }
}
</style>