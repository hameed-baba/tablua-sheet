<template>
  <div class="page">
    <div class="form-container p-4">
      <!-- Stepper Header -->
      <div class="stepper-header">
        <div
          class="stepper-step"
          :class="{ active: currentStep === 1, completed: currentStep > 1 }"
        >
          <div class="step-number">
            <i v-if="currentStep > 1" class="fa fa-check"></i>
            <span v-else>1</span>
          </div>
          <div class="step-label">Basic Information</div>
        </div>
        <div class="stepper-line" :class="{ active: currentStep > 1 }"></div>
        <div class="stepper-step" :class="{ active: currentStep === 2 }">
          <div class="step-number">2</div>
          <div class="step-label">Grade Ranges</div>
        </div>
      </div>

      <!-- Step 1: Basic Information -->
      <vee-form
        v-if="currentStep === 1"
        :validation-schema="step1Validation"
        @submit="goToStep2"
        v-slot="{ errors }"
      >
        <div class="form-card">
          <div
            class="d-flex flex-column flex-sm-row align-items-start align-items-md-center justify-content-between mb-3"
          >
            <h3 class="form-section-title mb-2 mb-md-0">Basic Information</h3>
            <button type="button" class="add-btn" @click="goBack">
              <i class="fa fa-angle-left"></i>
              <span class="btn-text">Back to grades</span>
            </button>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Grade System Name *</label>
              <vee-form-field
                type="text"
                v-model="gradeData.grade_name"
                name="grade_name"
                :class="['form-input', errors.grade_name ? 'is-invalid' : '']"
                placeholder="Enter grade system name (e.g., A+ Grading)"
              />
              <vee-form-error name="grade_name" class="error-message" />
            </div>

            <div class="form-group">
              <label class="form-label">Grade Type *</label>
              <vee-form-field
                as="select"
                v-model="gradeData.grade_type"
                name="grade_type"
                :class="['form-input', errors.grade_type ? 'is-invalid' : '']"
                disabled
              >
                <option value="">Select grade type</option>
                <option value="letter_grade">Letter Grade</option>
                <option value="remark_grade">Remark Grade</option>
              </vee-form-field>
              <vee-form-error name="grade_type" class="error-message" />
              <small class="text-muted">Grade type cannot be changed</small>
            </div>
          </div>

          <div class="d-flex justify-content-end">
            <label class="check-all-main">
              <input
                type="checkbox"
                :checked="gradeData.allow_grade"
                :disabled="gradeData.grade_type === 'letter_grade'"
                @change="toggleAllowGrade"
              />
              <span
                class="checkmark"
                :class="{ disabled: gradeData.grade_type === 'letter_grade' }"
              ></span>
              <span
                class="permission-label"
                :class="{ disabled: gradeData.grade_type === 'letter_grade' }"
              >
                Allow Grade <small>(A, B)</small>
                <small
                  v-if="gradeData.grade_type === 'letter_grade'"
                  class="text-muted d-block"
                  >Required for Letter Grade</small
                >
              </span>
            </label>

            <label class="check-all-main">
              <input
                type="checkbox"
                :checked="gradeData.allow_remark"
                @change="toggleAllowRemark"
              />
              <span class="checkmark"></span>
              <span class="permission-label">
                Allow Remark <small>(Excellent, Good)</small>
              </span>
            </label>
          </div>
        </div>

        <div class="form-actions pe-4">
          <button type="button" class="btn btn-cancel" @click="goBack">
            Cancel
          </button>
          <button type="submit" class="add-btn btn-primary">
            Next <i class="fa fa-angle-right"></i>
          </button>
        </div>
      </vee-form>

      <!-- Step 2: Grade Ranges -->
      <vee-form
        v-if="currentStep === 2"
        :validation-schema="step2Validation"
        @submit="handleSubmit"
      >
        <!-- Summary Card -->
        <div class="summary-card">
          <div class="summary-header">
            <i class="fa fa-info-circle"></i>
            <span>Grade System Information</span>
          </div>
          <div class="summary-content">
            <div class="summary-item">
              <span class="summary-label">System Name:</span>
              <span class="summary-value">{{ gradeData.grade_name }}</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">Grade Type:</span>
              <span class="summary-value">
                {{
                  gradeData.grade_type === "letter_grade"
                    ? "Letter Grade"
                    : "Remark Grade"
                }}
              </span>
            </div>
          </div>
        </div>


        <div class="form-card">
          <div class="section-header">
            <h3 class="form-section-title">Grade Ranges</h3>
            <button type="button" class="btn-add-range" @click="addGradeRange">
              <i class="fa fa-plus"></i> Add Range
            </button>
          </div>

          <div class="ranges-container">
            <div
              v-for="(range, index) in gradeData.gradeSystems"
              :key="index"
              class="grade-range-card"
            >
              <div class="range-header">
                <span class="range-number">Range {{ index + 1 }}</span>
                <button
                  type="button"
                  class="btn-remove"
                  @click="removeGradeRange(index)"
                  v-if="gradeData.gradeSystems.length > 1"
                >
                  <i class="fa fa-times"></i>
                </button>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">From Mark *</label>
                  <input
                    type="number"
                    v-model="range.from_mark"
                    class="form-input"
                    placeholder="0"
                    min="0"
                    max="100"
                  />
                </div>

                <div class="form-group">
                  <label class="form-label">To Mark *</label>
                  <input
                    type="number"
                    v-model="range.to_mark"
                    class="form-input"
                    placeholder="100"
                    min="0"
                    max="100"
                  />
                </div>

                <div class="form-group" v-if="gradeData.allow_remark === true">
                  <label class="form-label">Remark *</label>
                  <input
                    type="text"
                    v-model="range.remark"
                    class="form-input"
                    placeholder="e.g., Excellent, Good"
                  />
                </div>
                <div class="form-group" v-if="gradeData.allow_grade === true">
                  <label class="form-label">Grade *</label>
                  <input
                    type="text"
                    v-model="range.grade"
                    class="form-input"
                    placeholder="e.g., A+, B, 1st"
                  />
                </div>
                <div class="form-group">
                  <label class="form-label">Principal Remark *</label>
                  <input
                    type="text"
                    v-model="range.principal_remark"
                    class="form-input"
                    placeholder="e.g., Excellent, Good"
                  />
                </div>
                <div class="form-group">
                  <label class="form-label">Class Teacher Remark *</label>
                  <input
                    type="text"
                    v-model="range.class_teacher_remark"
                    class="form-input"
                    placeholder="e.g., Excellent, Good"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="form-actions pe-4">
          <button type="button" class="btn btn-secondary" @click="goToStep1">
            <i class="fa fa-angle-left"></i> Back
          </button>
          <button type="submit" class="btn btn-success" :disabled="loading">
            <span v-if="loading" class="spinner"></span>
            {{ loading ? "Saving..." : "Update Grade System" }}
          </button>
        </div>
      </vee-form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import * as yup from "yup";
import { useToast } from "../../../../composables/useToast";
import apiServices from "../../../../services/apiServices";

const router = useRouter();
const route = useRoute();
const toast = useToast();

const currentStep = ref(1);

const step1Validation = yup.object({
  grade_name: yup.string().required("Grade system name is required"),
  grade_type: yup.string().required("Grade type is required"),
});

const step2Validation = yup.object({});

const loading = ref(false);

const gradeData = ref({
  grade_name: "",
  grade_type: "",
  allow_grade: true,
  allow_remark: true,
  gradeSystems: [],
});

const toggleAllowGrade = () => {
  // If grade type is letter_grade, allow_grade must remain true
  if (gradeData.value.grade_type === "letter_grade") {
    gradeData.value.allow_grade = true;
    toast.info(
      "Grade Required",
      "Letter Grade type requires the Grade option to be enabled."
    );
    return;
  }
  gradeData.value.allow_grade = !gradeData.value.allow_grade;
};

const toggleAllowRemark = () => {
  gradeData.value.allow_remark = !gradeData.value.allow_remark;
};

// Watch for grade type changes and enforce allow_grade requirement
watch(
  () => gradeData.value.grade_type,
  (newType) => {
    if (newType === "letter_grade") {
      gradeData.value.allow_grade = true;
    }
  }
);

const goBack = () => {
  router.push("/configuration");
};

const goToStep1 = () => {
  currentStep.value = 1;
};

const goToStep2 = () => {
  currentStep.value = 2;
};

const addGradeRange = () => {
  gradeData.value.gradeSystems.push({
    from_mark: "",
    to_mark: "",
    grade: "",
    remark: "",
    principal_remark: "",
    class_teacher_remark: "",
  });
};

const removeGradeRange = (index) => {
  gradeData.value.gradeSystems.splice(index, 1);
};

const fetchGradeData = () => {
  loading.value = true;

  apiServices
    .getAllGarde()
    .then((response) => {
      if (response.status === 200) {
        const gradeId = parseInt(route.params.id);
        const grades = response.data.data || response.data || [];
        const found = grades.find((g) => g.id === gradeId);

        if (found) {
          gradeData.value = {
            grade_name: found.grade_name,
            grade_type: found.grade_type,
            allow_grade: found.allow_grade,
            allow_remark: found.allow_remark,
            gradeSystems: found.gradeSystems || found.gradeSystems || [],
          };
        } else {
          toast.error(
            "Grade Not Found",
            "The requested grade system could not be found."
          );
          router.push("/configuration");
        }
      }
    })
    .catch((error) => {
      console.error("Error fetching grade data:", error);
      toast.error(
        "Failed to Load Grade System",
        error.response?.data?.message ||
          "An error occurred while loading the grade system. Please try again."
      );
      router.push("/configuration");
    })
    .finally(() => {
      loading.value = false;
    });
};

const handleSubmit = async () => {
  loading.value = true;

  const gradeId = parseInt(route.params.id);

  // Backend expects gradeSystems (uppercase) for update
  const payload = {
    grade_name: gradeData.value.grade_name,
    grade_type: gradeData.value.grade_type,
    allow_grade: gradeData.allow_grade,
    allow_remark: gradeData.allow_remark,
    gradeSystems: gradeData.value.gradeSystems,
  };

  apiServices
    .updateGrade(gradeId, payload)
    .then((response) => {
      if (response.status === 200) {
        toast.success(
          "Grade System Updated Successfully",
          `The grade system ${gradeData.value.grade_name} has been updated successfully.`
        );
        router.push("/configuration");
      }
    })
    .catch((error) => {
      console.error("Error updating grade system:", error);
      toast.error(
        "Failed to Update Grade System",
        error.response?.data?.message ||
          "An error occurred while updating the grade system. Please try again."
      );
    })
    .finally(() => {
      loading.value = false;
    });
};

onMounted(() => {
  fetchGradeData();
});
</script>

<style lang="scss" scoped>
.form-container {
  max-width: 900px;
  // margin: 0 auto;
}

.stepper-header {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 2rem;
  padding: 1.5rem 0;
}

.stepper-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  position: relative;

  .step-number {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: #e5e7eb;
    color: #6b7280;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 1rem;
    transition: all 0.3s;
  }

  .step-label {
    font-size: 0.875rem;
    color: #6b7280;
    font-weight: 500;
    transition: color 0.3s;
  }

  &.active {
    .step-number {
      background-color: #3b82f6;
      color: white;
    }

    .step-label {
      color: #3b82f6;
    }
  }

  &.completed {
    .step-number {
      background-color: #10b981;
      color: white;
    }

    .step-label {
      color: #10b981;
    }
  }
}

.stepper-line {
  width: 100px;
  height: 2px;
  background-color: #e5e7eb;
  margin: 0 1rem;
  margin-bottom: 1.5rem;
  transition: background-color 0.3s;

  &.active {
    background-color: #10b981;
  }
}

.summary-card {
  background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
  border-radius: 8px;
  padding: 1.25rem;
  margin-bottom: 1.5rem;
  color: white;

  .summary-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1rem;
    font-weight: 600;
    margin-bottom: 1rem;

    i {
      font-size: 1.125rem;
    }
  }

  .summary-content {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .summary-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.9375rem;

    .summary-label {
      font-weight: 500;
      opacity: 0.9;
    }

    .summary-value {
      font-weight: 600;
    }
  }
}

.form-card {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  // box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.form-section-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 1.25rem 0;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem;
}

.btn-add-range {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 1rem;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #2563eb;
  }
}

.ranges-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.grade-range-card {
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1rem;
}

.range-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.range-number {
  font-size: 0.875rem;
  font-weight: 600;
  color: #6b7280;
}

.btn-remove {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background-color: #fee2e2;
  color: #dc2626;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #fecaca;
  }
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding-top: 1rem;
}

@media (max-width: 768px) {
  .stepper-header {
    padding: 1rem 0;
  }

  .stepper-step {
    .step-number {
      width: 36px;
      height: 36px;
      font-size: 0.875rem;
    }

    .step-label {
      font-size: 0.75rem;
    }
  }

  .stepper-line {
    width: 60px;
    margin: 0 0.5rem;
    margin-bottom: 1.5rem;
  }

  .summary-card {
    padding: 1rem;

    .summary-content {
      gap: 0.5rem;
    }

    .summary-item {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.25rem;
    }
  }

  .form-card {
    padding: 1rem;
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .btn-add-range {
    width: 100%;
    justify-content: center;
  }

  .form-actions {
    flex-direction: column-reverse;

    button {
      width: 100%;
    }
  }
}

.checkmark.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.permission-label.disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
</style>
