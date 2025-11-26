<template>
  <BaseModal :show="showModal" title="Modify Term" @close="toggleModal">
    <vee-form
      :validation-schema="formValidation"
      @submit="handleSubmit"
      v-slot="{ errors }"
    >
      <!-- <template v-slot="{ errors }"> -->
      <div class="">
        <div class="form-group mt-0">
          <label class="form-label">Start Date *</label>
          <vee-form-field
            type="date"
            v-model="termToUpdate.start_date"
            name="start_date"
            :class="['form-input', errors.start_date ? 'is-invalid' : '']"
          />
          <vee-form-error name="start_date" class="error-message" />
        </div>

        <div class="form-group mt-4">
          <label class="form-label">End Date *</label>
          <vee-form-field
            type="date"
            v-model="termToUpdate.end_date"
            name="end_date"
            :class="['form-input', errors.end_date ? 'is-invalid' : '']"
          />
          <vee-form-error name="end_date" class="error-message" />
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
          {{ loading ? "Modifying..." : "Modify Term" }}
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

const emits = defineEmits(["sendStatus"]);

const props = defineProps({
  termToUpdate: Object,
});

// const formData = ref({
//   start_date: "",
//   end_date: "",
// });

const toast = useToast();
const formValidation = yup.object({
  start_date: yup
    .date()
    .required("Start date is required")
    .typeError("Invalid date format"),
  end_date: yup
    .date()
    .required("End date is required")
    .typeError("Invalid date format")
    .min(yup.ref("start_date"), "End date cannot be earlier than start date"),
});

const showModal = ref(false);
const loading = ref(false);

const toggleModal = () => {
  showModal.value = !showModal.value;
};

const handleSubmit = async () => {
  loading.value = true;

  apiServices
    .updateTerm(props.termToUpdate.id, props.termToUpdate)
    .then((response) => {
      if (response.status == 200) {
        toggleModal();
        toast.success(
          "Successfully",
          `The term dates has been modifyed successfully.`
        );
        // router.push("/configuration");
        emits("sendStatus", "success");
      }
    })
    .catch((error) => {
      console.error("Error modifying term:", error);
      toast.error(
        "Failed to Create Session",
        error.response?.data?.message ||
          "An error occurred while modifying the term. Please try again."
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