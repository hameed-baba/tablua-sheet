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
            v-model="formData.classId"
            class="form-select"
            @change="getSubjectsToDisplay"
          >
            <option value="">Select Class</option>
            <option
              v-for="cls in assignedSubjects.assignments"
              :key="cls.class_id"
              :value="cls.class_id"
            >
              {{ cls.class_name }}
            </option>
          </select>
        </div>
        <div class="form-group">
          <label>Subjects</label>
          <select v-model="formData.subjectId" class="form-select">
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
          <select v-model="assessmentType" class="form-select">
            <option value="">Select Type</option>
            <option value="CA">Continuous Assessment</option>
            <option value="EXAM">Examination</option>
          </select>
        </div>
        
      </div>
      <div class="selection-actions">
        <button
          class="btn btn-primary"
          @click="loadStudents"
          :disabled="!canLoadStudents"
        >
          Load Students
        </button>
      </div>
    </div>

    <!-- Students Marks Entry -->
    <div v-if="studentsLoaded" class="marks-card">
      <div class="marks-header">
        <h3>Enter Marks - {{ getSelectedClassInfo() }}</h3>
        <div class="marks-summary">
          <span class="summary-badge">
            {{ completedCount }}/{{ students.length }} Completed
          </span>
        </div>
      </div>

      <div class="marks-table-container">
        <table class="marks-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Student Name</th>
              <th>Admission No.</th>
              <th v-if="assessmentType === 'CA'">CA Marks (0-40)</th>
              <th v-else-if="assessmentType === 'EXAM'">
                <div class="exam-header">
                  <span>CA Score</span>
                  <span>Exam (0-60)</span>
                  <span>Total</span>
                </div>
              </th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(student, index) in students" :key="student.id">
              <td>{{ index + 1 }}</td>
              <td>
                <div class="student-info">
                  <div class="student-avatar">
                    <span>{{ getInitials(student.name) }}</span>
                  </div>
                  <span>{{ student.name }}</span>
                </div>
              </td>
              <td>{{ student.admissionNumber }}</td>
              <td>
                <div
                  v-if="assessmentType === 'CA'"
                  class="marks-input-container"
                >
                  <input
                    v-model="student.caMarks"
                    type="text"
                    class="marks-input"
                    :class="{
                      valid: isValidCAMark(student.caMarks),
                      invalid: isInvalidCAMark(student.caMarks),
                    }"
                    placeholder="0-40 or ABS"
                    @input="formatMarksInput(student, 'caMarks')"
                  />
                </div>
                <div
                  v-else-if="assessmentType === 'EXAM'"
                  class="exam-marks-container"
                >
                  <div class="ca-score">{{ student.existingCA || "--" }}</div>
                  <div class="exam-input-container">
                    <input
                      v-model="student.examMarks"
                      type="text"
                      class="marks-input exam-input"
                      :class="{
                        valid: isValidExamMark(student.examMarks),
                        invalid: isInvalidExamMark(student.examMarks),
                      }"
                      placeholder="0-60 or ABS"
                      @input="formatMarksInput(student, 'examMarks')"
                    />
                  </div>
                  <div class="total-score">
                    {{ calculateTotal(student) }}
                  </div>
                </div>
              </td>
              <td>
                <span class="status-badge" :class="getStudentStatus(student)">
                  {{ getStudentStatusText(student) }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="marks-actions">
        <button class="btn btn-secondary" @click="clearAllMarks">
          Clear All
        </button>
        <button
          class="btn btn-primary"
          @click="submitMarks"
          :disabled="!canSubmit"
        >
          Submit Marks
        </button>
      </div>
    </div>

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

const loginStore = useLoginStore();
const selectedClass = ref("");
const assessmentType = ref("");
const selectedTerm = ref("");
const studentsLoaded = ref(false);
const students = ref([]);
const termSession = ref({});
const assignedSubjects = ref([]);
// const assignedSubjects = ref({
//   assignments: [],
// });
const subjectToDisplay = ref([]);

const formData = ref({
  classId: "",
  subjectId: "",
  assessmentType: "",
  term: "",
}); 


const canLoadStudents = computed(() => {
  return selectedClass.value && assessmentType.value && selectedTerm.value;
});

const completedCount = computed(() => {
  return students.value.filter((student) => {
    if (assessmentType.value === "CA") {
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

const getInitials = (name) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
};


const loadStudents = () => {
  if (!canLoadStudents.value) return;

  // Mock student data
  const mockStudents = [
    {
      id: 1,
      name: "John Doe",
      admissionNumber: "AGP/SS/2022/001",
      caMarks: "",
      examMarks: "",
      existingCA: 35,
    },
    {
      id: 2,
      name: "Jane Smith",
      admissionNumber: "AGP/SS/2022/002",
      caMarks: "",
      examMarks: "",
      existingCA: 32,
    },
    {
      id: 3,
      name: "Mike Johnson",
      admissionNumber: "AGP/SS/2022/003",
      caMarks: "",
      examMarks: "",
      existingCA: 28,
    },
    {
      id: 4,
      name: "Sarah Wilson",
      admissionNumber: "AGP/SS/2022/004",
      caMarks: "",
      examMarks: "",
      existingCA: 30,
    },
    {
      id: 5,
      name: "David Brown",
      admissionNumber: "AGP/SS/2022/005",
      caMarks: "",
      examMarks: "",
      existingCA: 25,
    },
  ];

  students.value = mockStudents;
  studentsLoaded.value = true;
};

const isValidCAMark = (mark) => {
  if (!mark) return false;
  if (mark === "ABS") return true;
  const num = parseFloat(mark);
  return !isNaN(num) && num >= 0 && num <= 40;
};

const isValidExamMark = (mark) => {
  if (!mark) return false;
  if (mark === "ABS") return true;
  const num = parseFloat(mark);
  return !isNaN(num) && num >= 0 && num <= 60;
};

const isInvalidCAMark = (mark) => {
  if (!mark) return false;
  if (mark === "ABS") return false;
  const num = parseFloat(mark);
  return isNaN(num) || num < 0 || num > 40;
};

const isInvalidExamMark = (mark) => {
  if (!mark) return false;
  if (mark === "ABS") return false;
  const num = parseFloat(mark);
  return isNaN(num) || num < 0 || num > 60;
};

const formatMarksInput = (student, field) => {
  const value = student[field];
  if (value && value !== "ABS" && !isNaN(parseFloat(value))) {
    student[field] = parseFloat(value).toString();
  }
};

const calculateTotal = (student) => {
  if (student.examMarks === "ABS") return "ABS";
  const ca = parseFloat(student.existingCA || 0);
  const exam = parseFloat(student.examMarks || 0);
  if (student.examMarks && !isNaN(exam)) {
    return ca + exam;
  }
  return "--";
};

const getStudentStatus = (student) => {
  if (assessmentType.value === "CA") {
    if (student.caMarks === "ABS") return "absent";
    if (isValidCAMark(student.caMarks)) return "completed";
    if (isInvalidCAMark(student.caMarks)) return "invalid";
  } else {
    if (student.examMarks === "ABS") return "absent";
    if (isValidExamMark(student.examMarks)) return "completed";
    if (isInvalidExamMark(student.examMarks)) return "invalid";
  }
  return "pending";
};

const getStudentStatusText = (student) => {
  const status = getStudentStatus(student);
  return status.charAt(0).toUpperCase() + status.slice(1);
};

const clearAllMarks = () => {
  if (confirm("Are you sure you want to clear all marks?")) {
    students.value.forEach((student) => {
      if (assessmentType.value === "CA") {
        student.caMarks = "";
      } else {
        student.examMarks = "";
      }
    });
  }
};

const submitMarks = () => {
  if (!canSubmit.value) return;

  console.log("Submitting marks:", students.value);
  alert("Marks submitted successfully!");
};

const getTermAndSession = () => {
  apiServices
    .getTermAndSession()
    .then((response) => {
      termSession.value = response.data.data;
      console.log("Term and Session Data:", response.data);
    })
    .catch((error) => {
      console.error("Error fetching staff assigned subjects:", error);
    });
};

const getStaffAssigned = () => {
  apiServices
    .getStaffAssigned(loginStore.user?.id)
    .then((response) => {
      assignedSubjects.value = response.data.data;
    })
    .catch((error) => {
      console.error("Error fetching staff assigned subjects:", error);
    });
};

const getSubjectsToDisplay = () => {
  const selected = assignedSubjects.value.assignments.find(
    cls => cls.class_id === formData.value.classId
  );

  subjectToDisplay.value = selected ? selected.subjects : [];
};

onMounted(() => {
  getTermAndSession();
  getStaffAssigned();
});
</script>

<style scoped>
/* Term & Session Card */
.term-session-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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

.marks-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.marks-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.marks-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.summary-badge {
  padding: 6px 12px;
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
}

.marks-table-container {
  overflow-x: auto;
  margin-bottom: 24px;
}

.marks-table {
  width: 100%;
  border-collapse: collapse;
}

.marks-table th {
  background: #f8fafc;
  padding: 12px;
  text-align: left;
  font-weight: 600;
  color: #475569;
  border-bottom: 2px solid #e2e8f0;
}

.marks-table td {
  padding: 12px;
  border-bottom: 1px solid #f1f5f9;
}

.exam-header {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

.student-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.student-avatar {
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 12px;
}

.marks-input-container {
  width: 100%;
}

.marks-input {
  width: 100%;
  padding: 8px 12px;
  border: 2px solid #e2e8f0;
  border-radius: 6px;
  font-size: 14px;
  text-align: center;
  text-transform: uppercase;
}

.marks-input:focus {
  outline: none;
  border-color: #667eea;
}

.marks-input.valid {
  border-color: #10b981;
  background: rgba(16, 185, 129, 0.05);
}

.marks-input.invalid {
  border-color: #ef4444;
  background: rgba(239, 68, 68, 0.05);
}

.exam-marks-container {
  display: flex;
  align-items: center;
  gap: 12px;
}

.ca-score {
  min-width: 60px;
  text-align: center;
  font-weight: 600;
  color: #64748b;
}

.exam-input-container {
  flex: 1;
}

.exam-input {
  max-width: 80px;
}

.total-score {
  min-width: 60px;
  text-align: center;
  font-weight: 600;
  color: #1e293b;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  text-transform: capitalize;
}

.status-badge.completed {
  background: rgba(16, 185, 129, 0.1);
  color: #059669;
}

.status-badge.pending {
  background: rgba(245, 158, 11, 0.1);
  color: #d97706;
}

.status-badge.invalid {
  background: rgba(239, 68, 68, 0.1);
  color: #dc2626;
}

.status-badge.absent {
  background: rgba(107, 114, 128, 0.1);
  color: #6b7280;
}

.marks-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
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