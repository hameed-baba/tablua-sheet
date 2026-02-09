const dateFormatter = require("../../utils/dateFormatter");


module.exports = studentInfoData = (student) => {
  return {
    fontSize: 9,
    table: {
      widths: ["auto", "*", "auto", "auto", 90], // last column for Position
      body: [
        // HEADER ROWS
        [
          {},
          {},
          {},
          {}, // empty cells for colSpan
          {
            text: "Position", // header for the last column
            fillColor: "#3771c8",
            color: "#ffffff",
            bold: true,
            alignment: "center",
            margin: [0, 0, 0, 0],
          },
        ],

        // DATA ROW 1
        [
          {
            text: "Full Name".toUpperCase(),
            bold: true,
          },
          {
            text: student.student.full_name.toUpperCase(),
          },
          {
            text: "Gender".toUpperCase(),
            bold: true,
          },
          { text: student.student.gender.toUpperCase(), fontSize: 9 },
          {
            text: student.performance.display_position || "", // dynamically get position
            bold: true,
            fontSize: 15,
            alignment: "center",
            rowSpan: 2,
            color: "#3771c8",
            margin: [0, 5, 0, 0],
          },
        ],

        // DATA ROW 2
        [
          {
            text: "Admission Number".toUpperCase(),
            bold: true,
            fontSize: 9,
          },
          { text: student.student.admission_number, fontSize: 9 },
          {
            text: "Date of Birth".toUpperCase(),
            bold: true,
            fontSize: 9,
          },
          {
            text: dateFormatter(student.student.dob) || "-", // fallback if no DOB
            fontSize: 9,
          },
          { text: "", fontSize: 9 }, // empty cell to match column
        ],
      ],
    },
    layout: "noBorders", // Disable borders
    margin: [0, 10, 0, 10],
  };
};
