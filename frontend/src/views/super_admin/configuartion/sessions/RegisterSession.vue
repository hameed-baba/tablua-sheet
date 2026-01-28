<template>
  <BaseModal :show="showModal" title="Add New Session" @close="toggleModal">
    <vee-form
      :validation-schema="formValidation"
      @submit="handleSubmit"
      v-slot="{ errors }"
    >
      <!-- <template v-slot="{ errors }"> -->
      <div class="">
        <div class="form-group mt-0">
          <label class="form-label">Session Name *</label>
          <vee-form-field
            type="text"
            v-model="formData.session_name"
            name="session_name"
            :class="['form-input', errors.session_name ? 'is-invalid' : '']"
            placeholder="Enter session name (e.g., 2020/2021)"
          />
          <vee-form-error name="session_name" class="error-message" />
        </div>
      </div>

      <div class="form-row mt-3">
        <div class="form-group">
          <label class="form-label"
            >First Term Begin <small class="text-muted">(Optinal)</small></label
          >
          <vee-form-field
            type="date"
            v-model="formData.first_term_start"
            name="first_term_start"
            :class="['form-input', errors.first_term_start]"
          />
          <vee-form-error
            name="first_term_start"
            class="text-danger error-message"
          />
        </div>
        <div class="form-group">
          <label class="form-label"
            >First Term End <small class="text-muted">(Optinal)</small></label
          >
          <vee-form-field
            type="date"
            v-model="formData.first_term_end"
            name="first_term_end"
            :class="['form-input', errors.first_term_end]"
          />
          <vee-form-error
            name="first_term_end"
            class="text-danger error-message"
          />
        </div>
      </div>

      <div class="form-row mt-3">
        <div class="form-group">
          <label class="form-label"
            >Second Term Begin
            <small class="text-muted">(Optinal)</small></label
          >
          <vee-form-field
            type="date"
            v-model="formData.second_term_start"
            name="second_term_start"
            :class="['form-input', errors.second_term_start]"
          />
          <vee-form-error
            name="second_term_start"
            class="text-danger error-message"
          />
        </div>
        <div class="form-group">
          <label class="form-label"
            >Second Term End <small class="text-muted">(Optinal)</small></label
          >
          <vee-form-field
            type="date"
            v-model="formData.second_term_end"
            name="second_term_end"
            :class="['form-input', errors.second_term_end]"
          />
          <vee-form-error
            name="second_term_end"
            class="text-danger error-message"
          />
        </div>
      </div>

      <div class="form-row mt-3">
        <div class="form-group">
          <label class="form-label"
            >Third Term Begin <small class="text-muted">(Optinal)</small></label
          >
          <vee-form-field
            type="date"
            v-model="formData.third_term_start"
            name="third_term_start"
            :class="['form-input', errors.third_term_start]"
          />
          <vee-form-error
            name="third_term_start"
            class="text-danger error-message"
          />
        </div>
        <div class="form-group">
          <label class="form-label"
            >Third Term End <small class="text-muted">(Optinal)</small></label
          >
          <vee-form-field
            type="date"
            v-model="formData.third_term_end"
            name="third_term_end"
            :class="['form-input', errors.third_term_end]"
          />
          <vee-form-error
            name="third_term_end"
            class="text-danger error-message"
          />
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
          {{ loading ? "Saving..." : "Register Session" }}
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
  session_name: yup.string().required("Session name is required"),

  first_term_start: yup
    .date()
    .nullable()
    .transform((value, originalValue) => (originalValue === "" ? null : value))
    .notRequired(),

  first_term_end: yup
    .date()
    .nullable()
    .transform((value, originalValue) => (originalValue === "" ? null : value))
    .notRequired()
    .test(
      "first-term-end-check",
      "First term end must be after its start",
      function (value) {
        const { first_term_start } = this.parent;
        if (!first_term_start || !value) return true;
        return new Date(value) > new Date(first_term_start);
      }
    ),

  second_term_start: yup
    .date()
    .nullable()
    .transform((value, originalValue) => (originalValue === "" ? null : value))
    .notRequired()
    .test(
      "second-term-start-after-first-end",
      "Second term start must be after first term end",
      function (value) {
        const { first_term_end } = this.parent;
        if (!first_term_end || !value) return true;
        return new Date(value) > new Date(first_term_end);
      }
    )
    .test(
      "second-term-start-before-end",
      "Second term start must be before second term end",
      function (value) {
        const { second_term_end } = this.parent;
        if (!second_term_end || !value) return true;
        return new Date(value) < new Date(second_term_end);
      }
    ),

  second_term_end: yup
    .date()
    .nullable()
    .transform((value, originalValue) => (originalValue === "" ? null : value))
    .notRequired()
    .test(
      "second-term-end-after-start",
      "Second term end must be after its start",
      function (value) {
        const { second_term_start } = this.parent;
        if (!second_term_start || !value) return true;
        return new Date(value) > new Date(second_term_start);
      }
    ),

  third_term_start: yup
    .date()
    .nullable()
    .transform((value, originalValue) => (originalValue === "" ? null : value))
    .notRequired()
    .test(
      "third-term-start-after-second-end",
      "Third term start must be after second term end",
      function (value) {
        const { second_term_end } = this.parent;
        if (!second_term_end || !value) return true;
        return new Date(value) > new Date(second_term_end);
      }
    )
    .test(
      "third-term-start-before-end",
      "Third term start must be before third term end",
      function (value) {
        const { third_term_end } = this.parent;
        if (!third_term_end || !value) return true;
        return new Date(value) < new Date(third_term_end);
      }
    ),

  third_term_end: yup
    .date()
    .nullable()
    .transform((value, originalValue) => (originalValue === "" ? null : value))
    .notRequired()
    .test(
      "third-term-end-after-start",
      "Third term end must be after its start",
      function (value) {
        const { third_term_start } = this.parent;
        if (!third_term_start || !value) return true;
        return new Date(value) > new Date(third_term_start);
      }
    ),
});

const showModal = ref(false);
const loading = ref(false);

const formData = ref({
  session_name: "",
  first_term_start: "",
  first_term_end: "",
  second_term_start: "",
  second_term_end: "",
  third_term_start: "",
  third_term_end: "",
});

const toggleModal = () => {
  showModal.value = !showModal.value;
};

const handleSubmit = async () => {
  loading.value = true;

  apiServices
    .createSession(formData.value)
    .then((response) => {
      if (response.status == 201) {
        toggleModal();
        toast.success(
          "Session Created Successfully",
          `The session ${formData.value.session_name.trim()} has been created successfully.`
        );
        router.push("/configuration");
        emits("sendStatus", "success");
      }
    })
    .catch((error) => {
      console.error("Error creating session:", error);
      toast.error(
        "Failed to Create Session",
        error.response?.data?.message ||
          "An error occurred while creating the session. Please try again."
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