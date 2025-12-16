const { generateModernPdfMakePDF } = require('./src/controllers/pdfController');
const fs = require('fs');

// Mock request and response objects
const mockReq = {
  body: {
    reportData: [
      {
        student: {
          name: 'Jane Smith',
          admissionNo: 'ADM002',
          class: 'Grade 11'
        },
        subjects: [
          {
            name: 'Mathematics',
            ca: 28,
            exam: 68,
            total: 96,
            grade: 'A',
            remark: 'Excellent'
          },
          {
            name: 'English Language',
            ca: 26,
            exam: 62,
            total: 88,
            grade: 'A',
            remark: 'Very Good'
          },
          {
            name: 'Physics',
            ca: 24,
            exam: 58,
            total: 82,
            grade: 'A',
            remark: 'Very Good'
          },
          {
            name: 'Chemistry',
            ca: 22,
            exam: 55,
            total: 77,
            grade: 'B',
            remark: 'Good'
          },
          {
            name: 'Biology',
            ca: 25,
            exam: 60,
            total: 85,
            grade: 'A',
            remark: 'Very Good'
          }
        ],
        totalMarks: 428,
        maxMarks: 500,
        average: 85.6,
        position: 2,
        totalStudents: 35,
        attendance: {
          totalDays: 95,
          present: 92,
          absent: 3,
          rate: '96.8'
        },
        teacherComment: 'Jane is a dedicated student who consistently performs well across all subjects. Her analytical skills in Mathematics and Sciences are particularly impressive.',
        principalComment: 'Excellent academic performance. Jane demonstrates leadership qualities and is a role model for other students. Keep up the outstanding work!',
        nextTermDate: '15th January, 2025'
      }
    ],
    schoolInfo: {
      schoolName: 'Modern Excellence Academy',
      schoolAddress: '456 Innovation Drive, Tech City, State 12345'
    },
    termName: 'Second Term',
    sessionName: '2024/2025'
  }
};

const mockRes = {
  setHeader: (name, value) => {
    console.log(`Header set: ${name} = ${value}`);
  },
  send: (buffer) => {
    console.log('✅ Modern PDF generated successfully!');
    console.log(`PDF size: ${buffer.length} bytes`);
    
    // Save the PDF to test
    fs.writeFileSync('test-modern-pdfmake-output.pdf', buffer);
    console.log('✅ Modern PDF saved as test-modern-pdfmake-output.pdf');
  },
  status: (code) => ({
    json: (data) => {
      console.log(`❌ Error ${code}:`, data);
    }
  })
};

console.log('Testing Modern Style pdfmake PDF generation...');
generateModernPdfMakePDF(mockReq, mockRes);