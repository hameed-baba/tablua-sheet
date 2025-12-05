<template>
  <div class="page">
    <div class="form-container">
      <!-- Stepper Indicator -->
      <StepperIndicator :steps="stepLabels" :current-step="currentStep" :allow-click-navigation="true"
        @step-click="goToStep" />

      <!-- Step 1: Search Parent -->
      <div v-if="currentStep === 1" class="step-content">
        <h2 class="step-title">Search Parent/Guardian</h2>
        <p class="step-description">
          Search for an existing parent/guardian by phone number
        </p>

        <div class="parent-search-section">
          <div class="search-input-group">
            <label class="form-label">Parent Phone Number *</label>
            <div class="search-wrapper">
              <input type="text" v-model="parentSearchPhone" class="form-input"
                placeholder="Enter parent phone number (e.g., 08031234567)" @input="clearParentSelection"
                @keyup.enter="searchParents" />
              <button type="button" class="search-btn" @click="searchParents"
                :disabled="searchingParent || !parentSearchPhone">
                <i v-if="!searchingParent" class="fa fa-search"></i>
                <span v-if="searchingParent" class="spinner"></span>
                {{ searchingParent ? "Searching..." : "Search" }}
              </button>
            </div>
          </div>

          <!-- Search Results -->
          <div v-if="parentSearchResults.length > 0" class="search-results">
            <p class="results-label">Select a parent:</p>
            <div class="parent-cards">
              <div v-for="parent in parentSearchResults" :key="parent.id" :class="[
                'parent-card',
                { selected: selectedParent?.id === parent.id },
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
                <div v-if="selectedParent?.id === parent.id" class="selected-badge">
                  <i class="fa fa-check-circle"></i> Selected
                </div>
              </div>
            </div>
          </div>

          <!-- No Results -->
          <div v-if="parentSearched && parentSearchResults.length === 0" class="no-results">
            <i class="fa fa-exclamation-circle"></i>
            <p>No parent found with this phone number.</p>
            <p class="hint">
              Please register the parent first or try a different phone number.
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
                <span class="info-value">{{
                  selectedParent.full_name
                  }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Phone:</span>
                <span class="info-value">{{
                  selectedParent.phone_number
                  }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Address:</span>
                <span class="info-value">{{
                  selectedParent.address
                  }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="step-actions">
          <button type="button" class="btn btn-cancel" @click="goBack">
            Cancel
          </button>
          <button type="button" class="btn btn-primary" @click="nextStep" :disabled="!selectedParent">
            Next <i class="fa fa-arrow-right"></i>
          </button>
        </div>
      </div>

      <!-- Step 2: Student Registration Form -->
      <div v-if="currentStep === 2" class="step-content">
        <h2 class="step-title">Student Information</h2>
        <p class="step-description">
          Fill in the student's personal and academic details
        </p>

        <vee-form :validation-schema="formValidation" @submit="nextStep" v-slot="{ errors }">
          <!-- Personal Information -->
          <div class="form-section">
            <h3 class="section-title">Personal Information</h3>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Full Name *</label>
                <vee-form-field type="text" v-model="registrationData.student.full_name" name="full_name"
                  :class="['form-input', errors.full_name ? 'is-invalid' : '']" placeholder="Enter full name" />
                <vee-form-error name="full_name" class="error-message" />
              </div>
              <div class="form-group">
                <label class="form-label">Date of Birth *</label>
                <vee-form-field type="date" v-model="registrationData.student.dob" name="dob"
                  :class="['form-input', errors.dob ? 'is-invalid' : '']" />
                <vee-form-error name="dob" class="error-message" />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Gender *</label>
                <vee-form-field as="select" v-model="registrationData.student.gender" name="gender"
                  :class="['form-input', errors.gender ? 'is-invalid' : '']">
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </vee-form-field>
                <vee-form-error name="gender" class="error-message" />
              </div>
              <div class="form-group">
                <label class="form-label">Blood Group</label>
                <vee-form-field as="select" v-model="registrationData.student.blood_group" name="blood_group" :class="[
                  'form-input',
                  errors.blood_group ? 'is-invalid' : '',
                ]">
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
              <vee-form-field as="select" v-model="registrationData.student.religion" name="religion"
                :class="['form-input', errors.religion ? 'is-invalid' : '']">
                <option value="">Select religion</option>
                <option value="islam">Islam</option>
                <option value="christianity">Christianity</option>
                <option value="other">Other</option>
              </vee-form-field>
              <vee-form-error name="religion" class="error-message" />
            </div>
          </div>

          <!-- Address Information -->
          <div class="form-section">
            <h3 class="section-title">Address Information</h3>

            <div class="form-group mb-4">
              <label class="form-label">Address *</label>
              <vee-form-field type="text" v-model="registrationData.student.address" name="address"
                :class="['form-input', errors.address ? 'is-invalid' : '']" placeholder="Enter full address" />
              <vee-form-error name="address" class="error-message" />
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">State *</label>
                <vee-form-field as="select" v-model="registrationData.student.state" name="state"
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
                <vee-form-field as="select" v-model="registrationData.student.local_gov" name="local_gov"
                  :class="['form-input', errors.local_gov ? 'is-invalid' : '']"
                  :disabled="!registrationData.student.state">
                  <option value="">Select LGA</option>
                  <option v-for="lga in localGovs" :key="lga" :value="lga.value">
                    {{ lga.label }}
                  </option>
                </vee-form-field>
                <vee-form-error name="local_gov" class="error-message" />
              </div>
            </div>
          </div>

          <!-- Academic Information -->
          <div class="form-section">
            <h3 class="section-title">Academic Information</h3>

            <div class="form-group mb-4">
              <label class="form-label">Admission Number *</label>
              <vee-form-field type="text" v-model="registrationData.student.admission_number" name="admission_number"
                :class="[
                  'form-input',
                  errors.admission_number ? 'is-invalid' : '',
                ]" placeholder="e.g., AGP/SS/2022/045" />
              <vee-form-error name="admission_number" class="error-message" />
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Admitted Class *</label>
                <vee-form-field as="select" v-model="registrationData.student.admitted_class" name="admitted_class"
                  :class="[
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
                <vee-form-field as="select" v-model="registrationData.student.current_class_id" name="current_class_id"
                  :class="[
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
                <vee-form-field as="select" v-model="registrationData.student.admitted_session" name="admitted_session"
                  :class="[
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
                <vee-form-field as="select" v-model="registrationData.student.current_session_id"
                  name="current_session_id" :class="[
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

          <div class="step-actions">
            <button type="button" class="btn btn-secondary" @click="previousStep">
              <i class="fa fa-arrow-left"></i> Back
            </button>
            <button type="submit" class="btn btn-primary">
              Next <i class="fa fa-arrow-right"></i>
            </button>
          </div>
        </vee-form>
      </div>

      <!-- Step 3: Assign Subjects -->
      <div v-if="currentStep === 3" class="step-content">
        <h2 class="step-title">Assign Subjects</h2>
        <p class="step-description">
          Select the subjects for this student
        </p>

        <div v-if="loadingSubjects" class="loading-state">
          <span class="spinner"></span>
          <p>Loading subjects...</p>
        </div>

        <div v-else-if="availableSubjects.length === 0" class="no-subjects">
          <i class="fa fa-exclamation-circle"></i>
          <p>No subjects available for the selected class.</p>
        </div>

        <div v-else>
          <!-- Check All Header -->
          <div class="subjects-header">
            <label class="check-all-subjects">
              <input type="checkbox" :checked="areAllSubjectsSelected" @change="toggleAllSubjects" />
              <span class="checkmark"></span>
              <div class="check-label-container">
                <span class="check-label">Select All Subjects</span>
                <span class="check-count">{{ registrationData.subjects.length }} of {{ availableSubjects.length }}
                  selected</span>
              </div>
            </label>
          </div>

          <div class="subjects-grid">
            <label v-for="subject in availableSubjects" :key="subject.id" class="subject-card"
              :class="{ selected: isSubjectSelected(subject.id) }">
              <input type="checkbox" :checked="isSubjectSelected(subject.id)" @change="toggleSubject(subject)" />
              <span class="subject-checkmark"></span>
              <div class="subject-info">
                <h4>{{ subject.subject_name }}</h4>
                <p class="subject-code">{{ subject.subject_code }}</p>
                <p v-if="subject.teacher_name" class="subject-teacher">
                  <i class="fa fa-user"></i> {{ subject.teacher_name }}
                </p>
              </div>
            </label>
          </div>
        </div>
        <pre>{{ registrationData }}</pre>

        <div class="step-actions">
          <button type="button" class="btn btn-secondary" @click="previousStep">
            <i class="fa fa-arrow-left"></i> Back
          </button>
          <button type="button" class="btn btn-success" @click="registerStudent"
            :disabled="loading || registrationData.subjects.length === 0">
            <span v-if="loading" class="spinner"></span>
            {{ loading ? "Registering..." : "Register Student" }}
          </button>
        </div>
      </div>

      <!-- Step 4: Success -->
      <div v-if="currentStep === 4" class="step-content success-step">
        <div class="success-icon">
          <i class="fa fa-check-circle"></i>
        </div>
        <h2 class="success-title">Student Registered Successfully!</h2>
        <p class="success-message">
          {{ registeredStudent?.full_name }} has been successfully registered.
        </p>

        <div class="student-summary">
          <div class="summary-item">
            <span class="summary-label">Admission Number:</span>
            <span class="summary-value">{{
              registeredStudent?.admission_number
              }}</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">Class:</span>
            <span class="summary-value">{{
              getClassName(registeredStudent?.current_class_id)
              }}</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">Subjects Assigned:</span>
            <span class="summary-value">{{
              registrationData.subjects.length
              }}</span>
          </div>
        </div>

        <div class="success-actions">
          <button type="button" class="btn btn-secondary" @click="registerFreshStudent">
            <i class="fa fa-user-plus"></i> Register Fresh Student
          </button>
          <button type="button" class="btn btn-primary" @click="registerWithSameParent">
            <i class="fa fa-users"></i> Register Another Child
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import * as yup from "yup";
import { useToast } from "../../composables/useToast";
import { useRouter } from "vue-router";
import nigerianStates from "../../data/nigerianStates";
import nigerianLGs from "../../data/nigerianLGs";
import apiServices from "../../services/apiServices";
import StepperIndicator from "../../components/public/StepperIndicator.vue";

const router = useRouter();
const toast = useToast();

// Stepper state
const currentStep = ref(1);
const stepLabels = ["Search Parent", "Student Info", "Assign Subjects", "Success"];

// Registration data
const registrationData = ref({
  student: {
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
    student_status: "active",
    parent_id: ""
  },
  subjects: [], // Array of { current_class_id, school_subject_id, current_session_id }
});

// Selected parent for display purposes
const selectedParent = ref(null);

const registeredStudent = ref(null);

// Parent search
const parentSearchPhone = ref("");
const searchingParent = ref(false);
const parentSearched = ref(false);
const parentSearchResults = ref([]);

// Form data
const loading = ref(false);
const states = ref(nigerianStates);
const allRowSessions = ref([]);
const allRowClasses = ref([]);
const availableSubjects = ref([]);
const loadingSubjects = ref(false);

// Form validation
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
});

const localGovs = computed(() => {
  if (!registrationData.value.student.state) return [];
  return nigerianLGs[registrationData.value.student.state] || [];
});

// Parent search functions
const searchParents = () => {
  searchingParent.value = true;
  parentSearched.value = false;

  apiServices
    .searchParents(parentSearchPhone.value)
    .then((response) => {
      parentSearchResults.value = response.data.data.parents || [];
      if (parentSearchResults.value.length === 0) {
        parentSearched.value = true;
      }
    })
    .catch((error) => {
      console.log(error);
      parentSearched.value = true;
      toast.error(
        "Search Failed",
        error.response?.data?.message || "Failed to search for parent"
      );
    })
    .finally(() => (searchingParent.value = false));
};

const selectParent = (parent) => {
  selectedParent.value = parent;
  registrationData.value.student.parent_id = parent.id;
};

const clearParentSelection = () => {
  if (parentSearchResults.value.length > 0) {
    parentSearchResults.value = [];
    parentSearched.value = false;
    selectedParent.value = null;
    registrationData.value.student.parent_id = "";
  }
};

// Form functions
const onStateChange = () => {
  registrationData.value.student.local_gov = "";
};

const onClassChange = () => {
  // Load subjects when class changes
  if (registrationData.value.student.current_class_id) {
    loadClassSubjects(registrationData.value.student.current_class_id);
  }
};

// Watch for class changes and load subjects
watch(
  () => registrationData.value.student.current_class_id,
  (newClassId) => {
    if (newClassId) {
      loadClassSubjects(newClassId);
    } else {
      availableSubjects.value = [];
    }
  }
);

const loadClassSubjects = (classId) => {
  loadingSubjects.value = true;
  apiServices
    .getSubjectsByClassId(classId)
    .then((response) => {
      availableSubjects.value = response.data.data.subjects || [];
    })
    .catch((error) => {
      console.error("Error fetching subjects:", error);
      toast.error("Failed to Load Subjects", "Could not load subjects for this class");
    })
    .finally(() => {
      loadingSubjects.value = false;
    });
};

// Subject selection
const isSubjectSelected = (subjectId) => {
  return registrationData.value.subjects.some((s) => s.school_subject_id === subjectId);
};

const toggleSubject = (subject) => {
  const index = registrationData.value.subjects.findIndex(
    (s) => s.school_subject_id === subject.id
  );
  if (index > -1) {
    registrationData.value.subjects.splice(index, 1);
  } else {
    // Add subject in StudentSubjectAssign format
    registrationData.value.subjects.push({
      school_subject_id: subject.id,
      current_class_id: registrationData.value.student.current_class_id,
      current_session_id: registrationData.value.student.current_session_id,
    });
  }
};

// Check All functionality
const areAllSubjectsSelected = computed(() => {
  if (availableSubjects.value.length === 0) return false;
  return availableSubjects.value.every((subject) =>
    isSubjectSelected(subject.id)
  );
});

const toggleAllSubjects = () => {
  if (areAllSubjectsSelected.value) {
    // Deselect all
    registrationData.value.subjects = [];
  } else {
    // Select all - convert to StudentSubjectAssign format
    registrationData.value.subjects = availableSubjects.value.map((subject) => ({
      school_subject_id: subject.id,
      current_class_id: registrationData.value.student.current_class_id,
      current_session_id: registrationData.value.student.current_session_id,
    }));
  }
};

// Navigation
const nextStep = () => {
  if (currentStep.value < 4) {
    currentStep.value++;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
};

const previousStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
};

const goToStep = (step) => {
  if (step < currentStep.value) {
    currentStep.value = step;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
};

const goBack = () => {
  router.push("/students");
};



// Registration
const registerStudent = async () => {
  loading.value = true;

  // Prepare payload with nested structure
  const payload = {
    student: {
      ...registrationData.value.student,
    },
    subjects: registrationData.value.subjects,
  };

  try {
    // Create student with subject assignments
    const response = await apiServices.createStudent(payload);

    if (response.status === 201) {
      registeredStudent.value = response.data.data;

      toast.success(
        "Student Registered Successfully",
        `${payload.student.full_name} has been registered successfully.`
      );
      currentStep.value = 4;
    }
  } catch (error) {
    console.error("Failed to Create Student:", error);
    toast.error(
      "Failed to Register Student",
      error.response?.data?.message ||
      "An error occurred while registering the student. Please try again."
    );
  } finally {
    loading.value = false;
  }
};

const registerAnother = () => {
  // Reset all data
  registrationData.value = {
    student: {
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
      student_status: "active",
      parent_id: "",
    },
    subjects: [],
  };
  selectedParent.value = null;
  registeredStudent.value = null;
  parentSearchPhone.value = "";
  parentSearchResults.value = [];
  parentSearched.value = false;
  currentStep.value = 1;
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const registerFreshStudent = () => {
  // Reset everything including parent
  registrationData.value = {
    student: {
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
      student_status: "active",
      parent_id: "",
    },
    subjects: [],
  };
  selectedParent.value = null;
  registeredStudent.value = null;
  parentSearchPhone.value = "";
  parentSearchResults.value = [];
  parentSearched.value = false;
  currentStep.value = 1;
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const registerWithSameParent = () => {
  // Keep parent, reset student form, skip to Step 2
  registrationData.value.student = {
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
    student_status: "active",
    parent_id: selectedParent.value?.id || "",
  };
  registrationData.value.subjects = [];
  registeredStudent.value = null;
  currentStep.value = 2;
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const getClassName = (classId) => {
  const classObj = allRowClasses.value.find((c) => c.id === classId);
  return classObj?.class_name || "N/A";
};

// Load initial data
const getAllRowSessions = () => {
  apiServices
    .getAllRowSessions()
    .then((response) => {
      allRowSessions.value = response.data.data || [];
    })
    .catch((error) => {
      console.error("Error fetching sessions:", error);
    });
};

const getAllRowClases = () => {
  apiServices
    .getAllRowClases()
    .then((response) => {
      allRowClasses.value = response.data.data || [];
    })
    .catch((error) => {
      console.error("Error fetching classes:", error);
    });
};

onMounted(() => {
  getAllRowSessions();
  getAllRowClases();
});
</script>

<style lang="scss" scoped>
.form-container {
  max-width: 1000px;
  margin-top: 10px;
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.step-content {
  animation: fadeIn 0.3s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.step-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 0.5rem;
}

.step-description {
  color: #6b7280;
  margin-bottom: 2rem;
}

.form-section {
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #e5e7eb;

  &:last-of-type {
    border-bottom: none;
  }
}

.section-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 1.5rem;
}

.step-actions {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
}

// Parent search styles
.parent-search-section {
  margin-bottom: 2rem;
}

.search-input-group {
  margin-bottom: 1.5rem;
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
    min-width: 120px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;

    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
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
  margin-top: 1rem;
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

// Subjects grid
.loading-state,
.no-subjects {
  text-align: center;
  padding: 3rem;
  color: #6b7280;

  i {
    font-size: 2rem;
    margin-bottom: 1rem;
    color: #9ca3af;
  }

  .spinner {
    margin-bottom: 1rem;
  }
}

// Subjects header with Check All
.subjects-header {
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #e5e7eb;
}

.check-all-subjects {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  transition: background-color 0.2s ease;
  width: fit-content;
  position: relative;

  &:hover {
    background-color: rgba(102, 126, 234, 0.05);
  }

  input[type="checkbox"] {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    width: 0;
    height: 0;
  }

  .checkmark {
    width: 20px;
    height: 20px;
    border: 2px solid rgba(102, 126, 234, 0.2);
    border-radius: 6px;
    position: relative;
    transition: all 0.3s ease;
    background: rgba(255, 255, 255, 0.8);
    flex-shrink: 0;
  }

  &:hover .checkmark {
    border-color: #667eea;
    background: white;
  }

  input[type="checkbox"]:checked+.checkmark {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-color: #667eea;
  }

  input[type="checkbox"]:checked+.checkmark::after {
    content: "";
    position: absolute;
    left: 6px;
    top: 2px;
    width: 6px;
    height: 10px;
    border: solid white;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
  }

  .check-label-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex: 1;
    gap: 1rem;
  }

  .check-label {
    font-size: 0.875rem;
    color: #1e293b;
    user-select: none;
    font-weight: 500;
  }

  .check-count {
    font-size: 0.8125rem;
    color: #667eea;
    user-select: none;
    font-weight: 500;
  }
}

.subjects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 0.875rem;
  margin-bottom: 2rem;
}

.subject-card {
  padding: 0.875rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  gap: 0.625rem;
  position: relative;
  align-items: flex-start;

  &:hover {
    border-color: #667eea;
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
  }

  &.selected {
    border-color: #667eea;
    background-color: rgba(102, 126, 234, 0.05);
  }

  input[type="checkbox"] {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    width: 0;
    height: 0;
  }

  .subject-checkmark {
    width: 18px;
    height: 18px;
    border: 2px solid #d1d5db;
    border-radius: 4px;
    position: relative;
    transition: all 0.2s ease;
    background: white;
    flex-shrink: 0;
    margin-top: 2px;
  }

  &:hover .subject-checkmark {
    border-color: #667eea;
  }

  input[type="checkbox"]:checked+.subject-checkmark {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-color: #667eea;
  }

  input[type="checkbox"]:checked+.subject-checkmark::after {
    content: "";
    position: absolute;
    left: 5px;
    top: 1px;
    width: 5px;
    height: 9px;
    border: solid white;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
  }
}

.subject-info {
  flex: 1;
  min-width: 0;

  h4 {
    margin: 0 0 0.25rem 0;
    font-size: 0.875rem;
    font-weight: 600;
    color: #111827;
    line-height: 1.3;
  }

  .subject-code {
    font-size: 0.75rem;
    color: #6b7280;
    margin: 0 0 0.375rem 0;
  }

  .subject-teacher {
    font-size: 0.75rem;
    color: #667eea;
    margin: 0;

    i {
      margin-right: 0.25rem;
    }
  }
}

// Success step
.success-step {
  text-align: center;
  padding: 2rem 0;
}

.success-icon {
  i {
    font-size: 5rem;
    color: #10b981;
    margin-bottom: 1rem;
  }
}

.success-title {
  font-size: 1.875rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 0.5rem;
}

.success-message {
  font-size: 1.125rem;
  color: #6b7280;
  margin-bottom: 2rem;
}

.student-summary {
  background-color: #f9fafb;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 0;
  border-bottom: 1px solid #e5e7eb;

  &:last-child {
    border-bottom: none;
  }
}

.summary-label {
  font-weight: 600;
  color: #374151;
}

.summary-value {
  color: #6b7280;
}

.success-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}

@media (max-width: 768px) {
  .form-container {
    padding: 1rem;
  }

  .step-actions {
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

  .subjects-grid {
    grid-template-columns: 1fr;
  }

  .success-actions {
    flex-direction: column;

    button {
      width: 100%;
    }
  }
}
</style>
