function rotateTextSVG(text, options = {}) {
  const {
    fontSize = 8,
    fontWeight = "bold",
    rotate = -90,
    width = 50,
    height = 100,
    x = 20,
    y = 100,
  } = options;

  return {
    svg: `
      <svg width="${width}" height="${height}">
        <text
          transform="translate(${x}, ${y}) rotate(${rotate})"
          font-weight="${fontWeight}"
          style="font-size:${fontSize}px;"
        >
          ${text}
        </text>
      </svg>
    `,
    width,
    height,
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

module.exports = studentSubjects = (student) => {


  return {
    fontSize: 8,
    table: {
      widths: ["auto", "*", "auto", "auto", "auto", "auto", "auto"],
      body: [
        [
          //   { text: "S/N", style: "tableHeader" },
          rotateTextSVG("SN", {
            fontSize: 8,
            x: 8,
            y: 40,
            width: 8,
            height: 40,
          }),
          //   {
          straightTextSVG("SUBJECT NAMES", {
            y: 40,
            width:80,
            height: 50,
          }),
          // bold: true,
          // margin: [20, 20, 0, 0],
          //   },
          rotateTextSVG("CA SCORE", {
            fontSize: 8,
            x: 8,
            y: 50,
            width: 8,
            height: 50,
          }),
          rotateTextSVG("EXAM SCORE", {
            fontSize: 8,
            x: 8,
            y: 58,
            width: 8,
            height: 60,
          }),
          rotateTextSVG("TOTAL", {
            fontSize: 8,
            x: 8,
            y: 40,
            width: 8,
            height: 40,
          }),
          rotateTextSVG("GRADE", {
            fontSize: 8,
            x: 8,
            y: 40,
            width: 8,
            height: 40,
          }),
          straightTextSVG("REMARK", {
            y: 40,
            height: 50,
          }),

          //   { text: "REMARK", margin: [0, 20, 0, 0] },
        ],
      
        ...student.subjects.map((sub, index) => [
          { text: (index + 1).toString() }, // S/N
          { text: sub.name }, // Subject Name
          { text: sub.ca_1_score ?? "ABS" }, // CA Score
          { text: sub.exam_score ?? "ABS" }, // Exam Score
          { text: sub.total ?? "ABS" }, // Total
          { text: sub.grade ?? "" }, // Grade
          { text: sub.remark ?? "" }, // Remark
        ]),
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
