<template>
  <div class="page">
    <div v-if="isLoadingStudent" class="loading-container">
      <div class="spinner-large"></div>
      <p>Loading student data...</p>
    </div>
    <div class="form-container" v-else>
      <vee-form :validation-schema="formValidation" @submit="handleSubmit" v-slot="{ errors }">
        <!-- Personal Information Section -->
        <div class="form-section">
          <div class="d-flex align-items-center justify-content-between w-100">
            <h3 class="section-title">Personal Information</h3>
            <button type="button" @click="goBack" class="add-btn">
              <i class="fa fa-angle-left"></i> Back to Students
            </button>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Full Name *</label>
              <vee-form-field type="text" v-model="formData.full_name" name="full_name"
                :class="['form-input', errors.full_name ? 'is-invalid' : '']" placeholder="Enter full name" />
              <vee-form-error name="full_name" class="error-message" />
            </div>
            <div class="form-group">
              <label class="form-label">Date of Birth *</label>
              <vee-form-field type="date" v-model="formData.dob" name="dob"
                :class="['form-input', errors.dob ? 'is-invalid' : '']" />
              <vee-form-error name="dob" class="error-message" />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Gender *</label>
              <vee-form-field as="select" v-model="formData.gender" name="gender"
                :class="['form-input', errors.gender ? 'is-invalid' : '']">
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </vee-form-field>
              <vee-form-error name="gender" class="error-message" />
            </div>
            <div class="form-group">
              <label class="form-label">Blood Group</label>
              <vee-form-field as="select" v-model="formData.blood_group" name="blood_group"
                :class="['form-input', errors.blood_group ? 'is-invalid' : '']">
                <option value="">Select blood group</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </vee-form-field>
              <vee-form-error name="blood_group" class="error-message" />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Religion *</label>
            <vee-form-field as="select" v-model="formData.religion" name="religion"
              :class="['form-input', errors.religion ? 'is-invalid' : '']">
              <option value="">Select religion</option>
              <option value="Islam">Islam</option>
              <option value="Christianity">Christianity</option>
              <option value="Other">Other</option>
            </vee-form-field>
            <vee-form-error name="religion" class="error-message" />
          </div>
        </div>

        <!-- Address Information Section -->
        <div class="form-section">
          <h3 class="section-title">Address Information</h3>

          <div class="form-group">
            <label class="form-label">Address *</label>
            <vee-form-field type="text" v-model="formData.address" name="address"
              :class="['form-input', errors.address ? 'is-invalid' : '']" placeholder="Enter full address" />
            <vee-form-error name="address" class="error-message" />
          </div>

          <div class="form-row mt-4">
            <div class="form-group">
              <label class="form-label">State *</label>
              <vee-form-field as="select" v-model="formData.state" name="state"
                :class="['form-input', errors.state ? 'is-invalid' : '']" @change="onStateChange">
                <option value="">Select state</option>
                <option v-for="(state, index) in states" :key="index" :value="state.value">
                  {{ state.label }}
                </option>
              </vee-form-field>
              <vee-form-error name="state" class="error-message" />
            </div>
            <div class="form-group">
              <label class="form-label">Local Government *</label>
              <vee-form-field as="select" v-model="formData.local_gov" name="local_gov"
                :class="['form-input', errors.local_gov ? 'is-invalid' : '']" :disabled="!formData.state">
                <option value="">Select LGA</option>
                <option v-for="(lga, index) in localGovs" :key="index" :value="lga.value">
                  {{ lga.label }}
                </option>
              </vee-form-field>
              <vee-form-error name="local_gov" class="error-message" />
            </div>
          </div>
        </div>

        <!-- Academic Information Section -->
        <div class="form-section">
          <h3 class="section-title">Academic Information</h3>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Admission Number *</label>
              <vee-form-field type="text" v-model="formData.admission_number" name="admission_number"
                :class="['form-input', errors.admission_number ? 'is-invalid' : '']"
                placeholder="e.g., AGP/SS/2022/045" />
              <vee-form-error name="admission_number" class="error-message" />
            </div>

            <div class="form-group">
              <label class="form-label">Status *</label>
              <vee-form-field as="select" v-model="formData.student_status" name="student_status"
                :class="['form-input', errors.student_status ? 'is-invalid' : '']">
                <option value="active">Active</option>
                <option value="graduated">Graduated</option>
                <option value="transferred">Transferred</option>
                <option value="suspended">Suspended</option>
                <option value="withdrawn">Withdrawn</option>
                <option value="leave">Leave</option>

              </vee-form-field>
              <vee-form-error name="student_status" class="error-message" />
            </div>

            <!--  -->
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Admitted Class *</label>
              <vee-form-field as="select" v-model="formData.admitted_class" name="admitted_class"
                :class="['form-input', errors.admitted_class ? 'is-invalid' : '']">
                <option value="" selected disabled>Select current class</option>
                <option v-for="(sClass, index) in allRowClasses" :key="index" :value="sClass.id">
                  {{ sClass.class_name }}
                </option>
              </vee-form-field>
              <vee-form-error name="admitted_class" class="error-message" />
            </div>
            <div class="form-group">
              <label class="form-label">Current Class *</label>
              <vee-form-field as="select" v-model="formData.current_class_id" name="current_class_id"
                :class="['form-input', errors.current_class_id ? 'is-invalid' : '']">
                <option value="" selected disabled>Select current class</option>
                <option v-for="(sClass, index) in allRowClasses" :key="index" :value="sClass.id">
                  {{ sClass.class_name }}
                </option>
              </vee-form-field>
              <vee-form-error name="current_class_id" class="error-message" />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Admitted Session *</label>
              <vee-form-field as="select" v-model="formData.admitted_session" name="admitted_session"
                :class="['form-input', errors.admitted_session ? 'is-invalid' : '']">
                <option value="">Select session</option>
                <option v-for="(session, index) in allRowSessions" :key="index" :value="session.id">
                  {{ session.session_name }}
                </option>
              </vee-form-field>
              <vee-form-error name="admitted_session" class="error-message" />
            </div>
            <!--  -->
            <div class="form-group">
              <label class="form-label">Current Session *</label>
              <vee-form-field as="select" v-model="formData.current_session_id" name="current_session_id"
                :class="['form-input', errors.current_session_id ? 'is-invalid' : '']">
                <option value="">Select session</option>
                <option v-for="(session, index) in allRowSessions" :key="index" :value="session.id">
                  {{ session.session_name }}
                </option>
              </vee-form-field>
              <vee-form-error name="current_session_id" class="error-message" />
            </div>
          </div>


        </div>

        <!-- Form Actions -->
        <div class="form-actions">
          <button type="button" class="btn btn-cancel" @click="goBack">
            Cancel
          </button>
          <button type="submit" class="btn btn-success" :disabled="loading">
            <span v-if="loading" class="spinner"></span>
            {{ loading ? "Updating..." : "Update Student" }}
          </button>
        </div>
      </vee-form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import * as yup from "yup";
import { useToast } from "../../composables/useToast";
import { useRouter, useRoute } from "vue-router";
import nigerianStates from "../../data/nigerianStates";
import nigerianLGs from "../../data/nigerianLGs";
import apiServices from "../../services/apiServices";

const router = useRouter();
const route = useRoute();
const toast = useToast();

const formValidation = yup.object({
  full_name: yup.string().required("Full name is required"),
  dob: yup.string().required("Date of birth is required"),
  gender: yup.string().required("Gender is required"),
  religion: yup.string().required("Religion is required"),
  address: yup.string().required("Address is required"),
  state: yup.string().required("State is required"),
  local_gov: yup.string().required("Local government is required"),
  admission_number: yup.string().required("Admission number is required"),
  admitted_class: yup.string().required("Admitted class is required"),
  admitted_session: yup.string().required("Admitted session is required"),
  current_class_id: yup.string().required("Current class is required"),
  current_session_id: yup.string().required("Session is required"),
  // parent_id: yup.string().required("Parent/Guardian is required"),
  student_status: yup.string().required("Status is required"),
});

const loading = ref(false);
const isLoadingStudent = ref(false)
const states = ref(nigerianStates);
const allRowSessions = ref([]);
const allRowClasses = ref([]);

const formData = ref({});

const localGovs = computed(() => {
  if (!formData.value.state) return [];
  return nigerianLGs[formData.value.state] || [];
});

const onStateChange = () => {
  formData.value.local_gov = "";
};

const goBack = () => {
  router.push("/students");
};

const getAllRowSessions = () => {
  apiServices.getAllRowSessions().then((response) => {
    allRowSessions.value = response.data.data || [];
  });
};

const getAllRowClases = () => {
  apiServices.getAllRowClases().then((response) => {
    allRowClasses.value = response.data.data || [];
  });
};

const loadStudentData = () => {
  const studentId = route.params.id;
  isLoadingStudent.value = true;
  apiServices.getStudentById(studentId)
    .then((response) => {
      const student = response.data.data;
      // Map API response to formData
      formData.value = student
    })
    .catch((error) => {
      console.error("Error fetching student:", error);
      toast.error("Error", "Failed to load student data.");
    })
    .finally(() => {
      isLoadingStudent.value = false
    });
};

const handleSubmit = async () => {
  loading.value = true;
  const studentId = route.params.id;

  apiServices.updateStudent(studentId, formData.value)
    .then(() => {
      toast.success(
        "Student Updated Successfully",
        `${formData.value.full_name} has been updated successfully.`
      );
      router.push("/students");
    })
    .catch((error) => {
      console.error("Failed to Update Student:", error);
      toast.error(
        "Failed to Update Student",
        error.response?.data?.message || "An error occurred."
      );
    })
    .finally(() => {
      loading.value = false;
    });
};

onMounted(() => {
  getAllRowSessions();
  getAllRowClases();
  loadStudentData();
});
</script>

<style lang="scss" scoped>
.d-flex {
  display: flex;
}

.align-items-center {
  align-items: center;
}

.justify-content-between {
  justify-content: space-between;
}

.w-100 {
  width: 100%;
}

.form-container {
  max-width: 1000px;
  // margin: 0 auto;
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.form-section {
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #e5e7eb;

  &:last-of-type {
    border-bottom: none;
  }

  .d-flex {
    margin-bottom: 1.5rem;
  }
}

.section-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
}

@media (max-width: 768px) {
  .form-container {
    padding: 1rem;
  }

  .form-actions {
    flex-direction: column;

    button {
      width: 100%;
    }
  }
}
</style>
