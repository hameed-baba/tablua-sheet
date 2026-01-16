module.exports = termPosition = (student) => {
  return {
    fontSize: 7,
    margin: [0, 10, 0, 0],
    table: {
      widths: ["auto", "auto"],
      body: [
        [
          {
            text: "TERMS POSITION SCORED",
            colSpan: 2,
            alignment: "center",
            bold: true,
            fontSize: 6.5,
          },
          {},
        ],
        [
          {
            text: "FIRST TERM",
          },
          {
            text: student.term_positions_scored["First Term"],
            bold: true,
            alignment: "center",
          },
        ],
        [
          {
            text: "SECOND TERM",
          },
          {
            text: student.term_positions_scored["Second Term"],
            bold: true,
            alignment: "center",
          },
        ],
        [
          {
            text: "THIRD TERM",
          },
          {
            text: student.term_positions_scored["Third Term"],
            bold: true,
            alignment: "center",
          },
        ],
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
