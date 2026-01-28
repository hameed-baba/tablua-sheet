<template>
  <div class="container-fluid">
    <div class="row justify-content-center">
      <div class="col-lg-8 col-md-10 col-12">
        <div class="card shadow-sm">
          <div class="card-header bg-primary text-white">
            <div
              class="d-flex justify-content-between align-items-center flex-wrap"
            >
              <h4 class="card-title mb-0 me-2">
                <i class="fas fa-cog me-2"></i>
                <span class="d-none d-sm-inline"
                  >Continuous Assessment Configuration</span
                >
                <span class="d-sm-none">CA Configuration</span>
              </h4>
              <button
                v-if="!loading && config.id"
                @click="resetForm"
                class="btn btn-outline-light btn-sm mt-2 mt-sm-0"
                type="button"
              >
                <i class="fas fa-undo me-1"></i>
                <span class="d-none d-sm-inline">Reset</span>
              </button>
            </div>
          </div>

          <div class="card-body">
            <!-- Loading State -->
            <div v-if="loading" class="text-center py-5">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
              <p class="mt-3 text-muted">Loading configuration...</p>
            </div>

            <!-- Error State -->
            <div
              v-else-if="error"
              class="alert alert-danger d-flex align-items-center"
            >
              <i class="fas fa-exclamation-triangle me-2"></i>
              <div>
                <strong>Error:</strong> {{ error }}
                <button
                  @click="getLatestCaConfig"
                  class="btn btn-sm btn-outline-danger ms-2"
                >
                  <i class="fas fa-retry me-1"></i>
                  Retry
                </button>
              </div>
            </div>

            <!-- Form -->
            <div v-else>
              <div
                v-if="!config.id"
                class="alert alert-info d-flex align-items-center mb-4"
              >
                <i class="fas fa-info-circle me-2"></i>
                <span
                  >No configuration found. Create a new CA configuration
                  below.</span
                >
              </div>

              <form @submit.prevent="handleSubmit" novalidate>
                <div class="row g-3">
                  <div class="col-lg-4 col-md-6 col-12">
                    <label for="caCount" class="form-label fw-semibold">
                      <i class="fas fa-list-ol me-1 text-primary"></i>
                      Number of CAs
                    </label>
                    <input
                      type="number"
                      class="form-control"
                      :class="{ 'is-invalid': errors.ca_count }"
                      id="caCount"
                      v-model.number="config.ca_count"
                      min="1"
                      max="4"
                      placeholder="e.g., 3"
                      @blur="validateField('ca_count')"
                    />
                    <div v-if="errors.ca_count" class="invalid-feedback">
                      {{ errors.ca_count }}
                    </div>
                    <div class="form-text">
                      Number of continuous assessments (1-4)
                    </div>
                  </div>

                  <div class="col-lg-4 col-md-6 col-12">
                    <label for="caTotalMarks" class="form-label fw-semibold">
                      <i class="fas fa-chart-bar me-1 text-success"></i>
                      CA Total Marks
                    </label>
                    <input
                      type="number"
                      class="form-control"
                      :class="{ 'is-invalid': errors.ca_total_marks }"
                      id="caTotalMarks"
                      v-model.number="config.ca_total_marks"
                      min="1"
                      max="100"
                      placeholder="e.g., 30"
                      @blur="validateField('ca_total_marks')"
                    />
                    <div v-if="errors.ca_total_marks" class="invalid-feedback">
                      {{ errors.ca_total_marks }}
                    </div>
                    <div class="form-text">
                      Total marks for all CAs combined
                    </div>
                  </div>

                  <div class="col-lg-4 col-md-12 col-12">
                    <label for="examTotalMarks" class="form-label fw-semibold">
                      <i class="fas fa-graduation-cap me-1 text-warning"></i>
                      Exam Total Marks
                    </label>
                    <input
                      type="number"
                      class="form-control"
                      :class="{ 'is-invalid': errors.exam_total_marks }"
                      id="examTotalMarks"
                      v-model.number="config.exam_total_marks"
                      min="1"
                      max="100"
                      placeholder="e.g., 70"
                      @blur="validateField('exam_total_marks')"
                    />
                    <div
                      v-if="errors.exam_total_marks"
                      class="invalid-feedback"
                    >
                      {{ errors.exam_total_marks }}
                    </div>
                    <div class="form-text">
                      Total marks for final examination
                    </div>
                  </div>
                </div>

                <!-- Summary Card -->
                <div class="card bg-light border-0 mb-4">
                  <div class="card-body">
                    <h6 class="card-title text-muted mb-3">
                      <i class="fas fa-calculator me-1"></i>
                      Configuration Summary
                    </h6>
                    <div class="row text-center g-3">
                      <div class="col-md-4 col-4">
                        <div class="h5 text-primary mb-1">
                          {{ config.ca_count || 0 }}
                        </div>
                        <small class="text-muted d-block">
                          <span class="d-none d-sm-inline">CA Tests</span>
                          <span class="d-sm-none">Tests</span>
                        </small>
                      </div>
                      <div class="col-md-4 col-4">
                        <div class="h5 text-success mb-1">
                          {{ config.ca_total_marks || 0 }}%
                        </div>
                        <small class="text-muted d-block">
                          <span class="d-none d-sm-inline">CA Weight</span>
                          <span class="d-sm-none">CA %</span>
                        </small>
                      </div>
                      <div class="col-md-4 col-4">
                        <div class="h5 text-warning mb-1">
                          {{ config.exam_total_marks || 0 }}%
                        </div>
                        <small class="text-muted d-block">
                          <span class="d-none d-sm-inline">Exam Weight</span>
                          <span class="d-sm-none">Exam %</span>
                        </small>
                      </div>
                    </div>
                    <div v-if="totalMarks !== 100" class="mt-3">
                      <div class="alert alert-warning py-2 mb-0">
                        <i class="fas fa-exclamation-triangle me-1"></i>
                        <small>
                          Total marks: {{ totalMarks }}%.
                          <strong>Should equal 100% for proper grading.</strong>
                        </small>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Action Buttons -->
                <div class="d-flex justify-content-end gap-2 flex-wrap">
                  <button
                    type="button"
                    @click="resetForm"
                    class="btn btn-outline-secondary flex-fill flex-sm-grow-0"
                    :disabled="saving"
                  >
                    <i class="fas fa-times me-1"></i>
                    Cancel
                  </button>
                  <button
                    type="submit"
                    class="btn btn-primary flex-fill flex-sm-grow-0"
                    :disabled="saving || !isFormValid"
                  >
                    <span
                      v-if="saving"
                      class="spinner-border spinner-border-sm me-2"
                    ></span>
                    <i v-else class="fas fa-save me-1"></i>
                    <span class="d-none d-sm-inline">
                      {{
                        saving
                          ? "Saving..."
                          : config.id
                          ? "Update Configuration"
                          : "Create Configuration"
                      }}
                    </span>
                    <span class="d-sm-none">
                      {{
                        saving ? "Saving..." : config.id ? "Update" : "Create"
                      }}
                    </span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Warning Modal -->
    <div
      v-if="showWarningModal"
      class="modal fade show d-block"
      tabindex="-1"
      style="background-color: rgba(0, 0, 0, 0.5)"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header border-0 pb-0">
            <h5 class="modal-title text-warning">
              <i class="fas fa-exclamation-triangle me-2"></i>
              Warning
            </h5>
            <button
              type="button"
              class="btn-close"
              @click="cancelSaveWithWarning"
            ></button>
          </div>
          <div class="modal-body">
            <p class="mb-3">
              Total marks is <strong>{{ totalMarks }}%</strong> instead of 100%.
            </p>
            <p class="text-muted mb-0">
              This may affect grading calculations. Do you want to continue?
            </p>
          </div>
          <div class="modal-footer border-0 pt-0">
            <button
              type="button"
              class="btn btn-outline-secondary"
              @click="cancelSaveWithWarning"
            >
              Cancel
            </button>
            <button
              type="button"
              class="btn btn-warning"
              @click="confirmSaveWithWarning"
            >
              Yes, Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import apiServices from "@/services/apiServices";
import { useToast } from "@/composables/useToast";

export default {
  name: "CaConfig",
  setup() {
    const toast = useToast();
    return { toast };
  },
  data() {
    return {
      config: {
        ca_count: null,
        ca_total_marks: null,
        exam_total_marks: null,
      },
      originalConfig: {},
      loading: false,
      saving: false,
      error: null,
      errors: {},
      showWarningModal: false,
    };
  },
  computed: {
    totalMarks() {
      const caMarks = Number(this.config.ca_total_marks) || 0;
      const examMarks = Number(this.config.exam_total_marks) || 0;
      return caMarks + examMarks;
    },
    isFormValid() {
      return (
        this.config.ca_count > 0 &&
        this.config.ca_total_marks > 0 &&
        this.config.exam_total_marks > 0 &&
        Object.keys(this.errors).length === 0
      );
    },
  },
  created() {
    this.getLatestCaConfig();
  },
  methods: {
    async getLatestCaConfig() {
      this.loading = true;
      this.error = null;
      this.errors = {};

      try {
        const response = await apiServices.getLatestCaConfig();
        if (response.data.status === "success" && response.data.data) {
          // Fix property names from backend response
          const data = response.data.data;
          this.config = {
            id: data.id,
            ca_count: data.ca_count,
            ca_total_marks: data.ca_total_makrs || data.ca_total_marks, // Handle typo in backend
            exam_total_marks: data.eaxm_total_mark || data.exam_total_marks, // Handle typo in backend
          };
          this.originalConfig = { ...this.config };
        } else {
          // No config exists yet - initialize with defaults
          this.config = {
            ca_count: null,
            ca_total_marks: null,
            exam_total_marks: null,
          };
          this.originalConfig = {};
        }
      } catch (err) {
        console.error("Error fetching CA config:", err);
        this.error =
          err.response?.data?.message ||
          "Failed to load configuration. Please try again.";
      } finally {
        this.loading = false;
      }
    },

    validateField(fieldName) {
      this.errors = { ...this.errors };
      delete this.errors[fieldName];

      const value = this.config[fieldName];

      switch (fieldName) {
        case "ca_count":
          if (!value || value < 1) {
            this.errors[fieldName] = "CA count must be at least 1";
          } else if (value > 4) {
            this.errors[fieldName] = "CA count cannot exceed 4";
          }
          break;

        case "ca_total_marks":
          if (!value || value < 1) {
            this.errors[fieldName] = "CA total marks must be at least 1";
          } else if (value > 100) {
            this.errors[fieldName] = "CA total marks cannot exceed 100";
          }
          break;

        case "exam_total_marks":
          if (!value || value < 1) {
            this.errors[fieldName] = "Exam total marks must be at least 1";
          } else if (value > 100) {
            this.errors[fieldName] = "Exam total marks cannot exceed 100";
          }
          break;
      }
    },

    validateForm() {
      this.errors = {};
      this.validateField("ca_count");
      this.validateField("ca_total_marks");
      this.validateField("exam_total_marks");

      return Object.keys(this.errors).length === 0;
    },

    async handleSubmit() {
      if (!this.validateForm()) {
        this.toast.error(
          "Validation Error",
          "Please fix the errors in the form before submitting."
        );
        return;
      }

      if (this.totalMarks !== 100) {
        this.showWarningModal = true;
        return;
      }

      await this.saveConfig();
    },

    async confirmSaveWithWarning() {
      this.showWarningModal = false;
      await this.saveConfig();
    },

    cancelSaveWithWarning() {
      this.showWarningModal = false;
    },

    async saveConfig() {
      this.saving = true;

      try {
        // Prepare data with correct property names for backend
        const configData = {
          ca_count: this.config.ca_count,
          ca_total_makrs: this.config.ca_total_marks, // Backend expects this typo
          eaxm_total_mark: this.config.exam_total_marks, // Backend expects this typo
        };

        let response;
        if (this.config.id) {
          response = await apiServices.updateCaConfig(
            this.config.id,
            configData
          );
        } else {
          response = await apiServices.createCaConfig(configData);
        }

        if (response && response.data.status === "success") {
          this.toast.success(
            "Configuration Saved Successfully",
            `CA configuration has been ${
              this.config.id ? "updated" : "created"
            } successfully.`
          );

          await this.getLatestCaConfig();
        } else {
          throw new Error(
            response?.data?.message || "Unexpected response from server"
          );
        }
      } catch (err) {
        console.error("Error saving CA config:", err);
        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          "Failed to save configuration";

        this.toast.error("Failed to Save Configuration", errorMessage);
      } finally {
        this.saving = false;
      }
    },

    resetForm() {
      if (this.originalConfig.id) {
        this.config = { ...this.originalConfig };
      } else {
        this.config = {
          ca_count: null,
          ca_total_marks: null,
          exam_total_marks: null,
        };
      }
      this.errors = {};
    },
  },
};
</script>

<style scoped>
.card {
  margin-top: 20px;
  border: none;
  border-radius: 12px;
}

.card-header {
  border-radius: 12px 12px 0 0 !important;
  border-bottom: none;
  padding: 1.5rem;
}

.card-body {
  padding: 2rem;
}

.form-control {
  border-radius: 8px;
  border: 1px solid #e0e6ed;
  padding: 0.75rem 1rem;
  transition: all 0.2s ease;
}

.form-control:focus {
  border-color: #0d6efd;
  box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.15);
}

.form-control.is-invalid {
  border-color: #dc3545;
  box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.15);
}

.form-label {
  color: #495057;
  margin-bottom: 0.75rem;
}

.form-text {
  font-size: 0.875rem;
  color: #6c757d;
  margin-top: 0.5rem;
}

.btn {
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.btn:hover {
  transform: translateY(-1px);
}

.btn:disabled {
  transform: none;
}

.alert {
  border-radius: 8px;
  border: none;
}

.alert-info {
  background-color: #e7f3ff;
  color: #0c5460;
}

.alert-warning {
  background-color: #fff3cd;
  color: #856404;
}

.alert-danger {
  background-color: #f8d7da;
  color: #721c24;
}

.bg-light {
  background-color: #f8f9fa !important;
}

.shadow-sm {
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075) !important;
}

.spinner-border-sm {
  width: 1rem;
  height: 1rem;
}

.gap-2 {
  gap: 0.5rem !important;
}

/* Modal Styles */
.modal-content {
  border-radius: 12px;
  border: none;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
}

.modal-header {
  padding: 1.5rem 1.5rem 0.5rem;
}

.modal-body {
  padding: 0.5rem 1.5rem;
}

.modal-footer {
  padding: 0.5rem 1.5rem 1.5rem;
}

/* Responsive Design */
@media (max-width: 991px) {
  .card-header {
    padding: 1rem;
  }

  .card-body {
    padding: 1.5rem;
  }
}

@media (max-width: 768px) {
  .card-header {
    padding: 1rem;
  }

  .card-body {
    padding: 1rem;
  }

  .btn {
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
  }

  .modal-dialog {
    margin: 1rem;
  }

  .form-label {
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
  }

  .form-text {
    font-size: 0.8rem;
  }

  .h5 {
    font-size: 1.1rem;
  }
}

@media (max-width: 576px) {
  .container-fluid {
    padding: 0.5rem;
  }

  .card {
    margin-top: 10px;
  }

  .card-header {
    padding: 0.75rem;
  }

  .card-body {
    padding: 0.75rem;
  }

  .btn {
    padding: 0.5rem 0.75rem;
    font-size: 0.8rem;
  }

  .gap-2 {
    gap: 0.25rem !important;
  }
}
</style>