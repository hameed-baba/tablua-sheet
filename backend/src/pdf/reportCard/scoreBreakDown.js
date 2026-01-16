module.exports = scoreBreakDown = (student) => {
  return {
    fontSize: 8,
    margin: [0, 10, 0, 0],
    table: {
      widths: ["auto", "*", "*", "auto", "*"],
      body: [
        [
          {
            text: "SCORES BREAK DOWN",
            colSpan: 5,
            alignment: "center",
            bold: true,
          },
          {},
          {},
          {},
          {}
        ],
        [
          {
            text: "SN",
            bold: true,
            alignment: "center",
          },
          {
            text: "Marks From",
            bold: true,
            alignment: "center",
          },
          {
            text: "Marks To",
            bold: true,
            alignment: "center",
          },
          {
            text: "Grade",
            bold: true,
            fillColor: "#e9f2fb",
          },
          {
            text: "Remark",
            bold: true,
            alignment: "center",
            fillColor: "#e9f2fb",
          },
        ],

        ...student.class.grading_name?.gradeSystems.map((grade, index) => [
          { text: (index + 1).toString() }, 
          { text: grade.from_mark }, 
          { text: grade.to_mark ?? "" }, 
          { text: grade.grade ?? "" }, 
          { text: grade.remark ?? "" }, 
        ]),

        // ["1", "0 - 39", "F", "Fail"],
        // ["2", "40 - 49", "D", "Poor"],
        // ["3", "50 - 59", "C", "Fair"],
        // ["4", "60 - 69", "B", "Good"],
        // ["5", "70 - 74", "B+", "Very Good"],
        // ["6", "75 - 100", "A", "Excellent"],
      ],
    },
    layout: {
      hLineWidth: () => 0.8,
      vLineWidth: () => 0.8,
      hLineColor: () => "#cfd8e3",
      vLineColor: () => "#cfd8e3",
    },
  };
};
