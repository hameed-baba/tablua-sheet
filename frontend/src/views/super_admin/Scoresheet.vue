<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1>Scoresheet</h1>
        <p>Detailed student scores for all subjects</p>
      </div>
      <div class="header-actions">
        <button class="add-btn" @click="exportToPDF" :disabled="!reportGenerated">
          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Export PDF
        </button>
        <button class="add-btn secondary" @click="printScoresheet" :disabled="!reportGenerated">
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
        <label>Class</label>
        <select v-model="filters.class" class="form-select">
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
        <select v-model="filters.section" class="form-select">
          <option value="">All Sections</option>
          <option value="A">A</option>
          <option value="B">B</option>
          <option value="C">C</option>
        </select>
      </div>

      <button class="search-btn" @click="loadScoresheet">
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
    </div>

    <!-- Scoresheet Table -->
    <div v-if="reportGenerated" class="table-container scoresheet-table">
      <table>
        <thead>
          <tr>
            <th rowspan="2" class="sticky-col">SN</th>
            <th rowspan="2" class="sticky-col-2">Student Name</th>
            <th rowspan="2">Admission No</th>
            <th :colspan="subjects.length * 4" class="subjects-header">Subjects (CA1 | CA2 | CA3 | Exam | Total | Grade)</th>
          </tr>
          <tr>
            <template v-for="subject in subjects" :key="subject">
              <th class="subject-name" :colspan="6">{{ subject }}</th>
            </template>
          </tr>
          <tr>
            <th class="sticky-col"></th>
            <th class="sticky-col-2"></th>
            <th></th>
            <template v-for="subject in subjects" :key="subject + '-headers'">
              <th class="score-header">CA1</th>
              <th class="score-header">CA2</th>
              <th class="score-header">CA3</th>
              <th class="score-header">Exam</th>
              <th class="score-header">Total</th>
              <th class="score-header">Grade</th>
            </template>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(student, index) in students" :key="student.id">
            <td class="sticky-col">{{ index + 1 }}</td>
            <td class="sticky-col-2 student-name">{{ student.name }}</td>
            <td>{{ student.admissionNo }}</td>
            <template v-for="subject in subjects" :key="subject + '-' + student.id">
              <td class="score-cell">{{ student.scores[subject].ca1 }}</td>
              <td class="score-cell">{{ student.scores[subject].ca2 }}</td>
              <td class="score-cell">{{ student.scores[subject].ca3 }}</td>
              <td class="score-cell exam-score">{{ student.scores[subject].exam }}</td>
              <td class="total-cell">{{ student.scores[subject].total }}</td>
              <td class="grade-cell">
                <span class="grade-badge" :class="'grade-' + student.scores[subject].grade">
                  {{ student.scores[subject].grade }}
                </span>
              </td>
            </template>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Empty State -->
    <div v-if="!reportGenerated" class="empty-state">
      <svg width="64" height="64" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <h3>No Report Generated</h3>
      <p>Select session, term, and class to generate scoresheet</p>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

// Set up fonts for pdfmake
if (pdfFonts && pdfFonts.pdfMake && pdfFonts.pdfMake.vfs) {
  pdfMake.vfs = pdfFonts.pdfMake.vfs;
} else if (pdfFonts.default && pdfFonts.default.pdfMake && pdfFonts.default.pdfMake.vfs) {
  pdfMake.vfs = pdfFonts.default.pdfMake.vfs;
}

export default {
  name: 'Scoresheet',
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

    const getGrade = (total) => {
      if (total >= 80) return 'A';
      if (total >= 70) return 'B';
      if (total >= 60) return 'C';
      if (total >= 50) return 'D';
      if (total >= 40) return 'E';
      return 'F';
    };

    // Mock data generator
    const loadScoresheet = () => {
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
        'Economics'
      ];

      // Generate mock student data
      const mockStudents = [];
      const studentCount = 35;

      for (let i = 1; i <= studentCount; i++) {
        const studentScores = {};

        subjects.value.forEach(subject => {
          const ca1 = Math.floor(Math.random() * 10) + 5; // 5-15
          const ca2 = Math.floor(Math.random() * 10) + 5; // 5-15
          const ca3 = Math.floor(Math.random() * 10) + 5; // 5-15
          const exam = Math.floor(Math.random() * 30) + 40; // 40-70
          const total = ca1 + ca2 + ca3 + exam;

          studentScores[subject] = {
            ca1,
            ca2,
            ca3,
            exam,
            total,
            grade: getGrade(total)
          };
        });

        mockStudents.push({
          id: i,
          name: `Student ${i.toString().padStart(2, '0')}`,
          admissionNo: `ADM${(2024000 + i).toString()}`,
          scores: studentScores
        });
      }

      students.value = mockStudents;
      reportGenerated.value = true;
    };

    const printScoresheet = () => {
      window.print();
    };

    const exportToPDF = () => {
      if (!reportGenerated.value) return;

      // Helper function to shorten subject names
      const shortenSubjectName = (subject) => {
        const abbreviations = {
          'Mathematics': 'Math',
          'English': 'Eng',
          'Physics': 'Phy',
          'Chemistry': 'Chem',
          'Biology': 'Bio',
          'Economics': 'Econ'
        };
        return abbreviations[subject] || subject;
      };

      // Build table headers
      const subjectHeaders = [];
      const scoreHeaders = [
        { text: 'SN', style: 'tableHeader', rowSpan: 2, alignment: 'center' },
        { text: 'Student Name', style: 'tableHeader', rowSpan: 2 },
        { text: 'Adm No', style: 'tableHeader', rowSpan: 2, alignment: 'center' }
      ];

      subjects.value.forEach(subject => {
        scoreHeaders.push({
          text: shortenSubjectName(subject),
          style: 'subjectHeader',
          colSpan: 6,
          alignment: 'center'
        });
        // Add empty cells for colspan
        for (let i = 0; i < 5; i++) {
          scoreHeaders.push({});
        }
      });

      // Second header row with CA1, CA2, etc.
      const detailHeaders = [{}, {}, {}]; // Empty for SN, Name, Adm No
      subjects.value.forEach(() => {
        detailHeaders.push(
          { text: 'CA1', style: 'scoreHeader', alignment: 'center' },
          { text: 'CA2', style: 'scoreHeader', alignment: 'center' },
          { text: 'CA3', style: 'scoreHeader', alignment: 'center' },
          { text: 'Exam', style: 'scoreHeader', alignment: 'center' },
          { text: 'Tot', style: 'scoreHeader', alignment: 'center' },
          { text: 'Grd', style: 'scoreHeader', alignment: 'center' }
        );
      });

      // Build table body
      const tableBody = [
        scoreHeaders,
        detailHeaders,
        ...students.value.map((student, index) => {
          const row = [
            { text: (index + 1).toString(), alignment: 'center', fontSize: 7 },
            { text: student.name, fontSize: 7 },
            { text: student.admissionNo, alignment: 'center', fontSize: 7 }
          ];

          subjects.value.forEach(subject => {
            const scores = student.scores[subject];
            row.push(
              { text: scores.ca1.toString(), alignment: 'center', fontSize: 7 },
              { text: scores.ca2.toString(), alignment: 'center', fontSize: 7 },
              { text: scores.ca3.toString(), alignment: 'center', fontSize: 7 },
              { text: scores.exam.toString(), alignment: 'center', fontSize: 7, bold: true },
              { text: scores.total.toString(), alignment: 'center', fontSize: 7, bold: true },
              { text: scores.grade, alignment: 'center', fontSize: 7, bold: true }
            );
          });

          return row;
        })
      ];

      // Calculate column widths
      const baseColumns = [20, 80, 40]; // SN, Name, Adm No
      const scoreColumnWidth = 18;
      const columnWidths = [
        ...baseColumns,
        ...subjects.value.flatMap(() => [
          scoreColumnWidth, scoreColumnWidth, scoreColumnWidth,
          scoreColumnWidth, scoreColumnWidth, scoreColumnWidth
        ])
      ];

      // Document definition
      const docDefinition = {
        pageSize: 'A4',
        pageOrientation: 'landscape',
        pageMargins: [15, 60, 15, 40],
        header: (currentPage, pageCount) => {
          return {
            text: 'SCORESHEET',
            style: 'documentTitle',
            alignment: 'center',
            margin: [0, 15, 0, 0]
          };
        },
        footer: (currentPage, pageCount) => {
          return {
            columns: [
              {
                text: `Generated: ${new Date().toLocaleDateString()}`,
                alignment: 'left',
                fontSize: 7,
                margin: [15, 0, 0, 0]
              },
              {
                text: `Page ${currentPage} of ${pageCount}`,
                alignment: 'right',
                fontSize: 7,
                margin: [0, 0, 15, 0]
              }
            ]
          };
        },
        content: [
          {
            text: `${filters.value.class}${filters.value.section ? ' - Section ' + filters.value.section : ''}`,
            style: 'classTitle',
            margin: [0, 0, 0, 2]
          },
          {
            text: `${filters.value.session} | ${filters.value.term}`,
            style: 'sessionInfo',
            margin: [0, 0, 0, 10]
          },
          {
            table: {
              headerRows: 2,
              widths: columnWidths,
              body: tableBody
            },
            layout: {
              fillColor: (rowIndex) => {
                if (rowIndex === 0 || rowIndex === 1) return '#1f2937';
                return rowIndex % 2 === 0 ? '#f9fafb' : null;
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
            fontSize: 16,
            bold: true,
            color: '#1f2937'
          },
          classTitle: {
            fontSize: 12,
            bold: true,
            color: '#111827'
          },
          sessionInfo: {
            fontSize: 10,
            color: '#6b7280'
          },
          tableHeader: {
            fontSize: 8,
            bold: true,
            color: 'white',
            fillColor: '#1f2937'
          },
          subjectHeader: {
            fontSize: 8,
            bold: true,
            color: 'white',
            fillColor: '#374151'
          },
          scoreHeader: {
            fontSize: 7,
            bold: true,
            color: 'white',
            fillColor: '#1f2937'
          }
        }
      };

      const fileName = `Scoresheet_${filters.value.class.replace(/\s+/g, '_')}_${filters.value.term.replace(/\s+/g, '_')}_${filters.value.session.replace(/\//g, '-')}.pdf`;
      pdfMake.createPdf(docDefinition).download(fileName);
    };

    return {
      filters,
      reportGenerated,
      students,
      subjects,
      loadScoresheet,
      printScoresheet,
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
  margin: 0;
  color: #6b7280;
  font-size: 14px;
}

.scoresheet-table {
  overflow-x: auto;
  position: relative;
}

.scoresheet-table table {
  min-width: 1400px;
  border-collapse: separate;
  border-spacing: 0;
}

.scoresheet-table thead th {
  background: #1f2937;
  color: white;
  font-weight: 600;
  font-size: 11px;
  padding: 8px 6px;
  text-align: center;
  border: 1px solid #374151;
  position: sticky;
  top: 0;
  z-index: 10;
}

.subjects-header {
  background: #374151 !important;
  font-size: 12px;
}

.subject-name {
  background: #374151 !important;
  font-size: 11px;
  font-weight: 700;
}

.score-header {
  font-size: 10px;
  min-width: 45px;
}

.sticky-col {
  position: sticky;
  left: 0;
  z-index: 20;
  background: #1f2937;
  min-width: 50px;
}

.sticky-col-2 {
  position: sticky;
  left: 50px;
  z-index: 20;
  background: #1f2937;
  min-width: 150px;
}

.scoresheet-table tbody td {
  padding: 8px 6px;
  font-size: 12px;
  border: 1px solid #e5e7eb;
  text-align: center;
}

.scoresheet-table tbody .sticky-col {
  background: white;
  font-weight: 600;
}

.scoresheet-table tbody .sticky-col-2 {
  background: white;
  text-align: left;
}

.student-name {
  font-weight: 500;
  color: #111827;
}

.score-cell {
  font-weight: 500;
  color: #374151;
}

.exam-score {
  background: #fef3c7;
  font-weight: 600;
  color: #92400e;
}

.total-cell {
  font-weight: 700;
  color: #111827;
  background: #dbeafe;
}

.grade-cell {
  background: #f3f4f6;
}

.grade-badge {
  display: inline-block;
  padding: 3px 8px;
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

.grade-E, .grade-F {
  background: #fee2e2;
  color: #991b1b;
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

  .scoresheet-table {
    box-shadow: none;
  }
}
</style>
