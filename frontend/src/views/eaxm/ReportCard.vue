<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1>Report Card</h1>
        <p>Generate report cards for all students in a class</p>
      </div>
      <div class="header-actions">
        <button
          class="add-btn puppeteer-btn"
          @click="exportClassicPDF"
          :disabled="!reportGenerated || isGeneratingPDF"
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
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 712-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          {{ isGeneratingPDF ? 'Generating...' : 'Classic PDF' }}
        </button>
        <button
          class="add-btn html2canvas-btn"
          @click="exportModernPDF"
          :disabled="!reportGenerated || isGeneratingPDF"
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
              d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z"
            />
          </svg>
          {{ isGeneratingPDF ? 'Generating...' : 'Modern PDF' }}
        </button>

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
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>

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

    <!-- Filters -->
    <div class="filters-section">
      <div class="filter-group">
        <label>Session</label>
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

      <div class="filter-group">
        <label>Term</label>
        <select v-model="filters.current_term_id" class="form-select">
          <option value="" selected disabled>Select Term</option>
          <option value="1">First Term</option>
          <option value="2">Second Term</option>
          <option value="3">Third Term</option>
        </select>
      </div>

      <div class="filter-group">
        <label>Class</label>
        <select v-model="filters.current_class_id" class="form-select">
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

      <button class="search-btn" @click="generateReport">
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
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        Generate Report Cards
      </button>
    </div>

    <!-- Style Selector -->
    <div v-if="reportGenerated" class="style-selector-section">
      <div class="style-selector-container">
        <label class="style-label">Report Card Style:</label>
        <div class="style-options">
          <button 
            @click="selectedStyle = 'classic'"
            :class="['style-btn', { active: selectedStyle === 'classic' }]"
          >
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
            </svg>
            Classic Style
          </button>
          <button 
            @click="selectedStyle = 'modern'"
            :class="['style-btn', { active: selectedStyle === 'modern' }]"
          >
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            Modern Style
          </button>
        </div>
      </div>
    </div>

    <!-- Search Section -->
    <div v-if="reportGenerated" class="search-section">
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
            {{ allReportData.length }} students
          </span>
          <span v-else> Showing all {{ allReportData.length }} students </span>
        </div>
      </div>
    </div>

    <!-- No Search Results -->
    <div
      v-if="reportGenerated && searchQuery && filteredReportData.length === 0"
      class="no-results-state"
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
      <p>No students match your search for "{{ searchQuery }}"</p>
      <button @click="clearSearch" class="clear-search-action-btn">
        Clear Search
      </button>
    </div>

    <!-- Report Cards -->
    <div
      v-if="reportGenerated && filteredReportData.length > 0"
      class="all-reports-container"
    >
      <div
        v-for="(reportData, index) in filteredReportData"
        :key="index"
        :class="['report-card', `report-card-${selectedStyle}`]"
        :id="`report-card-${index}`"
      >
        <!-- School Header -->
        <div class="school-header">
          <div class="school-logo">
            <div class="logo-badge">
              <svg
                width="50"
                height="50"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"
                />
              </svg>
            </div>
          </div>
          <div class="school-info">
            <h1>{{ configStore.schoolName }}</h1>
            <p>
              {{ configStore.schoolAddress || "School Address, City, State" }}
            </p>
            <p>Tel: +234 XXX XXX XXXX | Email: info@school.com</p>
          </div>
        </div>

        <div class="report-title">
          <h2>STUDENT REPORT CARD</h2>
          <div class="session-term">
            {{ selectedTermName }} • {{ selectedSessionName }}
          </div>
        </div>

        <!-- Student Details -->
        <div class="student-details">
          <div class="detail-row">
            <div class="detail-item">
              <span class="label">Name:</span>
              <span class="value">{{ reportData.student.name }}</span>
            </div>
            <div class="detail-item">
              <span class="label">Admission No:</span>
              <span class="value">{{ reportData.student.admissionNo }}</span>
            </div>
          </div>
          <div class="detail-row">
            <div class="detail-item">
              <span class="label">Class:</span>
              <span class="value">{{ reportData.student.class }}</span>
            </div>
            <div class="detail-item">
              <span class="label">Position:</span>
              <span class="value position-highlight"
                >{{ reportData.position }} of
                {{ reportData.totalStudents }}</span
              >
            </div>
          </div>
        </div>

        <!-- Academic Results -->
        <div class="academic-section">
          <h3>Academic Performance</h3>
          <table class="results-table">
            <thead>
              <tr>
                <th class="subject-col">Subject</th>
                <th class="score-col">CA<br /><small>(30)</small></th>
                <th class="score-col">Exam<br /><small>(70)</small></th>
                <th class="score-col">Total<br /><small>(100)</small></th>
                <th class="grade-col">Grade</th>
                <th class="remark-col">Remark</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="subject in reportData.subjects" :key="subject.name">
                <td class="subject-name">{{ subject.name }}</td>
                <td class="score">{{ subject.ca }}</td>
                <td class="score">{{ subject.exam }}</td>
                <td class="total-score">{{ subject.total }}</td>
                <td class="grade" :class="`grade-${subject.grade}`">
                  {{ subject.grade }}
                </td>
                <td class="remark">{{ subject.remark }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Summary -->
        <div class="summary-section">
          <div class="summary-grid">
            <div class="summary-item">
              <span class="summary-label">Total Marks:</span>
              <span class="summary-value"
                >{{ reportData.totalMarks }}/{{ reportData.maxMarks }}</span
              >
            </div>
            <div class="summary-item">
              <span class="summary-label">Average:</span>
              <span class="summary-value"
                >{{ reportData.average.toFixed(1) }}%</span
              >
            </div>
            <div class="summary-item">
              <span class="summary-label">Class Position:</span>
              <span class="summary-value"
                >{{ reportData.position }}/{{ reportData.totalStudents }}</span
              >
            </div>
          </div>
        </div>

        <!-- Attendance & Grading -->
        <div class="info-section">
          <div class="attendance-box">
            <h4>Attendance Record</h4>
            <div class="attendance-grid">
              <div class="attendance-item">
                <span>School Days:</span>
                <strong>{{ reportData.attendance.totalDays }}</strong>
              </div>
              <div class="attendance-item">
                <span>Present:</span>
                <strong>{{ reportData.attendance.present }}</strong>
              </div>
              <div class="attendance-item">
                <span>Absent:</span>
                <strong>{{ reportData.attendance.absent }}</strong>
              </div>
              <div class="attendance-item">
                <span>Rate:</span>
                <strong>{{ reportData.attendance.rate }}%</strong>
              </div>
            </div>
          </div>

          <div class="grading-box">
            <h4>Grading Scale</h4>
            <div class="grade-scale">
              <div class="grade-item">
                <span class="grade-letter grade-A">A</span> 80-100% Excellent
              </div>
              <div class="grade-item">
                <span class="grade-letter grade-B">B</span> 70-79% Very Good
              </div>
              <div class="grade-item">
                <span class="grade-letter grade-C">C</span> 60-69% Good
              </div>
              <div class="grade-item">
                <span class="grade-letter grade-D">D</span> 50-59% Fair
              </div>
              <div class="grade-item">
                <span class="grade-letter grade-E">E</span> 40-49% Pass
              </div>
              <div class="grade-item">
                <span class="grade-letter grade-F">F</span> 0-39% Fail
              </div>
            </div>
          </div>
        </div>

        <!-- Comments -->
        <div class="comments-section">
          <div class="comment-box">
            <h4>Class Teacher's Comment</h4>
            <p>{{ reportData.teacherComment }}</p>
            <div class="signature">
              <span>Signature: ________________________</span>
              <span>Date: {{ new Date().toLocaleDateString() }}</span>
            </div>
          </div>

          <div class="comment-box">
            <h4>Principal's Comment</h4>
            <p>{{ reportData.principalComment }}</p>
            <div class="signature">
              <span>Signature: ________________________</span>
              <span>Date: {{ new Date().toLocaleDateString() }}</span>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="report-footer">
          <p>
            <strong>Next Term Begins:</strong> {{ reportData.nextTermDate }}
          </p>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="!reportGenerated" class="empty-state">
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
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 712-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
      <h3>No Report Cards Generated</h3>
      <p>
        Select session, term, and class to generate report cards for all
        students
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useConfigStore } from "../../store/configStore";
import apiServices from "../../services/apiServices";
import { useToast } from "../../composables/useToast";
import { getRemark } from "../../utils/gradeUtils";

// Helper function to handle CA/Exam scores (can be number or "ABS")
const processScore = (score) => {
  if (score === null || score === undefined || score === "") {
    return 0;
  }

  // Convert to string and check if it's "ABS"
  const scoreStr = String(score).toUpperCase().trim();
  if (scoreStr === "ABS") {
    return "ABS";
  }

  // Try to convert to number
  const numScore = Number(score);
  if (isNaN(numScore)) {
    return 0;
  }

  return numScore;
};

// Helper function to calculate total from CA and Exam scores
const calculateTotal = (caScore, examScore) => {
  const processedCA = processScore(caScore);
  const processedExam = processScore(examScore);

  // If either is "ABS", return "ABS"
  if (processedCA === "ABS" || processedExam === "ABS") {
    return "ABS";
  }

  // If both are numbers, add them
  if (typeof processedCA === "number" && typeof processedExam === "number") {
    return processedCA + processedExam;
  }

  return 0;
};

// Default grading function as fallback
const getDefaultGrade = (score) => {
  // Handle "ABS" case
  if (score === "ABS" || String(score).toUpperCase() === "ABS") {
    return { grade: "ABS", remark: "Absent" };
  }

  const numScore = Number(score);
  if (isNaN(numScore)) {
    return { grade: "F", remark: "Invalid Score" };
  }

  if (numScore >= 80) return { grade: "A", remark: "Excellent" };
  if (numScore >= 70) return { grade: "B", remark: "Very Good" };
  if (numScore >= 60) return { grade: "C", remark: "Good" };
  if (numScore >= 50) return { grade: "D", remark: "Fair" };
  if (numScore >= 40) return { grade: "E", remark: "Pass" };
  return { grade: "F", remark: "Fail" };
};

const configStore = useConfigStore();
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
const selectedStyle = ref("classic");
const classes = ref([]);
const sessions = ref([]);
const subjects = ref([]);
const gradeList = ref(null);

// Computed properties for display names
const selectedSessionName = computed(() => {
  const session = sessions.value.find(
    (s) => s.id == filters.value.current_session_id
  );
  return session ? session.session_name : "";
});

const selectedTermName = computed(() => {
  const termNames = { 1: "First Term", 2: "Second Term", 3: "Third Term" };
  return termNames[filters.value.current_term_id] || "";
});

const selectedClassName = computed(() => {
  const cls = classes.value.find((c) => c.id == filters.value.current_class_id);
  return cls ? cls.class_name : "";
});

// Computed property for filtered report data based on search query
const filteredReportData = computed(() => {
  if (!searchQuery.value.trim()) {
    return allReportData.value;
  }

  const query = searchQuery.value.toLowerCase().trim();
  return allReportData.value.filter((reportData) => {
    const studentName = reportData.student.name.toLowerCase();
    const admissionNo = reportData.student.admissionNo.toLowerCase();

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

const getClassAssignedSubjects = async (classId) => {
  try {
    const response = await apiServices.getClassAssignedSubject(classId);
    return response.data.data || [];
  } catch (error) {
    console.error("Error fetching class assigned subjects:", error);
    toast.error(
      "Failed to Load Class Subjects",
      "Could not load subjects assigned to this class"
    );
    return [];
  }
};

const generateReport = async () => {
  if (
    !filters.value.current_session_id ||
    !filters.value.current_term_id ||
    !filters.value.current_class_id
  ) {
    toast.error(
      "Validation Error",
      "Please select session, term, and class to generate report cards"
    );
    return;
  }

  try {
    const classSubjects = await getClassAssignedSubjects(
      filters.value.current_class_id
    );

    if (!classSubjects || classSubjects.length === 0) {
      toast.warning(
        "No Class Subjects Found",
        "No subjects are assigned to this class"
      );
      return;
    }

    subjects.value = classSubjects.map(
      (assignment) => assignment.Subject.subject_name
    );

    const params = {
      current_session_id: filters.value.current_session_id,
      current_term_id: filters.value.current_term_id,
      current_class_id: filters.value.current_class_id,
    };

    const response = await apiServices.getAllStudentSubjectsWithScores(params);
    const responseData = response.data.data;

    console.log("API Response:", responseData); // Debug log

    // Handle different response structures
    gradeList.value =
      responseData.class?.gradeList || responseData.gradeList || null;

    if (!responseData.students || responseData.students.length === 0) {
      toast.error("No Students Found", "No students found in this class");
      return;
    }

    // Calculate all students' totals for ranking
    const allStudents = responseData.students.map((studentData) => {
      let studentTotal = 0;
      let studentSubjectCount = 0;

      studentData.subjects.forEach((subjectAssignment) => {
        let total;

        if (
          subjectAssignment.marks.total_score !== null &&
          subjectAssignment.marks.total_score !== undefined
        ) {
          total = processScore(subjectAssignment.marks.total_score);
        } else {
          const caScore = processScore(subjectAssignment.marks.ca_1_score);
          const examScore = processScore(subjectAssignment.marks.exam_score);
          total = calculateTotal(caScore, examScore);
        }

        // Only count numeric totals for ranking (exclude "ABS")
        if (typeof total === "number" && total > 0) {
          studentTotal += total;
          studentSubjectCount++;
        }
      });

      return {
        id: studentData.student.id,
        total: studentTotal,
        average:
          studentSubjectCount > 0 ? studentTotal / studentSubjectCount : 0,
      };
    });

    allStudents.sort((a, b) => b.total - a.total);

    // Generate report data for each student
    const allReports = [];

    responseData.students.forEach((selectedStudentData) => {
      const studentSubjectMap = {};
      selectedStudentData.subjects.forEach((subjectAssignment) => {
        const subjectName = subjectAssignment.subject.name;
        studentSubjectMap[subjectName] = subjectAssignment;
      });

      const subjectScores = [];
      let totalMarks = 0;
      let subjectCount = 0;

      subjects.value.forEach((subjectName) => {
        const subjectAssignment = studentSubjectMap[subjectName];

        if (subjectAssignment) {
          const caScore = processScore(subjectAssignment.marks.ca_1_score);
          const examScore = processScore(subjectAssignment.marks.exam_score);

          let total;
          if (
            subjectAssignment.marks.total_score !== null &&
            subjectAssignment.marks.total_score !== undefined
          ) {
            total = processScore(subjectAssignment.marks.total_score);
          } else {
            total = calculateTotal(caScore, examScore);
          }

          const gradeResult = gradeList.value
            ? getRemark(gradeList.value, total)
            : getDefaultGrade(total);

          subjectScores.push({
            name: subjectName,
            ca: caScore,
            exam: examScore,
            total: total,
            grade: gradeResult.grade,
            remark: gradeResult.remark,
          });

          // Only count numeric totals for overall calculation (exclude "ABS")
          if (typeof total === "number" && total > 0) {
            totalMarks += total;
            subjectCount++;
          }
        } else {
          subjectScores.push({
            name: subjectName,
            ca: "---",
            exam: "---",
            total: "---",
            grade: "---",
            remark: "Not Assigned",
          });
        }
      });

      const average = subjectCount > 0 ? totalMarks / subjectCount : 0;
      const maxMarks = subjects.value.length * 100;
      const position =
        allStudents.findIndex((s) => s.id == selectedStudentData.student.id) +
        1;

      allReports.push({
        student: {
          name: selectedStudentData.student.full_name,
          admissionNo: selectedStudentData.student.admission_number,
          class: selectedClassName.value,
        },
        subjects: subjectScores,
        totalMarks,
        maxMarks,
        average,
        position,
        totalStudents: responseData.students.length,
        attendance: {
          totalDays: 90,
          present: Math.floor(Math.random() * 10) + 85,
          absent: Math.floor(Math.random() * 5) + 1,
          rate: (Math.floor(Math.random() * 10) + 90).toFixed(1),
        },
        teacherComment:
          average >= 80
            ? "An excellent student who shows great dedication and commitment to studies. Keep up the good work!"
            : average >= 70
            ? "A very good student with consistent performance. Continue working hard!"
            : average >= 60
            ? "Good performance overall. There's room for improvement in some areas."
            : "Fair performance. More effort is needed to improve academic standing.",
        principalComment:
          average >= 80
            ? "Outstanding performance. Continue to maintain this excellent standard."
            : average >= 70
            ? "Very good work. Keep striving for excellence."
            : average >= 60
            ? "Satisfactory performance. Aim higher next term."
            : "Needs improvement. Please seek additional support from teachers.",
        nextTermDate: "15th January, 2025",
      });
    });

    allReportData.value = allReports;
    reportGenerated.value = true;
    toast.success(
      "Report Cards Generated",
      `Successfully generated report cards for ${allReports.length} students`
    );
  } catch (error) {
    console.error("Error generating report card:", error);
    toast.error(
      "Failed to Generate Report",
      error.response?.data?.message || "Could not generate report card"
    );
  }
};

const printReport = () => {
  window.print();
};

// 1. Classic pdfmake PDF Export (Server-side)
const exportClassicPDF = async () => {
  if (!reportGenerated.value) return;
  
  isGeneratingPDF.value = true;
  try {
    toast.info('PDF Generation', 'Generating PDF with pdfmake...');
    
    const response = await apiServices.generatePdfMakeReport({
      reportData: filteredReportData.value,
      schoolInfo: {
        schoolName: configStore.schoolName,
        schoolAddress: configStore.schoolAddress
      },
      termName: selectedTermName.value,
      sessionName: selectedSessionName.value
    });

    // Create download link
    const blob = new Blob([response.data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `report-cards-pdfmake-${Date.now()}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    toast.success('PDF Generated', 'pdfmake PDF downloaded successfully');
  } catch (error) {
    console.error('pdfmake PDF generation error:', error);
    toast.error('PDF Export Failed', 'Could not generate PDF with pdfmake: ' + (error.response?.data?.message || error.message));
  } finally {
    isGeneratingPDF.value = false;
  }
};

// 2. Modern Style pdfmake PDF Export (Server-side)
const exportModernPDF = async () => {
  if (!reportGenerated.value) return;
  
  isGeneratingPDF.value = true;
  try {
    toast.info('PDF Generation', 'Generating Modern Style PDF with pdfmake...');
    
    const response = await apiServices.generateModernPdfMakeReport({
      reportData: filteredReportData.value,
      schoolInfo: {
        schoolName: configStore.schoolName,
        schoolAddress: configStore.schoolAddress
      },
      termName: selectedTermName.value,
      sessionName: selectedSessionName.value
    });

    // Create download link
    const blob = new Blob([response.data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `report-cards-modern-${Date.now()}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    toast.success('PDF Generated', 'Modern Style PDF downloaded successfully');
  } catch (error) {
    console.error('Modern PDF generation error:', error);
    toast.error('PDF Export Failed', 'Could not generate Modern Style PDF: ' + (error.response?.data?.message || error.message));
  } finally {
    isGeneratingPDF.value = false;
  }
};



// Clear search function
const clearSearch = () => {
  searchQuery.value = "";
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
  }
);
</script>

<style scoped>
/* Page Layout */
.page {
  padding: 20px;
  background: #f8fafc;
  min-height: 100vh;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.page-header h1 {
  margin: 0 0 4px 0;
  color: #1f2937;
  font-size: 24px;
}

.page-header p {
  margin: 0;
  color: #6b7280;
  font-size: 14px;
}

.header-actions {
  display: flex;
  gap: 8px;
}

.add-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
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

.modern-btn {
  background: #7c3aed;
}

.modern-btn:hover:not(:disabled) {
  background: #6d28d9;
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

.form-select {
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
}

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
}

.search-icon {
  position: absolute;
  left: 12px;
  color: #9ca3af;
  z-index: 1;
}

.search-input {
  width: 100%;
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

.report-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  page-break-after: always;
  max-width: 800px;
  margin: 0 auto;
}

/* Modern Report Card Style */
.report-card-modern {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  max-width: 850px;
  margin: 0 auto;
  position: relative;
}

.report-card-modern::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 6px;
  background: linear-gradient(90deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #feca57);
}

/* School Header */
.school-header {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 30px 40px 20px 40px;
  border-bottom: 3px solid #e5e7eb;
}

.report-card-modern .school-header {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: none;
  padding: 40px;
  position: relative;
}

.school-logo .logo-badge {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.report-card-modern .school-logo .logo-badge {
  width: 100px;
  height: 100px;
  background: linear-gradient(135deg, #ff6b6b, #ee5a24);
  border-radius: 25px;
  box-shadow: 0 10px 30px rgba(255, 107, 107, 0.4);
  transform: rotate(-5deg);
}

.school-info {
  flex: 1;
  text-align: center;
}

.school-info h1 {
  margin: 0 0 8px 0;
  font-size: 28px;
  color: #1f2937;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.school-info p {
  margin: 4px 0;
  color: #6b7280;
  font-size: 14px;
}

.report-card-modern .school-info h1 {
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-size: 32px;
  font-weight: 800;
}

.report-card-modern .school-info p {
  color: #4a5568;
  font-weight: 500;
}

.report-title {
  text-align: center;
  padding: 20px 40px;
  background: #f8fafc;
  border-bottom: 2px solid #e5e7eb;
}

.report-title h2 {
  margin: 0 0 8px 0;
  font-size: 22px;
  color: #1f2937;
  font-weight: 700;
  letter-spacing: 2px;
}

.session-term {
  color: #6b7280;
  font-size: 14px;
  font-weight: 500;
}

.report-card-modern .report-title {
  background: linear-gradient(135deg, #4ecdc4, #44a08d);
  color: white;
  padding: 30px 40px;
  position: relative;
  overflow: hidden;
}

.report-card-modern .report-title::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
  animation: shimmer 3s ease-in-out infinite;
}

@keyframes shimmer {
  0%, 100% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
  50% { transform: translateX(100%) translateY(100%) rotate(45deg); }
}

.report-card-modern .report-title h2 {
  color: white;
  font-size: 26px;
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
}

.report-card-modern .session-term {
  color: rgba(255, 255, 255, 0.9);
  font-size: 16px;
  font-weight: 600;
}

/* Student Details */
.student-details {
  padding: 25px 40px;
  background: white;
}

.report-card-modern .student-details {
  background: linear-gradient(135deg, #ffeaa7, #fab1a0);
  padding: 30px 40px;
}

.detail-row {
  display: flex;
  gap: 40px;
  margin-bottom: 15px;
}

.detail-row:last-child {
  margin-bottom: 0;
}

.detail-item {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid #f3f4f6;
}

.detail-item .label {
  font-weight: 600;
  color: #374151;
  min-width: 120px;
  font-size: 14px;
}

.detail-item .value {
  color: #1f2937;
  font-size: 14px;
  font-weight: 500;
}

.report-card-modern .detail-item {
  background: rgba(255, 255, 255, 0.8);
  border-radius: 15px;
  padding: 15px 20px;
  margin-bottom: 10px;
  border: none;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
}

.report-card-modern .detail-item .label {
  color: #2d3436;
  font-weight: 700;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.report-card-modern .detail-item .value {
  color: #2d3436;
  font-size: 16px;
  font-weight: 600;
}

.position-highlight {
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  color: #78350f;
  padding: 4px 12px;
  border-radius: 20px;
  font-weight: 700;
  font-size: 13px;
}

/* Academic Section */
.academic-section {
  padding: 25px 40px;
  background: white;
}

.academic-section h3 {
  margin: 0 0 20px 0;
  font-size: 18px;
  color: #1f2937;
  font-weight: 700;
  padding-bottom: 10px;
  border-bottom: 2px solid #3b82f6;
}

.report-card-modern .academic-section {
  background: linear-gradient(135deg, #a8edea, #fed6e3);
  padding: 30px 40px;
}

.report-card-modern .academic-section h3 {
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-size: 22px;
  border-bottom: 3px solid #667eea;
  text-align: center;
  padding-bottom: 15px;
}

.results-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
}

.results-table thead th {
  background: linear-gradient(135deg, #1f2937, #374151);
  color: white;
  padding: 12px 8px;
  text-align: center;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.report-card-modern .results-table {
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  border: none;
}

.report-card-modern .results-table thead th {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  padding: 15px 10px;
  font-size: 13px;
  font-weight: 700;
}

.results-table tbody td {
  padding: 12px 8px;
  border-bottom: 1px solid #f3f4f6;
  text-align: center;
  font-size: 13px;
}

.results-table tbody tr:nth-child(even) {
  background: #f9fafb;
}

.results-table tbody tr:hover {
  background: #f3f4f6;
}

.report-card-modern .results-table tbody td {
  padding: 15px 10px;
  font-size: 14px;
  font-weight: 500;
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
}

.report-card-modern .results-table tbody tr:nth-child(even) {
  background: rgba(255, 255, 255, 0.7);
}

.report-card-modern .results-table tbody tr:nth-child(odd) {
  background: rgba(255, 255, 255, 0.5);
}

.report-card-modern .results-table tbody tr:hover {
  background: rgba(102, 126, 234, 0.1);
  transform: scale(1.02);
  transition: all 0.3s ease;
}

.subject-name {
  text-align: left !important;
  font-weight: 600;
  color: #1f2937;
  padding-left: 16px !important;
}

.total-score {
  font-weight: 700;
  background: #dbeafe !important;
  color: #1e40af;
}

.grade {
  font-weight: 700;
  font-size: 12px;
}

.grade-A {
  color: #059669;
}
.grade-B {
  color: #0284c7;
}
.grade-C {
  color: #ca8a04;
}
.grade-D {
  color: #dc2626;
}
.grade-E,
.grade-F {
  color: #dc2626;
}
.grade-ABS {
  color: #f59e0b;
  font-weight: 800;
}

.remark {
  font-style: italic;
  color: #6b7280;
  font-size: 12px;
}

/* Summary Section */
.summary-section {
  padding: 20px 40px;
  background: #f8fafc;
  border-top: 1px solid #e5e7eb;
  border-bottom: 1px solid #e5e7eb;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.summary-item {
  text-align: center;
  padding: 15px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.summary-label {
  display: block;
  font-size: 12px;
  color: #6b7280;
  font-weight: 500;
  margin-bottom: 4px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.summary-value {
  display: block;
  font-size: 18px;
  color: #1f2937;
  font-weight: 700;
}

/* Info Section */
.info-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 25px;
  padding: 25px 40px;
  background: white;
}

.attendance-box,
.grading-box {
  background: #f9fafb;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.attendance-box h4,
.grading-box h4 {
  margin: 0 0 15px 0;
  font-size: 14px;
  color: #1f2937;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.attendance-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.attendance-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  font-size: 13px;
  color: #374151;
  border-bottom: 1px solid #e5e7eb;
}

.attendance-item strong {
  color: #1f2937;
  font-weight: 600;
}

.grade-scale {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.grade-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #374151;
}

.grade-letter {
  display: inline-block;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  text-align: center;
  line-height: 20px;
  font-weight: 700;
  font-size: 11px;
  color: white;
}

.grade-letter.grade-A {
  background: #059669;
}
.grade-letter.grade-B {
  background: #0284c7;
}
.grade-letter.grade-C {
  background: #ca8a04;
}
.grade-letter.grade-D {
  background: #dc2626;
}
.grade-letter.grade-E,
.grade-letter.grade-F {
  background: #dc2626;
}
.grade-letter.grade-ABS {
  background: #f59e0b;
}

/* Comments Section */
.comments-section {
  padding: 25px 40px;
  background: white;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 25px;
}

.comment-box {
  background: #f9fafb;
  padding: 20px;
  border-radius: 8px;
  border-left: 4px solid #3b82f6;
}

.comment-box h4 {
  margin: 0 0 12px 0;
  font-size: 14px;
  color: #1f2937;
  font-weight: 700;
}

.comment-box p {
  margin: 0 0 15px 0;
  font-size: 13px;
  color: #374151;
  line-height: 1.6;
  font-style: italic;
  min-height: 40px;
}

.signature {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: #6b7280;
  padding-top: 10px;
  border-top: 1px solid #e5e7eb;
}

/* Footer */
.report-footer {
  text-align: center;
  padding: 20px 40px;
  background: #1f2937;
  color: white;
}

.report-footer p {
  margin: 0;
  font-size: 14px;
  font-weight: 500;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.empty-state svg {
  color: #9ca3af;
  margin-bottom: 16px;
}

.empty-state h3 {
  margin: 0 0 8px 0;
  color: #1f2937;
  font-size: 18px;
}

.empty-state p {
  margin: 0;
  color: #6b7280;
  font-size: 14px;
}

/* No Results State */
.no-results-state {
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.no-results-state svg {
  color: #f59e0b;
  margin-bottom: 16px;
}

.no-results-state h3 {
  margin: 0 0 8px 0;
  color: #1f2937;
  font-size: 18px;
}

.no-results-state p {
  margin: 0 0 16px 0;
  color: #6b7280;
  font-size: 14px;
}

.clear-search-action-btn {
  padding: 10px 20px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.clear-search-action-btn:hover {
  background: #2563eb;
}

/* Print Styles */
@media print {
  .page-header,
  .filters-section {
    display: none;
  }

  .report-card {
    box-shadow: none;
    margin: 0;
    max-width: none;
    page-break-after: always;
  }

  .all-reports-container {
    gap: 0;
  }
}

/* Modern Style Additional Sections */
.report-card-modern .summary-section {
  background: linear-gradient(135deg, #ff9a9e, #fecfef);
  padding: 30px 40px;
}

.report-card-modern .summary-item {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.report-card-modern .info-section {
  background: linear-gradient(135deg, #fad0c4, #ffd1ff);
  padding: 30px 40px;
}

.report-card-modern .attendance-box,
.report-card-modern .grading-box {
  background: rgba(255, 255, 255, 0.8);
  border-radius: 20px;
  padding: 25px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.report-card-modern .comments-section {
  background: linear-gradient(135deg, #a8edea, #fed6e3);
  padding: 30px 40px;
}

.report-card-modern .comment-box {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 20px;
  padding: 25px;
  border-left: 6px solid #667eea;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
}

.report-card-modern .report-footer {
  background: linear-gradient(135deg, #667eea, #764ba2);
  padding: 25px 40px;
  text-align: center;
}

.report-card-modern .report-footer p {
  color: white;
  font-size: 16px;
  font-weight: 600;
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
}

/* Position highlight modern style */
.report-card-modern .position-highlight {
  background: linear-gradient(135deg, #ff6b6b, #ee5a24);
  color: white;
  padding: 8px 16px;
  border-radius: 25px;
  font-weight: 800;
  font-size: 14px;
  box-shadow: 0 4px 15px rgba(255, 107, 107, 0.4);
}

/* Responsive */
@media (max-width: 768px) {
  .filters-section {
    flex-direction: column;
  }

  .filter-group {
    min-width: auto;
  }

  .detail-row {
    flex-direction: column;
    gap: 0;
  }

  .summary-grid {
    grid-template-columns: 1fr;
  }

  .info-section {
    grid-template-columns: 1fr;
  }

  .comments-section {
    grid-template-columns: 1fr;
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
}
</style>