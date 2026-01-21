const PdfPrinter = require("pdfmake");
const fs = require("fs");
const path = require("path");
const printedAt = require("../pdf/printedAt");
const backgroundImage = require("../pdf/reportCard/backgroundImage");
const backgroundImage2 = require("../pdf/broadsheet/backgroundImage");
const schoolLogo = require("../pdf/schoolLogo");
const studentList = require("../pdf/broadsheet/studentList");
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
      message: "Failed to generate report card PDF",
      error: error.message,
      stack: error.stack,
    });
  }
};

const generateBroadsheet = (req, res) => {
  try {
    const students = req.body.students || req.body.studentsData;
    const classSubjects = req.body.classSubjects;

    if (!students || students.length === 0) {
      return res.status(400).json({
        message: "No student data provided",
      });
    }

    if (!Array.isArray(students)) {
      return res.status(400).json({
        message: "students must be an array",
        received: students,
      });
    }

    if (!classSubjects || !Array.isArray(classSubjects)) {
      return res.status(400).json({
        message: "classSubjects must be an array",
      });
    }

    const tableBody = studentList(students, classSubjects);

    // Calculate widths - adjust as needed
    const subjectWidths = Array(classSubjects.length * 3).fill("auto");
    // const subjectWidths = Array(classSubjects.length * 3).fill(35);
    const widths = ["auto", "*", ...subjectWidths, "auto", "auto", "auto"];
    // const widths = [30, 150, ...subjectWidths, 40, 40, 40];

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

    // Extract session and term info from the first student
    const firstStudent = students[0];
    const sessionName = firstStudent?.session?.name || "2024/2025";
    const termName = firstStudent?.current_term?.name || "First Term";
    const className = firstStudent?.class?.name || "SS 2A";

    const docDefinition = {
      pageSize: "A4",
      pageOrientation: "landscape",
      defaultStyle: {
        font: "Helvetica",
        fontSize: 5,
      },
      styles: {
        header: {
          fontSize: 10,
          bold: true,
          margin: [0, 0, 0, 5],
        },
        tableHeader: {
          bold: true,
          fontSize: 8,
          color: "black",
        },
      },

      // Remove or comment these if not defined
      header: printedAt,
      background: backgroundImage2,
      footer: footerImage,

      content: [
        schoolLogo(160, 100),
        getSchoolName(18),
        getSchoolAddress(9),
        getSchoolMotto(8),
        dashSeparator(768),

        {
          text: "CLASS BROADSHEET".toUpperCase(),
          bold: true,
          margin: [0, 10, 0, 10],
          fontSize: 17,
          alignment: "center",
          color: "#3771c8",
        },
        {
          alignment: "center",
          margin: [0, 0, 0, 15],
          fontSize: 10,
          color: "#3771c8",
          bold: true,
          text: [
            "Academic Session: ",
            {
              text: sessionName,
              color: "#3771c8",
              italics: true,
              bold: false,
            },
            "\t-\t",
            "Term: ",
            {
              text: termName,
              color: "#3771c8",
              italics: true,
              bold: false,
            },
            "\t\t",
            "Class: ",
            {
              text: className,
              color: "#3771c8",
              italics: true,
              bold: false,
            },
          ],
        },

        {
          table: {
            headerRows: 2,
            widths: widths,
            body: tableBody,
          },
          margin: [0, 0, 0, 20],
          // layout: {
          //   hLineWidth: function (i, node) {
          //     return i === 0 || i === node.table.body.length ? 1 : 0.5;
          //   },
          //   vLineWidth: function (i, node) {
          //     return 0.5;
          //   },
          //   hLineColor: function (i, node) {
          //     return "#aaa";
          //   },
          //   vLineColor: function (i, node) {
          //     return "#aaa";
          //   },
          //   paddingLeft: function (i, node) {
          //     return 4;
          //   },
          //   paddingRight: function (i, node) {
          //     return 4;
          //   },
          //   paddingTop: function (i, node) {
          //     return 2;
          //   },
          //   paddingBottom: function (i, node) {
          //     return 2;
          //   },
          // },
          layout: {
            hLineWidth: () => 0.8,
            vLineWidth: () => 0.8,
            hLineColor: () => "#cfd8e3",
            vLineColor: () => "#cfd8e3",
          },
        },
      ],
    };

    const pdfDoc = printer.createPdfKitDocument(docDefinition);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "inline; filename=broadsheet.pdf");
    pdfDoc.pipe(res);
    pdfDoc.end();
  } catch (error) {
    console.error("PDF generation error:", error);
    res.status(500).json({
      message: "Failed to generate broadsheet PDF",
      error: error.message,
      stack: error.stack,
    });
  }
};

const generateBroadsheet3 = (req, res) => {
  try {
    const students = req.body.students || req.body.studentsData;
    const classSubjects = req.body.classSubjects;
    
    // ... validation code ...
    
    const tableBody = studentList(students, classSubjects);
    const subjectCount = classSubjects.length;
    const useCompactFormat = subjectCount > 10;
    
    // Calculate dynamic widths based on subject count and format
    let widths;
    
    if (useCompactFormat) {
      // Compact format widths (one column per subject)
      const snWidth = 25;
      const nameWidth = subjectCount > 15 ? 90 : 120;
      const subjectWidth = subjectCount > 15 ? 30 : 35;
      const summaryWidth = 30;
      
      const subjectWidths = Array(subjectCount).fill(subjectWidth);
      widths = [
        snWidth, 
        nameWidth, 
        ...subjectWidths, 
        summaryWidth, 
        summaryWidth, 
        summaryWidth
      ];
    } else {
      // Original format widths (three columns per subject)
      const snWidth = 25;
      const nameWidth = subjectCount > 8 ? 100 : 150;
      const subjectColWidth = subjectCount > 8 ? 25 : 35;
      const summaryWidth = 35;
      
      const subjectWidths = Array(subjectCount * 3).fill(subjectColWidth);
      widths = [
        snWidth, 
        nameWidth, 
        ...subjectWidths, 
        summaryWidth, 
        summaryWidth, 
        summaryWidth
      ];
    }

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
    };

    const printer = new PdfPrinter(fonts);

    // Extract session and term info from the first student
    const firstStudent = students[0];
    const sessionName = firstStudent?.session?.name || "2024/2025";
    const termName = firstStudent?.current_term?.name || "First Term";
    const className = firstStudent?.class?.name || "SS 2A";

    const docDefinition = {
      pageSize: "A4",
      pageOrientation: "landscape",
      defaultStyle: {
        font: "Helvetica",
        fontSize: subjectCount > 10 ? 7 : 8, // Dynamic font size
      },
      styles: {
        header: {
          fontSize: 10,
          bold: true,
          margin: [0, 0, 0, 5],
        },
        tableHeader: {
          bold: true,
          fontSize: subjectCount > 10 ? 7 : 8,
          color: "black",
        },
      },

      header: printedAt,
      background: backgroundImage2,
      footer: footerImage,

      content: [
        schoolLogo(160, 100),
        getSchoolName(18),
        getSchoolAddress(9),
        getSchoolMotto(8),
        dashSeparator(768),

        {
          text: "CLASS BROADSHEET".toUpperCase(),
          bold: true,
          margin: [0, 10, 0, 10],
          fontSize: subjectCount > 15 ? 15 : 17, // Adjust title size for many subjects
          alignment: "center",
          color: "#3771c8",
        },
        {
          alignment: "center",
          margin: [0, 0, 0, 15],
          fontSize: subjectCount > 15 ? 9 : 10,
          color: "#3771c8",
          bold: true,
          text: [
            "Academic Session: ",
            {
              text: sessionName,
              color: "#3771c8",
              italics: true,
              bold: false,
            },
            "\t-\t",
            "Term: ",
            {
              text: termName,
              color: "#3771c8",
              italics: true,
              bold: false,
            },
            "\t\t",
            "Class: ",
            {
              text: className,
              color: "#3771c8",
              italics: true,
              bold: false,
            },
          ],
        },

        {
          table: {
            headerRows: 2,
            widths: widths,
            body: tableBody,
          },
          margin: [0, 0, 0, 20],
          layout: {
            hLineWidth: function (i, node) {
              return i === 0 || i === node.table.body.length ? 1 : 0.5;
            },
            vLineWidth: function (i, node) {
              return 0.5;
            },
            hLineColor: function (i, node) {
              return "#aaa";
            },
            vLineColor: function (i, node) {
              return "#aaa";
            },
            paddingLeft: function (i, node) {
              return 2; // Reduced padding
            },
            paddingRight: function (i, node) {
              return 2; // Reduced padding
            },
            paddingTop: function (i, node) {
              return 1; // Reduced padding
            },
            paddingBottom: function (i, node) {
              return 1; // Reduced padding
            },
          },
        },
      ],
    };

    const pdfDoc = printer.createPdfKitDocument(docDefinition);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "inline; filename=broadsheet.pdf");
    pdfDoc.pipe(res);
    pdfDoc.end();
  } catch (error) {
    console.error("PDF generation error:", error);
    res.status(500).json({
      message: "Failed to generate broadsheet PDF",
      error: error.message,
      stack: error.stack,
    });
  }
};

module.exports = {
  generateAllReportCards,
  generateBroadsheet,
};
