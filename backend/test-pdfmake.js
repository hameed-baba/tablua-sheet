const { generatePdfMakePDF } = require('./src/controllers/pdfController');
const fs = require('fs');

// Mock request and response objects
const mockReq = {
  body: {
    reportData: [
      {
        student: {
          name: 'John Doe',
          admissionNo: 'ADM001',
          class: 'Grade 10'
        },
        subjects: [
          {
            name: 'Mathematics',
            ca: 25,
            exam: 65,
            total: 90,
            grade: 'A',
            remark: 'Excellent'
          },
          {
            name: 'English',
            ca: 28,
            exam: 60,
            total: 88,
            grade: 'A',
            remark: 'Excellent'
          },
          {
            name: 'Physics',
            ca: 22,
            exam: 58,
            total: 80,
            grade: 'A',
            remark: 'Excellent'
          }
        ],
        totalMarks: 258,
        maxMarks: 300,
        average: 86,
        position: 1,
        totalStudents: 30,
        attendance: {
          totalDays: 90,
          present: 88,
          absent: 2,
          rate: '97.8'
        },
        teacherComment: 'Excellent performance throughout the term. Keep up the good work!',
        principalComment: 'Outstanding student. Continue to maintain this excellent standard.',
        nextTermDate: '15th January, 2025'
      }
    ],
    schoolInfo: {
      schoolName: 'Test School',
      schoolAddress: '123 Test Street, Test City'
    },
    termName: 'First Term',
    sessionName: '2024/2025'
  }
};

let pdfBuffer = Buffer.alloc(0);

const mockRes = {
  setHeader: (name, value) => {
    console.log(`Header set: ${name} = ${value}`);
  },
  send: (buffer) => {
    console.log('✅ PDF generated successfully!');
    console.log(`PDF size: ${buffer.length} bytes`);
    
    // Save the PDF to test
    fs.writeFileSync('test-pdfmake-output.pdf', buffer);
    console.log('✅ PDF saved as test-pdfmake-output.pdf');
  },
  status: (code) => ({
    json: (data) => {
      console.log(`❌ Error ${code}:`, data);
    }
  })
};

console.log('Testing pdfmake PDF generation...');
generatePdfMakePDF(mockReq, mockRes);