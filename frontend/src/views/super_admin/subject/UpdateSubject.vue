<template>
  <BaseModal :show="showModal" title="Add New Subject" @close="toggleModal">
    <vee-form
      :validation-schema="formValidation"
      @submit="handleSubmit"
      v-slot="{ errors }"
    >
      <div class="form-group mt-0">
        <label class="form-label">Subject Name *</label>
        <vee-form-field
          type="text"
          v-model="subjectToUpdate.subject_name"
          name="subject_name"
          :class="['form-input', errors.subject_name ? 'is-invalid' : '']"
          placeholder="Enter subject name (e.g., A, B, C)"
        />
        <vee-form-error name="subject_name" class="error-message" />
      </div>

      <div class="form-group mt-3">
        <MultiSelectSections
          :items="allSections"
          label="Sections"
          placeholder="Select Section"
          v-model="subjectToUpdate.section_ids"
          id-key="id"
          label-key="section_name"
          :loading="loading"
          @change="section_erros = ''"
        />
        <p class="error-message" v-if="section_erros">{{ section_erros }}</p>
      </div>

      <div class="modal-actions">
        <button type="button" class="btn btn-cancel" @click="toggleModal">
          Cancel
        </button>
        <button type="submit" class="btn btn-success" :disabled="loading">
          <span v-if="loading" class="spinner"></span>
          {{ loading ? "Updating..." : "Update Section" }}
        </button>
      </div>
    </vee-form>
  </BaseModal>
</template>

<script setup>
import BaseModal from "@/components/public/BaseModal.vue";

import { ref } from "vue";
import * as yup from "yup";
import { useToast } from "../../../composables/useToast";
import apiServices from "../../../services/apiServices";
import { useRouter } from "vue-router";
import MultiSelectSections from "../../../components/public/MultiSelectSections.vue";

const router = useRouter();
const emits = defineEmits(["sendStatus"]);
const toast = useToast();
const formValidation = yup.object({
  subject_name: yup.string().required("Subject  name is required"),
});

const props = defineProps({
  subjectToUpdate: Object,
});

const showModal = ref(false);
const loading = ref(false);
const allSections = ref([]);
const isRegistering = ref(false);
const section_erros = ref("");

const toggleModal = () => {
  showModal.value = !showModal.value;
  if (showModal.value === true) {
    getAllSections();
  }
};

const getAllSections = (page = 1) => {
  loading.value = true;
  apiServices
    .getAllSections(page)
    .then((response) => {
      // The array of roles is inside response.data.data
      allSections.value = response.data.data?.schoolsections || [];
    })
    .catch((error) => {
      console.error("Error fetching sections:", error);
    })
    .finally(() => {
      loading.value = false;
    });
};

const handleSubmit = async () => {
  if (props.subjectToUpdate.section_ids.length === 0) {
    section_erros.value = "At least one section is required";
    return;
  }

  isRegistering.value = true;

  const payload = {
    ...props.subjectToUpdate,
    section_ids: props.subjectToUpdate.section_ids.join(","), // convert array to string
  };

  apiServices
    .updateSubject(payload.id, payload)
    .then((response) => {
      if (response.status == 200) {
        toggleModal();
        toast.success(
          "Subject Updated Successfully",
          `The subject ${props.subjectToUpdate.subject_name} has been updated successfully.`
        );
        emits("sendStatus", "success");
      }
    })
    .catch((error) => {
      console.error("Error updating subject:", error);
      toast.error(
        "Failed to Create Section",
        error.response?.data?.message ||
          "An error occurred while updating the subject. Please try again."
      );
    })
    .finally(() => {
      isRegistering.value = false;
    });
};

defineExpose({
  toggleModal,
});
</script>

<style lang="scss" scoped>
.error-message {
  font-size: 12px;
  color: #ef4444;
}
</style>