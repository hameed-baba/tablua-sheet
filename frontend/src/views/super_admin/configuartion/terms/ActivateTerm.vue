<template>
  <BaseModal
    :show="showModal"
    title="Activate Session"
    @close="toggleActivateModal"
  >
    <vee-form
      :validation-schema="formValidation"
      @submit="handleSubmit"
      v-slot="{ errors }"
    >
      <div class="">
        <div class="form-group mt-0">
          <div class="d-flex justify-content-between">
            <label class="form-label">Session Name * </label>
            <span class="text-muted">({{ allTerm.session_name }})</span>
          </div>
          <vee-form-field
            name="id"
            v-model="formData.id"
            :class="['form-input', errors.id ? 'is-invalid' : '']"
            as="select"
            :disabled="isLoadingRowSession"
          >
            <option value="" disabled selected>Select Session</option>
            <option
              v-for="(term, index) in allTerm?.terms"
              :key="index"
              :value="term.id"
            >
              {{ term.term_name }}
            </option>
          </vee-form-field>
          <vee-form-error name="id" class="error-message" />
        </div>
      </div>

      <div class="modal-actions">
        <button
          type="button"
          class="btn btn-cancel"
          @click="toggleActivateModal"
        >
          Cancel
        </button>
        <button type="submit" class="btn btn-success" :disabled="loading">
          <span v-if="loading" class="spinner"></span>
          {{ loading ? "Activating..." : "Activate Session" }}
        </button>
      </div>
    </vee-form>
  </BaseModal>
</template>

<script setup>
import BaseModal from "@/components/public/BaseModal.vue";
import { ref } from "vue";
import * as yup from "yup";
import { useToast } from "../../../../composables/useToast";
import apiServices from "../../../../services/apiServices";

const emits = defineEmits(["sendStatus"]);
const props = defineProps({
  allTerm: Object,
});

const isLoadingRowSession = ref(false);

const toast = useToast();
const formValidation = yup.object({
  id: yup.string().required("Please select a term to activate"), 
});

const formData = ref({
  id: "",
});

const showModal = ref(false);
const loading = ref(false);

const toggleModal = () => {
  showModal.value = !showModal.value;
};

const handleSubmit = async () => {
  loading.value = true;

  const sessionId = props.allTerm.terms[0]?.session_id; // ✅ get session_id

  apiServices
    .activateTerm(formData.value.id, sessionId) // ✅ send both id and session_id
    .then((response) => {
      if (response.status === 200) {
        toggleModal();
        toast.success("Success", `Term activated successfully.`);
        emits("sendStatus", "success");
      }
    })
    .catch((error) => {
      console.error("Error activating term:", error);
      toast.error(
        "Failed to Activate Term",
        error.response?.data?.message ||
          "An error occurred while activating the term. Please try again."
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