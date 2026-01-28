<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1>Configuration</h1>
        <p>Manage student grades and academic performance</p>
      </div>
    </div>

    <div class="configuration-container p-5 rounded-lg  bg-white">
      <!-- Sidebar Navigation -->
      <div class="config-sidebar">
        <nav class="config-nav">
          <button
            v-for="tab in configTabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            class="config-nav-item"
            :class="{ active: activeTab === tab.id }"
          >
            <svg
              class="config-nav-icon"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                :d="tab.icon"
              />
            </svg>
            <span>{{ tab.label }}</span>
          </button>
        </nav>
      </div>

      <!-- Main Content Area -->
      <div class="config-content">
        <!-- General Settings -->
        <div v-if="activeTab === 'general'" class="config-section">
          <h2 class="section-title">General Settings</h2>

          <div class="form-group">
            <label class="form-label">School Name</label>
            <input
              v-model="settings.general.schoolName"
              type="text"
              class="form-input"
              placeholder="Enter school name"
            />
          </div>

          <div class="form-group">
            <label class="form-label">School Address</label>
            <textarea
              v-model="settings.general.schoolAddress"
              class="form-input"
              rows="3"
              placeholder="Enter school address"
            ></textarea>
          </div>

          <div class="form-grid">
            <div class="form-group">
              <label class="form-label">Phone Number</label>
              <input
                v-model="settings.general.phoneNumber"
                type="tel"
                class="form-input"
                placeholder="Enter phone number"
              />
            </div>
            <div class="form-group">
              <label class="form-label">Email Address</label>
              <input
                v-model="settings.general.email"
                type="email"
                class="form-input"
                placeholder="Enter email address"
              />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Academic Year</label>
            <select v-model="settings.general.academicYear" class="form-input">
              <option value="2024-2025">2024-2025</option>
              <option value="2025-2026">2025-2026</option>
            </select>
          </div>
        </div>

        <!-- Security Settings -->
        <div v-if="activeTab === 'security'" class="config-section">
          <h2 class="section-title">Security Settings</h2>

          <div class="form-group">
            <label class="form-label">Password Policy</label>
            <div class="checkbox-group">
              <label class="permission-checkbox">
                <input
                  type="checkbox"
                  v-model="settings.security.requireUppercase"
                />
                <span class="checkmark"></span>
                <span class="permission-label">Require uppercase letters</span>
              </label>
              <label class="permission-checkbox">
                <input
                  type="checkbox"
                  v-model="settings.security.requireNumbers"
                />
                <span class="checkmark"></span>
                <span class="permission-label">Require numbers</span>
              </label>
              <label class="permission-checkbox">
                <input
                  type="checkbox"
                  v-model="settings.security.requireSpecialChars"
                />
                <span class="checkmark"></span>
                <span class="permission-label">Require special characters</span>
              </label>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Minimum Password Length</label>
            <input
              v-model="settings.security.minPasswordLength"
              type="number"
              class="form-input"
              min="6"
              max="20"
            />
          </div>

          <div class="form-group">
            <label class="form-label">Session Timeout (minutes)</label>
            <input
              v-model="settings.security.sessionTimeout"
              type="number"
              class="form-input"
              min="15"
              max="480"
            />
          </div>
        </div>

        <!-- Email Settings -->
        <div v-if="activeTab === 'email'" class="config-section">
          <h2 class="section-title">Email Configuration</h2>

          <div class="form-group">
            <label class="form-label">SMTP Server</label>
            <input
              v-model="settings.email.smtpServer"
              type="text"
              class="form-input"
              placeholder="smtp.example.com"
            />
          </div>

          <div class="form-grid">
            <div class="form-group">
              <label class="form-label">SMTP Port</label>
              <input
                v-model="settings.email.smtpPort"
                type="number"
                class="form-input"
                placeholder="587"
              />
            </div>
            <div class="form-group">
              <label class="form-label">Encryption</label>
              <select v-model="settings.email.encryption" class="form-input">
                <option value="tls">TLS</option>
                <option value="ssl">SSL</option>
                <option value="none">None</option>
              </select>
            </div>
          </div>

          <div class="form-grid">
            <div class="form-group">
              <label class="form-label">Username</label>
              <input
                v-model="settings.email.username"
                type="text"
                class="form-input"
                placeholder="Enter SMTP username"
              />
            </div>
            <div class="form-group">
              <label class="form-label">Password</label>
              <input
                v-model="settings.email.password"
                type="password"
                class="form-input"
                placeholder="Enter SMTP password"
              />
            </div>
          </div>

          <div class="form-group">
            <button
              type="button"
              class="btn btn-secondary"
              @click="testEmailConnection"
            >
              Test Connection
            </button>
          </div>
        </div>

        <!-- Notifications Settings -->
        <div v-if="activeTab === 'notifications'" class="config-section">
          <h2 class="section-title">Notification Settings</h2>

          <div class="form-group">
            <label class="form-label">Email Notifications</label>
            <div class="checkbox-group">
              <label class="permission-checkbox">
                <input
                  type="checkbox"
                  v-model="settings.notifications.newStudentRegistration"
                />
                <span class="checkmark"></span>
                <span class="permission-label">New student registration</span>
              </label>
              <label class="permission-checkbox">
                <input
                  type="checkbox"
                  v-model="settings.notifications.attendanceAlerts"
                />
                <span class="checkmark"></span>
                <span class="permission-label">Attendance alerts</span>
              </label>
              <label class="permission-checkbox">
                <input
                  type="checkbox"
                  v-model="settings.notifications.gradeUpdates"
                />
                <span class="checkmark"></span>
                <span class="permission-label">Grade updates</span>
              </label>
              <label class="permission-checkbox">
                <input
                  type="checkbox"
                  v-model="settings.notifications.systemAlerts"
                />
                <span class="checkmark"></span>
                <span class="permission-label">System alerts</span>
              </label>
            </div>
          </div>
        </div>

        <!-- Backup Settings -->
        <div v-if="activeTab === 'backup'" class="config-section">
          <h2 class="section-title">Backup & Restore</h2>

          <div class="form-group">
            <label class="form-label">Automatic Backup</label>
            <div class="checkbox-group">
              <label class="permission-checkbox">
                <input type="checkbox" v-model="settings.backup.autoBackup" />
                <span class="checkmark"></span>
                <span class="permission-label">Enable automatic backup</span>
              </label>
            </div>
          </div>

          <div class="form-group" v-if="settings.backup.autoBackup">
            <label class="form-label">Backup Frequency</label>
            <select v-model="settings.backup.frequency" class="form-input">
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>

          <div class="backup-actions">
            <button type="button" class="btn btn-primary" @click="createBackup">
              Create Backup Now
            </button>
            <button
              type="button"
              class="btn btn-secondary"
              @click="restoreBackup"
            >
              Restore from Backup
            </button>
          </div>
        </div>

        <!-- Advanced Settings -->
        <div v-if="activeTab === 'advanced'" class="config-section">
          <h2 class="section-title">Advanced Settings</h2>

          <div class="form-group">
            <label class="form-label">System Language</label>
            <select v-model="settings.advanced.language" class="form-input">
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Date Format</label>
            <select v-model="settings.advanced.dateFormat" class="form-input">
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Time Zone</label>
            <select v-model="settings.advanced.timezone" class="form-input">
              <option value="UTC">UTC</option>
              <option value="America/New_York">Eastern Time</option>
              <option value="America/Chicago">Central Time</option>
              <option value="America/Denver">Mountain Time</option>
              <option value="America/Los_Angeles">Pacific Time</option>
            </select>
          </div>

          <div class="danger-zone">
            <h3 class="danger-title">Danger Zone</h3>
            <p class="danger-description">
              These actions are irreversible. Please be careful.
            </p>
            <div class="danger-actions">
              <button
                type="button"
                class="btn btn-danger"
                @click="resetSettings"
              >
                Reset All Settings
              </button>
              <button
                type="button"
                class="btn btn-danger"
                @click="clearAllData"
              >
                Clear All Data
              </button>
            </div>
          </div>
        </div>

        <!-- Save Actions -->
        <div class="config-actions">
          <button
            type="button"
            @click="saveSettings"
            class="btn btn-submit"
            :disabled="isSaving"
          >
            <span v-if="isSaving" class="spinner"></span>
            {{ isSaving ? "Saving..." : "Save Changes" }}
          </button>
          <button type="button" @click="resetForm" class="btn btn-cancel">
            Reset
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from "vue";

export default {
  name: "Configuration",
  setup() {
    const activeTab = ref("general");
    const isSaving = ref(false);

    const configTabs = [
      {
        id: "general",
        label: "General",
        icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z",
      },
      {
        id: "security",
        label: "Security",
        icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
      },
      {
        id: "email",
        label: "Email",
        icon: "M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
      },
      {
        id: "notifications",
        label: "Notifications",
        icon: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9",
      },
      {
        id: "backup",
        label: "Backup",
        icon: "M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10",
      },
      {
        id: "advanced",
        label: "Advanced",
        icon: "M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4",
      },
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

    return {
      activeTab,
      isSaving,
      configTabs,
      settings,
      saveSettings,
      resetForm,
      testEmailConnection,
      createBackup,
      restoreBackup,
      resetSettings,
      clearAllData,
    };
  },
};
</script>
<style scoped>
.configuration-container {
  display: grid;
  grid-template-columns: 280px 1fr;
  grid-template-areas: "sidebar content";
  max-width: 1200px;
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
    flex-wrap: wrap; /* allow wrapping to multiple rows */
    justify-content: flex-start;
    gap: 0.5rem;
    background: #f8fafc;
    border-radius: 12px;
    padding: 0.5rem;
    border: 1px solid #e2e8f0;
  }

  .config-nav-item {
    flex: 1 1 48%; /* make two per row */
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