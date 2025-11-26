<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1>Report Card</h1>
        <p>Generate individual student report card</p>
      </div>
      <div class="header-actions">
        <button
          class="add-btn"
          @click="exportToPDF2"
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
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          Export PDF
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
              d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 012-2h2a2 2 0 012 2v4M6 7h.01M10 7h.01"
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
        <select v-model="filters.session" class="form-select">
          <option value="">Select Session</option>
          <option value="2023/2024">2023/2024</option>
          <option value="2024/2025">2024/2025</option>
        </select>
      </div>

      <div class="filter-group">
        <label>Term</label>
        <select v-model="filters.term" class="form-select">
          <option value="">Select Term</option>
          <option value="First Term">First Term</option>
          <option value="Second Term">Second Term</option>
          <option value="Third Term">Third Term</option>
        </select>
      </div>

      <div class="filter-group">
        <label>Student</label>
        <select v-model="filters.studentId" class="form-select">
          <option value="">Select Student</option>
          <option
            v-for="student in studentsList"
            :key="student.id"
            :value="student.id"
          >
            {{ student.name }} - {{ student.admissionNo }}
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
        Generate Report Card
      </button>
    </div>

    <!-- Report Card -->
    <div v-if="reportGenerated" class="report-card-container" id="report-card">
      <!-- Header -->
      <div class="report-header-section">
        <div class="header-top">
          <div class="school-logo">
            <svg
              width="70"
              height="70"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
              />
            </svg>
          </div>
          <div class="school-info">
            <h1>{{ configStore.schoolName }}</h1>
            <p class="school-address">
              {{ configStore.schoolAddress || "School Address, City, State" }}
            </p>
            <p class="school-contact">
              Tel: +234 XXX XXX XXXX | Email: info@school.com
            </p>
          </div>
        </div>
        <div class="report-title-bar">
          <h2>STUDENT REPORT CARD</h2>
        </div>
      </div>

      <!-- Student Information -->
      <div class="student-info-section">
        <table class="info-table">
          <tr>
            <td class="info-label">Student Name:</td>
            <td class="info-value">{{ reportData.student.name }}</td>
            <td class="info-label">Admission No:</td>
            <td class="info-value">{{ reportData.student.admissionNo }}</td>
          </tr>
          <tr>
            <td class="info-label">Class:</td>
            <td class="info-value">{{ reportData.student.class }}</td>
            <td class="info-label">Session:</td>
            <td class="info-value">{{ filters.session }}</td>
          </tr>
          <tr>
            <td class="info-label">Term:</td>
            <td class="info-value">{{ filters.term }}</td>
            <td class="info-label">Position in Class:</td>
            <td class="info-value">
              <span class="position-badge"
                >{{ reportData.position }} of
                {{ reportData.totalStudents }}</span
              >
            </td>
          </tr>
        </table>
      </div>

      <!-- Academic Performance -->
      <div class="performance-section">
        <h3>Academic Performance</h3>
        <table class="performance-table">
          <thead>
            <tr>
              <th>Subject</th>
              <th>CA1 (10)</th>
              <th>CA2 (10)</th>
              <th>CA3 (10)</th>
              <th>Exam (70)</th>
              <th>Total (100)</th>
              <th>Grade</th>
              <th>Remark</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="subject in reportData.subjects" :key="subject.name">
              <td class="subject-name">{{ subject.name }}</td>
              <td>{{ subject.ca1 }}</td>
              <td>{{ subject.ca2 }}</td>
              <td>{{ subject.ca3 }}</td>
              <td>{{ subject.exam }}</td>
              <td class="total-score">{{ subject.total }}</td>
              <td>
                <span class="grade-badge" :class="'grade-' + subject.grade">
                  {{ subject.grade }}
                </span>
              </td>
              <td class="remark">{{ subject.remark }}</td>
            </tr>
          </tbody>
          <tfoot>
            <tr class="summary-row">
              <td colspan="4"><strong>Total Marks Obtained</strong></td>
              <td colspan="4">
                <strong
                  >{{ reportData.totalMarks }} /
                  {{ reportData.maxMarks }}</strong
                >
              </td>
            </tr>
            <tr class="summary-row">
              <td colspan="4"><strong>Average Score</strong></td>
              <td colspan="4">
                <strong>{{ reportData.average.toFixed(2) }}%</strong>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      <!-- Grading Scale & Attendance -->
      <div class="info-grid">
        <div class="grading-scale">
          <h4>Grading Scale</h4>
          <ul>
            <li><strong>A:</strong> 80-100% (Excellent)</li>
            <li><strong>B:</strong> 70-79% (Very Good)</li>
            <li><strong>C:</strong> 60-69% (Good)</li>
            <li><strong>D:</strong> 50-59% (Fair)</li>
            <li><strong>E:</strong> 40-49% (Pass)</li>
            <li><strong>F:</strong> 0-39% (Fail)</li>
          </ul>
        </div>

        <div class="attendance-section">
          <h4>Attendance</h4>
          <div class="attendance-item">
            <span>Total School Days:</span>
            <strong>{{ reportData.attendance.totalDays }}</strong>
          </div>
          <div class="attendance-item">
            <span>Days Present:</span>
            <strong>{{ reportData.attendance.present }}</strong>
          </div>
          <div class="attendance-item">
            <span>Days Absent:</span>
            <strong>{{ reportData.attendance.absent }}</strong>
          </div>
          <div class="attendance-item">
            <span>Attendance Rate:</span>
            <strong>{{ reportData.attendance.rate }}%</strong>
          </div>
        </div>
      </div>

      <!-- Teacher's Comments -->
      <div class="comments-section">
        <h4>Class Teacher's Comment</h4>
        <p class="comment-text">{{ reportData.teacherComment }}</p>
        <div class="signature-line">
          <span>Signature: _______________________</span>
          <span>Date: {{ new Date().toLocaleDateString() }}</span>
        </div>
      </div>

      <div class="comments-section">
        <h4>Principal's Comment</h4>
        <p class="comment-text">{{ reportData.principalComment }}</p>
        <div class="signature-line">
          <span>Signature: _______________________</span>
          <span>Date: {{ new Date().toLocaleDateString() }}</span>
        </div>
      </div>

      <!-- Footer -->
      <div class="report-footer">
        <p>Next Term Begins: {{ reportData.nextTermDate }}</p>
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
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
      <h3>No Report Card Generated</h3>
      <p>Select session, term, and student to generate report card</p>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useConfigStore } from "../store/configStore";
import pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";

// Set up fonts for pdfmake
if (pdfFonts && pdfFonts.pdfMake && pdfFonts.pdfMake.vfs) {
  pdfMake.vfs = pdfFonts.pdfMake.vfs;
} else if (
  pdfFonts.default &&
  pdfFonts.default.pdfMake &&
  pdfFonts.default.pdfMake.vfs
) {
  pdfMake.vfs = pdfFonts.default.pdfMake.vfs;
}

export default {
  name: "ReportCard",
  setup() {
    const configStore = useConfigStore();
    const filters = ref({
      session: "",
      term: "",
      studentId: "",
    });

    const reportGenerated = ref(false);
    const studentsList = ref([]);
    const reportData = ref(null);

    onMounted(() => {
      // Load students list
      const mockStudents = [];
      for (let i = 1; i <= 50; i++) {
        mockStudents.push({
          id: i,
          name: `Student ${i.toString().padStart(2, "0")}`,
          admissionNo: `ADM${(2024000 + i).toString()}`,
          class: "JSS 1",
        });
      }
      studentsList.value = mockStudents;
    });

    const getGrade = (score) => {
      if (score >= 80) return "A";
      if (score >= 70) return "B";
      if (score >= 60) return "C";
      if (score >= 50) return "D";
      if (score >= 40) return "E";
      return "F";
    };

    const getRemark = (score) => {
      if (score >= 80) return "Excellent";
      if (score >= 70) return "Very Good";
      if (score >= 60) return "Good";
      if (score >= 50) return "Fair";
      if (score >= 40) return "Pass";
      return "Fail";
    };

    const generateReport = () => {
      if (
        !filters.value.session ||
        !filters.value.term ||
        !filters.value.studentId
      ) {
        alert("Please select session, term, and student");
        return;
      }

      const student = studentsList.value.find(
        (s) => s.id === filters.value.studentId
      );

      // Generate mock subject data
      const subjects = [
        "Mathematics",
        "English Language",
        "Physics",
        "Chemistry",
        "Biology",
        "Economics",
        "Geography",
        "Civic Education",
        "Computer Science",
      ];

      const subjectScores = subjects.map((subject) => {
        const ca1 = Math.floor(Math.random() * 5) + 6; // 6-10
        const ca2 = Math.floor(Math.random() * 5) + 6; // 6-10
        const ca3 = Math.floor(Math.random() * 5) + 6; // 6-10
        const exam = Math.floor(Math.random() * 30) + 45; // 45-75
        const total = ca1 + ca2 + ca3 + exam;

        return {
          name: subject,
          ca1,
          ca2,
          ca3,
          exam,
          total,
          grade: getGrade(total),
          remark: getRemark(total),
        };
      });

      const totalMarks = subjectScores.reduce((sum, s) => sum + s.total, 0);
      const maxMarks = subjects.length * 100;
      const average = totalMarks / subjects.length;

      reportData.value = {
        student: student,
        subjects: subjectScores,
        totalMarks,
        maxMarks,
        average,
        position: Math.floor(Math.random() * 10) + 1,
        totalStudents: 45,
        attendance: {
          totalDays: 90,
          present: 87,
          absent: 3,
          rate: 96.7,
        },
        teacherComment:
          "An excellent student who shows great dedication and commitment to studies. Keep up the good work!",
        principalComment:
          "Outstanding performance. Continue to maintain this excellent standard.",
        nextTermDate: "15th January, 2025",
      };

      reportGenerated.value = true;
    };

    const printReport = () => {
      window.print();
    };

    const exportToPDF = () => {
      if (!reportGenerated.value) return;

      // Build performance table body
      const tableBody = [
        [
          { text: "Subject", style: "tableHeader" },
          { text: "CA1 (10)", style: "tableHeader", alignment: "center" },
          { text: "CA2 (10)", style: "tableHeader", alignment: "center" },
          { text: "CA3 (10)", style: "tableHeader", alignment: "center" },
          { text: "Exam (70)", style: "tableHeader", alignment: "center" },
          { text: "Total (100)", style: "tableHeader", alignment: "center" },
          { text: "Grade", style: "tableHeader", alignment: "center" },
          { text: "Remark", style: "tableHeader", alignment: "center" },
        ],
        ...reportData.value.subjects.map((subject) => [
          { text: subject.name, fontSize: 10 },
          { text: subject.ca1.toString(), alignment: "center", fontSize: 10 },
          { text: subject.ca2.toString(), alignment: "center", fontSize: 10 },
          { text: subject.ca3.toString(), alignment: "center", fontSize: 10 },
          { text: subject.exam.toString(), alignment: "center", fontSize: 10 },
          {
            text: subject.total.toString(),
            alignment: "center",
            fontSize: 10,
            bold: true,
            fillColor: "#dbeafe",
          },
          {
            text: subject.grade,
            alignment: "center",
            fontSize: 10,
            bold: true,
          },
          {
            text: subject.remark,
            alignment: "center",
            fontSize: 9,
            italics: true,
            color: "#6b7280",
          },
        ]),
        [
          {
            text: "Total Marks Obtained",
            colSpan: 4,
            bold: true,
            fontSize: 11,
          },
          {},
          {},
          {},
          {
            text: `${reportData.value.totalMarks} / ${reportData.value.maxMarks}`,
            colSpan: 4,
            bold: true,
            fontSize: 11,
            alignment: "center",
            fillColor: "#f3f4f6",
          },
          {},
          {},
          {},
        ],
        [
          { text: "Average Score", colSpan: 4, bold: true, fontSize: 11 },
          {},
          {},
          {},
          {
            text: `${reportData.value.average.toFixed(2)}%`,
            colSpan: 4,
            bold: true,
            fontSize: 11,
            alignment: "center",
            fillColor: "#f3f4f6",
          },
          {},
          {},
          {},
        ],
      ];

      // Build student info table
      const studentInfoTable = {
        table: {
          widths: ["25%", "25%", "25%", "25%"],
          body: [
            [
              {
                text: "Student Name:",
                bold: true,
                fontSize: 10,
                border: [true, true, false, false],
              },
              {
                text: reportData.value.student.name,
                fontSize: 10,
                border: [false, true, false, false],
              },
              {
                text: "Admission No:",
                bold: true,
                fontSize: 10,
                border: [false, true, false, false],
              },
              {
                text: reportData.value.student.admissionNo,
                fontSize: 10,
                border: [false, true, true, false],
              },
            ],
            [
              {
                text: "Class:",
                bold: true,
                fontSize: 10,
                border: [true, false, false, false],
              },
              {
                text: reportData.value.student.class,
                fontSize: 10,
                border: [false, false, false, false],
              },
              {
                text: "Session:",
                bold: true,
                fontSize: 10,
                border: [false, false, false, false],
              },
              {
                text: filters.value.session,
                fontSize: 10,
                border: [false, false, true, false],
              },
            ],
            [
              {
                text: "Term:",
                bold: true,
                fontSize: 10,
                border: [true, false, false, true],
              },
              {
                text: filters.value.term,
                fontSize: 10,
                border: [false, false, false, true],
              },
              {
                text: "Position:",
                bold: true,
                fontSize: 10,
                border: [false, false, false, true],
              },
              {
                text: `${reportData.value.position} of ${reportData.value.totalStudents}`,
                fontSize: 10,
                bold: true,
                fillColor: "#fef3c7",
                border: [false, false, true, true],
              },
            ],
          ],
        },
        layout: {
          fillColor: (rowIndex) =>
            rowIndex === 0 || rowIndex === 1 || rowIndex === 2
              ? "#f9fafb"
              : null,
          hLineWidth: () => 1,
          vLineWidth: () => 1,
          hLineColor: () => "#e5e7eb",
          vLineColor: () => "#e5e7eb",
        },
      };

      const docDefinition = {
        pageSize: "A4",
        pageMargins: [40, 40, 40, 40],
        content: [
          // Header Section
          {
            canvas: [
              {
                type: "line",
                x1: 0,
                y1: 0,
                x2: 515,
                y2: 0,
                lineWidth: 3,
                lineColor: "#1f2937",
              },
            ],
          },
          {
            text: configStore.schoolName,
            style: "schoolName",
            alignment: "center",
            margin: [0, 15, 0, 5],
          },
          {
            text: configStore.schoolAddress || "School Address",
            style: "schoolAddress",
            alignment: "center",
            margin: [0, 0, 0, 10],
          },
          {
            text: "STUDENT REPORT CARD",
            style: "reportTitle",
            alignment: "center",
            margin: [0, 0, 0, 15],
          },
          {
            canvas: [
              {
                type: "line",
                x1: 0,
                y1: 0,
                x2: 515,
                y2: 0,
                lineWidth: 3,
                lineColor: "#1f2937",
              },
            ],
            margin: [0, 0, 0, 20],
          },

          // Student Information
          studentInfoTable,
          { text: "", margin: [0, 0, 0, 15] },

          // Academic Performance
          {
            text: "Academic Performance",
            style: "sectionHeader",
            margin: [0, 0, 0, 8],
          },
          {
            canvas: [
              {
                type: "line",
                x1: 0,
                y1: 0,
                x2: 150,
                y2: 0,
                lineWidth: 2,
                lineColor: "#e5e7eb",
              },
            ],
            margin: [0, 0, 0, 10],
          },
          {
            table: {
              headerRows: 1,
              widths: ["*", 40, 40, 40, 50, 50, 40, 60],
              body: tableBody,
            },
            layout: {
              fillColor: (rowIndex, node) => {
                if (rowIndex === 0) return "#1f2937";
                if (rowIndex >= node.table.body.length - 2) return "#f3f4f6";
                return null;
              },
              hLineWidth: () => 1,
              vLineWidth: () => 1,
              hLineColor: () => "#e5e7eb",
              vLineColor: () => "#e5e7eb",
            },
          },

          // Grading Scale and Attendance
          { text: "", margin: [0, 0, 0, 15] },
          {
            columns: [
              {
                width: "48%",
                stack: [
                  {
                    text: "Grading Scale",
                    style: "subsectionHeader",
                    margin: [0, 0, 0, 5],
                  },
                  {
                    canvas: [
                      {
                        type: "line",
                        x1: 0,
                        y1: 0,
                        x2: 100,
                        y2: 0,
                        lineWidth: 2,
                        lineColor: "#e5e7eb",
                      },
                    ],
                    margin: [0, 0, 0, 8],
                  },
                  {
                    text: "A: 80-100% (Excellent)",
                    fontSize: 9,
                    margin: [0, 2, 0, 2],
                  },
                  {
                    text: "B: 70-79% (Very Good)",
                    fontSize: 9,
                    margin: [0, 2, 0, 2],
                  },
                  {
                    text: "C: 60-69% (Good)",
                    fontSize: 9,
                    margin: [0, 2, 0, 2],
                  },
                  {
                    text: "D: 50-59% (Fair)",
                    fontSize: 9,
                    margin: [0, 2, 0, 2],
                  },
                  {
                    text: "E: 40-49% (Pass)",
                    fontSize: 9,
                    margin: [0, 2, 0, 2],
                  },
                  {
                    text: "F: 0-39% (Fail)",
                    fontSize: 9,
                    margin: [0, 2, 0, 2],
                  },
                ],
              },
              { width: "4%", text: "" },
              {
                width: "48%",
                stack: [
                  {
                    text: "Attendance",
                    style: "subsectionHeader",
                    margin: [0, 0, 0, 5],
                  },
                  {
                    canvas: [
                      {
                        type: "line",
                        x1: 0,
                        y1: 0,
                        x2: 80,
                        y2: 0,
                        lineWidth: 2,
                        lineColor: "#e5e7eb",
                      },
                    ],
                    margin: [0, 0, 0, 8],
                  },
                  {
                    columns: [
                      { text: "Total School Days:", fontSize: 9, width: "60%" },
                      {
                        text: reportData.value.attendance.totalDays.toString(),
                        fontSize: 9,
                        bold: true,
                        width: "40%",
                        alignment: "right",
                      },
                    ],
                    margin: [0, 2, 0, 2],
                  },
                  {
                    columns: [
                      { text: "Days Present:", fontSize: 9, width: "60%" },
                      {
                        text: reportData.value.attendance.present.toString(),
                        fontSize: 9,
                        bold: true,
                        width: "40%",
                        alignment: "right",
                      },
                    ],
                    margin: [0, 2, 0, 2],
                  },
                  {
                    columns: [
                      { text: "Days Absent:", fontSize: 9, width: "60%" },
                      {
                        text: reportData.value.attendance.absent.toString(),
                        fontSize: 9,
                        bold: true,
                        width: "40%",
                        alignment: "right",
                      },
                    ],
                    margin: [0, 2, 0, 2],
                  },
                  {
                    columns: [
                      { text: "Attendance Rate:", fontSize: 9, width: "60%" },
                      {
                        text: `${reportData.value.attendance.rate}%`,
                        fontSize: 9,
                        bold: true,
                        width: "40%",
                        alignment: "right",
                      },
                    ],
                    margin: [0, 2, 0, 2],
                  },
                ],
              },
            ],
          },

          // Comments Section
          { text: "", margin: [0, 0, 0, 15] },
          {
            stack: [
              {
                text: "Class Teacher's Comment",
                style: "subsectionHeader",
                margin: [0, 0, 0, 5],
              },
              {
                canvas: [
                  {
                    type: "rect",
                    x: 0,
                    y: 0,
                    w: 515,
                    h: 60,
                    lineWidth: 1,
                    lineColor: "#e5e7eb",
                    color: "#f9fafb",
                  },
                  {
                    type: "line",
                    x1: 0,
                    y1: 0,
                    x2: 4,
                    y2: 0,
                    lineWidth: 60,
                    lineColor: "#1f2937",
                  },
                ],
              },
              {
                text: reportData.value.teacherComment,
                fontSize: 10,
                italics: true,
                margin: [10, -50, 10, 0],
              },
              {
                columns: [
                  {
                    text: "Signature: _______________________",
                    fontSize: 9,
                    margin: [10, 15, 0, 0],
                  },
                  {
                    text: `Date: ${new Date().toLocaleDateString()}`,
                    fontSize: 9,
                    alignment: "right",
                    margin: [0, 15, 10, 0],
                  },
                ],
              },
            ],
            margin: [0, 0, 0, 15],
          },

          {
            stack: [
              {
                text: "Principal's Comment",
                style: "subsectionHeader",
                margin: [0, 0, 0, 5],
              },
              {
                canvas: [
                  {
                    type: "rect",
                    x: 0,
                    y: 0,
                    w: 515,
                    h: 60,
                    lineWidth: 1,
                    lineColor: "#e5e7eb",
                    color: "#f9fafb",
                  },
                  {
                    type: "line",
                    x1: 0,
                    y1: 0,
                    x2: 4,
                    y2: 0,
                    lineWidth: 60,
                    lineColor: "#1f2937",
                  },
                ],
              },
              {
                text: reportData.value.principalComment,
                fontSize: 10,
                italics: true,
                margin: [10, -50, 10, 0],
              },
              {
                columns: [
                  {
                    text: "Signature: _______________________",
                    fontSize: 9,
                    margin: [10, 15, 0, 0],
                  },
                  {
                    text: `Date: ${new Date().toLocaleDateString()}`,
                    fontSize: 9,
                    alignment: "right",
                    margin: [0, 15, 10, 0],
                  },
                ],
              },
            ],
            margin: [0, 0, 0, 20],
          },

          // Footer
          {
            canvas: [
              {
                type: "line",
                x1: 0,
                y1: 0,
                x2: 515,
                y2: 0,
                lineWidth: 2,
                lineColor: "#e5e7eb",
              },
            ],
            margin: [0, 0, 0, 10],
          },
          {
            text: `Next Term Begins: ${reportData.value.nextTermDate}`,
            fontSize: 11,
            bold: true,
            alignment: "center",
          },
        ],
        styles: {
          schoolName: {
            fontSize: 20,
            bold: true,
            color: "#1f2937",
          },
          schoolAddress: {
            fontSize: 11,
            color: "#6b7280",
          },
          reportTitle: {
            fontSize: 16,
            bold: true,
            decoration: "underline",
            color: "#1f2937",
          },
          sectionHeader: {
            fontSize: 13,
            bold: true,
            color: "#1f2937",
          },
          subsectionHeader: {
            fontSize: 11,
            bold: true,
            color: "#1f2937",
          },
          tableHeader: {
            fontSize: 10,
            bold: true,
            color: "white",
            fillColor: "#1f2937",
          },
        },
      };

      const fileName = `ReportCard_${reportData.value.student.name.replace(
        /\s+/g,
        "_"
      )}_${filters.value.term.replace(
        /\s+/g,
        "_"
      )}_${filters.value.session.replace(/\//g, "-")}.pdf`;
      pdfMake.createPdf(docDefinition).download(fileName);
    };

   

    const exportToPDF2 = () => {
      if (!reportData.value || !reportData.value.student) {
        alert("Report data not ready yet. Please wait.");
        return;
      }

      const r = reportData.value; // shortcut
      const f = filters.value;

      const docDefinition = {
        pageSize: "A4",
        pageMargins: [30, 20, 30, 30],

        content: [
          // HEADER
          {
            columns: [
              {
                width: 70,
                canvas: [
                  {
                    type: "rect",
                    x: 0,
                    y: 0,
                    w: 60,
                    h: 60,
                    r: 5,
                    lineColor: "#4b5563",
                  },
                ],
                margin: [0, 0, 10, 0],
              },
              {
                width: "*",
                stack: [
                  { text: configStore.schoolName, style: "schoolName" },
                  { text: configStore.schoolAddress, style: "schoolAddress" },
                  {
                    text: "Tel: +234 XXX XXX XXXX | Email: info@school.com",
                    style: "schoolContact",
                    margin: [0, 2, 0, 0],
                  },
                ],
              },
            ],
          },

          {
            text: "STUDENT REPORT CARD",
            style: "reportTitle",
            margin: [0, 10, 0, 10],
          },

          // STUDENT INFO
          {
            table: {
              widths: ["25%", "25%", "25%", "25%"],
              body: [
                [
                  { text: "Student Name:", style: "label" },
                  { text: r.student.name, style: "value" },
                  { text: "Admission No:", style: "label" },
                  { text: r.student.admissionNo, style: "value" },
                ],
                [
                  { text: "Class:", style: "label" },
                  { text: r.student.class, style: "value" },
                  { text: "Session:", style: "label" },
                  { text: f.session, style: "value" },
                ],
                [
                  { text: "Term:", style: "label" },
                  { text: f.term, style: "value" },
                  { text: "Position in Class:", style: "label" },
                  {
                    text: `${r.position} of ${r.totalStudents}`,
                    style: "positionValue",
                  },
                ],
              ],
            },
            layout: "lightHorizontalLines",
            margin: [0, 10, 0, 15],
          },

          // PERFORMANCE TABLE
          {
            text: "Academic Performance",
            style: "sectionTitle",
            margin: [0, 5, 0, 5],
          },

          {
            table: {
              headerRows: 1,
              widths: ["23%", "*", "*", "*", "*", "*", "*", "*"],
              body: [
                [
                  { text: "Subject", style: "tableHeader" },
                  { text: "CA1 (10)", style: "tableHeader" },
                  { text: "CA2 (10)", style: "tableHeader" },
                  { text: "CA3 (10)", style: "tableHeader" },
                  { text: "Exam (70)", style: "tableHeader" },
                  { text: "Total", style: "tableHeader" },
                  { text: "Grade", style: "tableHeader" },
                  { text: "Remark", style: "tableHeader" },
                ],

                ...r.subjects.map((s) => [
                  { text: s.name, style: "cell" },
                  { text: s.ca1.toString(), style: "centerCell" },
                  { text: s.ca2.toString(), style: "centerCell" },
                  { text: s.ca3.toString(), style: "centerCell" },
                  { text: s.exam.toString(), style: "centerCell" },
                  { text: s.total.toString(), style: "totalCell" },
                  { text: s.grade, style: "gradeCell" },
                  { text: s.remark, style: "remarkCell" },
                ]),

                [
                  {
                    text: "Total Marks Obtained",
                    colSpan: 4,
                    style: "summaryLabel",
                  },
                  {},
                  {},
                  {},
                  {
                    text: `${r.totalMarks} / ${r.maxMarks}`,
                    colSpan: 4,
                    style: "summaryValue",
                  },
                  {},
                  {},
                  {},
                ],

                [
                  { text: "Average Score", colSpan: 4, style: "summaryLabel" },
                  {},
                  {},
                  {},
                  {
                    text: `${r.average.toFixed(2)}%`,
                    colSpan: 4,
                    style: "summaryValue",
                  },
                  {},
                  {},
                  {},
                ],
              ],
            },

            layout: {
              fillColor: (i) => (i === 0 ? "#f3f4f6" : null),
              hLineColor: "#e5e7eb",
              vLineColor: "#e5e7eb",
            },

            margin: [0, 0, 0, 15],
          },

          // GRADING SCALE + ATTENDANCE
          {
            columns: [
              {
                width: "*",
                stack: [
                  { text: "Grading Scale", style: "sectionTitle" },
                  {
                    ul: [
                      "A: 80-100% (Excellent)",
                      "B: 70-79% (Very Good)",
                      "C: 60-69% (Good)",
                      "D: 50-59% (Fair)",
                      "E: 40-49% (Pass)",
                      "F: 0-39% (Fail)",
                    ],
                    style: "listItem",
                  },
                ],
              },

              {
                width: "*",
                stack: [
                  { text: "Attendance", style: "sectionTitle" },
                  {
                    text: `Total School Days:   ${r.attendance.totalDays}`,
                    style: "attendItem",
                  },
                  {
                    text: `Days Present:        ${r.attendance.present}`,
                    style: "attendItem",
                  },
                  {
                    text: `Days Absent:         ${r.attendance.absent}`,
                    style: "attendItem",
                  },
                  {
                    text: `Attendance Rate:     ${r.attendance.rate}%`,
                    style: "attendItem",
                  },
                ],
              },
            ],
            columnGap: 20,
            margin: [0, 0, 0, 15],
          },

          // TEACHER COMMENT
          { text: "Class Teacher’s Comment", style: "sectionTitle" },
          { text: r.teacherComment, style: "commentText" },
          {
            text:
              "Signature: _______________________     Date: " +
              new Date().toLocaleDateString(),
            style: "signLine",
            margin: [0, 5, 0, 20],
          },

          // PRINCIPAL COMMENT
          { text: "Principal’s Comment", style: "sectionTitle" },
          { text: r.principalComment, style: "commentText" },
          {
            text:
              "Signature: _______________________     Date: " +
              new Date().toLocaleDateString(),
            style: "signLine",
            margin: [0, 5, 0, 20],
          },

          // FOOTER
          {
            text: `Next Term Begins: ${r.nextTermDate}`,
            alignment: "center",
            margin: [0, 20, 0, 0],
            fontSize: 10,
          },
        ],
      };

      pdfMake.createPdf(docDefinition).open();
    };

    return {
      configStore,
      filters,
      reportGenerated,
      studentsList,
      reportData,
      generateReport,
      printReport,
      exportToPDF,
      exportToPDF2,
    };
  },
};
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

.filters-section {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  flex-wrap: wrap;
  align-items: flex-end;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 200px;
}

.filter-group label {
  font-size: 13px;
  font-weight: 500;
  color: #374151;
}

.report-card-container {
  background: white;
  padding: 0;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  max-width: 900px;
  margin: 0 auto;
  border: 1px solid #e5e7eb;
}

.report-header-section {
  background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
  color: white;
  padding: 30px 40px 0 40px;
  border-radius: 8px 8px 0 0;
}

.header-top {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
}

.school-logo {
  flex-shrink: 0;
}

.school-logo svg {
  color: white;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

.school-info {
  flex: 1;
  text-align: center;
}

.school-info h1 {
  margin: 0 0 8px 0;
  font-size: 28px;
  color: white;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.school-address {
  margin: 0 0 4px 0;
  color: rgba(255, 255, 255, 0.9);
  font-size: 13px;
}

.school-contact {
  margin: 0;
  color: rgba(255, 255, 255, 0.8);
  font-size: 12px;
}

.report-title-bar {
  background: rgba(255, 255, 255, 0.15);
  padding: 12px;
  text-align: center;
  border-radius: 6px 6px 0 0;
}

.report-title-bar h2 {
  margin: 0;
  font-size: 20px;
  color: white;
  font-weight: 700;
  letter-spacing: 2px;
}

.student-info-section {
  padding: 30px 40px;
  background: #f9fafb;
  border-bottom: 3px solid #e5e7eb;
}

.info-table {
  width: 100%;
  border-collapse: collapse;
}

.info-table tr {
  border-bottom: 1px solid #e5e7eb;
}

.info-table tr:last-child {
  border-bottom: none;
}

.info-table td {
  padding: 12px 15px;
}

.info-label {
  font-weight: 600;
  color: #374151;
  font-size: 14px;
  width: 20%;
  background: white;
}

.info-value {
  color: #111827;
  font-size: 14px;
  width: 30%;
  font-weight: 500;
}

.position-badge {
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  color: #78350f;
  padding: 4px 12px;
  border-radius: 6px;
  font-weight: 700;
  font-size: 13px;
  display: inline-block;
  box-shadow: 0 2px 4px rgba(251, 191, 36, 0.3);
}

.performance-section {
  padding: 30px 40px;
  background: white;
}

.performance-section h3 {
  margin: 0 0 20px 0;
  font-size: 18px;
  color: #1f2937;
  font-weight: 700;
  padding-bottom: 10px;
  border-bottom: 3px solid #3b82f6;
  display: inline-block;
}

.performance-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
  margin-top: 15px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.performance-table thead th {
  background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
  color: white;
  padding: 12px 10px;
  text-align: center;
  font-size: 12px;
  font-weight: 600;
  border: 1px solid #2563eb;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.performance-table tbody td {
  padding: 12px 10px;
  border: 1px solid #e5e7eb;
  text-align: center;
  font-size: 13px;
}

.performance-table tbody tr:nth-child(even) {
  background: #f9fafb;
}

.performance-table tbody tr:hover {
  background: #f3f4f6;
}

.performance-table .subject-name {
  text-align: left;
  font-weight: 600;
  color: #1f2937;
  padding-left: 15px;
}

.performance-table .total-score {
  font-weight: 700;
  background: #dbeafe;
  color: #1e40af;
  font-size: 14px;
}

.performance-table tfoot td {
  padding: 12px 10px;
  border: 1px solid #e5e7eb;
  background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
  font-weight: 600;
}

.summary-row {
  font-size: 14px;
}

.summary-row td {
  color: #1f2937;
}

.grade-badge {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 4px;
  font-weight: 700;
  font-size: 11px;
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

.remark {
  font-style: italic;
  color: #6b7280;
  font-size: 12px;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 25px;
  padding: 30px 40px;
  background: #f9fafb;
}

.grading-scale,
.attendance-section {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border-left: 4px solid #3b82f6;
}

.grading-scale h4,
.attendance-section h4 {
  margin: 0 0 15px 0;
  font-size: 15px;
  color: #1f2937;
  font-weight: 700;
  padding-bottom: 8px;
  border-bottom: 2px solid #e5e7eb;
}

.grading-scale ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.grading-scale li {
  padding: 6px 0;
  font-size: 13px;
  color: #374151;
  display: flex;
  align-items: center;
}

.grading-scale li strong {
  min-width: 30px;
  color: #1f2937;
}

.attendance-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  font-size: 13px;
  color: #374151;
  border-bottom: 1px solid #f3f4f6;
}

.attendance-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.attendance-item strong {
  color: #1f2937;
  font-weight: 600;
}

.comments-section {
  margin: 0 40px 25px 40px;
  padding: 20px;
  background: white;
  border-radius: 8px;
  border-left: 4px solid #3b82f6;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.comments-section h4 {
  margin: 0 0 12px 0;
  font-size: 15px;
  color: #1f2937;
  font-weight: 700;
}

.comment-text {
  margin: 0 0 15px 0;
  font-size: 13px;
  color: #374151;
  font-style: italic;
  line-height: 1.7;
  min-height: 50px;
  padding: 10px;
  background: #f9fafb;
  border-radius: 4px;
}

.signature-line {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #6b7280;
  margin-top: 15px;
  padding-top: 10px;
  border-top: 1px solid #e5e7eb;
}

.report-footer {
  text-align: center;
  padding: 25px 40px;
  background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
  border-radius: 0 0 8px 8px;
}

.report-footer p {
  margin: 0;
  font-size: 15px;
  font-weight: 700;
  color: white;
  letter-spacing: 0.5px;
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

@media print {
  .page-header,
  .filters-section {
    display: none;
  }

  .report-card-container {
    box-shadow: none;
    padding: 20px;
  }
}
</style>
