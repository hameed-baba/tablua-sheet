module.exports = function studentStubject(students, classSubjects) {
  // Header row 1 - Subject names with colSpan
  const headerRow1 = [
    { text: "SN", bold: true, rowSpan: 2, alignment: "center" },
    { text: "Student Name", bold: true, rowSpan: 2, alignment: "center" },
    ...classSubjects.flatMap((cs) => [
      {
        text: cs.Subject.subject_name.substring(0, 3).toUpperCase(),
        bold: true,
        alignment: "center",
        colSpan: 3,
      },
      {},
      {},
    ]),
    { text: "Total", bold: true, rowSpan: 2, alignment: "center" },
    { text: "Average", bold: true, rowSpan: 2, alignment: "center" },
    { text: "Position", bold: true, rowSpan: 2, alignment: "center" },
  ];

  // Header row 2 - CA, Exam, Total for each subject
  const headerRow2 = [
    {},
    {},
    ...classSubjects.flatMap(() => [
      { text: "CA", bold: true, alignment: "center" },
      { text: "EX", bold: true, alignment: "center" },
      { text: "TT", bold: true, alignment: "center" },
    ]),
    {},
    {},
    {},
  ];

  // Data rows
  const dataRows = students.map((student, index) => {
    // For each class subject, get CA, Exam, and Total
    const subjectScores = classSubjects.flatMap((cs) => {
      // Try to find the subject by ID or by name
      const subject = student.subjects?.find(
        (s) => s.id === cs.Subject.id || s.name === cs.Subject.subject_name,
      );

      if (subject) {
        return [
          {
            text: subject.ca_1_score?.toString() || "-",
            alignment: "center",
            
          },
          {
            text: subject.exam_score?.toString() || "-",
            alignment: "center",
            
          },
          {
            text: subject.total?.toString() || "-",
            alignment: "center",
            
            bold: true,
          },
        ];
      } else {
        return [
          { text: "-", alignment: "center" },
          { text: "-", alignment: "center" },
          { text: "-", alignment: "center" },
        ];
      }
    });

    // Get performance data
    const performance = student.performance || {};
    const totalScore = performance.mark_obtained?.toString() || "0";
    const average = performance.average
      ? performance.average.toFixed(2)
      : "0.00";
    const position = performance.display_position || "-";

    return [
      { text: (index + 1).toString(), alignment: "center" },
      { text: student.student?.full_name || "-" },
      ...subjectScores,
      { text: totalScore, alignment: "center", bold: true },
      { text: average, alignment: "center", bold: true },
      { text: position, alignment: "center", bold: true },
    ];
  });

  return [headerRow1, headerRow2, ...dataRows];
};

// module.exports = function studentStubject2(students, classSubjects) {
//   // Header row - only one row needed now
//   const headerRow = [
//     { text: "SN", bold: true, rowSpan: 1, alignment: "center" },
//     {
//       text: "STUDENTS NAME",
//       bold: true,
//       rowSpan: 1,
//       alignment: "center",
//       margin: [0, 50, 0, 0],
//     },
//     ...classSubjects.map((cs) =>
//       rotateTextSVG(cs.Subject.subject_name, {
//         
//         width: 8,
//         height: 80,
//       }),
//     ),
//     {
//       text: "TOTAL",
//       bold: true,
//       rowSpan: 1,
//       alignment: "center",
//       margin: [0, 50, 0, 0],
//     },
//     {
//       text: "AVERAGE",
//       bold: true,
//       rowSpan: 1,
//       alignment: "center",
//       margin: [0, 50, 0, 0],
//     },
//     {
//       text: "POSITION",
//       bold: true,
//       rowSpan: 1,
//       alignment: "center",
//       margin: [0, 50, 0, 0],
//     },
//   ];

//   // Data rows
//   const dataRows = students.map((student, index) => {
//     // For each class subject, find if the student has it and get the total
//     const subjectScores = classSubjects.map((cs) => {
//       // Try to find the subject by ID or by name
//       const subject = student.subjects?.find(
//         (s) => s.id === cs.Subject.id || s.name === cs.Subject.subject_name,
//       );

//       if (subject) {
//         return {
//           text: subject.total?.toString() || "-",
//           alignment: "center",
//         };
//       } else {
//         return {
//           text: "-",
//           alignment: "center",
//         };
//       }
//     });

//     // Get performance data
//     const performance = student.performance || {};
//     const totalScore = performance.mark_obtained?.toString() || "0";
//     const average = performance.average
//       ? performance.average.toFixed(2)
//       : "0.00";
//     const position = performance.display_position || "-";

//     return [
//       { text: (index + 1).toString(), alignment: "center" },
//       { text: student.student?.full_name || "-" },
//       ...subjectScores,
//       { text: totalScore, alignment: "center", bold: true },
//       { text: average, alignment: "center", bold: true },
//       { text: position, alignment: "center", bold: true },
//     ];
//   });

//   return [headerRow, ...dataRows];
// };

function rotateTextSVG(text, options = {}) {
  const {
    fontSize = 8,
    fontWeight = "bold",
    rotate = -90,
    width = 40,
    height = 80,
  } = options;

  return {
    svg: `
      <svg width="${width}" height="${height}">
        <g transform="translate(${width / 2}, ${height / 2})">
          <text
            text-anchor="middle"
            transform="rotate(${rotate})"
            font-weight="${fontWeight}"
            font-size="${fontSize}"
            y="0"
            dy="0.35em"
          >
            ${text}
          </text>
        </g>
      </svg>
    `,
    alignment: "center",
    // margin: [0, 5, 0, 5],
  };
}

const straightTextSVG = (text, options = {}) => {
  const {
    fontSize = 8,
    fontWeight = "bold",
    width = 50,
    height = 20,
    x = 5,
    y = 15,
  } = options;

  return {
    svg: `
      <svg width="${width}" height="${height}">
        <text
          x="${x}"
          y="${y}"
          font-weight="${fontWeight}"
          style="font-size:${fontSize}px;"
          text-anchor="start"
        >
          ${text}
        </text>
      </svg>
    `,
    width,
    height,
  };
};
