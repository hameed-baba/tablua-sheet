const dateFormatter = require("../../utils/dateFormatter");

module.exports = termCalendar = (student) => {
  return {
    fontSize: 7,
    margin: [0, 10, 0, 0],
    table: {
      widths: ["*", "*", "*"],
      body: [
        [
          {
            text: "TERMS CALENDAR",
            colSpan: 3,
            alignment: "center",
            bold: true,
            fontSize: 6.5,
          },
          {},
          {},
        ],
        [
          { text: "First Term".toUpperCase() },
          { text: dateFormatter(student.session.first_term_start) || "" },
          { text: dateFormatter(student.session.first_term_end) || "" },
        ],
        [
          { text: "Second Term".toUpperCase() },
          { text: dateFormatter(student.session.second_term_start) || "" },
          { text: dateFormatter(student.session.second_term_end) || "" },
        ],
        [
          { text: "Third Term".toUpperCase() },
          { text: dateFormatter(student.session.third_term_start) || "" },
          { text: dateFormatter(student.session.third_term_end) || "" },
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
