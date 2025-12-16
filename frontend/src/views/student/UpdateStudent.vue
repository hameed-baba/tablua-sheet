<template>
  <div class="page">
    <div v-if="isLoadingStudent" class="loading-container">
      <div class="spinner-large"></div>
      <p>Loading student data...</p>
    </div>
    <div class="form-container" v-else>
      <!-- Stepper Indicator -->
      <StepperIndicator :steps="stepLabels" :current-step="currentStep" :allow-click-navigation="true"
        @step-click="goToStep" />

      <!-- Step 1: Student Information -->
      <div v-if="currentStep === 1" class="step-content">
        <h2 class="step-title">Edit Student Information</h2>
        <p class="step-description">
          Update the student's personal and academic details
        </p>

        <vee-form :validation-schema="formValidation" @submit="nextStep" v-slot="{ errors }">
          <!-- Personal Information -->
          <div class="form-section">
            <h3 class="section-title">Personal Information</h3>

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
                <vee-form-field as="select" v-model="formData.blood_group" name="blood_group" :class="[
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

          <!-- Address Information -->
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
                  <option v-for="(lga, index) in localGovs" :key="index" :value="lga.value">
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
              <vee-form-field type="text" v-model="formData.admission_number" name="admission_number" :class="[
                'form-input',
                errors.admission_number ? 'is-invalid' : '',
              ]" placeholder="e.g., AGP/SS/2022/045" />
              <vee-form-error name="admission_number" class="error-message" />
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Status *</label>
                <vee-form-field as="select" v-model="formData.student_status" name="student_status" :class="[
                  'form-input',
                  errors.student_status ? 'is-invalid' : '',
                ]">
                  <option value="active">Active</option>
                  <option value="graduated">Graduated</option>
                  <option value="transferred">Transferred</option>
                  <option value="suspended">Suspended</option>
                  <option value="withdrawn">Withdrawn</option>
                  <option value="leave">Leave</option>
                </vee-form-field>
                <vee-form-error name="student_status" class="error-message" />
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
                    Select current class
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
                ]" @change="onClassChange">
                  <option value="" selected disabled>
                    Select current class
                  </option>
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
                  <option value="">Select session</option>
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
                ]" @change="onSessionChange">
                  <option value="">Select session</option>
                  <option v-for="(session, index) in allRowSessions" :key="index" :value="session.id">
                    {{ session.session_name }}
                  </option>
                </vee-form-field>
                <vee-form-error name="current_session_id" class="error-message" />
              </div>
            </div>
          </div>

          <div class="step-actions">
            <button type="button" class="btn btn-cancel" @click="goBack">
              Cancel
            </button>
            <button type="submit" class="btn btn-primary">
              Next <i class="fa fa-arrow-right"></i>
            </button>
          </div>
        </vee-form>
      </div>

      <!-- Step 2: Assign Subjects -->
      <div v-if="currentStep === 2" class="step-content">
        <h2 class="step-title">Update Subjects</h2>
        <p class="step-description">Update the subjects for this student</p>

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
                <span class="check-count">{{ selectedSubjects.length }} of
                  {{ availableSubjects.length }} selected</span>
                <!-- <span>{{ termAndSession }}</span> -->
                <!-- <span>{{ termAndSession.session }} </span> -->
              </div>
            </label>
          </div>

          <div class="subjects-grid">
            <label v-for="subject in availableSubjects" :key="subject.id" class="subject-card"
              :class="{ selected: isSubjectSelected(subject.school_subject_id) }">
              <input type="checkbox" :checked="isSubjectSelected(subject.school_subject_id)" @change="toggleSubject(subject)" />
              <span class="subject-checkmark"></span>
              <div class="subject-info">
                <h4>{{ subject.Subject.subject_name }}</h4>
                <p v-if="subject.Staff.full_name" class="subject-teacher">
                  <i class="fa fa-user"></i> {{ subject.Staff.full_name }}
                </p>
              </div>
            </label>
          </div>
        </div>

        <div class="step-actions">
          <button type="button" class="btn btn-secondary" @click="previousStep">
            <i class="fa fa-arrow-left"></i> Back
          </button>
          <button type="button" class="btn btn-primary" @click="nextStep">
            Next <i class="fa fa-arrow-right"></i>
          </button>
        </div>
      </div>

      <!-- Step 3: Review & Update -->
      <div v-if="currentStep === 3" class="step-content">
        <h2 class="step-title">Review & Update</h2>
        <p class="step-description">
          Review all changes before updating the student
        </p>

        <div class="review-section">
          <!-- Personal Information Review -->
          <div class="review-card">
            <h3 class="review-title">Personal Information</h3>
            <div class="review-grid">
              <div class="review-item">
                <span class="review-label">Full Name:</span>
                <span class="review-value">{{ formData.full_name }}</span>
              </div>
              <div class="review-item">
                <span class="review-label">Date of Birth:</span>
                <span class="review-value">{{ formatDate(formData.dob) }}</span>
              </div>
              <div class="review-item">
                <span class="review-label">Gender:</span>
                <span class="review-value">{{ formData.gender }}</span>
              </div>
              <div class="review-item">
                <span class="review-label">Blood Group:</span>
                <span class="review-value">{{
                  formData.blood_group || "N/A"
                }}</span>
              </div>
              <div class="review-item">
                <span class="review-label">Religion:</span>
                <span class="review-value">{{ formData.religion }}</span>
              </div>
            </div>
          </div>

          <!-- Address Information Review -->
          <div class="review-card">
            <h3 class="review-title">Address Information</h3>
            <div class="review-grid">
              <div class="review-item">
                <span class="review-label">Address:</span>
                <span class="review-value">{{ formData.address }}</span>
              </div>
              <div class="review-item">
                <span class="review-label">State:</span>
                <span class="review-value">{{
                  getStateName(formData.state)
                }}</span>
              </div>
              <div class="review-item">
                <span class="review-label">Local Government:</span>
                <span class="review-value">{{
                  getLGAName(formData.state, formData.local_gov)
                }}</span>
              </div>
            </div>
          </div>

          <!-- Academic Information Review -->
          <div class="review-card">
            <h3 class="review-title">Academic Information</h3>
            <div class="review-grid">
              <div class="review-item">
                <span class="review-label">Admission Number:</span>
                <span class="review-value">{{
                  formData.admission_number
                }}</span>
              </div>
              <div class="review-item">
                <span class="review-label">Status:</span>
                <span class="review-value badge" :class="getStatusClass(formData.student_status)">
                  {{ formData.student_status }}
                </span>
              </div>
              <div class="review-item">
                <span class="review-label">Admitted Class:</span>
                <span class="review-value">{{
                  getClassName(formData.admitted_class)
                }}</span>
              </div>
              <div class="review-item">
                <span class="review-label">Current Class:</span>
                <span class="review-value">{{
                  getClassName(formData.current_class_id)
                }}</span>
              </div>
              <div class="review-item">
                <span class="review-label">Admitted Session:</span>
                <span class="review-value">{{
                  getSessionName(formData.admitted_session)
                }}</span>
              </div>
              <div class="review-item">
                <span class="review-label">Current Session:</span>
                <span class="review-value">{{
                  getSessionName(formData.current_session_id)
                }}</span>
              </div>
            </div>
          </div>

          <!-- Subjects Review -->
          <div class="review-card">
            <h3 class="review-title">Assigned Subjects</h3>
            <div v-if="selectedSubjects.length === 0" class="no-subjects-review">
              <i class="fa fa-exclamation-circle"></i>
              <p>No subjects selected</p>
            </div>
            <div v-else class="subjects-review">
              <div class="subjects-count">
                <span class="count-label">Total Subjects:</span>
                <span class="count-value">{{ selectedSubjects.length }}</span>
              </div>
              <div class="subjects-list">
                <span v-for="subject in selectedSubjects" :key="subject.id" class="subject-badge">
                  {{ subject.subject_name }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="step-actions">
          <button type="button" class="btn btn-secondary" @click="previousStep">
            <i class="fa fa-arrow-left"></i> Back
          </button>
          <button type="button" class="btn btn-success" @click="handleSubmit" :disabled="loading">
            <span v-if="loading" class="spinner"></span>
            {{ loading ? "Updating..." : "Update Student" }}
          </button>
        </div>
      </div>

      <!-- Step 4: Success -->
      <div v-if="currentStep === 4" class="step-content success-step">
        <div class="success-icon">
          <i class="fa fa-check-circle"></i>
        </div>
        <h2 class="success-title">Student Updated Successfully!</h2>
        <p class="success-message">
          {{ formData.full_name }} has been successfully updated.
        </p>

        <div class="student-summary">
          <div class="summary-item">
            <span class="summary-label">Admission Number:</span>
            <span class="summary-value">{{ formData.admission_number }}</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">Class:</span>
            <span class="summary-value">{{
              getClassName(formData.current_class_id)
            }}</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">Subjects Assigned:</span>
            <span class="summary-value">{{ selectedSubjects.length }}</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">Status:</span>
            <span class="summary-value badge" :class="getStatusClass(formData.student_status)">
              {{ formData.student_status }}
            </span>
          </div>
        </div>

        <div class="success-actions">
          <button type="button" class="btn btn-secondary" @click="goBack">
            <i class="fa fa-users"></i> {{ backButtonLabel }}
          </button>
          <!-- <button type="button" class="btn btn-primary" @click="editAnother">
            <i class="fa fa-edit"></i> Edit Another Student
          </button> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import * as yup from "yup";
import { useToast } from "../../composables/useToast";
import { useRouter, useRoute } from "vue-router";
import nigerianStates from "../../data/nigerianStates";
import nigerianLGs from "../../data/nigerianLGs";
import apiServices from "../../services/apiServices";
import StepperIndicator from "../../components/public/StepperIndicator.vue";

const router = useRouter();
const route = useRoute();
const toast = useToast();

// Stepper state
const currentStep = ref(1);
const stepLabels = [
  "Student Info",
  "Assign Subjects",
  "Review & Update",
  "Success",
];

// Form state
const loading = ref(false);
const isLoadingStudent = ref(false);
const loadingSubjects = ref(false);
const states = ref(nigerianStates);
const allRowSessions = ref([]);
const allRowClasses = ref([]);
const availableSubjects = ref([]);
const selectedSubjects = ref([]);

// Form data
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
  student_status: "active",
});

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
  student_status: yup.string().required("Status is required"),
});

const localGovs = computed(() => {
  if (!formData.value.state) return [];
  return nigerianLGs[formData.value.state] || [];
});

// Navigation functions
const nextStep = () => {
  if (currentStep.value < 4) {
    currentStep.value++;
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Load subjects when moving to step 2
    if (currentStep.value === 2 && formData.value.current_class_id) {
      loadClassSubjects(formData.value.current_class_id);
    }
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

// Navigation context from query parameters
const navigationOrigin = ref(route.query.from || 'students');
const classIdParam = ref(route.query.classId || null);

// Computed property for back button label
const backButtonLabel = computed(() => {
  switch (navigationOrigin.value) {
    case 'search':
      return 'Back to Search';
    case 'class':
      return 'Back to Class';
    case 'students':
    default:
      return 'Back to Students';
  }
});

// Context-aware back navigation
const goBack = () => {
  switch (navigationOrigin.value) {
    case 'search':
      router.push('/students/search');
      break;
    case 'class':
      if (classIdParam.value) {
        router.push(`/classes/${classIdParam.value}/students`);
      } else {
        router.push('/students');
      }
      break;
    case 'students':
    default:
      router.push('/students');
      break;
  }
};

// Form functions
const onStateChange = () => {
  formData.value.local_gov = "";
};

const onClassChange = () => {
  // Load subjects when class changes
  if (formData.value.current_class_id && currentStep.value >= 2) {
    loadClassSubjects(formData.value.current_class_id);
  }
};

const onSessionChange = () => {
  // Update session for selected subjects if needed
  if (selectedSubjects.value.length > 0) {
    // You can update session info for subjects here if needed
  }
};

// Watch for class changes and load subjects
watch(
  () => formData.value.current_class_id,
  (newClassId) => {
    if (newClassId && currentStep.value >= 2) {
      loadClassSubjects(newClassId);
    }
  }
);

// Subject management
const loadClassSubjects = async (classId) => {
  loadingSubjects.value = true;

  try {
    // First, get available subjects for the class
    const response = await apiServices.getClassAssignedSubjectByClassId(classId);
    availableSubjects.value = response.data.data || [];

    // Then, load the student's current subjects
    await loadStudentCurrentSubjects();
  } catch (error) {
    console.error("Error fetching subjects:", error);
    toast.error(
      "Failed to Load Subjects",
      "Could not load subjects for this class"
    );
  } finally {
    loadingSubjects.value = false;
  }
};

const isSubjectSelected = (subjectId) => {
  return selectedSubjects.value.some((s) => s.id === subjectId);
};

const toggleSubject = (subject) => {
  // Use school_subject_id for consistency with how selectedSubjects are stored
  const subjectId = subject.school_subject_id || subject.id;
  const index = selectedSubjects.value.findIndex((s) => s.id === subjectId);
  if (index > -1) {
    selectedSubjects.value.splice(index, 1);
  } else {
    selectedSubjects.value.push({
      id: subjectId,
      subject_name: subject.Subject?.subject_name || subject.subject_name,
      subject_code: subject.Subject?.subject_code || subject.subject_code,
    });
  }
};


const loadStudentCurrentSubjects = async () => {
  const studentId = route.params.id;
  try {
    // Get ALL subjects assigned to the student (all terms)
    const response = await apiServices.getStudentAssignedSubjects(studentId);
    const responseData = response.data.data;


    // Get subjects from all three terms
    const firstTermSubjects = responseData.terms?.first_term?.subjects || [];
    const secondTermSubjects = responseData.terms?.second_term?.subjects || [];
    const thirdTermSubjects = responseData.terms?.third_term?.subjects || [];

    // Combine all subjects
    const combinedSubjects = [
      ...firstTermSubjects,
      ...secondTermSubjects,
      ...thirdTermSubjects,
    ];

    // Create a Map to store unique subjects by school_subject_id
    const uniqueSubjects = new Map();

    combinedSubjects.forEach((subject) => {
      if (!uniqueSubjects.has(subject.school_subject_id)) {
        uniqueSubjects.set(subject.school_subject_id, {
          id: subject.school_subject_id,
          subject_name: subject.subject_name,
          subject_code: subject.subject_code,
        });
      }
    });

    // Convert Map to Array
    selectedSubjects.value = Array.from(uniqueSubjects.values());
  } catch (error) {
    console.error("Error loading student subjects:", error);
    selectedSubjects.value = [];

    // Only show error toast if it's not a 404 (student might not have subjects yet)
    if (error.response?.status !== 404) {
      toast.error("Error", "Failed to load student's assigned subjects");
    }
  }
};

const areAllSubjectsSelected = computed(() => {
  if (availableSubjects.value.length === 0) return false;
  return availableSubjects.value.every((subject) =>
    isSubjectSelected(subject.school_subject_id)
  );
});

const toggleAllSubjects = () => {
  if (areAllSubjectsSelected.value) {
    // Deselect all
    selectedSubjects.value = [];
  } else {
    // Select all
    selectedSubjects.value = availableSubjects.value.map((subject) => ({
      id: subject.school_subject_id,
      subject_name: subject.Subject?.subject_name || subject.subject_name,
      subject_code: subject.Subject?.subject_code || subject.subject_code,
    }));
  }
};

// Helper functions for review step
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const getStateName = (stateValue) => {
  const state = states.value.find((s) => s.value === stateValue);
  return state ? state.label : stateValue;
};

const getLGAName = (stateValue, lgaValue) => {
  if (!stateValue || !lgaValue) return "N/A";
  const lgas = nigerianLGs[stateValue] || [];
  const lga = lgas.find((l) => l.value === lgaValue);
  return lga ? lga.label : lgaValue;
};

const getClassName = (classId) => {
  const classObj = allRowClasses.value.find((c) => c.id === classId);
  return classObj?.class_name || "N/A";
};

const getSessionName = (sessionId) => {
  const session = allRowSessions.value.find((s) => s.id === sessionId);
  return session?.session_name || "N/A";
};

const getStatusClass = (status) => {
  const statusClasses = {
    active: "badge-success",
    graduated: "badge-primary",
    transferred: "badge-info",
    suspended: "badge-warning",
    withdrawn: "badge-danger",
    leave: "badge-secondary",
  };
  return statusClasses[status] || "badge-secondary";
};

// Data loading
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
  apiServices
    .getStudentById(studentId)
    .then((response) => {
      formData.value = response.data.data;
      loadStudentCurrentSubjects();
    })
    .catch((error) => {
      console.error("Error fetching student:", error);
      toast.error("Error", "Failed to load student data.");
    })
    .finally(() => {
      isLoadingStudent.value = false;
    });
};

const handleSubmit = () => {
  loading.value = true;
  const studentId = route.params.id;

  // Prepare the data in the format backend expects
  const payload = {
    student: { ...formData.value },
    subjects: selectedSubjects.value.map((subject) => ({
      school_subject_id: subject.id,
      current_class_id: formData.value.current_class_id,
      current_session_id: formData.value.current_session_id,
    })),
  };


  apiServices
    .updateStudent(studentId, payload)
    .then((response) => {
      toast.success(
        "Student Updated Successfully",
        `${formData.value.full_name} has been updated successfully.`
      );
      currentStep.value = 4; // Move to success step
    })
    .catch((error) => {
      console.error("Failed to Update Student:", error);

      let errorMessage = "An error occurred while updating the student.";

      if (error.response) {
        // The request was made and the server responded with a status code
        console.error("Response error:", error.response.data);
        console.error("Status:", error.response.status);
        console.error("Headers:", error.response.headers);

        errorMessage =
          error.response.data?.message ||
          error.response.data?.error ||
          `Server error: ${error.response.status}`;
      } else if (error.request) {
        // The request was made but no response was received
        console.error("No response received:", error.request);
        errorMessage =
          "No response received from server. Please check your connection.";
      } else {
        // Something happened in setting up the request
        console.error("Request setup error:", error.message);
        errorMessage = error.message;
      }

      toast.error("Failed to Update Student", errorMessage);
    })
    .finally(() => {
      loading.value = false;
    });
};

const editAnother = () => {
  router.push("/students");
};

onMounted(() => {
  getAllRowSessions();
  getAllRowClases();
  loadStudentData();
});
</script>

<style lang="scss" scoped>
/* All the previous styles remain the same, plus these additions for subjects */

// Subjects grid styles (from first example)
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

// Subjects review styles
.no-subjects-review {
  text-align: center;
  padding: 1.5rem;
  color: #6b7280;

  i {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
    color: #9ca3af;
  }

  p {
    margin: 0;
  }
}

.subjects-review {
  .subjects-count {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid #e5e7eb;

    .count-label {
      font-weight: 500;
      color: #374151;
    }

    .count-value {
      font-weight: 600;
      color: #667eea;
    }
  }

  .subjects-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .subject-badge {
    background-color: #e0e7ff;
    color: #3730a3;
    padding: 0.375rem 0.75rem;
    border-radius: 16px;
    font-size: 0.75rem;
    font-weight: 500;
  }
}

/* All other styles from the previous version remain the same */
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

// Review Section Styles
.review-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.review-card {
  background: #f9fafb;
  border-radius: 8px;
  padding: 1.5rem;
  border: 1px solid #e5e7eb;
}

.review-title {
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #e5e7eb;
}

.review-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
}

.review-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.review-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #6b7280;
}

.review-value {
  font-size: 0.938rem;
  font-weight: 500;
  color: #111827;
  word-break: break-word;
}

.badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: capitalize;

  &.badge-success {
    background-color: #d1fae5;
    color: #065f46;
  }

  &.badge-primary {
    background-color: #dbeafe;
    color: #1e40af;
  }

  &.badge-info {
    background-color: #e0f2fe;
    color: #0c4a6e;
  }

  &.badge-warning {
    background-color: #fef3c7;
    color: #92400e;
  }

  &.badge-danger {
    background-color: #fee2e2;
    color: #991b1b;
  }

  &.badge-secondary {
    background-color: #f3f4f6;
    color: #374151;
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

  .badge {
    margin-top: -0.125rem;
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

// Loading state
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  gap: 1rem;

  .spinner-large {
    width: 48px;
    height: 48px;
    border: 4px solid #e5e7eb;
    border-top-color: #667eea;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  p {
    color: #6b7280;
    font-size: 1rem;
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

// Form styles
.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.form-group {
  margin-bottom: 1rem;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #374151;
}

.form-input {
  width: 100%;
  padding: 0.625rem 0.875rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.938rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  &.is-invalid {
    border-color: #ef4444;
  }

  &:disabled {
    background-color: #f9fafb;
    cursor: not-allowed;
  }
}

.error-message {
  display: block;
  margin-top: 0.375rem;
  font-size: 0.875rem;
  color: #ef4444;
}

.btn {
  padding: 0.625rem 1.5rem;
  border-radius: 8px;
  font-size: 0.938rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &.btn-cancel {
    background-color: #f3f4f6;
    color: #374151;

    &:hover {
      background-color: #e5e7eb;
    }
  }

  &.btn-secondary {
    background-color: #6b7280;
    color: white;

    &:hover {
      background-color: #4b5563;
    }
  }

  &.btn-primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;

    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    }
  }

  &.btn-success {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    color: white;

    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
    }
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none !important;
    box-shadow: none !important;
  }
}

.spinner {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@media (max-width: 768px) {
  .form-container {
    padding: 1rem;
  }

  .step-actions,
  .success-actions {
    flex-direction: column;

    button {
      width: 100%;
    }
  }

  .review-grid,
  .subjects-grid {
    grid-template-columns: 1fr;
  }
}
</style>