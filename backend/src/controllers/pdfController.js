const PdfPrinter = require('pdfmake');
const fs = require('fs');
const path = require('path');

// Define fonts for pdfmake - using built-in fonts
const fonts = {
    Helvetica: {
        normal: 'Helvetica',
        bold: 'Helvetica-Bold',
        italics: 'Helvetica-Oblique',
        bolditalics: 'Helvetica-BoldOblique'
    }
};

// Helper function to convert image to base64
const getBase64Image = (imagePath) => {
    try {
        const fullPath = path.join(__dirname, '..', 'img', imagePath);
        if (fs.existsSync(fullPath)) {
            const imageBuffer = fs.readFileSync(fullPath);
            const base64 = imageBuffer.toString('base64');
            const mimeType = imagePath.endsWith('.png') ? 'image/png' : 'image/jpeg';
            return `data:${mimeType};base64,${base64}`;
        }
        return null;
    } catch (error) {
        console.error('Error loading image:', error);
        return null;
    }
};

// Helper function to calculate average and total marks
const calculateAverageTotalMarks = (student) => {
    if (!student.subjects || student.subjects.length === 0) {
        return { average: 'N/A', total: 'N/A' };
    }

    // Sum marks and count valid subjects, treating invalid marks as 0
    const totalMarksSum = student.subjects.reduce((sum, subject) => {
        const marks = subject.total || subject.total_marks;
        // Treat '', null, 'ABS', '?' as 0
        if (marks === '' || marks === null || marks === 'ABS' || marks === '?') {
            return sum; // Add 0 to sum
        }
        return sum + parseFloat(marks) || 0;
    }, 0);

    // Count all subjects (valid or invalid)
    const validSubjectsCount = student.subjects.length;

    // If no valid subjects, return 'N/A'
    if (validSubjectsCount === 0) {
        return { average: 'N/A', total: 'N/A' };
    }

    // Calculate average
    const average = totalMarksSum / validSubjectsCount;

    // Return both average and total marks
    return {
        average: average.toFixed(2), // Rounded to 2 decimal places
        total: totalMarksSum.toFixed(2) // Total sum of valid marks, rounded to 2 decimal places
    };
};

// Helper function to get remark based on score
const getRemark = (score) => {
    if (typeof score !== 'number') return { grade: 'N/A', remark: 'N/A' };

    if (score >= 75) return { grade: 'A', remark: 'Excellent' };
    if (score >= 70) return { grade: 'B', remark: 'Very Good' };
    if (score >= 60) return { grade: 'C', remark: 'Good' };
    if (score >= 50) return { grade: 'D', remark: 'Fair' };
    if (score >= 40) return { grade: 'E', remark: 'Poor' };
    return { grade: 'F', remark: 'Fail' };
};
const createReportCardPDF = (reportData, schoolInfo, termName, sessionName) => {
    try {
        console.log('Creating enhanced PDF definition...');

        const docDefinition = {
            pageSize: 'A4',
            pageMargins: [40, 50, 40, 50],
            defaultStyle: {
                font: 'Helvetica',
                fontSize: 9
            },
            styles: {
                schoolHeader: {
                    fontSize: 18,
                    bold: true,
                    alignment: 'center',
                    margin: [0, 10, 0, 5]
                },
                schoolSubtitle: {
                    fontSize: 11,
                    bold: true,
                    alignment: 'center',
                    margin: [0, 0, 0, 3]
                },
                schoolAddress: {
                    fontSize: 9,
                    alignment: 'center',
                    margin: [0, 0, 0, 15]
                },
                printDate: {
                    fontSize: 8,
                    alignment: 'right',
                    margin: [0, 0, 0, 15]
                },
                sectionHeader: {
                    fontSize: 10,
                    bold: true,
                    fillColor: '#374151',
                    color: '#ffffff',
                    alignment: 'center'
                },
                dataLabel: {
                    fontSize: 9,
                    bold: true,
                    fillColor: '#f3f4f6'
                },
                dataValue: {
                    fontSize: 9
                },
                positionNumber: {
                    fontSize: 36,
                    bold: true,
                    alignment: 'center'
                },
                tableHeader: {
                    fontSize: 9,
                    bold: true,
                    fillColor: '#374151',
                    color: '#ffffff',
                    alignment: 'center'
                },
                tableCell: {
                    fontSize: 9,
                    alignment: 'center'
                },
                tableCellLeft: {
                    fontSize: 9,
                    alignment: 'left'
                },
                watermark: {
                    fontSize: 60,
                    color: '#f0f0f0',
                    alignment: 'center'
                }
            },
            background: function (_currentPage, pageSize) {
                const logoBase64 = getBase64Image('Coat_of_arms.png');
                if (logoBase64) {
                    return {
                        image: logoBase64,
                        width: 200,
                        height: 150,
                        alignment: 'center',
                        absolutePosition: { x: (pageSize.width - 200) / 2, y: (pageSize.height - 150) / 2 },
                        opacity: 0.1
                    };
                }
                return {
                    text: 'DAY LIGHT HIGH SCHOOL',
                    style: 'watermark',
                    absolutePosition: { x: 0, y: pageSize.height / 2 - 30 },
                    width: pageSize.width,
                    opacity: 0.1
                };
            },
            content: []
        };

        // Generate content for each student
        if (reportData && Array.isArray(reportData)) {
            console.log('Processing', reportData.length, 'students with enhanced layout');

            reportData.forEach((report, index) => {
                try {
                    console.log('Processing student', index + 1, 'with full layout');

                    if (index > 0) {
                        docDefinition.content.push({ text: '', pageBreak: 'before' });
                    }

                    // Print date (top-right)
                    docDefinition.content.push({
                        text: `Printed at ${new Date().toISOString().split('T')[0]}`,
                        fontSize: 8,
                        alignment: 'right',
                        margin: [0, 0, 0, 15]
                    });

                    // School Logo (centered)
                    const logoBase64 = getBase64Image('Coat_of_arms.png');
                    if (logoBase64) {
                        docDefinition.content.push({
                            image: logoBase64,
                            width: 70,
                            height: 55,
                            alignment: 'center',
                            margin: [0, 0, 0, 8]
                        });
                    }

                    // School Header
                    docDefinition.content.push({
                        text: (schoolInfo && schoolInfo.schoolName) || 'DAY LIGHT HIGH SCHOOL',
                        fontSize: 18,
                        bold: true,
                        alignment: 'center',
                        margin: [0, 0, 0, 3]
                    });

                    docDefinition.content.push({
                        text: 'EXCELLENCE IN EDUCATION',
                        fontSize: 10,
                        bold: true,
                        alignment: 'center',
                        margin: [0, 0, 0, 2]
                    });

                    docDefinition.content.push({
                        text: (schoolInfo && schoolInfo.schoolAddress) || '123 EDUCATION LANE, KNOWLEDGE CITY, 12345',
                        fontSize: 8,
                        alignment: 'center',
                        margin: [0, 0, 0, 15]
                    });

                    // Three-column header: Student Data | Academic Data | Position
                    const studentName = report.name || report.full_name || (report.student && report.student.name) || 'HADIZA LAWAL 1044';
                    const admissionNo = report.admissionNo || report.admission_number || (report.student && report.student.admissionNo) || 'AMB/21/1044';
                    const studentClass = report.class || report.class_name || (report.student && report.student.class) || 'PRIMARY 1';
                    const position = report.position || report.rank || '1';
                    const calculatedMarks = calculateAverageTotalMarks(report);

                    docDefinition.content.push({
                        table: {
                            widths: ['38%', '38%', '24%'],
                            body: [
                                // Headers
                                [
                                    {
                                        text: 'STUDENT DATA',
                                        fontSize: 9,
                                        bold: true,
                                        fillColor: '#4a5568',
                                        color: '#ffffff',
                                        alignment: 'center',
                                        margin: [0, 4, 0, 4]
                                    },
                                    {
                                        text: 'ACADEMIC DATA',
                                        fontSize: 9,
                                        bold: true,
                                        fillColor: '#4a5568',
                                        color: '#ffffff',
                                        alignment: 'center',
                                        margin: [0, 4, 0, 4]
                                    },
                                    {
                                        text: 'POSITION',
                                        fontSize: 9,
                                        bold: true,
                                        fillColor: '#4a5568',
                                        color: '#ffffff',
                                        alignment: 'center',
                                        margin: [0, 4, 0, 4]
                                    }
                                ],
                                // Content rows
                                [
                                    // Student Data column
                                    {
                                        stack: [
                                            {
                                                table: {
                                                    widths: ['40%', '60%'],
                                                    body: [
                                                        [
                                                            {
                                                                text: 'STUDENT NAME',
                                                                fontSize: 8,
                                                                bold: true,
                                                                margin: [3, 2, 3, 2]
                                                            },
                                                            {
                                                                text: studentName.toUpperCase(),
                                                                fontSize: 8,
                                                                margin: [3, 2, 3, 2]
                                                            }
                                                        ],
                                                        [
                                                            {
                                                                text: 'DATE OF BIRTH',
                                                                fontSize: 8,
                                                                bold: true,
                                                                margin: [3, 2, 3, 2]
                                                            },
                                                            {
                                                                text: report.dob || '07/11/1997',
                                                                fontSize: 8,
                                                                margin: [3, 2, 3, 2]
                                                            }
                                                        ],
                                                        [
                                                            {
                                                                text: 'GENDER',
                                                                fontSize: 8,
                                                                bold: true,
                                                                margin: [3, 2, 3, 2]
                                                            },
                                                            {
                                                                text: (report.gender || 'FEMALE').toUpperCase(),
                                                                fontSize: 8,
                                                                margin: [3, 2, 3, 2]
                                                            }
                                                        ]
                                                    ]
                                                },
                                                layout: 'noBorders'
                                            }
                                        ],
                                        margin: [4, 4, 4, 4]
                                    },
                                    // Academic Data column
                                    {
                                        stack: [
                                            {
                                                table: {
                                                    widths: ['45%', '55%'],
                                                    body: [
                                                        [
                                                            {
                                                                text: 'ADMISSION NUMBER',
                                                                fontSize: 8,
                                                                bold: true,
                                                                margin: [3, 2, 3, 2]
                                                            },
                                                            {
                                                                text: admissionNo,
                                                                fontSize: 8,
                                                                margin: [3, 2, 3, 2]
                                                            }
                                                        ],
                                                        [
                                                            {
                                                                text: 'CURRENT CLASS',
                                                                fontSize: 8,
                                                                bold: true,
                                                                margin: [3, 2, 3, 2]
                                                            },
                                                            {
                                                                text: studentClass.toUpperCase(),
                                                                fontSize: 8,
                                                                margin: [3, 2, 3, 2]
                                                            }
                                                        ],
                                                        [
                                                            {
                                                                text: 'CURRENT TERM',
                                                                fontSize: 8,
                                                                bold: true,
                                                                margin: [3, 2, 3, 2]
                                                            },
                                                            {
                                                                text: (termName || 'FIRST TERM').toUpperCase(),
                                                                fontSize: 8,
                                                                margin: [3, 2, 3, 2]
                                                            }
                                                        ],
                                                        [
                                                            {
                                                                text: 'CURRENT SESSION',
                                                                fontSize: 8,
                                                                bold: true,
                                                                margin: [3, 2, 3, 2]
                                                            },
                                                            {
                                                                text: sessionName || '2021/2022',
                                                                fontSize: 8,
                                                                margin: [3, 2, 3, 2]
                                                            }
                                                        ]
                                                    ]
                                                },
                                                layout: 'noBorders'
                                            }
                                        ],
                                        margin: [4, 4, 4, 4]
                                    },
                                    // Position column
                                    {
                                        text: String(position),
                                        fontSize: 50,
                                        bold: true,
                                        alignment: 'center',
                                        margin: [0, 15, 0, 15]
                                    }
                                ]
                            ]
                        },
                        layout: {
                            hLineWidth: function (i, node) {
                                return 1;
                            },
                            vLineWidth: function (i, node) {
                                return 1;
                            },
                            hLineColor: function (i, node) {
                                return '#000000';
                            },
                            vLineColor: function (i, node) {
                                return '#000000';
                            }
                        },
                        margin: [0, 0, 0, 10]
                    });

                    // Academic Results Table
                    const tableBody = [
                        [
                            {
                                text: 'SN',
                                fontSize: 9,
                                bold: true,
                                fillColor: '#4a5568',
                                color: '#ffffff',
                                alignment: 'center',
                                margin: [0, 3, 0, 3]
                            },
                            {
                                text: 'SUBJECT NAME',
                                fontSize: 9,
                                bold: true,
                                fillColor: '#4a5568',
                                color: '#ffffff',
                                alignment: 'center',
                                margin: [0, 3, 0, 3]
                            },
                            {
                                text: 'CA',
                                fontSize: 9,
                                bold: true,
                                fillColor: '#4a5568',
                                color: '#ffffff',
                                alignment: 'center',
                                margin: [0, 3, 0, 3]
                            },
                            {
                                text: 'EXAM',
                                fontSize: 9,
                                bold: true,
                                fillColor: '#4a5568',
                                color: '#ffffff',
                                alignment: 'center',
                                margin: [0, 3, 0, 3]
                            },
                            {
                                text: 'TOTAL',
                                fontSize: 9,
                                bold: true,
                                fillColor: '#4a5568',
                                color: '#ffffff',
                                alignment: 'center',
                                margin: [0, 3, 0, 3]
                            },
                            {
                                text: 'REMARK',
                                fontSize: 9,
                                bold: true,
                                fillColor: '#4a5568',
                                color: '#ffffff',
                                alignment: 'center',
                                margin: [0, 3, 0, 3]
                            }
                        ]
                    ];

                    // Add subject rows
                    if (report.subjects && Array.isArray(report.subjects)) {
                        report.subjects.forEach((subject, idx) => {
                            const subjectName = subject.name || subject.subject_name || 'N/A';
                            const ca = subject.ca || subject.ca_score || 0;
                            const exam = subject.exam || subject.exam_score || 0;
                            const total = subject.total || subject.total_marks || 0;
                            const remark = getRemark(parseFloat(total)).remark;

                            tableBody.push([
                                { text: String(idx + 1), fontSize: 9, alignment: 'center' },
                                { text: subjectName.toUpperCase(), fontSize: 9, alignment: 'left' },
                                { text: String(ca), fontSize: 9, alignment: 'center' },
                                { text: String(exam), fontSize: 9, alignment: 'center' },
                                { text: String(total), fontSize: 9, alignment: 'center', bold: true },
                                { text: remark, fontSize: 9, alignment: 'center' }
                            ]);
                        });
                    }

                    // Add the TOTAL MARKS and AVERAGE row as part of the same table
                    tableBody.push([
                        { text: '', fontSize: 9, alignment: 'center' }, // Empty SN
                        { text: '', fontSize: 9, alignment: 'center' }, // Empty Subject Name
                        {
                            text: 'TOTAL MARKS',
                            fontSize: 9,
                            bold: true,
                            fillColor: '#4a5568',
                            color: '#ffffff',
                            alignment: 'center',
                            margin: [0, 3, 0, 3]
                        },
                        {
                            text: calculatedMarks.total,
                            fontSize: 12,
                            bold: true,
                            alignment: 'center',
                            margin: [0, 3, 0, 3]
                        },
                        {
                            text: 'AVERAGE',
                            fontSize: 9,
                            bold: true,
                            fillColor: '#4a5568',
                            color: '#ffffff',
                            alignment: 'center',
                            margin: [0, 3, 0, 3]
                        },
                        {
                            text: calculatedMarks.average,
                            fontSize: 12,
                            bold: true,
                            alignment: 'center',
                            margin: [0, 3, 0, 3]
                        }
                    ]);

                    docDefinition.content.push({
                        table: {
                            headerRows: 1,
                            widths: [25, '*', 40, 50, 50, 70],
                            body: tableBody
                        },
                        layout: {
                            hLineWidth: function (i, node) {
                                return 1;
                            },
                            vLineWidth: function (i, node) {
                                return 1;
                            },
                            hLineColor: function (i, node) {
                                return '#000000';
                            },
                            vLineColor: function (i, node) {
                                return '#000000';
                            }
                        },
                        margin: [0, 0, 0, 15]
                    });

                    // Scores Breakdown with QR Code
                    docDefinition.content.push({
                        columns: [
                            {
                                width: '60%',
                                stack: [
                                    {
                                        text: 'SCORES BREAK DOWN',
                                        fontSize: 10,
                                        bold: true,
                                        margin: [0, 0, 0, 8]
                                    },
                                    {
                                        table: {
                                            widths: [25, 40, 40, '*'],
                                            body: [
                                                [
                                                    {
                                                        text: 'SN',
                                                        fontSize: 9,
                                                        bold: true,
                                                        fillColor: '#4a5568',
                                                        color: '#ffffff',
                                                        alignment: 'center'
                                                    },
                                                    {
                                                        text: 'SCORES',
                                                        fontSize: 9,
                                                        bold: true,
                                                        fillColor: '#4a5568',
                                                        color: '#ffffff',
                                                        alignment: 'center',
                                                        colSpan: 2
                                                    },
                                                    {},
                                                    {
                                                        text: 'REMARK',
                                                        fontSize: 9,
                                                        bold: true,
                                                        fillColor: '#4a5568',
                                                        color: '#ffffff',
                                                        alignment: 'center'
                                                    }
                                                ],
                                                [
                                                    { text: '1', fontSize: 9, alignment: 'center' },
                                                    { text: '0', fontSize: 9, alignment: 'center' },
                                                    { text: '40', fontSize: 9, alignment: 'center' },
                                                    { text: 'Fail', fontSize: 9, alignment: 'center' }
                                                ],
                                                [
                                                    { text: '2', fontSize: 9, alignment: 'center' },
                                                    { text: '40', fontSize: 9, alignment: 'center' },
                                                    { text: '50', fontSize: 9, alignment: 'center' },
                                                    { text: 'Poor', fontSize: 9, alignment: 'center' }
                                                ],
                                                [
                                                    { text: '3', fontSize: 9, alignment: 'center' },
                                                    { text: '50', fontSize: 9, alignment: 'center' },
                                                    { text: '60', fontSize: 9, alignment: 'center' },
                                                    { text: 'Fair', fontSize: 9, alignment: 'center' }
                                                ],
                                                [
                                                    { text: '4', fontSize: 9, alignment: 'center' },
                                                    { text: '60', fontSize: 9, alignment: 'center' },
                                                    { text: '70', fontSize: 9, alignment: 'center' },
                                                    { text: 'Good', fontSize: 9, alignment: 'center' }
                                                ],
                                                [
                                                    { text: '5', fontSize: 9, alignment: 'center' },
                                                    { text: '70', fontSize: 9, alignment: 'center' },
                                                    { text: '75', fontSize: 9, alignment: 'center' },
                                                    { text: 'Very Good', fontSize: 9, alignment: 'center' }
                                                ],
                                                [
                                                    { text: '6', fontSize: 9, alignment: 'center' },
                                                    { text: '75', fontSize: 9, alignment: 'center' },
                                                    { text: '100', fontSize: 9, alignment: 'center' },
                                                    { text: 'Excellent', fontSize: 9, alignment: 'center' }
                                                ]
                                            ]
                                        },
                                        layout: {
                                            hLineWidth: function (i, node) {
                                                return 1;
                                            },
                                            vLineWidth: function (i, node) {
                                                return 1;
                                            },
                                            hLineColor: function (i, node) {
                                                return '#000000';
                                            },
                                            vLineColor: function (i, node) {
                                                return '#000000';
                                            }
                                        }
                                    }
                                ]
                            },
                            {
                                width: '40%',
                                qr: `Student Name: ${studentName}\nClass: ${studentClass}\nPosition: ${position}`,
                                fit: 100,
                                alignment: 'center',
                                margin: [20, 20, 0, 0]
                            }
                        ]
                    });

                    console.log('Student', index + 1, 'processed successfully with full layout');

                } catch (studentError) {
                    console.error('Error processing student', index + 1, ':', studentError);
                    docDefinition.content.push({
                        text: `Error processing student ${index + 1}: ${studentError.message}`,
                        margin: [0, 20, 0, 20]
                    });
                }
            });
        } else {
            console.log('No valid report data provided');
            docDefinition.content.push({
                text: 'No report data available',
                alignment: 'center',
                margin: [0, 50, 0, 50]
            });
        }

        console.log('Enhanced PDF definition created successfully');
        return docDefinition;

    } catch (error) {
        console.error('Error creating enhanced PDF definition:', error);
        throw error;
    }
};

const generatePdfMakePDF = async (req, res) => {
    try {
        console.log('=== Starting Enhanced PDF generation ===');
        console.log('Request body keys:', Object.keys(req.body));

        const { reportData, schoolInfo, termName, sessionName } = req.body;

        console.log('Report data type:', typeof reportData);
        console.log('Report data is array:', Array.isArray(reportData));
        console.log('Report data length:', reportData ? reportData.length : 'undefined');

        if (!reportData) {
            console.log('No report data provided');
            return res.status(400).json({
                success: false,
                message: 'Report data is required'
            });
        }

        if (!Array.isArray(reportData)) {
            console.log('Report data is not an array:', typeof reportData);
            return res.status(400).json({
                success: false,
                message: 'Report data must be an array'
            });
        }

        if (reportData.length === 0) {
            console.log('Report data array is empty');
            return res.status(400).json({
                success: false,
                message: 'Report data array is empty'
            });
        }

        console.log('Creating enhanced PDF definition...');
        const docDefinition = createReportCardPDF(
            reportData,
            schoolInfo || {},
            termName || 'Current Term',
            sessionName || 'Current Session'
        );

        console.log('Enhanced PDF definition created, creating printer...');
        const printer = new PdfPrinter(fonts);

        console.log('Creating enhanced PDF document...');
        const pdfDoc = printer.createPdfKitDocument(docDefinition);

        const chunks = [];
        let chunkCount = 0;

        pdfDoc.on('data', (chunk) => {
            chunks.push(chunk);
            chunkCount++;
            if (chunkCount % 10 === 0) {
                console.log('Received', chunkCount, 'chunks');
            }
        });

        pdfDoc.on('end', () => {
            try {
                console.log('Enhanced PDF generation completed, total chunks:', chunkCount);
                const pdfBuffer = Buffer.concat(chunks);
                console.log('Enhanced PDF buffer size:', pdfBuffer.length, 'bytes');

                res.setHeader('Content-Type', 'application/pdf');
                res.setHeader('Content-Disposition', 'attachment; filename=report-cards-enhanced.pdf');
                res.setHeader('Content-Length', pdfBuffer.length);

                console.log('Sending enhanced PDF response...');
                res.send(pdfBuffer);
                console.log('Enhanced PDF sent successfully');

            } catch (endError) {
                console.error('Error in enhanced PDF end event:', endError);
                if (!res.headersSent) {
                    res.status(500).json({
                        success: false,
                        message: 'Failed to finalize enhanced PDF',
                        error: endError.message
                    });
                }
            }
        });

        pdfDoc.on('error', (error) => {
            console.error('Enhanced PDF document error:', error);
            if (!res.headersSent) {
                res.status(500).json({
                    success: false,
                    message: 'Enhanced PDF generation failed',
                    error: error.message
                });
            }
        });

        console.log('Starting enhanced PDF document generation...');
        pdfDoc.end();

    } catch (error) {
        console.error('=== Enhanced PDF Generation Error ===');
        console.error('Error type:', error.constructor.name);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);

        if (!res.headersSent) {
            res.status(500).json({
                success: false,
                message: 'Failed to generate enhanced PDF',
                error: error.message,
                stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
            });
        }
    }
};

module.exports = {
    generatePdfMakePDF
};