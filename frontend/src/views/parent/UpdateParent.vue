<template>
  <BaseModal :show="showModal" title="Update Parent" @close="toggleModal">
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
            v-model="parentToUpdate.full_name"
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
            v-model="parentToUpdate.phone_number"
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
            v-model="parentToUpdate.gender"
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
            v-model="parentToUpdate.religion"
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
          v-model="parentToUpdate.address"
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
            v-model="parentToUpdate.state"
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
            v-model="parentToUpdate.local_gov"
            name="local_gov"
            :class="['form-input', errors.local_gov ? 'is-invalid' : '']"
            :disabled="!parentToUpdate.state"
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
        <button type="button" class="btn btn-cancel" @click="toggleModal">
          Cancel
        </button>
        <button type="submit" class="btn btn-success" :disabled="loading">
          <span v-if="loading" class="spinner"></span>
          {{ loading ? "Updating..." : "Update Parent" }}
        </button>
      </div>
    </vee-form>
    <p v-if="errorMessage" class="text-danger text-center mt-3">
      {{ errorMessage }}
    </p>
  </BaseModal>
</template>

<script setup>
import BaseModal from "@/components/public/BaseModal.vue";
import { ref, computed, watch } from "vue";
import * as yup from "yup";
import { useToast } from "../../composables/useToast";
import apiServices from "../../services/apiServices";
import { useRouter } from "vue-router";
import nigerianStates from "../../data/nigerianStates";
import nigerianLGs from "../../data/nigerianLGs";

const router = useRouter();
const emits = defineEmits(["sendStatus"]);
const toast = useToast();

const props = defineProps({
  parentToUpdate: {
    type: Object,
    default: () => ({}),
  },
});

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
const states = ref(nigerianStates);
const errorMessage = ref("");

// const parentToUpdate = ref({
//   full_name: "",
//   phone_number: "",
//   gender: "",
//   religion: "",
//   address: "",
//   state: "",
//   local_gov: "",
// });

const localGovs = computed(() => {
  if (!props.parentToUpdate.state) return [];
  return nigerianLGs[props.parentToUpdate.state] || [];
});

// Watch for changes in parentToUpdate prop
// watch(
//   () => props.parentToUpdate,
//   (newVal) => {
//     if (newVal && Object.keys(newVal).length > 0) {
//       parentToUpdate.value = {
//         full_name: newVal.full_name || "",
//         phone_number: newVal.phone_number || "",
//         gender: newVal.gender || "",
//         religion: newVal.religion || "",
//         address: newVal.address || "",
//         state: newVal.state || "",
//         local_gov: newVal.local_gov || "",
//       };
//     }
//   },
//   { immediate: true, deep: true }
// );

const onStateChange = () => {
  props.parentToUpdate.local_gov = "";
};

const toggleModal = () => {
  showModal.value = !showModal.value;
};

const handleSubmit = async () => {
  loading.value = true;

  // TODO: Replace with actual API call when backend is ready
  apiServices
    .updateParent(props.parentToUpdate.id, props.parentToUpdate)
    .then((response) => {
      if (response.status == 200) {
        toggleModal();
        toast.success(
          "Parent Updated Successfully",
          `${props.parentToUpdate.full_name} has been updated successfully.`
        );
        emits("sendStatus", "success");
      }
    })
    .catch((error) => {
      console.error("Error updating parent:", error);
      errorMessage.value =
        error.response?.data?.message ||
        "An error occurred while creating the parent. Please try again.";
      setTimeout(() => {
        errorMessage.value = "";
      }, 5000);
    })
    .finally(() => {
      loading.value = false;
    });

  // Temporary mock success
};

defineExpose({
  toggleModal,
});
</script>

<style lang="scss" scoped>
</style>
