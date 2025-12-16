const PdfPrinter = require('pdfmake');
const fs = require('fs');
const path = require('path');

// Define fonts for pdfmake
const fonts = {
    Roboto: {
        normal: path.join(__dirname, '../fonts/Roboto-Regular.ttf'),
        bold: path.join(__dirname, '../fonts/Roboto-Medium.ttf'),
        italics: path.join(__dirname, '../fonts/Roboto-Italic.ttf'),
        bolditalics: path.join(__dirname, '../fonts/Roboto-MediumItalic.ttf')
    }
};

// Fallback to system fonts if custom fonts are not available
const defaultFonts = {
    Helvetica: {
        normal: 'Helvetica',
        bold: 'Helvetica-Bold',
        italics: 'Helvetica-Oblique',
        bolditalics: 'Helvetica-BoldOblique'
    }
};

// Create PDF document definition
const createReportCardPDF = (reportData, schoolInfo, termName, sessionName) => {
    const docDefinition = {
        pageSize: 'A4',
        pageMargins: [40, 60, 40, 60],
        defaultStyle: {
            font: 'Helvetica',
            fontSize: 10
        },
        styles: {
            header: {
                fontSize: 18,
                bold: true,
                alignment: 'center',
                margin: [0, 0, 0, 10]
            },
            subheader: {
                fontSize: 14,
                bold: true,
                alignment: 'center',
                margin: [0, 0, 0, 15]
            },
            schoolInfo: {
                fontSize: 10,
                alignment: 'center',
                margin: [0, 0, 0, 5]
            },
            sectionHeader: {
                fontSize: 12,
                bold: true,
                margin: [0, 15, 0, 8]
            },
            tableHeader: {
                fontSize: 9,
                bold: true,
                fillColor: '#f0f0f0',
                alignment: 'center'
            },
            tableCell: {
                fontSize: 8,
                alignment: 'center'
            },
            studentInfo: {
                fontSize: 10,
                margin: [0, 5, 0, 5]
            },
            summary: {
                fontSize: 10,
                bold: true,
                margin: [0, 10, 0, 5]
            },
            comment: {
                fontSize: 9,
                margin: [0, 5, 0, 10]
            }
        },
        content: []
    };

    // Generate content for each student
    reportData.forEach((report, index) => {
        if (index > 0) {
            docDefinition.content.push({ text: '', pageBreak: 'before' });
        }

        // School Header
        docDefinition.content.push(
            { text: schoolInfo.schoolName || 'School Name', style: 'header' },
            { text: schoolInfo.schoolAddress || 'School Address', style: 'schoolInfo' },
            { text: 'Tel: +234 XXX XXX XXXX | Email: info@school.com', style: 'schoolInfo' },
            { text: 'STUDENT REPORT CARD', style: 'subheader' },
            { text: `${termName} • ${sessionName}`, style: 'schoolInfo' }
        );

        // Student Details
        docDefinition.content.push({
            style: 'studentInfo',
            table: {
                widths: ['25%', '25%', '25%', '25%'],
                body: [
                    [
                        { text: `Name: ${report.student.name}`, border: [false, false, false, false] },
                        { text: `Admission No: ${report.student.admissionNo}`, border: [false, false, false, false] },
                        { text: `Class: ${report.student.class}`, border: [false, false, false, false] },
                        { text: `Position: ${report.position}/${report.totalStudents}`, border: [false, false, false, false] }
                    ]
                ]
            }
        });

        // Academic Performance Table
        docDefinition.content.push(
            { text: 'Academic Performance', style: 'sectionHeader' }
        );

        const tableBody = [
            [
                { text: 'Subject', style: 'tableHeader' },
                { text: 'CA (30)', style: 'tableHeader' },
                { text: 'Exam (70)', style: 'tableHeader' },
                { text: 'Total (100)', style: 'tableHeader' },
                { text: 'Grade', style: 'tableHeader' },
                { text: 'Remark', style: 'tableHeader' }
            ]
        ];

        // Add subject rows (limit to fit on page)
        report.subjects.slice(0, 12).forEach(subject => {
            tableBody.push([
                { text: subject.name, style: 'tableCell', alignment: 'left' },
                { text: String(subject.ca), style: 'tableCell' },
                { text: String(subject.exam), style: 'tableCell' },
                { text: String(subject.total), style: 'tableCell', bold: true },
                { text: subject.grade, style: 'tableCell', bold: true },
                { text: subject.remark, style: 'tableCell', fontSize: 7 }
            ]);
        });

        docDefinition.content.push({
            table: {
                headerRows: 1,
                widths: ['30%', '12%', '12%', '12%', '10%', '24%'],
                body: tableBody
            },
            layout: {
                fillColor: function (rowIndex) {
                    return (rowIndex % 2 === 0) ? '#f9f9f9' : null;
                }
            }
        });

        // Summary Section
        docDefinition.content.push({
            style: 'summary',
            table: {
                widths: ['33%', '33%', '34%'],
                body: [
                    [
                        { text: `Total Marks: ${report.totalMarks}/${report.maxMarks}`, border: [false, false, false, false] },
                        { text: `Average: ${report.average.toFixed(1)}%`, border: [false, false, false, false] },
                        { text: `Class Position: ${report.position}/${report.totalStudents}`, border: [false, false, false, false] }
                    ]
                ]
            }
        });

        // Attendance Section
        docDefinition.content.push(
            { text: 'Attendance Record', style: 'sectionHeader' }
        );

        docDefinition.content.push({
            table: {
                widths: ['25%', '25%', '25%', '25%'],
                body: [
                    [
                        { text: `School Days: ${report.attendance.totalDays}`, border: [false, false, false, false] },
                        { text: `Present: ${report.attendance.present}`, border: [false, false, false, false] },
                        { text: `Absent: ${report.attendance.absent}`, border: [false, false, false, false] },
                        { text: `Rate: ${report.attendance.rate}%`, border: [false, false, false, false] }
                    ]
                ]
            }
        });

        // Comments Section
        docDefinition.content.push(
            { text: 'Comments', style: 'sectionHeader' }
        );

        docDefinition.content.push({
            table: {
                widths: ['50%', '50%'],
                body: [
                    [
                        {
                            stack: [
                                { text: "Class Teacher's Comment:", bold: true, margin: [0, 0, 0, 5] },
                                { text: report.teacherComment, style: 'comment' },
                                { text: 'Signature: ________________________', margin: [0, 10, 0, 0] },
                                { text: `Date: ${new Date().toLocaleDateString()}`, margin: [0, 5, 0, 0] }
                            ],
                            border: [true, true, false, true]
                        },
                        {
                            stack: [
                                { text: "Principal's Comment:", bold: true, margin: [0, 0, 0, 5] },
                                { text: report.principalComment, style: 'comment' },
                                { text: 'Signature: ________________________', margin: [0, 10, 0, 0] },
                                { text: `Date: ${new Date().toLocaleDateString()}`, margin: [0, 5, 0, 0] }
                            ],
                            border: [false, true, true, true]
                        }
                    ]
                ]
            }
        });

        // Footer
        docDefinition.content.push({
            text: `Next Term Begins: ${report.nextTermDate}`,
            alignment: 'center',
            margin: [0, 20, 0, 0],
            bold: true
        });
    });

    return docDefinition;
};

const generatePdfMakePDF = async (req, res) => {
    try {
        const { reportData, schoolInfo, termName, sessionName } = req.body;

        if (!reportData || !Array.isArray(reportData)) {
            return res.status(400).json({
                success: false,
                message: 'Report data is required and must be an array'
            });
        }

        console.log('Generating PDF with pdfmake for', reportData.length, 'students');

        // Create PDF document definition
        const docDefinition = createReportCardPDF(
            reportData,
            schoolInfo || {},
            termName || 'Current Term',
            sessionName || 'Current Session'
        );

        // Create PDF printer with fallback fonts
        const printer = new PdfPrinter(defaultFonts);
        const pdfDoc = printer.createPdfKitDocument(docDefinition);

        // Collect PDF chunks
        const chunks = [];

        pdfDoc.on('data', (chunk) => {
            chunks.push(chunk);
        });

        pdfDoc.on('end', () => {
            const pdfBuffer = Buffer.concat(chunks);

            // Set response headers
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename=report-cards-pdfmake.pdf');
            res.setHeader('Content-Length', pdfBuffer.length);

            // Send the PDF buffer
            res.send(pdfBuffer);
        });

        pdfDoc.on('error', (error) => {
            console.error('PDF generation error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to generate PDF',
                error: error.message
            });
        });

        // End the PDF document
        pdfDoc.end();

    } catch (error) {
        console.error('pdfmake PDF generation error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to generate PDF with pdfmake',
            error: error.message
        });
    }
};

// Create Modern Style PDF document definition
const createModernReportCardPDF = (reportData, schoolInfo, termName, sessionName) => {
    const docDefinition = {
        pageSize: 'A4',
        pageMargins: [30, 50, 30, 50],
        defaultStyle: {
            font: 'Helvetica',
            fontSize: 9
        },
        styles: {
            modernHeader: {
                fontSize: 22,
                bold: true,
                alignment: 'center',
                color: '#2563eb',
                margin: [0, 0, 0, 5]
            },
            modernSubheader: {
                fontSize: 16,
                bold: true,
                alignment: 'center',
                color: '#1e40af',
                margin: [0, 0, 0, 20]
            },
            modernSchoolInfo: {
                fontSize: 10,
                alignment: 'center',
                color: '#64748b',
                margin: [0, 0, 0, 3]
            },
            modernSectionTitle: {
                fontSize: 14,
                bold: true,
                color: '#ffffff',
                fillColor: '#3b82f6',
                margin: [0, 15, 0, 8],
                alignment: 'center'
            },
            modernTableHeader: {
                fontSize: 9,
                bold: true,
                fillColor: '#e0e7ff',
                color: '#1e40af',
                alignment: 'center'
            },
            modernTableCell: {
                fontSize: 8,
                alignment: 'center'
            },
            modernStudentName: {
                fontSize: 16,
                bold: true,
                color: '#1e40af',
                margin: [0, 10, 0, 5]
            },
            modernLabel: {
                fontSize: 10,
                bold: true,
                color: '#475569'
            },
            modernValue: {
                fontSize: 10,
                color: '#1e293b'
            },
            modernHighlight: {
                fontSize: 12,
                bold: true,
                color: '#ffffff',
                fillColor: '#10b981',
                alignment: 'center'
            },
            modernComment: {
                fontSize: 9,
                color: '#374151',
                margin: [0, 5, 0, 10],
                italics: true
            }
        },
        content: []
    };

    // Generate content for each student
    reportData.forEach((report, index) => {
        if (index > 0) {
            docDefinition.content.push({ text: '', pageBreak: 'before' });
        }

        // Modern Header with colored background
        docDefinition.content.push({
            table: {
                widths: ['*'],
                body: [
                    [{
                        text: schoolInfo.schoolName || 'School Name',
                        style: 'modernHeader',
                        fillColor: '#f1f5f9',
                        border: [false, false, false, false],
                        margin: [0, 15, 0, 5]
                    }],
                    [{
                        text: schoolInfo.schoolAddress || 'School Address',
                        style: 'modernSchoolInfo',
                        fillColor: '#f1f5f9',
                        border: [false, false, false, false],
                        margin: [0, 0, 0, 15]
                    }]
                ]
            }
        });

        // Report Title with gradient-like effect
        docDefinition.content.push({
            table: {
                widths: ['*'],
                body: [
                    [{
                        text: 'STUDENT REPORT CARD',
                        style: 'modernSubheader',
                        fillColor: '#dbeafe',
                        border: [false, false, false, false],
                        margin: [0, 10, 0, 5]
                    }],
                    [{
                        text: `${termName} • ${sessionName}`,
                        style: 'modernSchoolInfo',
                        fillColor: '#dbeafe',
                        border: [false, false, false, false],
                        margin: [0, 0, 0, 10]
                    }]
                ]
            }
        });

        // Student Name prominently displayed
        docDefinition.content.push({
            text: report.student.name,
            style: 'modernStudentName',
            alignment: 'center'
        });

        // Student Details in modern card layout
        docDefinition.content.push({
            table: {
                widths: ['25%', '25%', '25%', '25%'],
                body: [
                    [
                        {
                            stack: [
                                { text: 'Admission No', style: 'modernLabel' },
                                { text: report.student.admissionNo, style: 'modernValue' }
                            ],
                            fillColor: '#f8fafc',
                            margin: [8, 8, 8, 8]
                        },
                        {
                            stack: [
                                { text: 'Class', style: 'modernLabel' },
                                { text: report.student.class, style: 'modernValue' }
                            ],
                            fillColor: '#f1f5f9',
                            margin: [8, 8, 8, 8]
                        },
                        {
                            stack: [
                                { text: 'Position', style: 'modernLabel' },
                                { text: `${report.position}/${report.totalStudents}`, style: 'modernHighlight' }
                            ],
                            margin: [8, 8, 8, 8]
                        },
                        {
                            stack: [
                                { text: 'Average', style: 'modernLabel' },
                                { text: `${report.average.toFixed(1)}%`, style: 'modernValue' }
                            ],
                            fillColor: '#f8fafc',
                            margin: [8, 8, 8, 8]
                        }
                    ]
                ]
            }
        });

        // Academic Performance with modern styling
        docDefinition.content.push({
            text: 'ACADEMIC PERFORMANCE',
            style: 'modernSectionTitle'
        });

        const modernTableBody = [
            [
                { text: 'SUBJECT', style: 'modernTableHeader' },
                { text: 'CA\n(30)', style: 'modernTableHeader' },
                { text: 'EXAM\n(70)', style: 'modernTableHeader' },
                { text: 'TOTAL\n(100)', style: 'modernTableHeader' },
                { text: 'GRADE', style: 'modernTableHeader' },
                { text: 'REMARK', style: 'modernTableHeader' }
            ]
        ];

        // Add subject rows with alternating colors
        report.subjects.slice(0, 12).forEach((subject, idx) => {
            const fillColor = idx % 2 === 0 ? '#f8fafc' : '#ffffff';
            const gradeColor = subject.grade === 'A' ? '#10b981' :
                subject.grade === 'B' ? '#3b82f6' :
                    subject.grade === 'C' ? '#f59e0b' :
                        subject.grade === 'D' ? '#ef4444' : '#6b7280';

            modernTableBody.push([
                { text: subject.name, style: 'modernTableCell', alignment: 'left', fillColor, margin: [5, 3, 5, 3] },
                { text: String(subject.ca), style: 'modernTableCell', fillColor },
                { text: String(subject.exam), style: 'modernTableCell', fillColor },
                { text: String(subject.total), style: 'modernTableCell', bold: true, fillColor },
                { text: subject.grade, style: 'modernTableCell', bold: true, color: gradeColor, fillColor },
                { text: subject.remark, style: 'modernTableCell', fontSize: 7, fillColor }
            ]);
        });

        docDefinition.content.push({
            table: {
                headerRows: 1,
                widths: ['35%', '11%', '11%', '11%', '10%', '22%'],
                body: modernTableBody
            }
        });

        // Summary Cards
        docDefinition.content.push({
            text: 'PERFORMANCE SUMMARY',
            style: 'modernSectionTitle'
        });

        docDefinition.content.push({
            table: {
                widths: ['33%', '34%', '33%'],
                body: [
                    [
                        {
                            stack: [
                                { text: 'TOTAL MARKS', style: 'modernLabel', alignment: 'center' },
                                { text: `${report.totalMarks}/${report.maxMarks}`, style: 'modernValue', alignment: 'center', fontSize: 14, bold: true }
                            ],
                            fillColor: '#fef3c7',
                            margin: [10, 10, 10, 10]
                        },
                        {
                            stack: [
                                { text: 'AVERAGE SCORE', style: 'modernLabel', alignment: 'center' },
                                { text: `${report.average.toFixed(1)}%`, style: 'modernValue', alignment: 'center', fontSize: 14, bold: true, color: '#059669' }
                            ],
                            fillColor: '#d1fae5',
                            margin: [10, 10, 10, 10]
                        },
                        {
                            stack: [
                                { text: 'CLASS POSITION', style: 'modernLabel', alignment: 'center' },
                                { text: `${report.position} of ${report.totalStudents}`, style: 'modernValue', alignment: 'center', fontSize: 14, bold: true, color: '#dc2626' }
                            ],
                            fillColor: '#fee2e2',
                            margin: [10, 10, 10, 10]
                        }
                    ]
                ]
            }
        });

        // Attendance in modern card style
        docDefinition.content.push({
            text: 'ATTENDANCE RECORD',
            style: 'modernSectionTitle'
        });

        docDefinition.content.push({
            table: {
                widths: ['25%', '25%', '25%', '25%'],
                body: [
                    [
                        {
                            stack: [
                                { text: 'School Days', style: 'modernLabel', alignment: 'center' },
                                { text: String(report.attendance.totalDays), style: 'modernValue', alignment: 'center', fontSize: 12, bold: true }
                            ],
                            fillColor: '#e0f2fe',
                            margin: [8, 8, 8, 8]
                        },
                        {
                            stack: [
                                { text: 'Present', style: 'modernLabel', alignment: 'center' },
                                { text: String(report.attendance.present), style: 'modernValue', alignment: 'center', fontSize: 12, bold: true, color: '#059669' }
                            ],
                            fillColor: '#dcfce7',
                            margin: [8, 8, 8, 8]
                        },
                        {
                            stack: [
                                { text: 'Absent', style: 'modernLabel', alignment: 'center' },
                                { text: String(report.attendance.absent), style: 'modernValue', alignment: 'center', fontSize: 12, bold: true, color: '#dc2626' }
                            ],
                            fillColor: '#fef2f2',
                            margin: [8, 8, 8, 8]
                        },
                        {
                            stack: [
                                { text: 'Attendance Rate', style: 'modernLabel', alignment: 'center' },
                                { text: `${report.attendance.rate}%`, style: 'modernValue', alignment: 'center', fontSize: 12, bold: true, color: '#7c3aed' }
                            ],
                            fillColor: '#f3e8ff',
                            margin: [8, 8, 8, 8]
                        }
                    ]
                ]
            }
        });

        // Comments in modern style
        docDefinition.content.push({
            text: 'TEACHER & PRINCIPAL COMMENTS',
            style: 'modernSectionTitle'
        });

        docDefinition.content.push({
            table: {
                widths: ['50%', '50%'],
                body: [
                    [
                        {
                            stack: [
                                { text: "Class Teacher's Remark", style: 'modernLabel', color: '#1e40af' },
                                { text: report.teacherComment, style: 'modernComment' },
                                { text: 'Signature: ________________________', margin: [0, 15, 0, 5], fontSize: 8 },
                                { text: `Date: ${new Date().toLocaleDateString()}`, fontSize: 8, color: '#64748b' }
                            ],
                            fillColor: '#f1f5f9',
                            margin: [10, 10, 5, 10]
                        },
                        {
                            stack: [
                                { text: "Principal's Remark", style: 'modernLabel', color: '#059669' },
                                { text: report.principalComment, style: 'modernComment' },
                                { text: 'Signature: ________________________', margin: [0, 15, 0, 5], fontSize: 8 },
                                { text: `Date: ${new Date().toLocaleDateString()}`, fontSize: 8, color: '#64748b' }
                            ],
                            fillColor: '#f0fdf4',
                            margin: [5, 10, 10, 10]
                        }
                    ]
                ]
            }
        });

        // Footer with modern styling
        docDefinition.content.push({
            table: {
                widths: ['*'],
                body: [
                    [{
                        text: `Next Term Begins: ${report.nextTermDate}`,
                        alignment: 'center',
                        fillColor: '#1e293b',
                        color: '#ffffff',
                        bold: true,
                        margin: [0, 15, 0, 15],
                        fontSize: 12
                    }]
                ]
            },
            margin: [0, 20, 0, 0]
        });
    });

    return docDefinition;
};

const generateModernPdfMakePDF = async (req, res) => {
    try {
        const { reportData, schoolInfo, termName, sessionName } = req.body;

        if (!reportData || !Array.isArray(reportData)) {
            return res.status(400).json({
                success: false,
                message: 'Report data is required and must be an array'
            });
        }

        console.log('Generating Modern PDF with pdfmake for', reportData.length, 'students');

        // Create PDF document definition
        const docDefinition = createModernReportCardPDF(
            reportData,
            schoolInfo || {},
            termName || 'Current Term',
            sessionName || 'Current Session'
        );

        // Create PDF printer with fallback fonts
        const printer = new PdfPrinter(defaultFonts);
        const pdfDoc = printer.createPdfKitDocument(docDefinition);

        // Collect PDF chunks
        const chunks = [];

        pdfDoc.on('data', (chunk) => {
            chunks.push(chunk);
        });

        pdfDoc.on('end', () => {
            const pdfBuffer = Buffer.concat(chunks);

            // Set response headers
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename=report-cards-modern.pdf');
            res.setHeader('Content-Length', pdfBuffer.length);

            // Send the PDF buffer
            res.send(pdfBuffer);
        });

        pdfDoc.on('error', (error) => {
            console.error('Modern PDF generation error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to generate modern PDF',
                error: error.message
            });
        });

        // End the PDF document
        pdfDoc.end();

    } catch (error) {
        console.error('Modern pdfmake PDF generation error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to generate modern PDF with pdfmake',
            error: error.message
        });
    }
};

module.exports = {
    generatePdfMakePDF,
    generateModernPdfMakePDF
};