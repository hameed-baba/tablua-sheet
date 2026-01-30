<template>
  <div class="page">
    <div class="page-header mt-4">
      <div>
        <h1>Report Card</h1>
        <p>Generate report cards for all students in a class</p>
      </div>
      <div class="header-actions">
        <button
          class="add-btn"
          :disabled="isGeneratingPDF2"
          @click="generatePdf"
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
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          {{ isGeneratingPDF2 ? "Generating..." : "Export PDF" }}
        </button>
        <button
          class="add-btn secondary"
          @click="printReport"
          :disabled="!reportGenerated"
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
              d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 0 712-2h2a2 2 0 712 2v4M6 7h.01M10 7h.01"
            />
          </svg>
          Print
        </button>
      </div>
    </div>

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
          <select v-model="filters.current_class_id" class="form-select">
            <!-- @change="getClassAssignedSubjects" -->
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
                stroke-liCSVExportButtonnecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            Generate Report Cards
          </button>
        </div>
      </div>
    </div>

    <!-- Search Section -->
    <div class="search-section" v-if="freshData.length > 0">
      <div class="search-container">
        <div class="search-input-wrapper">
          <svg
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            class="search-icon"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search students by name or admission number..."
            class="search-input"
          />
          <button
            v-if="searchQuery"
            @click="clearSearch"
            class="clear-search-btn"
          >
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div class="search-results-info">
          <span v-if="searchQuery">
            Showing {{ filteredReportData.length }} of
            {{ freshData.length }} students
          </span>
          <span v-else> Showing all {{ freshData.length }} students </span>
        </div>
      </div>
      <!-- <pre>{{ freshData }}</pre> -->
    </div>

    <div
      class="result-card mb-2"
      v-for="(student, index) in filteredReportData"
      :key="index"
    >
      <!-- Top Section: Student Basic Info -->
      <div class="report-header">
        <div class="header-left">
          <div class="info-item">
            <span class="info-label-inline text-capitalize">FULL NAME</span>
            <span class="info-value-inline">{{
              student.student?.full_name
            }}</span>
          </div>
          <div class="info-item">
            <span class="info-label-inline">ADMISSION NUMBER</span>
            <span class="info-value-inline">{{
              student.student.admission_number
            }}</span>
          </div>
        </div>
        <div class="header-right">
          <div class="info-item">
            <span class="info-label-inline">GENDER</span>
            <span class="info-value-inline text-capitalize">{{
              student.student.gender
            }}</span>
          </div>
          <div class="info-item">
            <span class="info-label-inline">DATE OF BIRTH</span>
            <span class="info-value-inline">{{ student.student.dob }}</span>
          </div>
        </div>
        <div class="position-box">
          <div class="position-header">Position</div>
          <div class="position-value">
            {{ student.performance.display_position }}
          </div>
        </div>
      </div>

      <!-- Main Content: Subjects Table and Summary Boxes -->
      <!-- <pre>{{ student.term_performance_summary["First Term"] }}</pre> -->
      <div class="report-body">
        <!-- Left: Subjects Table -->
        <div class="subjects-section">
          <table class="subjects-table">
            <thead>
              <tr>
                <th class="sn-col">SN</th>
                <th class="subject-col">SUBJECT NAMES</th>
                <th class="score-col">CA SCORE</th>
                <th class="score-col">EXAM SCORE</th>
                <th class="score-col">TOTAL</th>
                <th class="grade-col">GRADE</th>
                <th class="remark-col">REMARK</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(subject, sIndex) in student.subjects"
                :key="sIndex"
                class="subject-row"
              >
                <td class="sn-cell">{{ sIndex + 1 }}</td>
                <td class="subject-name-cell">{{ subject.name }}</td>
                <td class="score-cell">{{ subject.ca_1_score }}</td>
                <td class="score-cell">{{ subject.exam_score }}</td>
                <td class="score-cell total-score">{{ subject.total }}</td>
                <td class="grade-cell">
                  {{ subject.grade }}
                </td>
                <td class="remark-cell font-semibold">
                  {{ subject.remark }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Right: Summary Boxes -->
        <div class="summary-section">
          <!-- Performance Summary -->
          <div class="summary-box">
            <div class="summary-box-header">PERFORMANCE SUMMARY</div>
            <div class="summary-box-body">
              <div class="summary-row-item">
                <span class="summary-label-text">Marks Obtained</span>
                <span class="summary-value-text">{{
                  student.performance.mark_obtained
                }}</span>
              </div>
              <div class="summary-row-item">
                <span class="summary-label-text">Average Marks</span>
                <span class="summary-value-text">{{
                  student.performance.average
                }}</span>
              </div>
              <div class="summary-row-item">
                <span class="summary-label-text">Total Subjects</span>
                <span class="summary-value-text">{{
                  student.subjects.length
                }}</span>
              </div>
            </div>
          </div>

          <!-- Session Info -->
          <div class="summary-box">
            <div class="summary-box-header">SESSION INFO</div>
            <div class="summary-box-body">
              <div class="session-info">
                <div class="session-item">
                  <span class="session-label">Current Session</span>
                  <span class="session-value">{{ student.session.name }}</span>
                </div>
                <div class="session-item">
                  <span class="session-label">Current Class</span>
                  <span class="session-value">{{ student.class.name }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      class="empty-state border"
      v-if="!reportGenerated && filteredReportData.length == 0 && !searchQuery"
    >
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
      <h3>No Report Card Generated</h3>
      <p>Select session, term, and class to generate report card</p>
    </div>

    <!-- No Search Results State -->
    <div
      class="empty-state border"
      v-if="freshData.length > 0 && filteredReportData.length == 0 && searchQuery"
    >
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
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
      <h3>No Students Found</h3>
      <p>No students match your search criteria "{{ searchQuery }}"</p>
      <button @click="clearSearch" class="btn btn-primary mt-3">
        Clear Search
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import apiServices from "../../../services/apiServices";
import { useToast } from "../../../composables/useToast";

const freshData = ref([]);
const toast = useToast();

// Reactive data
const filters = ref({
  current_session_id: "",
  current_term_id: "",
  current_class_id: "",
});

const reportGenerated = ref(false);
const allReportData = ref([]);
const searchQuery = ref("");
const isGeneratingPDF = ref(false);
const isGeneratingPDF2 = ref(false);
const classes = ref([]);
const sessions = ref([]);
const subjects = ref([]);
const gradeList = ref(null);


const filteredReportData = computed(() => {
  if (!searchQuery.value.trim()) {
    return freshData.value;
  }

  const query = searchQuery.value.toLowerCase().trim();
  return freshData.value.filter((student) => {
    const studentName = student.student?.full_name?.toLowerCase() || '';
    const admissionNo = student.student?.admission_number?.toLowerCase() || '';

    return studentName.includes(query) || admissionNo.includes(query);
  });
});

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


const printReport = () => {
  window.print();
};

// Clear search function
const clearSearch = () => {
  searchQuery.value = "";
};

const getAssignedSubjects = () => {
  apiServices
    .getAssignedSubjects(
      filters.value.current_class_id,
      filters.value.current_session_id,
      filters.value.current_term_id
    )
    .then((response) => {
      freshData.value = response.data.data;
    })
    .catch((error) => {
      console.log(error);
      toast.error(
        "Failed to Generate Report",
        error.response.data.message || "Could not load broadsheet data"
      );
    });
};

// const generatePdf = () => {
//   apiServices
//     .generatePdfMakeReport2()
//     .then((response) => {
//       const pdfBlob = new Blob([response.data], {
//         type: "application/pdf",
//       });

//       const pdfUrl = URL.createObjectURL(pdfBlob);

//       window.open(pdfUrl, "_blank");
//     })
//     .catch((error) => {
//       console.error(error);
//     });
// };

const generatePdf = () => {
  isGeneratingPDF2.value = true;
  apiServices
    .generatePdfMakeReport2(freshData.value)
    .then((response) => {
      const pdfBlob = new Blob([response.data], {
        type: "application/pdf",
      });
      const pdfUrl = URL.createObjectURL(pdfBlob);
      window.open(pdfUrl, "_blank");
    })
    .catch((error) => {
      console.error(error);
    })
    .finally(() => {
      isGeneratingPDF2.value = false;
    });
};
const downloadPdf = () => {
  apiServices
    .generatePdfMakeReport2(freshData.value)
    .then((response) => {
      const pdfBlob = new Blob([response.data], {
        type: "application/pdf",
      });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "report-cards.pdf";
      link.click();

      URL.revokeObjectURL(link.href);
    })
    .catch((error) => {
      console.error(error);
    });
};

// Lifecycle
onMounted(() => {
  getAllRowSessions();
  getAllRowClases();
});

// Watch for filter changes
watch(
  () => [
    filters.value.current_class_id,
    filters.value.current_session_id,
    filters.value.current_term_id,
  ],
  () => {
    // Reset report when filters change
    reportGenerated.value = false;
    allReportData.value = [];
    searchQuery.value = "";
    freshData.value = [];
  }
);
</script>

<style scoped>
/* Page Layout */

.header-actions {
  display: flex;
  gap: 8px;
}

.add-btn:hover {
  background: #2563eb;
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

/* Filters */
.filters-section {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  flex-wrap: wrap;
  align-items: flex-end;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 200px;
}

.filter-group label {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

/* .form-select {
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  background: white;
  color: #374151;
}

.form-select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
} */

.search-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: #059669;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  height: fit-content;
}

.search-btn:hover {
  background: #047857;
}

/* Style Selector */
.style-selector-section {
  margin-bottom: 20px;
}

.style-selector-container {
  background: white;
  padding: 15px 20px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 15px;
}

.style-label {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
}

.style-options {
  display: flex;
  gap: 10px;
}

.style-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border: 2px solid #e5e7eb;
  background: white;
  color: #6b7280;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.style-btn:hover {
  border-color: #3b82f6;
  color: #3b82f6;
}

.style-btn.active {
  border-color: #3b82f6;
  background: #3b82f6;
  color: white;
}

/* Search Section */
.search-section {
  margin-bottom: 24px;
}

.search-container {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  width: 25%;
}

.search-icon {
  position: absolute;
  left: 12px;
  color: #9ca3af;
  z-index: 1;
}

.search-input {
  width: 100% !important;
  padding: 12px 12px 12px 44px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  background: #f9fafb;
  color: #374151;
  transition: all 0.2s;
}

.search-input:focus {
  outline: none;
  border-color: #3b82f6;
  background: white;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.search-input::placeholder {
  color: #9ca3af;
}

.clear-search-btn {
  position: absolute;
  right: 8px;
  padding: 6px;
  background: #f3f4f6;
  border: none;
  border-radius: 4px;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.clear-search-btn:hover {
  background: #e5e7eb;
  color: #374151;
}

.search-results-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  color: #6b7280;
  padding-top: 8px;
  border-top: 1px solid #f3f4f6;
}

.search-results-info span {
  font-weight: 500;
}

/* Report Cards Container */
.all-reports-container {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

/* CSS Reset for consistent report card sizing */
.all-reports-container > .report-card {
  max-width: 900px !important;
  width: 100% !important;
  margin: 0 auto !important;
  font-size: 12px !important;
  line-height: 1.4 !important;
  box-sizing: border-box !important;
}

.report-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  page-break-after: always;
  max-width: 900px;
  width: 100%;
  margin: 0 auto;
  position: relative;
  border: 2px solid #e5e7eb;
  font-size: 12px; /* Ensure consistent base font size */
}

/* Ensure all report cards have the same size regardless of position */
.all-reports-container .report-card {
  max-width: 900px;
  width: 100%;
  margin: 0 auto;
  font-size: 12px;
}

/* Individual Student Download Button */
.student-download-section {
  position: absolute;
  top: 15px;
  right: 15px;
  z-index: 10;
}

.student-download-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: #10b981;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
}

.student-download-btn:hover:not(:disabled) {
  background: #059669;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
}

.student-download-btn:disabled {
  background: #d1d5db;
  cursor: not-allowed;
  opacity: 0.6;
  transform: none;
  box-shadow: none;
}

.student-download-btn svg {
  width: 14px;
  height: 14px;
}

/* Print Button */
.print-button-section {
  position: absolute;
  top: 15px;
  left: 15px;
  z-index: 10;
}

.print-btn {
  padding: 8px 16px;
  background: #1f2937;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.print-btn:hover {
  background: #374151;
}

/* Report Content */
.report-content {
  padding: 20px;
  margin-top: 40px;
  font-size: 12px; /* Consistent font size */
  line-height: 1.4; /* Consistent line height */
}

/* Ensure consistent sizing for all report cards */
.report-card .report-content {
  padding: 20px;
  margin-top: 40px;
  font-size: 12px;
  line-height: 1.4;
}

/* Header Section */
.report-header-section {
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 20px;
  margin-bottom: 20px;
}

.student-data-section,
.academic-data-section {
  border: 1px solid #374151;
}

.section-header {
  background: #374151;
  color: white;
  padding: 8px 12px;
  font-size: 12px;
  font-weight: 700;
  text-align: center;
  letter-spacing: 0.5px;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table tr {
  border-bottom: 1px solid #e5e7eb;
}

.data-table tr:last-child {
  border-bottom: none;
}

.label-cell {
  background: #f9fafb;
  padding: 8px 12px;
  font-size: 11px;
  font-weight: 600;
  color: #374151;
  text-transform: uppercase;
  border-right: 1px solid #e5e7eb;
  width: 40%;
}

.value-cell {
  padding: 8px 12px;
  font-size: 12px;
  color: #1f2937;
  font-weight: 500;
}

/* Position Section */
.position-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid #374151;
  min-width: 100px;
}

.position-number {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
  font-weight: 900;
  color: #1f2937;
  background: #f9fafb;
  width: 100%;
}

/* Academic Results Section */
.academic-results-section {
  margin-bottom: 20px;
}

.results-table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #374151;
  font-size: 12px;
}

.results-table thead th {
  background: #374151;
  color: white;
  padding: 10px 8px;
  text-align: center;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-right: 1px solid #4b5563;
}

.results-table thead th:last-child {
  border-right: none;
}

.sn-col {
  width: 40px;
}

.subject-col {
  width: 25%;
  text-align: left !important;
}

.score-col {
  width: 12%;
}

.remark-col {
  width: 20%;
}

.results-table tbody td {
  padding: 10px 8px;
  border-bottom: 1px solid #e5e7eb;
  border-right: 1px solid #e5e7eb;
  text-align: center;
  font-size: 12px;
}

.results-table tbody td:last-child {
  border-right: none;
}

.results-table tbody tr:nth-child(even) {
  background: #f9fafb;
}

.sn-cell {
  font-weight: 600;
  color: #374151;
}

.subject-name {
  text-align: left !important;
  font-weight: 600;
  color: #1f2937;
  padding-left: 12px !important;
}

.score-cell {
  font-weight: 500;
}

.total-cell {
  font-weight: 700;
  font-size: 13px;
}

.remark-cell {
  font-style: italic;
  color: #6b7280;
  font-size: 11px;
}

/* Score Color Classes */
.score-excellent {
  background: #dcfce7 !important;
  color: #166534;
}

.score-very-good {
  background: #dbeafe !important;
  color: #1e40af;
}

.score-good {
  background: #fef3c7 !important;
  color: #92400e;
}

.score-fair {
  background: #fed7aa !important;
  color: #9a3412;
}

.score-pass {
  background: #fecaca !important;
  color: #991b1b;
}

.score-fail {
  background: #fecaca !important;
  color: #991b1b;
}

.score-default {
  background: #f3f4f6 !important;
  color: #6b7280;
}

/* Summary Footer */
.summary-footer {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.summary-item {
  border: 1px solid #374151;
}

.summary-header {
  background: #374151;
  color: white;
  padding: 8px 12px;
  font-size: 12px;
  font-weight: 700;
  text-align: center;
  letter-spacing: 0.5px;
}

.summary-value {
  padding: 15px;
  text-align: center;
  font-size: 24px;
  font-weight: 900;
  color: #1f2937;
  background: #f9fafb;
}

/* Print Styles */
@media print {
  .page-header,
  .filters-section,
  .student-download-section,
  .print-button-section {
    display: none;
  }

  .report-card {
    box-shadow: none;
    margin: 0;
    max-width: none;
    page-break-after: always;
    border: 2px solid #000;
  }

  .all-reports-container {
    gap: 0;
  }

  .report-content {
    margin-top: 0;
  }
}

/* Responsive */
@media (max-width: 768px) {
  .filters-section {
    flex-direction: column;
  }

  .filter-group {
    min-width: auto;
  }

  .style-selector-container {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .style-options {
    width: 100%;
  }

  .style-btn {
    flex: 1;
    justify-content: center;
  }

  /* Mobile report card adjustments */
  .report-header-section {
    grid-template-columns: 1fr;
    gap: 15px;
  }

  .position-section {
    order: -1;
    min-width: auto;
  }

  .position-number {
    font-size: 36px;
    padding: 20px;
  }

  .summary-footer {
    grid-template-columns: 1fr;
  }

  /* Mobile download button adjustments */
  .student-download-section {
    top: 10px;
    right: 10px;
  }

  .student-download-btn {
    padding: 6px 10px;
    font-size: 11px;
  }

  .student-download-btn svg {
    width: 12px;
    height: 12px;
  }

  .print-button-section {
    top: 10px;
    left: 10px;
  }

  .print-btn {
    padding: 6px 12px;
    font-size: 11px;
  }
}

.result-card {
  background: white;
  padding: 0;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
  border: 2px solid #e5e7eb;
  overflow: hidden;
}

/* Report Header - Student Basic Info */
.report-header {
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 20px;
  padding: 20px;
  background: #f8fafc;
  border-bottom: 2px solid #e5e7eb;
  align-items: start;
}

.header-left,
.header-right {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-label-inline {
  font-size: 11px;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-value-inline {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
}

.position-box {
  background: #3b82f6;
  border-radius: 6px;
  padding: 12px 24px;
  text-align: center;
  min-width: 120px;
}

.position-header {
  font-size: 12px;
  font-weight: 700;
  color: white;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
}

.position-value {
  font-size: 48px;
  font-weight: 900;
  color: white;
  line-height: 1;
}

/* Report Body - Main Content Area */
.report-body {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 20px;
  padding: 20px;
}

/* Subjects Table Section */
.subjects-section {
  overflow-x: auto;

}

.subjects-table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #cbd5e1;
}

.subjects-table thead {
  background: #f1f5f9;
}

.subjects-table thead th {
  padding: 12px 10px;
  text-align: center;
  font-size: 11px;
  font-weight: 700;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border: 1px solid #cbd5e1;
}

.sn-col {
  width:0px !important;
}

.subject-col {
  text-align: left !important;
  min-width: 180px;
}

.score-col {
  width: 90px;
}

.grade-col {
  width: 80px;
}

.remark-col {
  width: 120px;
}

.subjects-table tbody .subject-row {
  transition: background 0.2s ease;
}

.subjects-table tbody .subject-row:nth-child(even) {
  background: #f8fafc;
}

.subjects-table tbody .subject-row:hover {
  background: #e0f2fe;
}

.sn-cell {
  padding: 12px 10px;
  text-align: center;
  font-weight: 600;
  color: #64748b;
  border: 1px solid #cbd5e1;
}

.subject-name-cell {
  padding: 12px 12px;
  font-weight: 600;
  color: #1e293b;
  text-align: left;
  border: 1px solid #cbd5e1;
}

.score-cell {
  padding: 12px 10px;
  text-align: center;
  font-weight: 600;
  color: #475569;
  border: 1px solid #cbd5e1;
}

.total-score {
  background: #fef3c7;
  color: #92400e;
  font-weight: 700;
}

.grade-cell {
  padding: 12px 10px;
  text-align: center;
  font-weight: 700;
  /* color: #059669; */
  color: #475569;
  border: 1px solid #cbd5e1;
}

.remark-cell {
  padding: 12px 10px;
  text-align: center;
  font-style: italic;
  color: #64748b;
  font-size: 12px;
  border: 1px solid #cbd5e1;
}

/* Summary Section - Right Side Boxes */
.summary-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.summary-box {
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  overflow: hidden;
  background: white;
}

.summary-box-header {
  background: #f1f5f9;
  padding: 12px 16px;
  font-size: 12px;
  font-weight: 700;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  text-align: center;
  border-bottom: 1px solid #cbd5e1;
}

.summary-box-body {
  padding: 16px;
}

.summary-row-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #e5e7eb;
}

.summary-row-item:last-child {
  border-bottom: none;
}

.summary-label-text {
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
}

.summary-value-text {
  font-size: 16px;
  font-weight: 700;
  color: #1e293b;
}

/* Term Performance Styling */
.term-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.term-label {
  font-size: 13px;
  font-weight: 700;
  color: #1e293b;
  text-align: center;
  padding-bottom: 8px;
  border-bottom: 1px solid #e5e7eb;
}

.term-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.term-detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
}

.term-detail-item span:first-child {
  color: #64748b;
  font-weight: 600;
}

.term-value {
  font-weight: 700;
  color: #1e293b;
  font-size: 14px;
}

/* Session Info Styling */
.session-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.session-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #e5e7eb;
}

.session-item:last-child {
  border-bottom: none;
}

.session-label {
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
}

.session-value {
  font-size: 13px;
  font-weight: 700;
  color: #1e293b;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .report-body {
    grid-template-columns: 1fr;
  }

  .summary-section {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    display: grid;
  }
}

@media (max-width: 768px) {
  .report-header {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .position-box {
    width: 100%;
  }

  .report-body {
    padding: 16px;
  }

  .subjects-section {
    overflow-x: scroll;
  }

  .summary-section {
    grid-template-columns: 1fr;
  }
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
</style>