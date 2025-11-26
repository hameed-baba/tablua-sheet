<template>
  <BaseModal
    :show="showModal"
    @close="toggleModal"
    :title="isEditMode ? 'Edit Subject Assignment' : 'Assign Subject to Class'"
  >
    <form @submit.prevent="handleSubmit">
      <div class="form-row mt-0">
        <div class="form-group">
          <label class="form-label">Subject <span class="required">*</span></label>
          <select
            id="subject"
            v-model="formData.subject_id"
            class="form-input"
            :disabled="isEditMode"
            required
          >
            <option value="" disabled selected>Select Subject</option>
            <option
              v-for="subject in availableSubjects"
              :key="subject.id"
              :value="subject.id"
            >
              {{ subject.subject_name }} ({{ subject.subject_code }})
            </option>
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">Teacher <span class="required">*</span></label>
          <select
            id="teacher"
            v-model="formData.teacher_id"
            class="form-input"
            required
          >
            <option value="" disabled selected>Select Teacher</option>
            <option
              v-for="teacher in teachers"
              :key="teacher.id"
              :value="teacher.id"
            >
              {{ teacher.full_name }}
            </option>
          </select>
        </div>
      </div>

      <div class="modal-actions">
        <button type="button" class="btn btn-cancel" @click="toggleModal">
          Cancel
        </button>
        <button type="submit" class="btn btn-success" :disabled="submitting">
          <span v-if="submitting" class="spinner"></span>
          {{ submitting ? "Saving..." : isEditMode ? "Update" : "Assign" }}
        </button>
      </div>
    </form>
  </BaseModal>
</template>

<script setup>
import { ref } from "vue";
import BaseModal from "../../components/public/BaseModal.vue";
import { useToast } from "../../composables/useToast";

const props = defineProps({
  classId: {
    type: [String, Number],
    required: true,
  },
  classInfo: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(["subject-assigned"]);

const toast = useToast();
const showModal = ref(false);
const submitting = ref(false);
const isEditMode = ref(false);
const availableSubjects = ref([]);
const teachers = ref([]);

const formData = ref({
  subject_id: "",
  teacher_id: "",
  assignment_id: null,
});

const toggleModal = (subjectData = null) => {
  showModal.value = !showModal.value;

  if (showModal.value) {
    if (subjectData) {
      // Edit mode
      isEditMode.value = true;
      formData.value = {
        subject_id: subjectData.subject_id,
        teacher_id: subjectData.teacher_id,
        assignment_id: subjectData.id,
      };
    } else {
      // Add mode
      isEditMode.value = false;
      resetForm();
    }
    loadData();
  }
};

const resetForm = () => {
  formData.value = {
    subject_id: "",
    teacher_id: "",
    assignment_id: null,
  };
};

const loadData = async () => {
  await Promise.all([loadSubjects(), loadTeachers()]);
};

const loadSubjects = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Hardcoded subjects data
  availableSubjects.value = [
    { id: 1, subject_name: 'Mathematics', subject_code: 'MATH101' },
    { id: 2, subject_name: 'English Language', subject_code: 'ENG101' },
    { id: 3, subject_name: 'Physics', subject_code: 'PHY101' },
    { id: 4, subject_name: 'Chemistry', subject_code: 'CHEM101' },
    { id: 5, subject_name: 'Biology', subject_code: 'BIO101' },
    { id: 6, subject_name: 'Computer Science', subject_code: 'CS101' },
    { id: 7, subject_name: 'History', subject_code: 'HIST101' },
    { id: 8, subject_name: 'Geography', subject_code: 'GEO101' },
    { id: 9, subject_name: 'Economics', subject_code: 'ECON101' },
    { id: 10, subject_name: 'Literature', subject_code: 'LIT101' }
  ];
};

const loadTeachers = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Hardcoded teachers data
  teachers.value = [
    { id: 1, full_name: 'Mrs. Emily Davis' },
    { id: 2, full_name: 'Mr. Michael Chen' },
    { id: 3, full_name: 'Mrs. Sarah Johnson' },
    { id: 4, full_name: 'Mr. Ahmed Suleiman' },
    { id: 5, full_name: 'Mrs. Grace Okafor' },
    { id: 6, full_name: 'Mr. David Thompson' },
    { id: 7, full_name: 'Mrs. Fatima Bello' },
    { id: 8, full_name: 'Mr. John Mensah' },
    { id: 9, full_name: 'Mrs. Chika Nwosu' },
    { id: 10, full_name: 'Mr. Peter Smith' }
  ];
};

const handleSubmit = async () => {
  submitting.value = true;

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));

  if (isEditMode.value) {
    toast.success(
      "Subject Updated",
      "Subject assignment has been updated successfully."
    );
  } else {
    toast.success(
      "Subject Assigned",
      "Subject has been assigned to the class successfully."
    );
  }

  emit("subject-assigned");
  toggleModal();
  submitting.value = false;
};

defineExpose({
  toggleModal,
});
</script>
