module.exports = termPerformance = (student) => {
  return {
    margin: [0, 11, 0, 0],
    table: {
      widths: ["auto", "*", "auto", "*", "auto", "*"],
      body: [
        [
          {
            text: "TERM PERFORMANCE",
            colSpan: 6,
            alignment: "center",
            bold: true,
          },
          {},
          {},
          {},
          {},
          {},
        ],
        [
          {
            text: "First Term",
            colSpan: 2,
            alignment: "center",
            bold: true,
          },
          {},
          {
            text: "Second Term",
            colSpan: 2,
            alignment: "center",
            bold: true,
          },
          {},
          {
            text: "Third Term",
            colSpan: 2,
            alignment: "center",
            bold: true,
          },
          {},
        ],
        [
          { text: "Marks Obtained" },

          {
            text: student.term_performance_summary["First Term"].mark_obtained,
            bold: true,
            alignment: "center",
          },
          { text: "Marks Obtained" },
          {
            text: student.term_performance_summary["Second Term"].mark_obtained,
            bold: true,
            alignment: "center",
          },
          { text: "Marks Obtained" },
          {
            text: student.term_performance_summary["Third Term"].mark_obtained,
            bold: true,
            alignment: "center",
          },
        ],
        [
          { text: "Total Subjects" },
          {
            text: student.term_performance_summary["First Term"].total_subjects,
            bold: true,
            alignment: "center",
          },
          { text: "Total Subjects" },
          {
            text: student.term_performance_summary["Second Term"]
              .total_subjects,
            bold: true,
            alignment: "center",
          },
          { text: "Total Subjects" },
          {
            text: student.term_performance_summary["Third Term"].total_subjects,
            bold: true,
            alignment: "center",
          },
        ],
      ],
    },
    fontSize: 7,
    layout: {
      hLineWidth: () => 0.8,
      vLineWidth: () => 0.8,
      hLineColor: () => "#cfd8e3",
      vLineColor: () => "#cfd8e3",
    },
    // layout:"lightHorizontalLines"
  };
};
