<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1>Broadsheet Report</h1>
        <p>Class performance report with student rankings</p>
      </div>
      <div class="header-actions">
        <button class="add-btn" :disabled="!reportGenerated">
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
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          Export PDF
        </button>
        <button class="add-btn secondary" :disabled="!reportGenerated">
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
              d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 012-2h2a2 2 0 012 2v4M6 7h.01M10 7h.01"
            />
          </svg>
          Print
        </button>
      </div>
    </div>

    <!-- Filters -->
    <div class="marks-selection-card">
      <div class="selection-grid">
        <div class="form-group">
          <label class="form-label">Session</label>
          <select v-model="filters.current_session_id" class="form-select">
            <option value="">Select Session</option>
            <option
              v-for="(session, index) in sessions"
              :key="index"
              :value="session.id"
            >
              {{ session.session_name }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">Term</label>
          <select v-model="filters.current_term_id" class="form-select">
            <option value="" selected disabled>Select Term</option>
            <option value="1">First Term</option>
            <option value="2">Second Term</option>
            <option value="3">Third Term</option>
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">Class</label>
          <select
            v-model="filters.current_class_id"
            class="form-select"
            @change="getClassAssignedSubjects"
          >
            <option value="">Select Class</option>
            <option
              v-for="(sClass, index) in classes"
              :key="index"
              :value="sClass.id"
            >
              {{ sClass.class_name }}
            </option>
          </select>
        </div>

        <div class="mt-auto">
          <button class="btn-load-students" @click="getAssignedSubjects">
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
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            Generate Report
          </button>
        </div>
      </div>
    </div>
    <!-- <pre>{{ students }}</pre> -->
    <!-- <pre>{{ classSubjects }}</pre> -->

    <!-- Broadsheet Table -->
    <div class="table-container broadsheet-table">
      <table>
        <thead>
          <tr>
            <!-- Sticky Columns -->
            <th rowspan="3" class="sticky-col">SN</th>
            <th rowspan="3" class="sticky-col-22">Student Name</th>
            <th rowspan="3">Admission No</th>

            <!-- Subjects Headers -->
            <th
              v-for="subject in classSubjects"
              :key="subject.id"
              class="subject-col-group"
              :colspan="3"
            >
              {{ subject.Subject.subject_name }}
            </th>

            <!-- Remaining columns -->
            <th rowspan="3">Grand Total</th>
            <th rowspan="3">Average</th>
            <th rowspan="3">Position</th>
          </tr>

          <tr>
            <!-- Sub-columns CA, Exam, Total for each subject -->
            <template
              v-for="subject in classSubjects"
              :key="'sub-' + subject.id"
            >
              <th class="subject-sub-col">CA</th>
              <th class="subject-sub-col">Exam</th>
              <th class="subject-sub-col">Total</th>
            </template>
          </tr>

          <!-- Optionally, third row can be empty if you don’t need extra header row -->
          <tr></tr>
        </thead>

        <tbody>
          <tr
            v-for="(studentData, index) in students"
            :key="studentData.student.id"
          >
            <!-- Position -->
            <td class="sticky-col position-cell">
              <span class="position-badge" :class="getPositionClass(index)">
                {{ getPositionText(index +1) }}
              </span>
            </td>

            <!-- Student Name -->
            <td class="sticky-col-22 student-name">
              {{ studentData.student.full_name }}
            </td>

            <!-- Admission Number -->
            <td>
              {{ studentData.student.admission_number }}
            </td>

            <!-- Subjects Scores -->
            <template v-for="subject in classSubjects" :key="subject.id">
              <td class="score-cell ca-cell">
                {{
                  getStudentSubjectScore(
                    studentData,
                    subject.school_subject_id,
                    "ca_1_score"
                  )
                }}
              </td>
              <td class="score-cell exam-cell">
                {{
                  getStudentSubjectScore(
                    studentData,
                    subject.school_subject_id,
                    "exam_score"
                  )
                }}
              </td>
              <td class="score-cell total-cell">
                {{
                  getStudentSubjectScore(
                    studentData,
                    subject.school_subject_id,
                    "total"
                  )
                }}
              </td>
            </template>

            <!-- Grand Total -->
            <td class="grand-total-cell">
              {{ studentData.performance.mark_obtained }}
            </td>

            <!-- Average -->
            <td class="average-cell">
              {{ studentData.performance.average }}
            </td>

            <!-- Grade -->
            <td class="grade-cell">
              <span class="grade-badge">
                {{ studentData.performance.display_position }}
              </span>
            </td>

            <!-- Remark -->
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Empty State -->
    <div v class="empty-state">
      <svg
        width="64"
        height="64"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
      <h3>No Report Generated</h3>
      <p>Select session, term, and class to generate broadsheet report</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import apiServices from "../../services/apiServices";
import { useToast } from "../../composables/useToast";

const toast = useToast();

// Reactive data
const filters = ref({
  current_session_id: "",
  current_term_id: "",
  current_class_id: "",
});

const reportGenerated = ref(false);
const classes = ref([]);
const sessions = ref([]);
const classSubjects = ref([]);
const students = ref([]);

// Helper functions

const getPositionText = (position) => {
  if (position === 1) return "1st";
  if (position === 2) return "2nd";
  if (position === 3) return "3rd";
  return `${position}th`;
};

const getPositionClass = (index) => {
  if (index === 0) return "position-gold";
  if (index === 1) return "position-silver";
  if (index === 2) return "position-bronze";
  return "";
};

const getRowClass = (index) => {
  if (index === 0) return "top-student";
  if (index < 3) return "top-three";
  return "";
};

const getScoreClass = (score) => {
  if (!score) return "";
  if (score >= 80) return "score-excellent";
  if (score >= 70) return "score-good";
  if (score >= 60) return "score-average";
  if (score >= 50) return "score-fair";
  return "score-poor";
};

const getScoreColor = (score) => {
  if (!score) return "#6b7280";
  if (score >= 80) return "#059669";
  if (score >= 70) return "#2563eb";
  if (score >= 60) return "#d97706";
  if (score >= 50) return "#dc2626";
  return "#991b1b";
};

const getGradeColor = (grade) => {
  const colors = {
    A: "#065f46",
    B: "#1e40af",
    C: "#92400e",
    D: "#9a3412",
    E: "#991b1b",
    F: "#991b1b",
  };
  return colors[grade] || "#111827";
};

// Get a specific score for a subject
const getStudentSubjectScore = (studentData, subjectId, key) => {
  const subject = studentData.subjects.find((s) => s.id === subjectId);
  return subject ? subject[key] : "-";
};

// Overall grade (you can use average or total logic)
const getOverallGrade = (studentData) => {
  // Example: take the grade of the first subject or compute based on average
  return studentData.subjects[0]?.grade || "-";
};

const getOverallRemark = (studentData) => {
  return studentData.subjects[0]?.remark || "-";
};

// API functions
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

const getClassAssignedSubjects = async () => {
  apiServices
    .getClassAssignedSubject(filters.value.current_class_id)
    .then((response) => {
      console.log(response);
      classSubjects.value = response.data.data;
    })
    .finally((error) => {
      console.log(error);
    });
};

const getAssignedSubjects = () => {
  apiServices
    .getAssignedSubjects(
      filters.value.current_class_id,
      filters.value.current_session_id,
      filters.value.current_term_id
    )
    .then((response) => {
      students.value = response.data.data;
    })
    .catch((error) => console.log(error));
};

// Lifecycle
onMounted(() => {
  getAllRowSessions();
  getAllRowClases();
});
</script>

<style scoped>
.header-actions {
  display: flex;
  gap: 8px;
}

.add-btn.secondary {
  background: #6b7280;
}

.add-btn.secondary:hover {
  background: #4b5563;
}

.add-btn:disabled {
  background: #d1d5db;
  cursor: not-allowed;
  opacity: 0.6;
}

.marks-selection-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
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

.report-header {
  background: white;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.report-header h2 {
  margin: 0 0 4px 0;
  font-size: 20px;
  color: #111827;
}

.report-header > p {
  margin: 0 0 16px 0;
  color: #6b7280;
  font-size: 14px;
}

.report-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 12px;
}

.stat-card {
  background: #f9fafb;
  padding: 12px;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-label {
  font-size: 12px;
  color: #6b7280;
  font-weight: 500;
}

.stat-value {
  font-size: 20px;
  font-weight: 600;
  color: #111827;
}

.broadsheet-table {
  overflow-x: auto;
  position: relative;
}

.broadsheet-table table {
  min-width: 2400px;
  border-collapse: separate;
  border-spacing: 0;
  width: 100%;
}

.broadsheet-table thead th {
  background: #1f2937;
  color: white;
  font-weight: 600;
  font-size: 12px;
  padding: 10px 8px;
  text-align: center;
  border: 1px solid #374151;
  position: sticky;
  top: 0;
  z-index: 10;
}

.subjects-header {
  background: #374151 !important;
}

.subject-col {
  min-width: 80px;
  font-size: 11px;
}

.subject-col-group {
  background: #374151 !important;
  font-size: 10px;
  font-weight: 600;
  text-align: center;
  border: 1px solid #4b5563;
  min-width: 180px;
  white-space: nowrap;
  border-right: 1px solid white !important;
}

.subject-sub-col {
  min-width: 60px;
  font-size: 9px;
  font-weight: 500;
  text-align: center;
  background: #4b5563 !important;
  color: #e5e7eb;
  border: 1px solid #6b7280;
  white-space: nowrap;
}

.ca-cell {
  background: #fef3c7;
  font-size: 11px;
  text-align: center;
  min-width: 60px;
  white-space: nowrap;
}

.exam-cell {
  background: #dbeafe;
  font-size: 11px;
  text-align: center;
  min-width: 60px;
  white-space: nowrap;
}

.total-cell {
  background: #d1fae5;
  font-size: 11px;
  text-align: center;
  font-weight: 600;
  min-width: 60px;
  white-space: nowrap;
}

.grand-total-cell {
  font-weight: 700;
  color: #111827;
  background: #f3f4f6;
  text-align: center;
  font-size: 14px;
}

.sticky-col {
  position: sticky;
  left: 0;
  z-index: 20;
  background: #1f2937;
  min-width: 5px;
}

.sticky-col-2 {
  position: sticky;
  left: 80px;
  z-index: 20;
  background: #1f2937;
  min-width: 180px;
}

.broadsheet-table tbody td {
  padding: 8px;
  font-size: 13px;
  border: 1px solid #e5e7eb;
  text-align: center;
}

.broadsheet-table tbody .sticky-col {
  background: white;
  font-weight: 600;
}

.broadsheet-table tbody .sticky-col-2 {
  background: white;
  text-align: left;
}

.top-student {
  background: #fef3c7;
}

.top-three {
  background: #f3f4f6;
}

.position-cell {
  text-align: center;
}

.position-badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: 700;
  font-size: 12px;
}

.position-gold {
  background: #fbbf24;
  color: #78350f;
}

.position-silver {
  background: #d1d5db;
  color: #1f2937;
}

.position-bronze {
  background: #f59e0b;
  color: #78350f;
}

.student-name {
  font-weight: 500;
  color: #111827;
}

.score-cell {
  font-weight: 500;
}

.score-excellent {
  color: #059669;
  font-weight: 600;
}

.score-good {
  color: #2563eb;
  font-weight: 600;
}

.score-average {
  color: #d97706;
}

.score-fair {
  color: #dc2626;
}

.score-poor {
  color: #991b1b;
  font-weight: 600;
}

.total-cell {
  font-weight: 700;
  color: #111827;
  background: #f9fafb;
}

.average-cell {
  font-weight: 600;
  color: #1f2937;
  background: #f9fafb;
}

.grade-cell {
  background: #f9fafb;
}

.grade-badge {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 4px;
  font-weight: 700;
  font-size: 12px;
}

.grade-A {
  background: #d1fae5;
  color: #065f46;
}

.grade-B {
  background: #dbeafe;
  color: #1e40af;
}

.grade-C {
  background: #fef3c7;
  color: #92400e;
}

.grade-D {
  background: #fed7aa;
  color: #9a3412;
}

.grade-E,
.grade-F {
  background: #fee2e2;
  color: #991b1b;
}

.remark-cell {
  font-size: 12px;
  color: #6b7280;
  font-style: italic;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 8px;
}

.empty-state svg {
  color: #9ca3af;
  margin-bottom: 16px;
}

.empty-state h3 {
  margin: 0 0 8px 0;
  color: #111827;
  font-size: 18px;
}

.empty-state p {
  margin: 0;
  color: #6b7280;
  font-size: 14px;
}

/* Form Controls - Match AddMarks.vue styling */
/* .form-control {
  width: 100%;
  padding: 4px 8px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  transition: all 0.3s ease;
  background: white;
  text-align: center;
} */

.form-control:focus {
  outline: none;
  border-color: #667eea !important;
}

.form-control option {
  text-align: left;
  padding: 4px 8px;
}

/* Search Button Styling */
.search-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  height: fit-content;
}

.search-btn:hover {
  background: #5a67d8;
  transform: translateY(-1px);
}

.search-btn:active {
  transform: translateY(0);
}

.search-btn svg {
  flex-shrink: 0;
}

/* Print Styles */
/* Mobile responsive styles */
@media (max-width: 768px) {
  .selection-grid {
    grid-template-columns: 1fr;
  }
}

@media print {
  .page-header,
  .marks-selection-card {
    display: none;
  }

  .report-header {
    box-shadow: none;
    border: 1px solid #e5e7eb;
  }

  .broadsheet-table {
    box-shadow: none;
  }

  .broadsheet-table table {
    page-break-inside: auto;
  }

  .broadsheet-table tr {
    page-break-inside: avoid;
    page-break-after: auto;
  }

  .broadsheet-table thead {
    display: table-header-group;
  }
}
</style>
