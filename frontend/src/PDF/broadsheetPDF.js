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

/**
 * Generate and download broadsheet PDF
 * @param {Object} data - Broadsheet data
 * @param {Array} data.students - Array of student data
 * @param {Array} data.subjects - Array of subject names
 * @param {Object} data.classInfo - Class information
 * @param {Object} data.sessionInfo - Session information
 * @param {Object} data.termInfo - Term information
 * @param {Object} data.stats - Statistics (classAverage, highestScore, lowestScore)
 * @param {boolean} data.showGradeColumn - Whether to show grade column
 */
export const generateBroadsheetPDF = (data) => {
  const {
    students,
    subjects,
    classInfo,
    sessionInfo,
    termInfo,
    stats,
    showGradeColumn = true,
  } = data;

  // Helper function to shorten subject names for PDF (3 letters max)
  const shortenSubjectName = (subject) => {
    const abbreviations = {
      Mathematics: "Mat",
      English: "Eng",
      Physics: "Phy",
      Chemistry: "Che",
      Biology: "Bio",
      Economics: "Eco",
      Geography: "Geo",
      "Civic Education": "Civ",
      "Computer Science": "Com",
      "Social Study": "Soc",
      "MMG Science": "MMG",
      Reading: "Rea",
      "Reading 002": "Re2",
      "S. BEE": "BEE",
      Islamic: "Isl",
      Hausa: "Hau",
      "Agric S": "Agr",
      "Basic S": "Bas",
      "Comp s": "Cmp",
      "Computer": "Cpt",
      "Enginee": "Eng",
      "English": "Enl",
      "Langua g": "Lng",
      "Math": "Mat",
      "MM Scie": "MMS",
    };
    
    // If we have a specific abbreviation, use it
    if (abbreviations[subject]) {
      return abbreviations[subject];
    }
    
    // Otherwise, take first 3 letters and capitalize
    return subject.substring(0, 3).toUpperCase();
  };

  // Helper function to get position text
  const getPositionText = (position) => {
    if (position === 1) return "1st";
    if (position === 2) return "2nd";
    if (position === 3) return "3rd";
    return `${position}th`;
  };

  // Helper function to get grade color
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

  // Prepare table headers
  const tableHeaders = [
    { text: "Pos", style: "tableHeader", alignment: "center", fontSize: 7 },
    { text: "Student Name", style: "tableHeader", fontSize: 7 },
    { text: "Adm No", style: "tableHeader", alignment: "center", fontSize: 7 },
    ...subjects.map((subject) => ({
      text: shortenSubjectName(subject),
      style: "tableHeader",
      alignment: "center",
      fontSize: 6,
    })),
    { text: "Total", style: "tableHeader", alignment: "center", fontSize: 7 },
    { text: "Avg", style: "tableHeader", alignment: "center", fontSize: 7 },
  ];

  // Add Grade column if needed
  if (showGradeColumn) {
    tableHeaders.push({
      text: "Grd",
      style: "tableHeader",
      alignment: "center",
      fontSize: 7,
    });
  }

  // Add Remark column
  tableHeaders.push({
    text: "Rmk",
    style: "tableHeader",
    alignment: "center",
    fontSize: 7,
  });

  // Split students into pages of 15 students each
  const studentsPerPage = 15;
  const studentPages = [];
  
  for (let i = 0; i < students.length; i += studentsPerPage) {
    const pageStudents = students.slice(i, i + studentsPerPage);
    studentPages.push(pageStudents);
  }

  // Function to create table body for a page of students
  const createTableBodyForPage = (pageStudents, startIndex = 0) => {
    return [
      tableHeaders,
      ...pageStudents.map((student, index) => {
        const globalIndex = startIndex + index; // Global position across all pages
        const row = [
          {
            text: getPositionText(globalIndex + 1),
            alignment: "center",
            fontSize: 7,
            bold: globalIndex < 3,
          },
          { text: student.name, fontSize: 7 },
          { text: student.admissionNo, alignment: "center", fontSize: 6 },
          ...subjects.map((subject) => ({
            text: student.subjectDetails[subject]?.total || "---",
            alignment: "center",
            fontSize: 6,
            bold: true,
            color: student.subjectDetails[subject]?.total ? "#111827" : "#6b7280",
          })),
          {
            text: student.total > 0 ? student.total : "---",
            alignment: "center",
            fontSize: 7,
            bold: true,
          },
          {
            text: student.average > 0 ? student.average.toFixed(1) + "%" : "---",
            alignment: "center",
            fontSize: 7,
          },
        ];

        // Add Grade column if needed
        if (showGradeColumn) {
          row.push({
            text: student.grade || "---",
            alignment: "center",
            fontSize: 7,
            bold: true,
            color: student.grade ? getGradeColor(student.grade) : "#6b7280",
          });
        }

        // Add Remark column
        row.push({
          text: student.remark || "---",
          alignment: "center",
          fontSize: 6,
          italics: true,
        });

        return row;
      }),
    ];
  };

  // Calculate column widths dynamically based on number of subjects
  const baseColumns = 3; // Position, Student Name, Admission No
  const endColumns = showGradeColumn ? 4 : 3; // Grand Total, Average, Grade (optional), Remark
  const subjectColumns = subjects.length;

  // Determine page size and orientation based on number of subjects
  let pageSize = "A4";
  let pageOrientation = "landscape";
  let availableWidth = 750; // A4 landscape available width
  
  if (subjectColumns > 15) {
    pageSize = "A3";
    pageOrientation = "landscape";
    availableWidth = 1100; // A3 landscape available width
  }

  // Calculate subject column width (minimum 20, maximum 35)
  const fixedColumnsWidth = 30 + 120 + 40 + 40 + 35 + (showGradeColumn ? 25 : 0) + 50; // Fixed columns total
  const availableForSubjects = availableWidth - fixedColumnsWidth;
  const subjectColumnWidth = Math.max(20, Math.min(35, Math.floor(availableForSubjects / subjectColumns)));

  const columnWidths = [
    25, // Position (smaller)
    120, // Student Name (fixed width)
    40, // Admission No (smaller)
    ...subjects.map(() => subjectColumnWidth), // Subject columns
    40, // Grand Total (smaller)
    35, // Average (smaller)
  ];

  // Add Grade column width if needed
  if (showGradeColumn) {
    columnWidths.push(25); // Grade (smaller)
  }

  // Add Remark column width
  columnWidths.push(50); // Remark (smaller)

  // Document definition
  const docDefinition = {
    pageSize: pageSize,
    pageOrientation: pageOrientation,
    pageMargins: [15, 50, 15, 30], // Smaller margins for more space
    header: () => {
      return {
        columns: [
          {
            text: "BROADSHEET REPORT",
            style: "documentTitle",
            alignment: "center",
            margin: [0, 15, 0, 0],
          },
        ],
      };
    },
    footer: (currentPage, pageCount) => {
      return {
        columns: [
          {
            text: `Generated on: ${new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}`,
            alignment: "left",
            fontSize: 8,
            margin: [20, 0, 0, 0],
          },
          {
            text: `Page ${currentPage} of ${pageCount}`,
            alignment: "right",
            fontSize: 8,
            margin: [0, 0, 20, 0],
          },
        ],
      };
    },
    content: [
      // Create content for each page
      ...studentPages.flatMap((pageStudents, pageIndex) => {
        const startIndex = pageIndex * studentsPerPage;
        const isFirstPage = pageIndex === 0;
        const pageContent = [];

        // Add header and statistics only on first page
        if (isFirstPage) {
          pageContent.push(
            // Report Header
            {
              columns: [
                {
                  width: "*",
                  stack: [
                    {
                      text: classInfo.name || "Class Name",
                      style: "classTitle",
                    },
                    {
                      text: `${sessionInfo.name || "Session"} | ${
                        termInfo.name || "Term"
                      }`,
                      style: "sessionInfo",
                    },
                  ],
                },
              ],
              margin: [0, 0, 0, 10],
            },
            // Statistics
            {
              columns: [
                {
                  width: "*",
                  stack: [
                    { text: "Total Students", style: "statLabel" },
                    {
                      text: students.length.toString(),
                      style: "statValue",
                    },
                  ],
                },
                {
                  width: "*",
                  stack: [
                    { text: "Class Average", style: "statLabel" },
                    {
                      text: (stats.classAverage || 0).toFixed(2) + "%",
                      style: "statValue",
                    },
                  ],
                },
                {
                  width: "*",
                  stack: [
                    { text: "Highest Score", style: "statLabel" },
                    {
                      text: (stats.highestScore || 0).toFixed(2) + "%",
                      style: "statValue",
                    },
                  ],
                },
                {
                  width: "*",
                  stack: [
                    { text: "Lowest Score", style: "statLabel" },
                    {
                      text: (stats.lowestScore || 0).toFixed(2) + "%",
                      style: "statValue",
                    },
                  ],
                },
              ],
              margin: [0, 0, 0, 15],
            }
          );
        } else {
          // Add page title for subsequent pages
          pageContent.push({
            text: `${classInfo.name || "Class Name"} - ${sessionInfo.name || "Session"} | ${termInfo.name || "Term"} (Page ${pageIndex + 1})`,
            style: "pageTitle",
            margin: [0, 0, 0, 15],
          });
        }

        // Add table for this page
        pageContent.push({
          table: {
            headerRows: 1,
            widths: columnWidths,
            body: createTableBodyForPage(pageStudents, startIndex),
          },
          layout: {
            fillColor: (rowIndex) => {
              if (rowIndex === 0) return "#1f2937";
              if (rowIndex === 1) return "#fef3c7";
              if (rowIndex <= 3) return "#f3f4f6";
              return null;
            },
            hLineWidth: () => 0.5,
            vLineWidth: () => 0.5,
            hLineColor: () => "#e5e7eb",
            vLineColor: () => "#e5e7eb",
          },
        });

        // Add page break after each page except the last one
        if (pageIndex < studentPages.length - 1) {
          pageContent.push({ text: "", pageBreak: "after" });
        }

        return pageContent;
      }),
    ],
    styles: {
      documentTitle: {
        fontSize: 18,
        bold: true,
        color: "#1f2937",
      },
      classTitle: {
        fontSize: 16,
        bold: true,
        color: "#111827",
      },
      pageTitle: {
        fontSize: 14,
        bold: true,
        color: "#111827",
        alignment: "center",
      },
      sessionInfo: {
        fontSize: 12,
        color: "#6b7280",
        margin: [0, 2, 0, 0],
      },
      statLabel: {
        fontSize: 9,
        color: "#6b7280",
        margin: [0, 0, 0, 2],
      },
      statValue: {
        fontSize: 14,
        bold: true,
        color: "#111827",
      },
      tableHeader: {
        fontSize: 9,
        bold: true,
        color: "white",
        fillColor: "#1f2937",
        alignment: "center",
      },
    },
    defaultStyle: {
      font: "Roboto",
    },
  };

  // Generate filename
  const fileName = `Broadsheet_${(classInfo.name || "Class").replace(
    /\s+/g,
    "_"
  )}_${(termInfo.name || "Term").replace(/\s+/g, "_")}_${(
    sessionInfo.name || "Session"
  ).replace(/\//g, "-")}.pdf`;

  // Generate and download PDF
  pdfMake.createPdf(docDefinition).download(fileName);
};

export default generateBroadsheetPDF;