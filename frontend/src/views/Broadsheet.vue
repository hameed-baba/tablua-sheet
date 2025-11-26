<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1>Broadsheet Report</h1>
        <p>Class performance report with student rankings</p>
      </div>
      <div class="header-actions">
        <button class="add-btn" @click="exportToPDF" :disabled="!reportGenerated">
          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Export PDF
        </button>
        <button class="add-btn secondary" @click="printBroadsheet" :disabled="!reportGenerated">
          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 012-2h2a2 2 0 012 2v4M6 7h.01M10 7h.01" />
          </svg>
          Print
        </button>
      </div>
    </div>

    <!-- Filters -->
    <div class="filters-section">
      <div class="filter-group">
        <label>Session</label>
        <select v-model="filters.session" class="form-control">
          <option value="">Select Session</option>
          <option value="2023/2024">2023/2024</option>
          <option value="2024/2025">2024/2025</option>
        </select>
      </div>

      <div class="filter-group">
        <label>Term</label>
        <select v-model="filters.term" class="form-control">
          <option value="">Select Term</option>
          <option value="First Term">First Term</option>
          <option value="Second Term">Second Term</option>
          <option value="Third Term">Third Term</option>
        </select>
      </div>

      <div class="filter-group">
        <label>Class</label>
        <select v-model="filters.class" class="form-control">
          <option value="">Select Class</option>
          <option value="JSS 1">JSS 1</option>
          <option value="JSS 2">JSS 2</option>
          <option value="JSS 3">JSS 3</option>
          <option value="SSS 1">SSS 1</option>
          <option value="SSS 2">SSS 2</option>
          <option value="SSS 3">SSS 3</option>
        </select>
      </div>

      <div class="filter-group">
        <label>Section</label>
        <select v-model="filters.section" class="form-control">
          <option value="">All Sections</option>
          <option value="A">A</option>
          <option value="B">B</option>
          <option value="C">C</option>
        </select>
      </div>

      <button class="search-btn" @click="loadBroadsheet">
        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        Generate Report
      </button>
    </div>

    <!-- Report Header -->
    <div v-if="reportGenerated" class="report-header">
      <h2>{{ filters.class }}{{ filters.section ? ' - Section ' + filters.section : '' }}</h2>
      <p>{{ filters.session }} | {{ filters.term }}</p>
      <div class="report-stats">
        <div class="stat-card">
          <span class="stat-label">Total Students</span>
          <span class="stat-value">{{ students.length }}</span>
        </div>
        <div class="stat-card">
          <span class="stat-label">Class Average</span>
          <span class="stat-value">{{ classAverage.toFixed(2) }}%</span>
        </div>
        <div class="stat-card">
          <span class="stat-label">Highest Score</span>
          <span class="stat-value">{{ highestScore.toFixed(2) }}%</span>
        </div>
        <div class="stat-card">
          <span class="stat-label">Lowest Score</span>
          <span class="stat-value">{{ lowestScore.toFixed(2) }}%</span>
        </div>
      </div>
    </div>

    <!-- Broadsheet Table -->
    <div v-if="reportGenerated" class="table-container broadsheet-table">
      <table>
        <thead>
          <tr>
            <th rowspan="2" class="sticky-col">Position</th>
            <th rowspan="2" class="sticky-col-2">Student Name</th>
            <th rowspan="2">Admission No</th>
            <th :colspan="subjects.length" class="subjects-header">Subjects</th>
            <th rowspan="2">Total</th>
            <th rowspan="2">Average</th>
            <th rowspan="2">Grade</th>
            <th rowspan="2">Remark</th>
          </tr>
          <tr>
            <th v-for="subject in subjects" :key="subject" class="subject-col">
              {{ subject }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(student, index) in rankedStudents" :key="student.id" :class="getRowClass(index)">
            <td class="sticky-col position-cell">
              <span class="position-badge" :class="getPositionClass(index)">
                {{ getPositionText(index + 1) }}
              </span>
            </td>
            <td class="sticky-col-2 student-name">{{ student.name }}</td>
            <td>{{ student.admissionNo }}</td>
            <td v-for="subject in subjects" :key="subject" class="score-cell">
              <span :class="getScoreClass(student.scores[subject])">
                {{ student.scores[subject] || '-' }}
              </span>
            </td>
            <td class="total-cell">{{ student.total }}</td>
            <td class="average-cell">{{ student.average.toFixed(2) }}%</td>
            <td class="grade-cell">
              <span class="grade-badge" :class="'grade-' + student.grade">
                {{ student.grade }}
              </span>
            </td>
            <td class="remark-cell">{{ student.remark }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Empty State -->
    <div v-if="!reportGenerated" class="empty-state">
      <svg width="64" height="64" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <h3>No Report Generated</h3>
      <p>Select session, term, and class to generate broadsheet report</p>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

// Set up fonts for pdfmake
if (pdfFonts && pdfFonts.pdfMake && pdfFonts.pdfMake.vfs) {
  pdfMake.vfs = pdfFonts.pdfMake.vfs;
} else if (pdfFonts.default && pdfFonts.default.pdfMake && pdfFonts.default.pdfMake.vfs) {
  pdfMake.vfs = pdfFonts.default.pdfMake.vfs;
}

export default {
  name: 'Broadsheet',
  setup() {
    const filters = ref({
      session: '',
      term: '',
      class: '',
      section: ''
    });

    const reportGenerated = ref(false);
    const students = ref([]);
    const subjects = ref([]);

    // Mock data generator
    const loadBroadsheet = () => {
      if (!filters.value.session || !filters.value.term || !filters.value.class) {
        alert('Please select session, term, and class');
        return;
      }

      // Generate mock subjects
      subjects.value = [
        'Mathematics',
        'English',
        'Physics',
        'Chemistry',
        'Biology',
        'Economics',
        'Geography',
        'Civic Education',
        'Computer Science'
      ];

      // Generate mock student data
      const mockStudents = [];
      const studentCount = 45;

      for (let i = 1; i <= studentCount; i++) {
        const scores = {};
        let total = 0;

        subjects.value.forEach(subject => {
          const score = Math.floor(Math.random() * 40) + 40; // 40-80 range
          scores[subject] = score;
          total += score;
        });

        const average = total / subjects.value.length;
        
        mockStudents.push({
          id: i,
          name: `Student ${i.toString().padStart(2, '0')}`,
          admissionNo: `ADM${(2024000 + i).toString()}`,
          scores: scores,
          total: total,
          average: average,
          grade: getGrade(average),
          remark: getRemark(average)
        });
      }

      // Sort by total (descending)
      students.value = mockStudents.sort((a, b) => b.total - a.total);
      reportGenerated.value = true;
    };

    const rankedStudents = computed(() => students.value);

    const classAverage = computed(() => {
      if (students.value.length === 0) return 0;
      const sum = students.value.reduce((acc, student) => acc + student.average, 0);
      return sum / students.value.length;
    });

    const highestScore = computed(() => {
      if (students.value.length === 0) return 0;
      return students.value[0].average;
    });

    const lowestScore = computed(() => {
      if (students.value.length === 0) return 0;
      return students.value[students.value.length - 1].average;
    });

    const getGrade = (average) => {
      if (average >= 80) return 'A';
      if (average >= 70) return 'B';
      if (average >= 60) return 'C';
      if (average >= 50) return 'D';
      if (average >= 40) return 'E';
      return 'F';
    };

    const getRemark = (average) => {
      if (average >= 80) return 'Excellent';
      if (average >= 70) return 'Very Good';
      if (average >= 60) return 'Good';
      if (average >= 50) return 'Fair';
      if (average >= 40) return 'Pass';
      return 'Fail';
    };

    const getPositionText = (position) => {
      if (position === 1) return '1st';
      if (position === 2) return '2nd';
      if (position === 3) return '3rd';
      return `${position}th`;
    };

    const getPositionClass = (index) => {
      if (index === 0) return 'position-gold';
      if (index === 1) return 'position-silver';
      if (index === 2) return 'position-bronze';
      return '';
    };

    const getRowClass = (index) => {
      if (index === 0) return 'top-student';
      if (index < 3) return 'top-three';
      return '';
    };

    const getScoreClass = (score) => {
      if (!score) return '';
      if (score >= 80) return 'score-excellent';
      if (score >= 70) return 'score-good';
      if (score >= 60) return 'score-average';
      if (score >= 50) return 'score-fair';
      return 'score-poor';
    };

    const printBroadsheet = () => {
      window.print();
    };

    const exportToPDF = () => {
      if (!reportGenerated.value) return;

      // Helper function to shorten subject names for PDF
      const shortenSubjectName = (subject) => {
        const abbreviations = {
          'Mathematics': 'Math',
          'English': 'Eng',
          'Physics': 'Phy',
          'Chemistry': 'Chem',
          'Biology': 'Bio',
          'Economics': 'Econ',
          'Geography': 'Geo',
          'Civic Education': 'Civic',
          'Computer Science': 'Comp'
        };
        return abbreviations[subject] || (subject.length > 8 ? subject.substring(0, 7) + '.' : subject);
      };

      // Prepare table headers
      const tableHeaders = [
        { text: 'Pos', style: 'tableHeader', alignment: 'center' },
        { text: 'Student Name', style: 'tableHeader' },
        { text: 'Adm No', style: 'tableHeader', alignment: 'center' },
        ...subjects.value.map(subject => ({ 
          text: shortenSubjectName(subject), 
          style: 'tableHeader', 
          alignment: 'center',
          fontSize: 8
        })),
        { text: 'Total', style: 'tableHeader', alignment: 'center' },
        { text: 'Avg', style: 'tableHeader', alignment: 'center' },
        { text: 'Grd', style: 'tableHeader', alignment: 'center' },
        { text: 'Remark', style: 'tableHeader', alignment: 'center' }
      ];

      // Prepare table body
      const tableBody = [
        tableHeaders,
        ...rankedStudents.value.map((student, index) => [
          { text: getPositionText(index + 1), alignment: 'center', fontSize: 9, bold: index < 3 },
          { text: student.name, fontSize: 9 },
          { text: student.admissionNo, alignment: 'center', fontSize: 8 },
          ...subjects.value.map(subject => ({
            text: student.scores[subject] || '-',
            alignment: 'center',
            fontSize: 8,
            color: getScoreColor(student.scores[subject])
          })),
          { text: student.total, alignment: 'center', fontSize: 9, bold: true },
          { text: student.average.toFixed(2) + '%', alignment: 'center', fontSize: 9 },
          { text: student.grade, alignment: 'center', fontSize: 9, bold: true, color: getGradeColor(student.grade) },
          { text: student.remark, alignment: 'center', fontSize: 8, italics: true }
        ])
      ];

      // Calculate column widths dynamically
      const subjectColumnWidth = Math.max(25, Math.floor(300 / subjects.value.length));
      const columnWidths = [
        30, // Position
        'auto', // Student Name
        50, // Admission No
        ...subjects.value.map(() => subjectColumnWidth),
        40, // Total
        40, // Average
        35, // Grade
        50  // Remark
      ];

      // Document definition
      const docDefinition = {
        pageSize: 'A4',
        pageOrientation: 'landscape',
        pageMargins: [20, 60, 20, 40],
        header: (currentPage, pageCount) => {
          return {
            columns: [
              {
                text: 'BROADSHEET REPORT',
                style: 'documentTitle',
                alignment: 'center',
                margin: [0, 15, 0, 0]
              }
            ]
          };
        },
        footer: (currentPage, pageCount) => {
          return {
            columns: [
              {
                text: `Generated on: ${new Date().toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}`,
                alignment: 'left',
                fontSize: 8,
                margin: [20, 0, 0, 0]
              },
              {
                text: `Page ${currentPage} of ${pageCount}`,
                alignment: 'right',
                fontSize: 8,
                margin: [0, 0, 20, 0]
              }
            ]
          };
        },
        content: [
          // Report Header
          {
            columns: [
              {
                width: '*',
                stack: [
                  { 
                    text: `${filters.value.class}${filters.value.section ? ' - Section ' + filters.value.section : ''}`,
                    style: 'classTitle'
                  },
                  { 
                    text: `${filters.value.session} | ${filters.value.term}`,
                    style: 'sessionInfo'
                  }
                ]
              }
            ],
            margin: [0, 0, 0, 10]
          },
          // Statistics
          {
            columns: [
              {
                width: '*',
                stack: [
                  { text: 'Total Students', style: 'statLabel' },
                  { text: students.value.length.toString(), style: 'statValue' }
                ]
              },
              {
                width: '*',
                stack: [
                  { text: 'Class Average', style: 'statLabel' },
                  { text: classAverage.value.toFixed(2) + '%', style: 'statValue' }
                ]
              },
              {
                width: '*',
                stack: [
                  { text: 'Highest Score', style: 'statLabel' },
                  { text: highestScore.value.toFixed(2) + '%', style: 'statValue' }
                ]
              },
              {
                width: '*',
                stack: [
                  { text: 'Lowest Score', style: 'statLabel' },
                  { text: lowestScore.value.toFixed(2) + '%', style: 'statValue' }
                ]
              }
            ],
            margin: [0, 0, 0, 15]
          },
          // Table
          {
            table: {
              headerRows: 1,
              widths: columnWidths,
              body: tableBody
            },
            layout: {
              fillColor: (rowIndex) => {
                if (rowIndex === 0) return '#1f2937';
                if (rowIndex === 1) return '#fef3c7';
                if (rowIndex <= 3) return '#f3f4f6';
                return null;
              },
              hLineWidth: () => 0.5,
              vLineWidth: () => 0.5,
              hLineColor: () => '#e5e7eb',
              vLineColor: () => '#e5e7eb'
            }
          }
        ],
        styles: {
          documentTitle: {
            fontSize: 18,
            bold: true,
            color: '#1f2937'
          },
          classTitle: {
            fontSize: 16,
            bold: true,
            color: '#111827'
          },
          sessionInfo: {
            fontSize: 12,
            color: '#6b7280',
            margin: [0, 2, 0, 0]
          },
          statLabel: {
            fontSize: 9,
            color: '#6b7280',
            margin: [0, 0, 0, 2]
          },
          statValue: {
            fontSize: 14,
            bold: true,
            color: '#111827'
          },
          tableHeader: {
            fontSize: 9,
            bold: true,
            color: 'white',
            fillColor: '#1f2937',
            alignment: 'center'
          }
        },
        defaultStyle: {
          font: 'Roboto'
        }
      };

      // Generate and download PDF
      const fileName = `Broadsheet_${filters.value.class.replace(/\s+/g, '_')}_${filters.value.term.replace(/\s+/g, '_')}_${filters.value.session.replace(/\//g, '-')}.pdf`;
      pdfMake.createPdf(docDefinition).download(fileName);
    };

    const getScoreColor = (score) => {
      if (!score) return '#6b7280';
      if (score >= 80) return '#059669';
      if (score >= 70) return '#2563eb';
      if (score >= 60) return '#d97706';
      if (score >= 50) return '#dc2626';
      return '#991b1b';
    };

    const getGradeColor = (grade) => {
      const colors = {
        'A': '#065f46',
        'B': '#1e40af',
        'C': '#92400e',
        'D': '#9a3412',
        'E': '#991b1b',
        'F': '#991b1b'
      };
      return colors[grade] || '#111827';
    };

    return {
      filters,
      reportGenerated,
      students,
      subjects,
      rankedStudents,
      classAverage,
      highestScore,
      lowestScore,
      loadBroadsheet,
      getPositionText,
      getPositionClass,
      getRowClass,
      getScoreClass,
      printBroadsheet,
      exportToPDF
    };
  }
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
  min-width: 160px;
}

.filter-group label {
  font-size: 13px;
  font-weight: 500;
  color: #374151;
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
  min-width: 1200px;
  border-collapse: separate;
  border-spacing: 0;
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

.sticky-col {
  position: sticky;
  left: 0;
  z-index: 20;
  background: #1f2937;
  min-width: 80px;
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

.grade-E, .grade-F {
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

/* Print Styles */
@media print {
  .page-header,
  .filters-section {
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
