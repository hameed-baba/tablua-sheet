<template>
  <BaseModal :show="showModal" title="Add New Section" @close="toggleModal">
    <vee-form
      :validation-schema="formValidation"
      @submit="handleSubmit"
      v-slot="{ errors }"
    >
      <!-- <template v-slot="{ errors }"> -->
      <div class="">
        <div class="form-group mt-0">
          <label class="form-label">Section Name *</label>
          <vee-form-field
            type="text"
            v-model="formData.section_name"
            name="section_name"
            :class="['form-input', errors.section_name ? 'is-invalid' : '']"
            placeholder="Enter section name (e.g., A, B, C)"
          />
          <vee-form-error name="section_name" class="error-message" />
        </div>
      </div>
      <!-- </template> -->

      <!-- <template #footer> -->
      <div class="modal-actions">
        <button type="button" class="btn btn-cancel" @click="toggleModal">
          Cancel
        </button>
        <button type="submit" class="btn btn-success" :disabled="loading">
          <span v-if="loading" class="spinner"></span>
          {{ loading ? "Saving..." : "Register Section" }}
        </button>
      </div>
    </vee-form>
    <!-- </template> -->
  </BaseModal>
</template>

<script setup>
import BaseModal from "@/components/public/BaseModal.vue";
import { ref } from "vue";
import * as yup from "yup";
import { useToast } from "../../../../composables/useToast";
import apiServices from "../../../../services/apiServices";
import { useRouter } from "vue-router";

const router = useRouter();
const emits = defineEmits(["sendStatus"]);
const toast = useToast();
const formValidation = yup.object({
  section_name: yup.string().required("Section name is required"),
});

const showModal = ref(false);
const loading = ref(false);

const formData = ref({
  section_name: "",
});

const toggleModal = () => {
  showModal.value = !showModal.value;
};

const handleSubmit = async () => {
  loading.value = true;

  apiServices
    .createSection(formData.value)
    .then((response) => {
      if (response.status == 201) {
        toggleModal();
        toast.success(
          "Section Created Successfully",
          `The section ${formData.value.section_name} has been created successfully.`
        );
        router.push("/configuration");
        emits("sendStatus", "success");
      }
    })
    .catch((error) => {
      console.error("Error creating section:", error);
      toast.error(
        "Failed to Create Section",
        error.response?.data?.message ||
          "An error occurred while creating the section. Please try again."
      );
    })
    .finally(() => {
      loading.value = false;
    });
};

defineExpose({
  toggleModal,
});
</script>

<style lang="scss" scoped>
</style>