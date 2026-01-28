<template>
  <div class="page">
    <div class="form-container">
      <vee-form
        class="staff-form"
        :validation-schema="formValidation"
        v-slot="{ errors }"
        @submit="handleSubmit"
      >
        <!-- Personal Information -->
        <div class="form-section">
          <div class="d-flex align-items-center justify-content-between w-100">
            <h3 class="section-title">Personal Information</h3>
            <button type="button" @click="$router.go(-1)" class="add-btn">
              <i class="fa fa-angle-left"></i> Back to staffs
            </button>
          </div>

          <div class="form-group mb-3">
            <label class="form-label">Full Name *</label>
            <vee-form-field
              type="text"
              v-model="form.full_name"
              name="full_name"
              :class="['form-input', errors.full_name]"
              placeholder="Enter full name"
            />
            <vee-form-error
              name="full_name"
              class="text-danger error-message"
            />
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Gender *</label>
              <vee-form-field
                v-model="form.gender"
                name="gender"
                :class="['form-select', errors.gender]"
                as="select"
              >
                <option value="" selected disabled>Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </vee-form-field>
              <vee-form-error name="gender" class="text-danger error-message" />
            </div>
            <div class="form-group">
              <label class="form-label">Date of Birth</label>
              <vee-form-field
                type="date"
                v-model="form.date_of_birth"
                name="date_of_birth"
                :class="['form-input', errors.date_of_birth]"
              />
              <vee-form-error
                name="date_of_birth"
                class="text-danger error-message"
              />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Phone Number *</label>
              <vee-form-field
                type="text"
                v-model="form.phone_number"
                name="phone_number"
                :class="['form-input', errors.phone_number]"
                placeholder="Enter phone number"
              />
              <vee-form-error
                name="phone_number"
                class="text-danger error-message"
              />
            </div>
            <div class="form-group">
              <label class="form-label">Email *</label>
              <vee-form-field
                type="email"
                v-model="form.email"
                name="email"
                :class="['form-input', errors.email]"
                placeholder="Enter email"
              />
              <vee-form-error name="email" class="text-danger error-message" />
            </div>
          </div>

          <div class="form-row">
            <!-- State -->
            <div class="form-group">
              <label class="form-label">State *</label>
              <vee-form-field
                v-model="form.state"
                name="state"
                :class="['form-select', errors.state]"
                as="select"
              >
                <option value="">Select State</option>
                <option
                  v-for="state in states"
                  :key="state"
                  :value="state.value"
                >
                  {{ state.label }}
                </option>
              </vee-form-field>
              <vee-form-error name="state" class="text-danger error-message" />
            </div>

            <!-- Local Government -->
            <div class="form-group">
              <label class="form-label">Local Government *</label>
              <vee-form-field
                v-model="form.local_gov"
                name="local_gov"
                :class="['form-select', errors.local_gov]"
                as="select"
                :disabled="localGovs.length < 0"
              >
                <option value="">Select LGA</option>
                <option v-for="lg in localGovs" :key="lg" :value="lg.value">
                  {{ lg.label }}
                </option>
              </vee-form-field>
              <vee-form-error
                name="local_gov"
                class="text-danger error-message"
              />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Address *</label>
            <vee-form-field
              as="textarea"
              v-model="form.address"
              name="address"
              :class="['form-textarea', errors.address]"
              placeholder="Enter address"
              rows="3"
            />
            <vee-form-error name="address" class="text-danger error-message" />
          </div>
        </div>

        <!-- Employment Info -->
        <div class="form-section">
          <h3 class="section-title">Employment Information</h3>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Employee ID *</label>
              <vee-form-field
                type="text"
                v-model="form.employee_id"
                name="employee_id"
                :class="['form-input', errors.employee_id]"
                placeholder="Enter employee ID eg. XYZ001"
              />
              <vee-form-error
                name="employee_id"
                class="text-danger error-message"
              />
            </div>

            <div class="form-group">
              <label class="form-label">Role *</label>
              <vee-form-field
                v-model="form.role_id"
                name="role_id"
                :class="['form-select', errors.role_id]"
                as="select"
              >
                <option value="">Select Role</option>
                <option
                  v-for="(role, index) in roles"
                  :key="index"
                  :value="role.id"
                >
                  {{ role.role_name }}
                </option>
              </vee-form-field>
              <vee-form-error name="role_id" class="text-danger error-message" />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Date of Employment *</label>
              <vee-form-field
                type="date"
                v-model="form.date_of_employment"
                name="date_of_employment"
                :class="['form-input', errors.date_of_employment]"
              />
              <vee-form-error
                name="date_of_employment"
                class="text-danger error-message"
              />
            </div>

            <div class="form-group">
              <label class="form-label">Salary</label>
              <vee-form-field
                type="number"
                v-model="form.salary"
                name="salary"
                :class="['form-input', errors.salary]"
                placeholder="Enter salary"
              />
              <vee-form-error name="salary" class="text-danger error-message" />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Employment Type</label>
              <vee-form-field
                v-model="form.employment_type"
                name="employment_type"
                :class="['form-select', errors.employment_type]"
                as="select"
              >
                <option value="">Select Type</option>
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="contract">Contract</option>
                <option value="internship">Internship</option>
              </vee-form-field>
              <vee-form-error
                name="employment_type"
                class="text-danger error-message"
              />
            </div>

            <div class="form-group">
              <label class="form-label">Sections</label>
              <div class="multi-select-container">
                <div
                  class="multi-select-dropdown"
                  @click="toggleSectionDropdown"
                >
                  <span
                    v-if="selectedSections.length === 0"
                    class="placeholder"
                  >
                    Select Sections
                  </span>
                  <span v-else class="selected-count">
                    {{ selectedSections.length }} section(s) selected
                  </span>
                  <i class="fa fa-chevron-down dropdown-icon"></i>
                </div>

                <div v-if="showSectionDropdown" class="multi-select-options">
                  <label
                    v-for="(section, index) in sections"
                    :key="index"
                    class="permission-checkbox"
                  >
                    <input
                      type="checkbox"
                      :value="section.id"
                      v-model="selectedSections"
                      @change="updateSectionIds"
                    />
                    <span class="checkmark"></span>
                    <span class="permission-label">{{
                      section.section_name
                    }}</span>
                  </label>
                </div>
              </div>
              <vee-form-field
                type="hidden"
                v-model="form.section_ids"
                name="section_ids"
              />
              <vee-form-error
                name="section_ids"
                class="text-danger error-message"
              />
            </div>
          </div>
        </div>

        <!-- Qualifications -->
        <div class="form-section">
          <h3 class="section-title">Qualifications & Experience</h3>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Highest Qualification *</label>

              <vee-form-field
                v-model="form.qualifications"
                name="qualifications"
                :class="['form-select', errors.qualifications]"
                as="select"
              >
                <option value="" selected disabled>
                  Select Qualifications
                </option>
                <option
                  v-for="qualification in qualifications"
                  :key="qualification"
                  :value="qualification.label"
                >
                  {{ qualification.label }}
                </option>
              </vee-form-field>
              <vee-form-error
                name="qualifications"
                class="text-danger error-message"
              />
            </div>

            <div class="form-group">
              <label class="form-label">Qualification Title *</label>
              <vee-form-field
                type="text"
                v-model="form.qualification_title"
                name="qualification_title"
                :class="['form-input', errors.qualification_title]"
                placeholder="Qualification Title eg (Bsc in Mathematics)"
              />
              <vee-form-error
                name="qualification_title"
                class="text-danger error-message"
              />
            </div>
          </div>

          <div class="form-group mb-3">
            <label class="form-label">Institution *</label>
            <vee-form-field
              type="text"
              v-model="form.institution"
              name="institution"
              class="form-input"
              :class="['form-input', errors.institution]"
              placeholder="Institution attended"
            />
            <vee-form-error
              name="institution"
              class="text-danger error-message"
            />
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Year Obtained *</label>
              <vee-form-field
                type="month"
                v-model="form.year_obtained"
                name="year_obtained"
                :class="['form-input', errors.year_obtained]"
                placeholder="e.g. 2025"
              />
              <vee-form-error
                name="year_obtained"
                class="text-danger error-message"
              />
            </div>

            <div class="form-group">
              <label class="form-label">Years of Experience *</label>
              <vee-form-field
                type="month"
                v-model="form.year_of_experience"
                name="year_of_experience"
                :class="['form-input', errors.year_of_experience]"
                placeholder="Enter year of experience"
              />
              <vee-form-error
                name="year_obtained"
                class="text-year_of_experience error-message"
              />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Specializations</label>
            <vee-form-field
              as="textarea"
              v-model="form.specializations"
              name="specializations"
              :class="['form-textarea', errors.specializations]"
              placeholder="List specializations or subjects taught"
              rows="3"
            />
            <vee-form-error
              name="specializations"
              class="text-danger error-message"
            />
          </div>
        </div>

        <!-- Emergency Contact -->
        <div class="form-section">
          <h3 class="section-title">Emergency Contact</h3>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Contact Name</label>
              <vee-form-field
                type="text"
                v-model="form.emergency_contact_name"
                name="emergency_contact_name"
                :class="['form-input', errors.emergency_contact_name]"
                placeholder="Enter contact name"
              />
              <vee-form-error
                name="emergency_contact_name"
                class="text-danger error-message"
              />
            </div>

            <div class="form-group">
              <label class="form-label">Contact Number</label>
              <vee-form-field
                type="text"
                v-model="form.emergency_contact"
                name="emergency_contact"
                :class="['form-input', errors.emergency_contact]"
                placeholder="Enter contact number"
              />
              <vee-form-error
                name="emergency_contact"
                class="text-danger error-message"
              />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Contact Relation</label>
            <vee-form-field
              type="text"
              v-model="form.emergency_contact_relation"
              name="emergency_contact_relation"
              :class="['form-input', errors.emergency_contact_relation]"
              placeholder="Enter contact relation"
            />
            <vee-form-error
              name="emergency_contact_relation"
              class="text-danger error-message"
            />
          </div>
        </div>

        <!-- Submit -->
        <div class="form-actions">
          <button type="submit" class="btn btn-success" :disabled="loading">
            {{ loading ? "Registering..." : "Register Staff" }}
          </button>
        </div>
      </vee-form>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch, onUnmounted } from "vue";
import * as yup from "yup";
import { getStateName } from "../../../data/nigerianLGs"; // function returns LGAs by state
import nigerianStates from "../../../data/nigerianStates"; // array of state names
import apiServices from "../../../services/apiServices";
import { useToast } from "../../../composables/useToast";
import { useRouter } from "vue-router";

const toast = useToast();
const states = nigerianStates;
const localGovs = ref([]);
const isLoadingRoles = ref(false);
const isLoadingSections = ref(false);
const roles = ref([]);
const sections = ref([]);
const router = useRouter();
const loading = ref(false);
const showSectionDropdown = ref(false);
const selectedSections = ref([]);

const form = ref({
  full_name: "",
  phone_number: "",
  email: "",
  address: "",
  state: "",
  local_gov: "",
  date_of_employment: "",
  role_id:"",
  password: "pwd123",
  status: true,
  has_school_access: true,
  has_system_access: true,
  is_default_password: true,
  section_ids: "",
  gender: "",
  date_of_birth: "",
  employee_id: "",
  salary: "",
  employment_type: "",
  qualifications: "",
  qualification_title: "",
  institution: "",
  year_obtained: "",
  emergency_contact: "",
  emergency_contact_name: "",
  emergency_contact_relation: "",
  year_of_experience: "",
  specializations: "",
});

const qualifications = [
  { value: "SSCE", label: "Senior Secondary Certificate (SSCE)" },
  { value: "ND", label: "National Diploma (ND)" },
  { value: "NCE", label: "National Certificate in Education (NCE)" },
  { value: "HND", label: "Higher National Diploma (HND)" },
  { value: "BSc", label: "Bachelor's Degree (BSc)" },
  { value: "MSc", label: "Master's Degree (MSc)" },
  { value: "PhD", label: "Doctorate (PhD)" },
  { value: "Certificate", label: "Certificate" },
  { value: "Other", label: "Other" },
];

const formValidation = yup.object({
  full_name: yup.string().required("Full name is required"),
  phone_number: yup
    .string()
    .required("Phone number is required")
    .matches(
      /^([+]234|234|0){1}[7-9]{1}[0-1]{1}[0-9]{8}$/,
      "Invalid phone number"
    ),
  email: yup.string().email("Invalid email").required("Email is required"),
  address: yup.string().required("Address is required"),
  state: yup.string().required("State is required"),
  local_gov: yup.string().required("Local government is required"),
  date_of_employment: yup.string().required("Employment date is required"),
  role_id: yup.string().required("Role ID is required"),
  gender: yup.string().required("Gender is required"),
  employee_id: yup.string().required("Employee ID is required"),
  date_of_birth: yup
    .date()
    .nullable()
    .transform((curr, orig) => (orig === "" ? null : curr))
    .notRequired(),
  salary: yup.string().required("Salary is required"),
  employment_type: yup.string().required("Employment type is required"),
  qualifications: yup.string().required("Qualification is required"),
  qualification_title: yup.string().required(),
  institution: yup.string().required(),
  year_obtained: yup
    .string()
    .required("Year obtained is required")
    .min(4, "Year obtained must be 4 digit"),
  emergency_contact: yup
    .string()
    .notRequired()
    .matches(
      /^([+]234|234|0){1}[7-9]{1}[0-1]{1}[0-9]{8}$/,
      "Invalid phone number"
    ),
  emergency_contact_name: yup.string().notRequired(),
  emergency_contact_relation: yup.string().notRequired(),
  specializations: yup.string().required(),
  year_of_experience: yup.string().notRequired(),
});

const handleSubmit = async () => {
  loading.value = true;

  apiServices
    .createStaff(form.value)
    .then((response) => {
      if (response.status == 201) {
        toast.success(
          "Staff Created Successfully",
          `The staff ${form.value.full_name.trim()} has been created successfully.`
        );
        router.push("/staff");
      }
    })
    .catch((error) => {
      console.error("Error fetching roles:", error);
      toast.error(
        "Failed to Create Staff",
        error.response?.data?.message ||
          "An error occurred while creating the staff. Please try again."
      );
    })
    .finally(() => {
      loading.value = false;
    });
};

// Watch when state changes and update LGAs
watch(
  () => form.value.state,
  (newState) => {
    if (newState) {
      localGovs.value = getStateName(newState); // returns array of LGAs
      form.value.local_gov = ""; // reset previously selected LGA
    } else {
      localGovs.value = [];
    }
  }
);

const getAllRoles = () => {
  isLoadingRoles.value = true;
  apiServices
    .getAllRoles()
    .then((response) => {
      // The array of roles is inside response.data.data
      roles.value = response.data.data || [];
    })
    .catch((error) => {
      console.error("Error fetching roles:", error);
    })
    .finally(() => {
      isLoadingRoles.value = false;
    });
};

const getAllSection = (page = 1) => {
  isLoadingSections.value = true;
  apiServices
    .getAllSections(page)
    .then((response) => {
      // The array of roles is inside response.data.data
      sections.value = response.data.data?.schoolsections || [];
    })
    .catch((error) => {
      console.error("Error fetching roles:", error);
    })
    .finally(() => {
      isLoadingSections.value = false;
    });
};

const toggleSectionDropdown = () => {
  showSectionDropdown.value = !showSectionDropdown.value;
};

const updateSectionIds = () => {
  form.value.section_ids = selectedSections.value.join(",");
};

// Close dropdown when clicking outside
const handleClickOutside = (event) => {
  const dropdown = event.target.closest(".multi-select-container");
  if (!dropdown) {
    showSectionDropdown.value = false;
  }
};

onMounted(() => {
  getAllRoles();
  getAllSection(1);
  document.addEventListener("click", handleClickOutside);
});

// Cleanup event listener
onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>



<style scoped>
.multi-select-container {
  position: relative;
  width: 100%;
}

.multi-select-dropdown {
  width: 100%;
  padding: 0.75rem 1rem;
  /* border: 2px solid #e5e7eb; */
  border: 2px solid rgba(102, 126, 234, 0.2);

  border-radius: 8px;
  font-size: 0.95rem;
  background-color: white;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.2s ease;
}

.multi-select-dropdown:hover {
  border-color: #d1d5db;
}

.multi-select-dropdown:focus-within {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.multi-select-dropdown .placeholder {
  color: #9ca3af;
}

.multi-select-dropdown .selected-count {
  color: #374151;
  font-weight: 500;
}

.dropdown-icon {
  font-size: 0.75rem;
  color: #6b7280;
  transition: transform 0.2s;
}

.multi-select-options {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 0.5rem;
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  max-height: 250px;
  overflow-y: auto;
  z-index: 1000;
}

.permission-label {
  font-size: 0.9rem;
  color: #374151;
  font-weight: 500;
}
</style>
