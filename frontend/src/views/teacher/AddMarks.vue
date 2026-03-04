<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1>Enter Student Marks</h1>
        <p>Record marks for your assigned classes</p>
      </div>
    </div>

    <!-- Current Term & Session -->
    <div class="term-session-card">
      <div class="term-session-header">
        <h3>Current Academic Period</h3>
      </div>
      <div class="term-session-content">
        <div class="term-info">
          <div class="info-item">
            <span class="info-label">Session:</span>
            <span class="info-value">{{
              termSession.session?.session_name || "Loading..."
            }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Term:</span>
            <span class="info-value">{{
              termSession.term?.term_name || "Loading..."
            }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Class Selection -->
    <div class="selection-card">
      <h3>Select Class & Subject</h3>
      <div class="selection-grid">
        <div class="form-group">
          <label>My Classes</label>
          <select
            v-model="formData.current_class_id"
            class="form-select"
            @change="handleClassChange"
          >
            <option value="">Select Class</option>
            <option
              v-for="cls in getAssignments"
              :key="cls.class_id"
              :value="cls.class_id"
            >
              {{ cls.class_name }}
            </option>
          </select>
        </div>
        <div class="form-group">
          <label>Subjects</label>
          <select v-model="formData.school_subject_id" class="form-select" @change="handleSubjectChange">
            <option value="">Select Subject</option>
            <option
              v-for="subject in subjectToDisplay"
              :key="subject.id"
              :value="subject.id"
            >
              {{ subject.subject_name }}
            </option>
          </select>
        </div>
        <div class="form-group">
          <label>Assessment Type</label>
          <select v-model="formData.assessmentType" class="form-select" @change="handleAssessmentTypeChange">
            <option value="">Select Type</option>
            <option value="CA">Continuous Assessment</option>
            <option value="EXAM">Examination</option>
          </select>
        </div>
      </div>
      <div class="selection-actions">
        <button
          class="btn btn-primary"
          @click="getClassStudents"
          :disabled="!canLoadStudents || loading"
        >
          {{ loading ? "Loading..." : "Load Students" }}
        </button>
      </div>
    </div>

    <!-- Students Marks Entry -->
    <MarksEntryTable
      v-if="studentsLoaded"
      v-model:students="students"
      :assessment-type="formData.assessmentType"
      :class-name="getSelectedClassInfo()"
      :subject-name="getSelectedSubjectName()"
      :submitting="submitting"
      @submit="submitMarks"
      @cancel="cancelEntry"
      @clear-marks="clearAllMarks"
    />

    <!-- Empty State -->
    <div v-else class="empty-state">
      <svg
        width="80"
        height="80"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
        />
      </svg>
      <h3>No Students Loaded</h3>
      <p>Select a class and assessment type to begin entering marks</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import apiServices from "../../services/apiServices";
import { useLoginStore } from "../../store/loginStore";
import { useTeacherAssignedSubjectStore } from "../../store/teacherAssignedSubjectStore";
import { storeToRefs } from "pinia";
import { useToast } from "../../composables/useToast";
import MarksEntryTable from "../../components/add-marks/MarksEntryTable.vue";
// import MarksEntryTable from "../super_admin/eaxm/components/MarksEntryTable.vue";

const toast = useToast();
const store = useTeacherAssignedSubjectStore();
const { getAssignments, isSubjectLoaded } = storeToRefs(store);

const loginStore = useLoginStore();
const selectedClass = ref("");
const assessmentType = ref("");
const selectedTerm = ref("");
const studentsLoaded = ref(false);
const students = ref([]);
const termSession = ref({});
const loading = ref(false);
const submitting = ref(false);

const subjectToDisplay = ref([]);

const formData = ref({
  current_class_id: "",
  school_subject_id: "",
  assessmentType: "",
});

const canLoadStudents = computed(() => {
  return (
    formData.value.current_class_id &&
    formData.value.school_subject_id &&
    formData.value.assessmentType
  );
});

const completedCount = computed(() => {
  return students.value.filter((student) => {
    if (formData.value.assessmentType === "CA") {
      return isValidCAMark(student.caMarks);
    } else {
      return isValidExamMark(student.examMarks);
    }
  }).length;
});

const canSubmit = computed(() => {
  return (
    students.value.length > 0 && completedCount.value === students.value.length
  );
});

// Validation functions needed for submitMarks
const isValidCAMark = (mark) => {
  if (mark === null || mark === "") return false;
  if (mark === "ABS") return true;
  const numMark = parseFloat(mark);
  return !isNaN(numMark) && numMark >= 0 && numMark <= 40;
};

const isValidExamMark = (mark) => {
  if (mark === null || mark === "") return false;
  if (mark === "ABS") return true;
  const numMark = parseFloat(mark);
  return !isNaN(numMark) && numMark >= 0 && numMark <= 60;
};

const getSelectedClassInfo = () => {
  const selected = getAssignments.value.find(
    (cls) => cls.class_id === formData.value.current_class_id
  );
  return selected ? selected.class_name : "";
};

const getSelectedSubjectName = () => {
  const subject = subjectToDisplay.value.find(
    (s) => s.id === formData.value.school_subject_id
  );
  return subject ? subject.subject_name : "";
};

const cancelEntry = () => {
  if (
    confirm("Are you sure you want to cancel? All unsaved data will be lost.")
  ) {
    // Reset form or navigate back
    students.value = [];
    studentsLoaded.value = false;
    formData.value = {
      current_class_id: "",
      school_subject_id: "",
      assessmentType: "",
    };
  }
};

const clearAllMarks = () => {
  students.value.forEach((student) => {
    if (formData.value.assessmentType === "CA") {
      student.caMarks = null;
    } else {
      student.examMarks = null;
    }
  });
  toast.info("Marks Cleared", "All marks have been cleared.");
};

const submitMarks = async () => {
  // Validate that all students have marks entered
  const hasIncompleteMarks = students.value.some((student) => {
    if (formData.value.assessmentType === "CA") {
      return !isValidCAMark(student.caMarks);
    } else {
      return !isValidExamMark(student.examMarks);
    }
  });

  if (hasIncompleteMarks) {
    toast.error(
      "Validation Error",
      "Please complete all marks entry before submitting."
    );
    return;
  }

  submitting.value = true;

  try {
    if (formData.value.assessmentType === "CA") {
      // Filter students with CA marks
      const studentsWithCAMarks = students.value.filter(
        (student) =>
          student.caMarks !== null &&
          student.caMarks !== undefined &&
          student.caMarks !== ""
      );

      if (studentsWithCAMarks.length > 0) {
        await updateCA1Score(studentsWithCAMarks);
      } else {
        toast.warning("No Marks to Submit", "No CA marks found to submit.");
      }
    } else if (formData.value.assessmentType === "EXAM") {
      // Filter students with exam marks
      const studentsWithExamMarks = students.value.filter(
        (student) =>
          student.examMarks !== null &&
          student.examMarks !== undefined &&
          student.examMarks !== ""
      );

      if (studentsWithExamMarks.length > 0) {
        await updateExamScore(studentsWithExamMarks);
      } else {
        toast.warning("No Marks to Submit", "No exam marks found to submit.");
      }
    }
  } catch (error) {
    console.error("Error in submitMarks:", error);
    toast.error(
      "Submission Failed",
      error.message || "Failed to submit marks. Please try again."
    );
  } finally {
    submitting.value = false;
  }
};

const updateCA1Score = async (studentsArray) => {
  // Filter only students whose CA marks have changed
  const changedStudents = studentsArray.filter((studentData) => {
    return String(studentData.caMarks) !== String(studentData.existingCA);
  });

  if (changedStudents.length === 0) {
    toast.info(
      "No Changes Detected",
      "No CA marks have been modified. Nothing to update."
    );
    return Promise.resolve({ status: "success", count: 0 });
  }

  const data = changedStudents.map((studentData) => ({
    student_id: studentData.id,
    current_class_id: formData.value.current_class_id,
    school_subject_id: formData.value.school_subject_id,
    current_session_id: termSession.value.session?.id,
    current_term_id: termSession.value.term?.id,
    ca_1_score:
      studentData.caMarks === "ABS" ? "ABS" : parseFloat(studentData.caMarks),
  }));

  return apiServices
    .updateCA1Score(data)
    .then((response) => {
      const responseData = response.data;

      if (responseData.status === "success") {
        toast.success(
          "CA Scores Updated",
          `CA scores updated successfully for ${
            responseData.count || changedStudents.length
          } students`
        );
      } else if (responseData.status === "partial_success") {
        toast.warning(
          "Partial Success",
          `${responseData.successful_count} CA scores updated successfully, ${responseData.error_count} failed. Check console for details.`
        );

        responseData.errors?.forEach((error) => {
          console.error(`Student ${error.student_id} error:`, error.error);
        });
      }

      return responseData;
    })
    .catch((error) => {
      console.error("Error updating CA1 scores:", error);
      console.error("Full error response:", error.response);

      toast.error(
        "Update Failed",
        error.response?.data?.message ||
          "Failed to update CA scores. Please try again."
      );

      throw error;
    });
};

const updateExamScore = async (studentsArray) => {
  // Filter only students whose exam marks have changed
  const changedStudents = studentsArray.filter((studentData) => {
    return String(studentData.examMarks) !== String(studentData.existingExam);
  });

  if (changedStudents.length === 0) {
    toast.info(
      "No Changes Detected",
      "No exam marks have been modified. Nothing to update."
    );
    return Promise.resolve({ status: "success", count: 0 });
  }

  const data = changedStudents.map((studentData) => ({
    student_id: studentData.id,
    current_class_id: formData.value.current_class_id,
    school_subject_id: formData.value.school_subject_id,
    current_session_id: termSession.value.session?.id,
    current_term_id: termSession.value.term?.id,
    exam_score:
      studentData.examMarks === "ABS"
        ? "ABS"
        : parseFloat(studentData.examMarks),
  }));

  return apiServices
    .updateExamScore(data)
    .then((response) => {
      const responseData = response.data;

      if (responseData.status === "success") {
        toast.success(
          "Exam Scores Updated",
          `Exam scores updated successfully for ${
            responseData.count || changedStudents.length
          } students`
        );
      } else if (responseData.status === "partial_success") {
        console.log("Partial success errors:", responseData.errors);

        toast.warning(
          "Partial Success",
          `${responseData.successful_count} exam scores updated successfully, ${responseData.error_count} failed. Check console for details.`
        );

        responseData.errors?.forEach((error) => {
          console.error(`Student ${error.student_id} error:`, error.error);
        });
      }

      return responseData;
    })
    .catch((error) => {
      console.error("Error updating exam scores:", error);
      console.error("Full error response:", error.response);

      toast.error(
        "Update Failed",
        error.response?.data?.message ||
          "Failed to update exam scores. Please try again."
      );

      throw error;
    });
};

const getTermAndSession = () => {
  apiServices
    .getTermAndSession()
    .then((response) => {
      termSession.value = response.data.data;
    })
    .catch((error) => {
      console.error("Error fetching staff assigned subjects:", error);
    });
};

const getStaffAssigned = () => {
  store.CLEAR_TEACHER_DATA();

  apiServices
    .getStaffAssigned(loginStore.user?.id)
    .then((response) => {
      store.SET_TEACHER_DATA(response.data.data);
    })
    .catch((error) => {
      console.error("Error fetching staff assigned subjects:", error);
    });
};

const getSubjectsToDisplay = () => {
  const selected = getAssignments.value.find(
    (cls) => cls.class_id === formData.value.current_class_id
  );

  subjectToDisplay.value = selected ? selected.subjects : [];
};

const handleClassChange = () => {
  // Reset subject selection when class changes
  formData.value.school_subject_id = "";
  subjectToDisplay.value = [];

  // Reset students
  students.value = [];
  studentsLoaded.value = false;

  // Load subjects for the selected class
  getSubjectsToDisplay();
};

const handleSubjectChange = () => {
  // Reset students when subject changes
  students.value = [];
  studentsLoaded.value = false;
};

const handleAssessmentTypeChange = () => {
  // Reset students when assessment type changes
  students.value = [];
  studentsLoaded.value = false;
};

const getClassStudents = () => {
  loading.value = true;

  const params = {
    current_class_id: formData.value.current_class_id,
    school_subject_id: formData.value.school_subject_id,
    current_session_id: termSession.value.session?.id,
    current_term_id: termSession.value.term?.id,
  };

  apiServices
    .getAssignedSubjectsByFilters(params)
    .then((response) => {
      console.log("Student assigned subjects response:", response.data);

      const responseData = response.data.data;
      const assignments = responseData.assignments || [];

      // Transform assignments to student format
      const transformedStudents = assignments.map((assignment) => ({
        id: assignment.student.id,
        full_name: assignment.student.full_name,
        admission_number: assignment.student.admission_number,
        email: assignment.student.email,
        phone: assignment.student.phone,
        assignment_id: assignment.assignment_id,
        caMarks: assignment.marks.ca_1_score,
        examMarks: assignment.marks.exam_score,
        existingCA: assignment.marks.ca_1_score,
        existingExam: assignment.marks.exam_score,
      }));

      students.value = transformedStudents;
      studentsLoaded.value = true;
    })
    .catch((error) => {
      console.error("Error fetching student assigned subjects:", error);

      if (error.response?.status === 404) {
        toast.warning(
          "No Students Found",
          "No students are assigned to this subject for the selected class, session, and term. Please check the assignments."
        );
      } else {
        toast.error(
          "Failed to Load Students",
          error.response?.data?.message ||
            "An error occurred while fetching student assignments."
        );
      }

      students.value = [];
      studentsLoaded.value = false;
    })
    .finally(() => {
      loading.value = false;
    });
};

onMounted(() => {
  getTermAndSession();
  if (!isSubjectLoaded.value) {
    getStaffAssigned();
  }
});
</script>

<style scoped>
/* Term & Session Card */
.term-session-card {
  background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
  color: white;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.3);
}

.term-session-header h3 {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 16px 0;
  color: white;
}

.term-session-content {
  display: flex;
  justify-content: center;
}

.term-info {
  display: flex;
  gap: 32px;
  align-items: center;
}

.info-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.info-label {
  font-size: 12px;
  font-weight: 500;
  opacity: 0.9;
  margin-bottom: 4px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-value {
  font-size: 16px;
  font-weight: 700;
  color: white;
}

/* Responsive Design for Term Session Card */
@media (max-width: 768px) {
  .term-info {
    gap: 20px;
  }

  .info-value {
    font-size: 14px;
  }
}

.selection-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.selection-card h3 {
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 20px;
}

.selection-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.selection-actions {
  display: flex;
  justify-content: flex-end;
}

.empty-state {
  text-align: center;
  padding: 80px 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.empty-state svg {
  color: #cbd5e1;
  margin-bottom: 20px;
}

.empty-state h3 {
  font-size: 20px;
  color: #475569;
  margin-bottom: 10px;
}

.empty-state p {
  color: #64748b;
  font-size: 14px;
}

@media (max-width: 768px) {
  .selection-grid {
    grid-template-columns: 1fr;
  }

  .marks-header {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }

  .exam-marks-container {
    flex-direction: column;
    gap: 8px;
  }

  .marks-actions {
    flex-direction: column;
  }
}
</style>