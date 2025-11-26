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
          <label class="form-label">Session Name *</label>
          <vee-form-field
            name="session_id"
            v-model="formData.session_id"
            :class="['form-input', errors.session_id ? 'is-invalid' : '']"
            as="select"
            :disabled="isLoadingRowSession"
          >
            <option value="" disabled selected>Select Session</option>
            <option
              v-for="(session, index) in allRowSessions"
              :key="index"
              :value="session.id"
            >
              {{ session.session_name }}
            </option>
          </vee-form-field>
          <vee-form-error name="session_id" class="error-message" />
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
import { useToast } from "../../../composables/useToast";
import apiServices from "../../../services/apiServices";

const emits = defineEmits(["sendStatus"]);

const allRowSessions = ref([]);
const isLoadingRowSession = ref(false);

const toast = useToast();
const formValidation = yup.object({
  session_id: yup.string().required("Session name is required"),
});

const formData = ref({
  session_id: "",
});

const showModal = ref(false);
const loading = ref(false);

const toggleModal = () => {
  showModal.value = !showModal.value;
};

const getAllRowSessions = () => {
  isLoadingRowSession.value = true;
  apiServices
    .getAllRowSessions()
    .then((response) => {
      // The array of roles is inside response.data.data
      allRowSessions.value = response.data.data || [];
    })
    .catch((error) => {
      console.error("Error fetching roles:", error);
    })
    .finally(() => {
      isLoadingRowSession.value = false;
    });
};

const toggleActivateModal = () => {
  toggleModal();
  getAllRowSessions();
};

const handleSubmit = async () => {
  loading.value = true;

  apiServices
    .activateSession(formData.value.session_id)
    .then((response) => {
      if (response.status == 200) {
        toggleActivateModal();
        toast.success(
          "Successfully",
          `Session has been activated successfully.`
        );
        emits("sendStatus", "success");
      }
    })
    .catch((error) => {
      console.error("Error activating session:", error);
      toast.error(
        "Failed to Activate Session",
        error.response?.data?.message ||
          "An error occurred while activating the session. Please try again."
      );
    })
    .finally(() => {
      loading.value = false;
    });
};

defineExpose({
  toggleActivateModal,
});
</script>

<style lang="scss" scoped>
</style>