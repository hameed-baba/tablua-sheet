<template>
  <BaseModal :show="showModal" title="Update Class" @close="toggleModal">
    <vee-form
      :validation-schema="formValidation"
      @submit="handleSubmit"
      v-slot="{ errors }"
    >
      <div class="form-row mt-0">
        <div class="form-group">
          <label class="form-label">Class *</label>
          <vee-form-field
            type="text"
            v-model="classToUpdate.class_name"
            name="class_name"
            :class="['form-input', errors.class_name ? 'is-invalid' : '']"
            placeholder="Enter class (e.g., Grade 7)"
          />
          <vee-form-error name="class_name" class="error-message" />
        </div>

        <div class="form-group">
          <label class="form-label">
            <div class="d-flex align-items-center justify-content-between">
              Grading System *
              <i v-if="isLoadingGrade" class="fa fa-spinner fa-spin"></i>
            </div>
          </label>
          <vee-form-field
            as="select"
            v-model="classToUpdate.grade_list_id"
            name="grade_list_id"
            :class="['form-input', errors.grade_list_id ? 'is-invalid' : '']"
            :disabled="isLoadingGrade"
          >
            <option v-if="isLoadingGrade" value="" selected disabled>
              Loading...
            </option>
            <option v-else value="" selected disabled>
              Select grading system
            </option>
            <option
              v-for="(grade, index) in allGrades"
              :key="index"
              :value="grade.id"
            >
              {{ grade.grade_name }}
            </option>
          </vee-form-field>
          <vee-form-error name="grade_list_id" class="error-message" />
        </div>
      </div>

      <div class="form-row mt-3">
        <div class="form-group">
          <label class="form-label">
            <div class="d-flex align-items-center justify-content-between">
              Section *
              <i v-if="isLoadingSection" class="fa fa-spinner fa-spin"></i>
            </div>
          </label>
          <vee-form-field
            as="select"
            v-model="classToUpdate.section_id"
            name="section_id"
            :class="['form-input', errors.section_id ? 'is-invalid' : '']"
            @update:modelValue="(value) => getStaffBySection(value)"
            :diabled="isLoadingGrade"
          >
            <option v-if="isLoadingSection" value="" disabled selected>
              Loading...
            </option>
            <option v-else value="" disabled selected>Select section</option>
            <option
              v-for="(section, index) in allSections"
              :key="index"
              :value="section.id"
              :diabled="isLoadingSection"
            >
              {{ section.section_name }}
            </option>
          </vee-form-field>
          <vee-form-error name="section_id" class="error-message" />
        </div>
        <div class="form-group">
          <label class="form-label">
            <div class="d-flex align-items-center justify-content-between">
              Teacher Name *
              <i v-if="isLoadingStaff" class="fa fa-spinner fa-spin"></i>
            </div>
          </label>
          <vee-form-field
            v-model="classToUpdate.school_staff_id"
            name="school_staff_id"
            :class="['form-input', errors.school_staff_id ? 'is-invalid' : '']"
            as="select"
            :diabled="isLoadingStaff"
          >
            <option v-if="isLoadingStaff" value="" disabled selected>
              Loading...
            </option>
            <option v-else value="" disabled selected>Select staff</option>
            <option
              v-for="(staff, index) in allStaffs"
              :key="index"
              :value="staff.id"
            >
              {{ staff.full_name }}
            </option>
          </vee-form-field>
          <vee-form-error name="school_staff_id" class="error-message" />
        </div>
      </div>

      <div class="modal-actions">
        <button type="button" class="btn btn-cancel" @click="toggleModal">
          Cancel
        </button>
        <button type="submit" class="btn btn-success" :disabled="loading">
          <span v-if="loading" class="spinner"></span>
          {{ loading ? "Updating..." : "Update Class" }}
        </button>
      </div>
    </vee-form>
  </BaseModal>
</template>

<script setup>
import BaseModal from "@/components/public/BaseModal.vue";
import { ref, watch } from "vue";
import * as yup from "yup";
import { useToast } from "../../composables/useToast";
import apiServices from "../../services/apiServices";
import { useRouter } from "vue-router";

const router = useRouter();
const emits = defineEmits(["sendStatus"]);
const toast = useToast();

const props = defineProps({
  classToUpdate: {
    type: Object,
    default: () => ({}),
  },
});

const allGrades = ref([]);
const allSections = ref([]);
const allStaffs = ref([]);
const isLoadingGrade = ref(false);
const isLoadingSection = ref(false);
const isLoadingStaff = ref(false);

const formValidation = yup.object({
  school_staff_id: yup.string().required("Teacher name is required"),
  class_name: yup.string().required("Class is required"),
  section_id: yup.string().required("Section is required"),
  grade_list_id: yup.string().required("Grading system is required"),
});

const showModal = ref(false);
const loading = ref(false);

const toggleModal = () => {
  showModal.value = !showModal.value;
    allStaffs.value = []; 
    
  if (showModal.value === true) {
    getAllGarde();
    getAllSections();
    if (props.classToUpdate?.section_id) {
      getStaffBySection(props.classToUpdate.section_id);
    }
  }
};

const handleSubmit = async () => {
  const payload = {
    id: props.classToUpdate.id,
    school_staff_id: props.classToUpdate.school_staff_id,
    class_name: props.classToUpdate.class_name,
    section_id: props.classToUpdate.section_id,
    grade_list_id: props.classToUpdate.grade_list_id,
  };

  loading.value = true;
  console.log(payload);

  apiServices
    .updateClass(payload.id, payload)
    .then((response) => {
      if (response.status == 200) {
        toggleModal();
        toast.success(
          "Class Updated Successfully",
          `The class for ${props.classToUpdate.class_name} has been updated successfully.`
        );
        emits("sendStatus", "success");
      }
    })
    .catch((error) => {
      console.error("Error updating class:", error);
      toast.error(
        "Failed to Update Class",
        error.response?.data?.message ||
          "An error occurred while updating the class. Please try again."
      );
    })
    .finally(() => {
      loading.value = false;
    });
};

const getAllGarde = () => {
  isLoadingGrade.value = true;
  apiServices
    .getAllGarde()
    .then((response) => {
      // The array of roles is inside response.data.data
      allGrades.value = response.data.data || [];
    })
    .catch((error) => {
      console.error("Error fetching sections:", error);
    })
    .finally(() => {
      isLoadingGrade.value = false;
    });
};

const getAllSections = (page = 1) => {
  isLoadingSection.value = true;
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
      isLoadingSection.value = false;
    });
};

const getStaffBySection = (section_id) => {
  isLoadingStaff.value = true;
  apiServices
    .getStaffBySection(section_id)
    .then((response) => {
      // The array of roles is inside response.data.data
      allStaffs.value = response.data.data || [];
    })
    .catch((error) => {
      console.error("Error fetching staff:", error);
    })
    .finally(() => {
      isLoadingStaff.value = false;
    });
};

watch(allSections, (newVal) => {
  if (
    newVal.length > 0 &&
    props.classToUpdate?.section_id &&
    allStaffs.value.length === 0
  ) {
    getStaffBySection(props.classToUpdate.section_id);
  }
});

defineExpose({
  toggleModal,
});
</script>

<style lang="scss" scoped>
</style>
