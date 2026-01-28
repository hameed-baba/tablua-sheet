<template>
  <BaseModal :show="showModal" title="Register New Parent" @close="closeModal" size="large">
    <vee-form
      :validation-schema="formValidation"
      @submit="handleSubmit"
      v-slot="{ errors }"
    >
      <div class="form-row mt-0">
        <div class="form-group">
          <label class="form-label">Full Name *</label>
          <vee-form-field
            type="text"
            v-model="formData.full_name"
            name="full_name"
            :class="['form-input', errors.full_name ? 'is-invalid' : '']"
            placeholder="Enter full name"
          />
          <vee-form-error name="full_name" class="error-message" />
        </div>
        <div class="form-group">
          <label class="form-label">Phone Number *</label>
          <vee-form-field
            type="text"
            v-model="formData.phone_number"
            name="phone_number"
            :class="['form-input', errors.phone_number ? 'is-invalid' : '']"
            placeholder="e.g., 08031234567"
          />
          <vee-form-error name="phone_number" class="error-message" />
        </div>
      </div>

      <div class="form-row mt-3">
        <div class="form-group">
          <label class="form-label">Gender *</label>
          <vee-form-field
            as="select"
            v-model="formData.gender"
            name="gender"
            :class="['form-input', errors.gender ? 'is-invalid' : '']"
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </vee-form-field>
          <vee-form-error name="gender" class="error-message" />
        </div>
        <div class="form-group">
          <label class="form-label">Religion *</label>
          <vee-form-field
            as="select"
            v-model="formData.religion"
            name="religion"
            :class="['form-input', errors.religion ? 'is-invalid' : '']"
          >
            <option value="">Select religion</option>
            <option value="islam">Islam</option>
            <option value="christianity">Christianity</option>
            <option value="other">Other</option>
          </vee-form-field>
          <vee-form-error name="religion" class="error-message" />
        </div>
      </div>

      <div class="form-group mt-3">
        <label class="form-label">Address *</label>
        <vee-form-field
          type="text"
          v-model="formData.address"
          name="address"
          :class="['form-input', errors.address ? 'is-invalid' : '']"
          placeholder="Enter full address"
        />
        <vee-form-error name="address" class="error-message" />
      </div>

      <div class="form-row mt-3">
        <div class="form-group">
          <label class="form-label">State *</label>
          <vee-form-field
            as="select"
            v-model="formData.state"
            name="state"
            :class="['form-input', errors.state ? 'is-invalid' : '']"
            @change="onStateChange"
          >
            <option value="">Select state</option>
            <option
              v-for="state in states"
              :key="state.name"
              :value="state.value"
            >
              {{ state.label }}
            </option>
          </vee-form-field>
          <vee-form-error name="state" class="error-message" />
        </div>
        <div class="form-group">
          <label class="form-label">Local Government *</label>
          <vee-form-field
            as="select"
            v-model="formData.local_gov"
            name="local_gov"
            :class="['form-input', errors.local_gov ? 'is-invalid' : '']"
            :disabled="!formData.state"
          >
            <option value="">Select LGA</option>
            <option v-for="lga in localGovs" :key="lga" :value="lga.value">
              {{ lga.label }}
            </option>
          </vee-form-field>
          <vee-form-error name="local_gov" class="error-message" />
        </div>
      </div>
      
      <div class="modal-actions">
        <button type="button" class="btn btn-cancel" @click="closeModal">
          Cancel
        </button>
        <button type="submit" class="btn btn-success" :disabled="loading">
          <span v-if="loading" class="spinner"></span>
          {{ loading ? "Registering..." : "Register Parent" }}
        </button>
      </div>
    </vee-form>
    
    <div v-if="errorMessage" class="error-alert">
      <i class="fa fa-exclamation-circle"></i>
      {{ errorMessage }}
    </div>
  </BaseModal>
</template>

<script setup>
import BaseModal from "../../../components/public/BaseModal.vue";
import { ref, computed } from "vue";
import * as yup from "yup";
import { useToast } from "../../../composables/useToast";
import apiServices from "../../../services/apiServices";
import nigerianStates from "../../../data/nigerianStates";
import nigerianLGs from "../../../data/nigerianLGs";

const emits = defineEmits(["parent-registered"]);
const toast = useToast();

const formValidation = yup.object({
  full_name: yup.string().required("Full name is required"),
  phone_number: yup
    .string()
    .required("Phone number is required")
    .matches(
      /^([+]234|234|0){1}[7-9]{1}[0-1]{1}[0-9]{8}$/,
      "Invalid phone number"
    ),
  gender: yup.string().required("Gender is required"),
  religion: yup.string().required("Religion is required"),
  address: yup.string().required("Address is required"),
  state: yup.string().required("State is required"),
  local_gov: yup.string().required("Local government is required"),
});

const showModal = ref(false);
const loading = ref(false);
const errorMessage = ref("");
const states = ref(nigerianStates);

const formData = ref({
  full_name: "",
  phone_number: "",
  gender: "",
  religion: "",
  address: "",
  state: "",
  local_gov: "",
});

const localGovs = computed(() => {
  if (!formData.value.state) return [];
  return nigerianLGs[formData.value.state] || [];
});

const onStateChange = () => {
  formData.value.local_gov = "";
};

const openModal = (phoneNumber = "") => {
  showModal.value = true;
  // Pre-fill phone number if provided
  if (phoneNumber) {
    formData.value.phone_number = phoneNumber;
  }
  errorMessage.value = "";
};

const closeModal = () => {
  showModal.value = false;
  // Reset form when closing
  formData.value = {
    full_name: "",
    phone_number: "",
    gender: "",
    religion: "",
    address: "",
    state: "",
    local_gov: "",
  };
  errorMessage.value = "";
};

const handleSubmit = async () => {
  loading.value = true;
  errorMessage.value = "";

  try {
    const response = await apiServices.createParent(formData.value);
    
    if (response.status === 201) {
      const newParent = response.data.data;
      
      toast.success(
        "Parent Registered Successfully",
        `${formData.value.full_name} has been registered successfully.`
      );
      
      // Emit the new parent data to the parent component
      emits("parent-registered", newParent);
      
      closeModal();
    }
  } catch (error) {
    console.error("Error creating parent:", error);
    errorMessage.value =
      error.response?.data?.message ||
      "An error occurred while registering the parent. Please try again.";
  } finally {
    loading.value = false;
  }
};

defineExpose({
  openModal,
  closeModal,
});
</script>

<style lang="scss" scoped>
.error-alert {
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
  padding: 12px 16px;
  border-radius: 8px;
  margin-top: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;

  i {
    color: #dc2626;
  }
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid #e5e7eb;
}

.btn {
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border: none;

  &.btn-cancel {
    background: #f3f4f6;
    color: #374151;

    &:hover {
      background: #e5e7eb;
    }
  }

  &.btn-success {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    color: white;

    &:hover:not(:disabled) {
      background: linear-gradient(135deg, #059669 0%, #047857 100%);
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }
  }
}

.spinner {
  width: 14px;
  height: 14px;
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
</style>