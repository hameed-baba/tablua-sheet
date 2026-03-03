const PdfPrinter = require("pdfmake");
const fs = require("fs");
const path = require("path");
const printedAt = require("../pdf/printedAt");
const backgroundImage = require("../pdf/reportCard/backgroundImage");
const backgroundImage2 = require("../pdf/broadsheet/backgroundImage");
const schoolLogo = require("../pdf/schoolLogo");
const studentList2 = require("../pdf/broadsheet/studentList2");
const {
  getSchoolAddress,
  getSchoolMotto,
  getSchoolName,
} = require("../pdf/schoolInfo");
const dashSeparator = require("../pdf/dashSeparator");
const studentInfoData = require("../pdf/reportCard/studentInfoData");
const { footerImage, footerImageSmall } = require("../pdf/footerImagr");
const studentSubjects = require("../pdf/reportCard/studentSubjects");
const performanceSummary = require("../pdf/reportCard/performaceSummary");
const termPerformance = require("../pdf/reportCard/termPerformace");
const scoreBreakDown = require("../pdf/reportCard/scoreBreakDown");
const termPosition = require("../pdf/reportCard/termPositions");
const qrCode = require("../pdf/reportCard/qrCode");
const termCalendar = require("../pdf/reportCard/termCalendar");
const dateFormatter = require("../utils/dateFormatter");
const { stack } = require("sequelize/lib/utils");

const generateAllReportCards2 = (req, res) => {
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
                      // termPerformance(student),
                      scoreBreakDown(student),
                      // termCalendar(student),

                      {
                        columns: [
                          // scoreBreakDown(student),
                          // termPosition(student),
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
            // Calculate next term begin date for each student
            let currentTerm = student.current_term;
            let nextTermBegin;
            if (currentTerm.id === 1) {
              nextTermBegin =
                "Next term will begin on: " +
                dateFormatter(student.session?.second_term_start);
            } else if (currentTerm.id === 2) {
              nextTermBegin =
                "Next term will begin on: " +
                dateFormatter(student.session.third_term_start);
            } else {
              nextTermBegin = "SESSION HAS ENDED!";
            }

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
                      // termPerformance(student),
                      scoreBreakDown(student),
                      qrCode(student),
                      {
                        text: nextTermBegin,
                        italics: true,
                        alignment: "center",
                        margin: [0, 10, 0, 0],
                        fontSize: 8,
                        bold: true,
                        color: "#3771c8",
                        marginTop: "auto",
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
                        text: student.performance.class_teacher_remark || "",
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
                        text: student.performance.principal_remark || "",
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

const generateSingleReportCard = (req, res) => {
  try {
    const student = req.body;

    let currentTerm = student.current_term;
    let nextTermBegin;
    if (currentTerm.id === 1) {
      nextTermBegin =
        "Next term will begin on: " +
        dateFormatter(student.session?.second_term_start);
    } else if (currentTerm.id === 2) {
      nextTermBegin =
        "Next term will begin on: " +
        dateFormatter(student.session.third_term_start);
    } else {
      nextTermBegin = "SESSION HAS ENDED!";
    }

    if (!student) {
      return res.status(400).json({
        message: "No student data provided",
      });
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
              italics: true,
              bold: false,
            },
            "\t-\t",
            "Term: ",
            {
              text: student.current_term.name,
              italics: true,
              bold: false,
            },
            "\n\n",
            "Class: ",
            {
              text: student.class.name,
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
                scoreBreakDown(student),
                qrCode(student),
                {
                  text: nextTermBegin,
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
                { text: "Teacher's Comment:", bold: true, fontSize: 9 },
                {
                  text: student.performance.class_teacher_remark || "",
                  fontSize: 9,
                  italics: true,
                  margin: [0, 4, 5, 0],
                },
              ],
            },
            {
              width: "50%",
              stack: [
                { text: "Principal's Comment:", bold: true, fontSize: 9 },
                {
                  text: student.performance.principal_remark || "",
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
      ],
    };

    const pdfDoc = printer.createPdfKitDocument(docDefinition);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "inline; filename=student-report.pdf");

    pdfDoc.pipe(res);
    pdfDoc.end();
  } catch (error) {
    console.error("PDF generation error:", error);
    res.status(500).json({
      message: "Failed to generate student report card",
      error: error.message,
    });
  }
};

const generateBroadsheet3 = (req, res) => {
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

    const tableBody = studentList2(students, classSubjects);

    // Calculate widths - now only 1 column per subject
    const subjectWidths = Array(classSubjects.length).fill("auto");
    const widths = ["auto", "*", ...subjectWidths, "auto", "auto", "auto"];

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
      pageSize: "A3",
      pageOrientation: "landscape",
      defaultStyle: {
        font: "Helvetica",
        fontSize: 7, // Increased from 5 for better readability
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
      footer: footerImageSmall,

      content: [
        // Comment out or adjust these based on your actual functions
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
            headerRows: 1, // Changed from 2 to 1 since we only have one header row now
            widths: widths,
            body: tableBody,
          },
          margin: [0, 0, 0, 20],
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

    const tableBody = studentList2(students, classSubjects);

    // Calculate widths - 3 columns per subject (CA, Exam, Total)
    const subjectWidths = Array(classSubjects.length * 3).fill("auto");
    const widths = ["auto", "*", ...subjectWidths, "auto", "auto", "auto"];

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
    const sessionName = firstStudent?.session?.name || "";
    const termName = firstStudent?.current_term?.name || "";
    const className = firstStudent?.class?.name || "";

    const docDefinition = {
      pageSize: "A3",
      pageOrientation: "landscape",
      defaultStyle: {
        font: "Helvetica",
        fontSize: 8,
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
        {
          columns: [
            schoolLogo(180, 120),
            {
              margin: [0, 20, 0, 0],
              stack: [
                getSchoolName(38),
                getSchoolAddress(20),
                getSchoolMotto(18),
              ],
            },
            schoolLogo(180, 120),
          ],
        },
        dashSeparator(1100),


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
        dashSeparator(1100),

        {
          table: {
            headerRows: 2,
            widths: widths,
            body: tableBody,
          },
          margin: [0, 20, 0, 20],
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

module.exports = {
  generateAllReportCards,
  generateBroadsheet,
  generateSingleReportCard,
};
