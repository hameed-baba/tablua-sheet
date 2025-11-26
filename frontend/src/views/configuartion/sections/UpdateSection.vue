<template>
  <BaseModal
    :show="showModal"
    title="Update Section"
    @close="toggleUpdateModal"
  >
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
            v-model="sectionToUpdate.section_name"
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
        <button type="button" class="btn btn-cancel" @click="toggleUpdateModal">
          Cancel
        </button>
        <button type="submit" class="btn btn-success" :disabled="loading">
          <span v-if="loading" class="spinner"></span>
          {{ loading ? "Saving..." : "Update Section" }}
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
import { useToast } from "../../../composables/useToast";
import apiServices from "../../../services/apiServices";
import { useRouter } from "vue-router";

const emits = defineEmits(["sendStatus"]);
const props = defineProps({
  sectionToUpdate: {
    type: Object,
    default: {},
  },
});

const router = useRouter();
const toast = useToast();
const formValidation = yup.object({
  section_name: yup.string().required("Section name is required"),
});

const showModal = ref(false);
const loading = ref(false);

const toggleUpdateModal = () => {
  showModal.value = !showModal.value;
};

const handleSubmit = async () => {
  loading.value = true;

  apiServices
    .updateSection(props.sectionToUpdate.id, props.sectionToUpdate)
    .then((response) => {
      if (response.status == 200) {
        toggleUpdateModal();
        toast.success(
          "Section Update Successfully",
          `The section ${props.sectionToUpdate.section_name} has been updated successfully.`
        );
        // router.push("/configuration");
        emits("sendStatus", "success");
      }
    })
    .catch((error) => {
      console.error("Error updating section:", error);
      toast.error(
        "Failed to Create Section",
        error.response?.data?.message ||
          "An error occurred while updating the section. Please try again."
      );
    })
    .finally(() => {
      loading.value = false;
    });
};

defineExpose({
  toggleUpdateModal,
});
</script>

<style lang="scss" scoped>
</style>