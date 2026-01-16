import {
  getSchoolName,
  getSchoolMotto,
  getSchoolAddress,
} from "../utils/schoolInfo";
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts.js";

import schoolLogo from "../assets/img/school-logo.png";
import tabulaSheetLogo from "../assets/img/tabula-sheet-logo.png";
// generatePdf.js
import { generateStudents } from "./studentsData.js";

pdfMake.vfs = pdfFonts.pdfMake ? pdfFonts.pdfMake.vfs : pdfMake.vfs;

const rotateTextSVG = (text, options = {}) => {
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
};

const getBase64ImageFromURL = (url) => {
  return new Promise((resolve, reject) => {
    var img = new Image();
    img.setAttribute("crossOrigin", "anonymous");

    img.onload = () => {
      var canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;

      var ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);

      var dataURL = canvas.toDataURL("image/png");

      resolve(dataURL);
    };

    img.onerror = (error) => {
      reject(error);
    };

    img.src = url;
  });
};

const pageHeader = async (student) => {
  const contentArray = [];
  const logoBase64 = await getBase64ImageFromURL(schoolLogo);

  contentArray.push(
    {
      image: logoBase64,
      width: 220,
      // height: 160,
      alignment: "center",
      margin: [0, 0, 0, 0],
    },
    {
      text: getSchoolName().toUpperCase(),
      bold: true,
      margin: [0, 0, 0, 0],
      fontSize: 25,
      alignment: "center",
      color: "#3771c8",
    },
    {
      text: getSchoolAddress().toUpperCase(),
      margin: [0, 0, 0, 0],
      fontSize: 12,
      bold: true,
      alignment: "center",
      color: "#3771c8",
    },
    {
      text: getSchoolMotto(),
      margin: [0, 0, 0, 0],
      fontSize: 9,
      alignment: "center",
      color: "#3771c8",
      italics: true,
    },
    {
      canvas: [
        {
          type: "line",
          x1: 0,
          y1: 0,
          x2: 515, // page width minus margins
          y2: 0,
          lineWidth: 0.5,
          lineColor: "#3771c8",
          dash: { length: 5, space: 3 },
        },
      ],
      margin: [0, 5, 0, 0],
    },
    {
      text: "Student report card".toUpperCase(),
      bold: true,
      margin: [0, 5, 0, 0],
      fontSize: 22,
      alignment: "center",
      color: "#3771c8",
    },

    {
      alignment: "center",
      margin: [0, 0, 0, 0],
      fontSize: 10,
      color: "#3771c8",
      bold: true,
      text: [
        "Academic Session: ",
        {
          text: student.academicSession,
          color: "#3771c8",
          italics: true,
          bold: false,
        },
        "\t-\tTerm: ",
        { text: student.term, color: "#3771c8", italics: true, bold: false },
        "\nClass: ",
        {
          text: student.className,
          color: "#3771c8",
          italics: true,
          bold: false,
        },
        "\nStudent: ",
        {
          text: student.fullName,
          color: "#3771c8",
          italics: true,
          bold: false,
        },
        "\nAdmission No: ",
        {
          text: student.admissionNumber,
          color: "#3771c8",
          italics: true,
          bold: false,
        },
      ],
    },
    {
      canvas: [
        {
          type: "line",
          x1: 0,
          y1: 0,
          x2: 515, // page width minus margins
          y2: 0,
          lineWidth: 0.5,
          lineColor: "#3771c8",
          dash: { length: 5, space: 3 },
        },
      ],
      margin: [0, 5, 0, 10],
    }
  );
  return contentArray;
};

const getSubjectsTable = (subjects) => {
  return {
    table: {
      headerRows: 1,
      widths: [
        "auto",
        "*",
        "auto",
        "auto",
        "auto",
        "auto",
        "auto",
        // "auto",
        // "auto",
        // "auto",
        // "auto",
      ],
      body: [
        [
          "SN",
          "Subject Name",
          "CA Score",
          "Exam Score",
          "Total Mark",
          "Grade",
          "Remark",
        ],
        ...subjects.map((sub) => [
          sub.sn,
          sub.subjectName,
          sub.caScore,
          sub.examScore,
          sub.totalMark,
          sub.grade,
          sub.remark,
        ]),
      ],
    },
    layout: {
      fillColor: (rowIndex) =>
        rowIndex === 0 ? "#3771c8" : rowIndex % 2 === 0 ? "#f3f4f6" : null,
      hLineColor: () => "#3771c8",
      vLineColor: () => "#3771c8",
    },
  };
};

export const generateReportCardPdf = async () => {
  const schoolLogoBase64 = await getBase64ImageFromURL(schoolLogo);
  const tabulaSheetLogoBase64 = await getBase64ImageFromURL(tabulaSheetLogo);

  const content = [];
  const students = generateStudents(2);

  for (const student of students) {
    const headerContent = await pageHeader(student);

    content.push(...headerContent, getSubjectsTable(student.subjects));

    // Page break after each student except the last
    if (student !== students[students.length - 1]) {
      content.push({ text: "", pageBreak: "after" });
    }
  }

  const docDefinition = {
    pageOrientation: "portrait",
    pageSize: "A4",
    background: [
      {
        image: schoolLogoBase64,
        opacity: 0.05,
        alignment: "center",
        absolutePosition: { x: 0, y: 290 },
        width: 800,
        height: 400,
      },
    ],
    header: () => ({
      margin: [20, 20, 40, 0],
      text: `Printed at ${new Date().toISOString().split("T")[0]}`,
      alignment: "right",
      bold: true,
      fontSize: 7,
      color: "#667085",
    }),
    footer: () => ({
      image: tabulaSheetLogoBase64,
      width: 70,
      alignment: "right",
      margin: [0, 0, 40, 0],
    }),
    content,
  };

  pdfMake.createPdf(docDefinition).open();
};
