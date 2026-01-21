module.exports = function studentList(students, classSubjects) {
  // Header row 1
  const headerRow1 = [
    { text: "SN", bold: true, rowSpan: 2, alignment: "center" },
    { text: "Student Name", bold: true, rowSpan: 2, alignment: "center" },
    ...classSubjects.flatMap((cs) => [
      { 
        text: cs.Subject.subject_name.substring(0,4), 
        bold: true, 
        colSpan: 3, 
        alignment: "center" 
      },
      {},
      {},
    ]),
    { text: "Total", bold: true, rowSpan: 2, alignment: "center" },
    { text: "Average", bold: true, rowSpan: 2, alignment: "center" },
    { text: "Position", bold: true, rowSpan: 2, alignment: "center" },
  ];

  // Header row 2
  const headerRow2 = [
    "",
    "",
    ...classSubjects.flatMap(() => ["CA", "Exam", "Total"]),
    "",
    "",
    "",
  ];

  // Data rows
  const dataRows = students.map((student, index) => {
    // For each class subject, find if the student has it
    const subjectScores = classSubjects.flatMap((cs) => {
      // Try to find the subject by ID or by name
      const subject = student.subjects?.find(
        (s) => 
          s.id === cs.Subject.id || 
          s.name === cs.Subject.subject_name
      );

      if (subject) {
        return [
          { text: subject.ca_1_score?.toString() || "-", alignment: "center" },
          { text: subject.exam_score?.toString() || "-", alignment: "center" },
          { text: subject.total?.toString() || "-", alignment: "center" },
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
    const average = performance.average ? performance.average.toFixed(2) : "0.00";
    const position = performance.display_position || "-";

    return [
      { text: (index + 1).toString(), alignment: "center" },
      { text: student.student?.full_name || "-" },
      ...subjectScores,
      { text: totalScore, alignment: "center" },
      { text: average, alignment: "center" },
      { text: position, alignment: "center" },
    ];
  });

  return [headerRow1, headerRow2, ...dataRows];
};

// module.exports = function studentList(students, classSubjects) {
//   const subjectCount = classSubjects.length;
  
//   // Use a more compact format when there are many subjects
//   const useCompactFormat = subjectCount > 10;
  
//   if (useCompactFormat) {
//     // ========== COMPACT FORMAT (For many subjects) ==========
    
//     // Header row 1 - One column per subject showing CA/Exam/Total
//     const headerRow1 = [
//       { text: "SN", bold: true, rowSpan: 2, alignment: "center" },
//       { text: "Student Name", bold: true, rowSpan: 2, alignment: "center" },
//       ...classSubjects.map((cs) => ({
//         text: cs.Subject.subject_name.substring(0,4),
//         bold: true,
//         alignment: "center",
//         fontSize: 7 // Smaller font for subject names
//       })),
//       { text: "Total", bold: true, rowSpan: 2, alignment: "center" },
//       { text: "Avg", bold: true, rowSpan: 2, alignment: "center" }, // Abbreviated
//       { text: "Pos", bold: true, rowSpan: 2, alignment: "center" }, // Abbreviated
//     ];

//     // Header row 2 - Show format indicator for subject columns
//     const headerRow2 = [
//       "",
//       "",
//       ...classSubjects.map(() => ({
//         text: "C/E/T", // CA/Exam/Total indicator
//         fontSize: 6,
//         alignment: "center"
//       })),
//       "",
//       "",
//       ""
//     ];

//     // Data rows
//     const dataRows = students.map((student, index) => {
//       // For each class subject, find if the student has it
//       const subjectScores = classSubjects.map((cs) => {
//         const subject = student.subjects?.find(
//           (s) => s.id === cs.Subject.id || s.name === cs.Subject.subject_name
//         );

//         if (subject) {
//           return {
//             text: `${subject.ca_1_score || "-"}/${subject.exam_score || "-"}/${subject.total || "-"}`,
//             alignment: "center",
//             fontSize: 7 // Smaller font for scores
//           };
//         } else {
//           return {
//             text: "-/-/-",
//             alignment: "center",
//             fontSize: 7
//           };
//         }
//       });

//       // Get performance data
//       const performance = student.performance || {};
//       const totalScore = performance.mark_obtained?.toString() || "0";
//       const average = performance.average ? performance.average.toFixed(1) : "0.0"; // 1 decimal for compact
//       const position = performance.display_position || "-";

//       return [
//         { text: (index + 1).toString(), alignment: "center", fontSize: 7 },
//         { text: student.student?.full_name || "-", fontSize: 7 }, // Smaller font for names
//         ...subjectScores,
//         { text: totalScore, alignment: "center", fontSize: 7 },
//         { text: average, alignment: "center", fontSize: 7 },
//         { text: position, alignment: "center", fontSize: 7 },
//       ];
//     });

//     return [headerRow1, headerRow2, ...dataRows];
    
//   } else {
//     // ========== ORIGINAL FORMAT (For few subjects) ==========
    
//     // Header row 1
//     const headerRow1 = [
//       { text: "SN", bold: true, rowSpan: 2, alignment: "center" },
//       { text: "Student Name", bold: true, rowSpan: 2, alignment: "center" },
//       ...classSubjects.flatMap((cs) => [
//         { 
//           text: cs.Subject.subject_name, 
//           bold: true, 
//           colSpan: 3, 
//           alignment: "center",
//           fontSize: subjectCount > 8 ? 7 : 8
//         },
//         {},
//         {},
//       ]),
//       { text: "Total", bold: true, rowSpan: 2, alignment: "center" },
//       { text: "Average", bold: true, rowSpan: 2, alignment: "center" },
//       { text: "Position", bold: true, rowSpan: 2, alignment: "center" },
//     ];

//     // Header row 2
//     const headerRow2 = [
//       "",
//       "",
//       ...classSubjects.flatMap(() => [
//         { text: "CA", fontSize: subjectCount > 8 ? 7 : 8 },
//         { text: "Exam", fontSize: subjectCount > 8 ? 7 : 8 },
//         { text: "Total", fontSize: subjectCount > 8 ? 7 : 8 }
//       ]),
//       "",
//       "",
//       "",
//     ];

//     // Data rows
//     const dataRows = students.map((student, index) => {
//       // For each class subject, find if the student has it
//       const subjectScores = classSubjects.flatMap((cs) => {
//         const subject = student.subjects?.find(
//           (s) => s.id === cs.Subject.id || s.name === cs.Subject.subject_name
//         );

//         if (subject) {
//           return [
//             { 
//               text: subject.ca_1_score?.toString() || "-", 
//               alignment: "center",
//               fontSize: subjectCount > 8 ? 7 : 8 
//             },
//             { 
//               text: subject.exam_score?.toString() || "-", 
//               alignment: "center",
//               fontSize: subjectCount > 8 ? 7 : 8 
//             },
//             { 
//               text: subject.total?.toString() || "-", 
//               alignment: "center",
//               fontSize: subjectCount > 8 ? 7 : 8 
//             },
//           ];
//         } else {
//           return [
//             { text: "-", alignment: "center", fontSize: subjectCount > 8 ? 7 : 8 },
//             { text: "-", alignment: "center", fontSize: subjectCount > 8 ? 7 : 8 },
//             { text: "-", alignment: "center", fontSize: subjectCount > 8 ? 7 : 8 },
//           ];
//         }
//       });

//       // Get performance data
//       const performance = student.performance || {};
//       const totalScore = performance.mark_obtained?.toString() || "0";
//       const average = performance.average ? performance.average.toFixed(2) : "0.00";
//       const position = performance.display_position || "-";

//       return [
//         { 
//           text: (index + 1).toString(), 
//           alignment: "center",
//           fontSize: subjectCount > 8 ? 7 : 8 
//         },
//         { 
//           text: student.student?.full_name || "-",
//           fontSize: subjectCount > 8 ? 7 : 8 
//         },
//         ...subjectScores,
//         { 
//           text: totalScore, 
//           alignment: "center",
//           fontSize: subjectCount > 8 ? 7 : 8 
//         },
//         { 
//           text: average, 
//           alignment: "center",
//           fontSize: subjectCount > 8 ? 7 : 8 
//         },
//         { 
//           text: position, 
//           alignment: "center",
//           fontSize: subjectCount > 8 ? 7 : 8 
//         },
//       ];
//     });

//     return [headerRow1, headerRow2, ...dataRows];
//   }
// };