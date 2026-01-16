const PdfPrinter = require("pdfmake");
const fs = require("fs");
const path = require("path");
const printedAt = require("../pdf/printedAt");
const backgroundImage = require("../pdf/reportCard/backgroundImage");
const schoolLogo = require("../pdf/schoolLogo");
const {
  getSchoolAddress,
  getSchoolMotto,
  getSchoolName,
} = require("../pdf/schoolInfo");
const dashSeparator = require("../pdf/dashSeparator");
const studentInfoData = require("../pdf/reportCard/studentInfoData");
const footerImage = require("../pdf/footerImagr");
const studentSubjects = require("../pdf/reportCard/studentSubjects");
const performanceSummary = require("../pdf/reportCard/performaceSummary");
const termPerformance = require("../pdf/reportCard/termPerformace");
const scoreBreakDown = require("../pdf/reportCard/scoreBreakDown");
const termPosition = require("../pdf/reportCard/termPositions");
const qrCode = require("../pdf/reportCard/qrCode");
const termCalendar = require("../pdf/reportCard/termCalendar");

const generateAllReportCards = (req, res) => {
  try {
    const studentsData = req.body;

    if (!studentsData || studentsData.length === 0) {
      return res.status(400).json({
        message: "No student data provided",
      });
    }
    // Use standard PDF fonts that don't require embedding
    const fonts = {
      Times: {
        normal: "Times-Roman",
        bold: "Times-Bold",
        italics: "Times-Italic",
        bolditalics: "Times-BoldItalic",
      },
      Helvetica: {
        normal: "Helvetica",
        bold: "Helvetica-Bold",
        italics: "Helvetica-Oblique",
        bolditalics: "Helvetica-BoldOblique",
      },
      Courier: {
        normal: "Courier",
        bold: "Courier-Bold",
        italics: "Courier-Oblique",
        bolditalics: "Courier-BoldOblique",
      },
    };

    const printer = new PdfPrinter(fonts);

    const docDefinition = {
      pageSize: "A4",
      defaultStyle: {
        font: "Helvetica",
      },
      header: printedAt,
      background: backgroundImage,
      footer: footerImage,

      content: [
        ...studentsData
          .map((student, index) => {
            return [
              // Repeat header info for each student page
              schoolLogo(),
              getSchoolName(),
              getSchoolAddress(),
              getSchoolMotto(),
              dashSeparator(),
              {
                text: "Student report card".toUpperCase(),
                bold: true,
                margin: [0, 10, 0, 0],
                fontSize: 20,
                alignment: "center",
                color: "#3771c8",
              },
              {
                alignment: "center",
                margin: [0, 6, 0, 0],
                fontSize: 10,
                color: "#3771c8",
                bold: true,
                text: [
                  "Academic Session: ",
                  {
                    text: student.session.name,
                    color: "#3771c8",
                    italics: true,
                    bold: false,
                  },
                  "\t-\t",
                  "Term: ",
                  {
                    text: student.current_term.name,
                    color: "#3771c8",
                    italics: true,
                    bold: false,
                  },
                  "\n\n",
                  "Class: ",
                  {
                    text: student.class.name,
                    color: "#3771c8",
                    italics: true,
                    bold: false,
                  },
                ],
              },
              dashSeparator(),

              // Student-specific content
              studentInfoData(student),
              {
                columns: [
                  studentSubjects(student),
                  { width: "2%", text: "" },
                  {
                    stack: [
                      performanceSummary(student),
                      termPerformance(student),
                      scoreBreakDown(student),
                      termCalendar(student),

                      {
                        columns: [
                          // scoreBreakDown(student),
                          termPosition(student),
                          qrCode(student),
                          // { stack: [termPosition(student), qrCode(student)] },
                        ],
                      },
                      // termCalendar(student),
                      {
                        text: "Next term will begin 20/12/2023",
                        italics: true,
                        alignment: "center",
                        margin: [0, 10, 0, 0],
                        fontSize: 8,
                        bold: true,
                        color: "#3771c8",
                      },
                    ],
                  },
                ],
              },
              {
                margin: [0, 10, 0, 0],
                columns: [
                  {
                    width: "50%",
                    stack: [
                      {
                        text: "Teacher's Comment:",
                        bold: true,
                        fontSize: 9,
                      },
                      {
                        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet.",
                        fontSize: 9,
                        italics: true,
                        margin: [0, 4, 5, 0],
                      },
                    ],
                  },

                  {
                    width: "50%",
                    stack: [
                      {
                        text: "Principal's Comment:",
                        bold: true,
                        fontSize: 9,
                      },
                      {
                        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet.",
                        fontSize: 9,
                        italics: true,
                        margin: [0, 4, 0, 0],
                      },
                    ],
                  },
                ],
              },
              {
                columns: [
                  {
                    width: "50%",
                    text: "Class Teacher's Signature: ____________________________",
                    margin: [0, 20, 0, 0],
                    fontSize: 9,
                  },
                  {
                    width: "50%",
                    text: "Principal's Signature: _______________________________",
                    margin: [0, 20, 0, 0],
                    fontSize: 9,
                  },
                ],
              },

              // Add page break after each student except the last
              ...(index < studentsData.length - 1
                ? [{ text: "", pageBreak: "after" }]
                : []),
            ];
          })
          .flat(),
      ],
    };

    const pdfDoc = printer.createPdfKitDocument(docDefinition);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "inline; filename=report.pdf");

    pdfDoc.pipe(res);
    pdfDoc.end();
  } catch (error) {
    console.error("PDF generation error:", error);
    res.status(500).json({
      message: "Failed to generate PDF",
      error: error.message,
      stack: error.stack,
    });
  }
};

module.exports = {
  generateAllReportCards,
};
