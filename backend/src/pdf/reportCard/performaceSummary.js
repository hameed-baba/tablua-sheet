module.exports = performanceSummary = (student) => {
  return {
    table: {
      widths: ["auto", "*", "auto", "*"],
      body: [
        [
          {
            text: "PERFORMANCE SUMMARY",
            colSpan: 4,
            alignment: "center",
            bold: true,
          },
          {},
          {},
          {},
        ],
        [
          {
            text: "Marks Obtainable",
          },
          {
            text: student.performance.mark_obtainable,
            bold: true,
            alignment: "center",
          },
          {
            text: "Marks Obtained",
          },
          {
            text: student.performance.mark_obtained,
            bold: true,
            alignment: "center",
          },
        ],
        [
          {
            text: "Total Subjects",
          },
          {
            text: student.performance.total_subjects,
            alignment: "center",
            bold: true,
          },
          {
            text: "Average Marks",
          },
          {
            text: student.performance.average,
            bold: true,
            alignment: "center",
          },
        ],
      ],
    },
    fontSize: 8,
    layout: {
      hLineWidth: () => 0.8,
      vLineWidth: () => 0.8,
      hLineColor: () => "#cfd8e3",
      vLineColor: () => "#cfd8e3",
    },
  };
  // layout:"lightHorizontalLines"
};
