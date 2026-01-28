<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1>Add Student Marks</h1>
        <p>Enter examination marks for students</p>
      </div>
    </div>

    <!-- Selection Filters -->
    <div class="marks-selection-card">
      <h3 class="section-title">
        <svg
          width="20"
          height="20"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
        Select Class & Subject
      </h3>

      <div class="selection-grid">
        <div class="form-group">
          <label class="form-label">Session *</label>
          <select
            v-model="selection.session"
            class="form-select"
            @change="loadClasses"
            required
          >
            <option value="">Select Session</option>
            <option
              v-for="session in sessions"
              :key="session.id"
              :value="session.id"
            >
              {{ session.session_name }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">Term *</label>
          <select v-model="selection.term" class="form-select" required>
            <option value="">Select Term</option>
            <option value="1">First Term</option>
            <option value="2">Second Term</option>
            <option value="3">Third Term</option>
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">Class *</label>
          <select
            v-model="selection.class"
            class="form-select"
            @change="handleClassChange"
            required
          >
            <option value="">Select Class</option>
            <option v-for="cls in classes" :key="cls.id" :value="cls.id">
              {{ cls.class_name }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">Subject *</label>
          <select
            v-model="selection.subject"
            class="form-select"
            :disabled="loadingSubjects"
            required
            @change="handleAssessmentTypeChange"
          >
            <option value="">
              {{ loadingSubjects ? "Loading subjects..." : "Select Subject" }}
            </option>
            <option
              v-for="subject in subjects"
              :key="subject.id"
              :value="subject.Subject?.id"
            >
              {{ subject.Subject?.subject_name }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">Assessment Type *</label>
          <select
            v-model="selection.assessmentType"
            class="form-select"
            @change="handleAssessmentTypeChange"
            required
          >
            <option value="">Select Assessment Type</option>
            <option value="CA">Continuous Assessment (CA)</option>
            <option value="EXAM">Examination</option>
          </select>
        </div>
      </div>

      <div class="selection-actions gap-2">
        <button
          class="btn-load-students"
          @click="loadStudentsList"
          :disabled="!canLoadStudents || loading"
        >
          <svg
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
          {{ loading ? "Loading..." : "Load Students" }}
        </button>
        <button class="btn-quick-action auto-fill" @click="autoFillMarks">
          <svg
            width="16"
            height="16"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
          Auto Fill (Test)
        </button>
        <button
          class="btn btn-submit"
          @click="submitMarks"
          :disabled="submitting"
        >
          <span v-if="submitting" class="spinner"></span>
          {{ submitting ? "Submitting..." : "Submit Marks" }}
        </button>
      </div>
    </div>

    <!-- Students Marks Entry -->
    <MarksEntryTable
      v-if="studentsLoaded"
      v-model:students="students"
      :assessment-type="selection.assessmentType"
      :class-name="getSelectedClassName()"
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
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
      <h3>No Students Loaded</h3>
      <p>
        Select session, term, class, and subject above, then click "Load
        Students" to begin entering marks.
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "../../../composables/useToast";
import apiServices from "../../../services/apiServices";
import MarksEntryTable from "./components/MarksEntryTable.vue";

const router = useRouter();
const toast = useToast();

const loading = ref(false);
const submitting = ref(false);
const studentsLoaded = ref(false);
const loadingSubjects = ref(false);

const selection = ref({
  session: "",
  term: "",
  class: "",
  subject: "",
  assessmentType: "",
});

// Data arrays
const sessions = ref([]);
const classes = ref([]);
const subjects = ref([]);
const students = ref([]);

const canLoadStudents = computed(() => {
  return (
    selection.value.session &&
    selection.value.term &&
    selection.value.class &&
    selection.value.subject &&
    selection.value.assessmentType
  );
});

// API Functions
const getAllRowSessions = () => {
  apiServices
    .getAllRowSessions()
    .then((response) => {
      sessions.value = response.data.data || [];
    })
    .catch((error) => {
      console.error("Error fetching sessions:", error);
      toast.error(
        "Failed to Load Sessions",
        "Could not load academic sessions"
      );
    });
};

const getAllRowClases = () => {
  apiServices
    .getAllRowClases()
    .then((response) => {
      classes.value = response.data.data || [];
    })
    .catch((error) => {
      console.error("Error fetching classes:", error);
      toast.error("Failed to Load Classes", "Could not load classes");
    });
};

const loadClassSubjects = (classId) => {
  if (!classId) {
    subjects.value = [];
    return;
  }

  loadingSubjects.value = true;
  apiServices
    .getClassAssignedSubjectByClassId(classId)
    .then((response) => {
      subjects.value = response.data.data || [];
    })
    .catch((error) => {
      console.error("Error fetching subjects:", error);
      toast.error(
        "Failed to Load Subjects",
        "Could not load subjects for this class"
      );
      subjects.value = [];
    })
    .finally(() => {
      loadingSubjects.value = false;
    });
};

const getClassStudents = () => {
  loading.value = true;

  const params = {
    current_class_id: selection.value.class,
    school_subject_id: selection.value.subject,
    current_session_id: selection.value.session,
    current_term_id: selection.value.term,
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
      // toast.success(
      //   "Students Loaded",
      //   `${transformedStudents.length} students loaded successfully. ${
      //     summary.students_with_ca || 0
      //   } have CA marks, ${summary.students_with_exam || 0} have exam marks.`
      // );
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

// Event Handlers
const handleClassChange = () => {
  // Reset subject selection when class changes
  selection.value.subject = "";
  subjects.value = [];

  // Reset students
  students.value = [];
  studentsLoaded.value = false;

  // Load subjects for the selected class
  if (selection.value.class) {
    loadClassSubjects(selection.value.class);
  }
};

const handleAssessmentTypeChange = () => {
  // Reset students when assessment type changes
  students.value = [];
  studentsLoaded.value = false;
};

const loadStudentsList = () => {
  if (!canLoadStudents.value) {
    toast.error(
      "Validation Error",
      "Please complete all required fields (session, term, class, subject, and assessment type)"
    );
    return;
  }

  // Reset students array and load from API
  students.value = [];
  studentsLoaded.value = false;

  getClassStudents();
};

const calculateGrade = (student) => {
  // This function can be removed or simplified since we're not showing grades
  // Keeping it minimal in case it's needed for backend processing
};

// Calculate total score for a student (CA + Exam)
const calculateStudentTotal = (student) => {
  const caScore = parseFloat(student.caMarks || student.existingCA || 0);
  const examScore = parseFloat(student.examMarks || 0);

  // Only calculate if both scores are valid numbers
  if (
    !isNaN(caScore) &&
    !isNaN(examScore) &&
    student.examMarks &&
    student.examMarks !== "ABS"
  ) {
    return caScore + examScore;
  }

  return 0;
};

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

const clearAllMarks = () => {
  students.value.forEach((student) => {
    if (selection.value.assessmentType === "CA") {
      student.caMarks = null;
    } else {
      student.examMarks = null;
    }
  });
  toast.info("Marks Cleared", "All marks have been cleared.");
};

const autoFillMarks = () => {
  // if (
  //   confirm(
  //     "This will auto-fill random marks for all students (for testing purposes). Continue?"
  //   )
  // ) {
  students.value.forEach((student) => {
    if (selection.value.assessmentType === "CA") {
      // Generate random CA marks between 0-40
      const randomMark = Math.floor(Math.random() * 41); // 0 to 40
      student.caMarks = randomMark.toString();
    } else {
      // Generate random Exam marks between 0-60
      const randomMark = Math.floor(Math.random() * 61); // 0 to 60
      student.examMarks = randomMark.toString();
    }
  });
  // toast.success(
  //   "Auto Fill Complete",
  //   `Random marks have been generated for all ${students.value.length} students.`
  // );
  // }
};

const getSelectedClassName = () => {
  const cls = classes.value.find((c) => c.id == selection.value.class);
  return cls ? cls.class_name : "";
};

const getSelectedSubjectName = () => {
  const subject = subjects.value.find((s) => s.id == selection.value.subject);
  return subject ? subject.Subject?.subject_name || subject.subject_name : "";
};

const cancelEntry = () => {
  if (
    confirm("Are you sure you want to cancel? All unsaved data will be lost.")
  ) {
    router.go(-1);
  }
};

const submitMarks = async () => {
  // Validate that all students have marks entered
  const hasIncompleteMarks = students.value.some((student) => {
    if (selection.value.assessmentType === "CA") {
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
    if (selection.value.assessmentType === "CA") {
      // Filter students with CA marks
      const studentsWithCAMarks = students.value.filter(
        (student) =>
          student.caMarks !== null &&
          student.caMarks !== undefined &&
          student.caMarks !== ""
      );

      if (studentsWithCAMarks.length > 0) {
        await updateCA1Score(studentsWithCAMarks);

        // toast.success(
        //   "Marks Submitted Successfully",
        //   `CA marks for ${studentsWithCAMarks.length} students have been submitted successfully.`
        // );
      } else {
        toast.warning("No Marks to Submit", "No CA marks found to submit.");
      }
    } else if (selection.value.assessmentType === "EXAM") {
      // Filter students with exam marks
      const studentsWithExamMarks = students.value.filter(
        (student) =>
          student.examMarks !== null &&
          student.examMarks !== undefined &&
          student.examMarks !== ""
      );

      if (studentsWithExamMarks.length > 0) {
        await updateExamScore(studentsWithExamMarks);

        // toast.success(
        //   "Marks Submitted Successfully",
        //   `Exam marks for ${studentsWithExamMarks.length} students have been submitted successfully.`
        // );
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
    current_class_id: selection.value.class,
    school_subject_id: selection.value.subject,
    current_session_id: selection.value.session,
    current_term_id: selection.value.term,
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
    current_class_id: selection.value.class,
    school_subject_id: selection.value.subject,
    current_session_id: selection.value.session,
    current_term_id: selection.value.term,
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

onMounted(() => {
  getAllRowSessions();
  getAllRowClases();
});
</script>

<style scoped>
.marks-selection-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.section-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 20px;
}

.selection-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 20px;
}

.selection-actions {
  display: flex;
  justify-content: flex-end;
}

.btn-load-students {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.btn-load-students:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.btn-load-students:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.btn-quick-action.auto-fill {
  background: #10b981;
  color: white;
  border-color: #10b981;
}

.btn-quick-action.auto-fill:hover {
  background: #059669;
  border-color: #059669;
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
  max-width: 500px;
  margin: 0 auto;
}

@media (max-width: 768px) {
  .selection-grid {
    grid-template-columns: 1fr;
  }
}
</style>
