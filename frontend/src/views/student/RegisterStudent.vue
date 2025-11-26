<template>
  <div class="page">
    <div class="form-container">
      <vee-form :validation-schema="formValidation" @submit="handleSubmit" v-slot="{ errors }">
        <!-- Personal Information Section -->
        <div class="form-section">
          <div class="d-flex align-items-center justify-content-between w-100">
            <h3 class="section-title">Personal Information</h3>
            <button type="button" class="add-btn" @click="autoFillForm">
              Auto Fill Form
            </button>
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
              <option value="islam">Islam</option>
              <option value="christianity">Christianity</option>
              <option value="other">Other</option>
            </vee-form-field>
            <vee-form-error name="religion" class="error-message" />
          </div>
        </div>

        <!-- Address Information Section -->
        <div class="form-section">
          <h3 class="section-title">Address Information</h3>

          <div class="form-group mb-4">
            <label class="form-label">Address *</label>
            <vee-form-field type="text" v-model="formData.address" name="address"
              :class="['form-input', errors.address ? 'is-invalid' : '']" placeholder="Enter full address" />
            <vee-form-error name="address" class="error-message" />
          </div>

          <div class="form-row">
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
                <option v-for="lga in localGovs" :key="lga" :value="lga.value">
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

          <div>
            <div class="form-group mb-4">
              <label class="form-label">Admission Number *</label>
              <vee-form-field type="text" v-model="formData.admission_number" name="admission_number" :class="[
                'form-input',
                errors.admission_number ? 'is-invalid' : '',
              ]" placeholder="e.g., AGP/SS/2022/045" />
              <vee-form-error name="admission_number" class="error-message" />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Admitted Class *</label>
              <vee-form-field as="select" v-model="formData.admitted_class" name="admitted_class" :class="[
                'form-input',
                errors.admitted_class ? 'is-invalid' : '',
              ]">
                <option value="" selected disabled>
                  Select admitted class
                </option>
                <option v-for="(sClass, index) in allRowClasses" :key="index" :value="sClass.id">
                  {{ sClass.class_name }}
                </option>
              </vee-form-field>
              <vee-form-error name="admitted_class" class="error-message" />
            </div>
            <div class="form-group">
              <label class="form-label">Current Class *</label>
              <vee-form-field as="select" v-model="formData.current_class_id" name="current_class_id" :class="[
                'form-input',
                errors.current_class_id ? 'is-invalid' : '',
              ]">
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
              <vee-form-field as="select" v-model="formData.admitted_session" name="admitted_session" :class="[
                'form-input',
                errors.admitted_session ? 'is-invalid' : '',
              ]">
                <option value="" selected disabled>Select session</option>
                <option v-for="(session, index) in allRowSessions" :key="index" :value="session.id">
                  {{ session.session_name }}
                </option>
              </vee-form-field>
              <vee-form-error name="admitted_session" class="error-message" />
            </div>

            <div class="form-group">
              <label class="form-label">Current Session *</label>
              <vee-form-field as="select" v-model="formData.current_session_id" name="current_session_id" :class="[
                'form-input',
                errors.current_session_id ? 'is-invalid' : '',
              ]">
                <option value="" selected disabled>Select session</option>
                <option v-for="(session, index) in allRowSessions" :key="index" :value="session.id">
                  {{ session.session_name }}
                </option>
              </vee-form-field>
              <vee-form-error name="current_session_id" class="error-message" />
            </div>
          </div>
        </div>

        <!-- Parent/Guardian Search Section -->
        <div class="form-section">
          <h3 class="section-title">Parent/Guardian Information</h3>

          <div class="parent-search-container">
            <div class="search-input-group">
              <label class="form-label">Search Parent by Phone Number *</label>
              <div class="search-wrapper">
                <input type="text" v-model="parentSearchPhone" class="form-input"
                  placeholder="Enter parent phone number (e.g., 08031234567)" @input="clearParentSelection" />
                <button type="button" class="search-btn" @click="searchParents"
                  :disabled="searchingParent || !parentSearchPhone">
                  <i v-if="!searchingParent" class="fa fa-search"></i>
                  <span v-if="searchingParent" class="spinner"></span>
                  {{ searchingParent ? "Searching..." : "Search Parent" }}
                </button>
              </div>
            </div>

            <!-- Search Results -->
            <div v-if="parentSearchResults.length > 0" class="search-results">
              <p class="results-label">Select a parent:</p>
              <div class="parent-cards">
                <div v-for="parent in parentSearchResults" :key="parent.id" :class="[
                  'parent-card',
                  { selected: formData.parent_id === parent.id },
                ]" @click="selectParent(parent)">
                  <div class="parent-card-header">
                    <i class="fa fa-user-circle"></i>
                    <span class="parent-name">{{ parent.full_name }}</span>
                  </div>
                  <div class="parent-card-details">
                    <div class="detail-item">
                      <i class="fa fa-phone"></i>
                      <span>{{ parent.phone_number }}</span>
                    </div>
                    <div class="detail-item">
                      <i class="fa fa-map-marker"></i>
                      <span>{{ parent.state }}, {{ parent.local_gov }}</span>
                    </div>
                  </div>
                  <div v-if="formData.parent_id === parent.id" class="selected-badge">
                    <i class="fa fa-check-circle"></i> Selected
                  </div>
                </div>
              </div>
            </div>

            <!-- No Results Message -->
            <div v-if="parentSearched && parentSearchResults.length === 0" class="no-results">
              <i class="fa fa-exclamation-circle"></i>
              <p>No parent found with this phone number.</p>
              <p class="hint">
                Please register the parent first or try a different phone
                number.
              </p>
            </div>

            <!-- Selected Parent Display -->
            <div v-if="selectedParent" class="selected-parent-display">
              <div class="selected-parent-header">
                <i class="fa fa-check-circle"></i>
                <span>Selected Parent/Guardian</span>
              </div>
              <div class="selected-parent-info">
                <div class="info-row">
                  <span class="info-label">Name:</span>
                  <span class="info-value">{{ selectedParent.full_name }}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Phone:</span>
                  <span class="info-value">{{
                    selectedParent.phone_number
                    }}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Address:</span>
                  <span class="info-value">{{ selectedParent.address }}</span>
                </div>
              </div>
            </div>

            <vee-form-error name="parent_id" class="error-message" />
          </div>
        </div>

        <!-- Form Actions -->
        <div class="form-actions">
          <button type="button" class="btn btn-cancel" @click="goBack">
            Cancel
          </button>
          <button type="submit" class="btn btn-success" :disabled="loading">
            <span v-if="loading" class="spinner"></span>
            {{ loading ? "Saving..." : "Register Student" }}
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
import { useRouter } from "vue-router";
import nigerianStates from "../../data/nigerianStates";
import nigerianLGs from "../../data/nigerianLGs";
import apiServices from "../../services/apiServices";

const autoFillForm = () => {
  formData.value = {
    full_name: "John Doe",
    dob: "2010-05-12",
    gender: "male",
    blood_group: "O+",
    religion: "islam",
    address: "No 24, Kofar Kade, Gusau",
    state: "Zamfara",
    local_gov: "Gusau",
    admission_number: "AGP/SS/2022/045",
    admitted_class: allRowClasses.value[0]?.id || "",
    admitted_session: allRowSessions.value[0]?.id || "",
    current_class_id: allRowClasses.value[0]?.id || "",
    current_session_id: allRowSessions.value[0]?.id || "",
    parent_id: selectedParent.value?.id || "",
    student_status: "active",
  };
};

const router = useRouter();
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
});

const loading = ref(false);
const states = ref(nigerianStates);
const parentSearchPhone = ref("");
const searchingParent = ref(false);
const parentSearched = ref(false);
const parentSearchResults = ref([]);
const selectedParent = ref(null);
const allRowSessions = ref([]);
const allRowClasses = ref([]);
const isLoadingRowSession = ref(false);
const isLoadingRowClasses = ref(false);

const formData = ref({
  full_name: "",
  dob: "",
  gender: "",
  blood_group: "",
  religion: "",
  address: "",
  state: "",
  local_gov: "",
  admission_number: "",
  admitted_class: "",
  admitted_session: "",
  current_class_id: "",
  current_session_id: "",
  parent_id: "",
  student_status: "active",
});

const localGovs = computed(() => {
  if (!formData.value.state) return [];
  return nigerianLGs[formData.value.state] || [];
});

const onStateChange = () => {
  formData.value.local_gov = "";
};

const selectParent = (parent) => {
  formData.value.parent_id = parent.id;
  selectedParent.value = parent;
};

const searchParents = () => {
  searchingParent.value = true;

  apiServices
    .searchParents(parentSearchPhone.value)
    .then((response) => {
      parentSearchResults.value = response.data.data.parents || [];
    })
    .catch((error) => {
      console.log(error);
      if (error.response?.data?.message) {
        parentSearched.value = true;
        setTimeout(() => {
          parentSearched.value = false;
        }, 5000);
      }
    })
    .finally(() => (searchingParent.value = false));
};

const clearParentSelection = () => {
  if (parentSearchResults.value.length > 0) {
    parentSearchResults.value = [];
    parentSearched.value = false;
    selectedParent.value = null;
    formData.value.parent_id = "";
  }
};

const getAllRowSessions = () => {
  isLoadingRowSession.value = true;
  apiServices
    .getAllRowSessions()
    .then((response) => {
      // The array of roles is inside response.data.data
      allRowSessions.value = response.data.data || [];
    })
    .catch((error) => {
      console.error("Error fetching roles:", error);
    })
    .finally(() => {
      isLoadingRowSession.value = false;
    });
};

const getAllRowClases = () => {
  isLoadingRowClasses.value = true;
  apiServices
    .getAllRowClases()
    .then((response) => {
      // The array of roles is inside response.data.data
      allRowClasses.value = response.data.data || [];
    })
    .catch((error) => {
      console.error("Error fetching roles:", error);
    })
    .finally(() => {
      isLoadingRowClasses.value = false;
    });
};

const goBack = () => {
  router.push("/students");
};

const handleSubmit = async () => {
  loading.value = true;

  apiServices
    .createStudent(formData.value)
    .then((response) => {
      if (response.status == 201) {
        toast.success(
          "Student Registered Successfully",
          `${formData.value.full_name} has been registered successfully.`
        );
        router.push("/students");
      }
    })
    .catch((error) => {
      console.error("Failed to Create Student:", error);
      toast.error(
        "Failed to Create Student",
        error.response?.data?.message ||
        "An error occurred while creating the student. Please try again."
      );
    })
    .finally(() => {
      loading.value = false;
    });
};

const activeSessionStudents = ref([]);
const isLoadingActiveSessionStudents = ref(false);

const fetchActiveSessionStudents = () => {
  isLoadingActiveSessionStudents.value = true;
  apiServices
    .getActivSessionStudents()
    .then((response) => {
      activeSessionStudents.value = response.data.data || [];
      console.log("Active Session Students:", activeSessionStudents.value);
    })
    .catch((error) => {
      console.error("Error fetching active session students:", error);
    })
    .finally(() => {
      isLoadingActiveSessionStudents.value = false;
    });
};

onMounted(() => {
  getAllRowSessions();
  getAllRowClases();
  fetchActiveSessionStudents();
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
  margin-top: 10px;
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

.parent-search-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.search-input-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.search-wrapper {
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;

  .form-input {
    flex: 1;
  }

  .search-btn {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    padding: 0.625rem 1.5rem;
    border-radius: 8px;
    font-size: 0.938rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    white-space: nowrap;
    min-width: 140px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;

    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    }

    &:active:not(:disabled) {
      transform: translateY(0);
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    i {
      font-size: 0.875rem;
    }
  }
}

.search-results {
  margin-top: 1rem;
}

.results-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.75rem;
}

.parent-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
}

.parent-card {
  padding: 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    border-color: #667eea;
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
  }

  &.selected {
    border-color: #667eea;
    background-color: rgba(102, 126, 234, 0.05);
  }
}

.parent-card-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;

  i {
    font-size: 1.5rem;
    color: #667eea;
  }

  .parent-name {
    font-weight: 600;
    color: #111827;
    font-size: 1rem;
  }
}

.parent-card-details {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #6b7280;

  i {
    width: 16px;
    color: #9ca3af;
  }
}

.selected-badge {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background-color: #667eea;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.no-results {
  text-align: center;
  padding: 2rem;
  background-color: #fef3c7;
  border: 1px solid #fbbf24;
  border-radius: 8px;

  i {
    font-size: 2rem;
    color: #f59e0b;
    margin-bottom: 0.75rem;
  }

  p {
    margin: 0.5rem 0;
    color: #92400e;
  }

  .hint {
    font-size: 0.875rem;
    color: #b45309;
  }
}

.selected-parent-display {
  background-color: #f0fdf4;
  border: 2px solid #10b981;
  border-radius: 8px;
  padding: 1rem;
}

.selected-parent-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  font-weight: 600;
  color: #065f46;

  i {
    color: #10b981;
    font-size: 1.25rem;
  }
}

.selected-parent-info {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.info-row {
  display: flex;
  gap: 0.75rem;
}

.info-label {
  font-weight: 600;
  color: #374151;
  min-width: 80px;
}

.info-value {
  color: #6b7280;
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

  .search-wrapper {
    flex-direction: column;

    .search-btn {
      width: 100%;
    }
  }

  .parent-cards {
    grid-template-columns: 1fr;
  }
}
</style>
