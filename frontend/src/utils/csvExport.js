// utils/csvExport.js

/**
 * Generate CSV with subjects grouped into CA, Exam, Total columns
 * @param {Array} studentsData - Array of student objects
 * @returns {string} - CSV string with formatted headers
 */
export function generateStudentCSV(studentsData) {
  if (!Array.isArray(studentsData) || studentsData.length === 0) {
    throw new Error('No student data available for export');
  }

  // Get all unique subjects sorted alphabetically
  const allSubjects = getAllUniqueSubjects(studentsData);
  
  // Generate headers with subject groupings
  const headers = generateFormattedHeaders(allSubjects);
  
  // Generate data rows
  const dataRows = generateDataRows(studentsData, allSubjects);
  
  // Combine headers and data rows
  return [...headers, ...dataRows].join('\n');
}

/**
 * Get all unique subjects from student data
 */
function getAllUniqueSubjects(studentsData) {
  const subjectSet = new Set();
  
  studentsData.forEach(student => {
    if (student.subjects && student.subjects.length > 0) {
      student.subjects.forEach(subject => {
        subjectSet.add(subject.name);
      });
    }
  });
  
  // Sort subjects alphabetically
  return Array.from(subjectSet).sort((a, b) => a.localeCompare(b));
}

/**
 * Generate formatted headers with subject groupings
 */
function generateFormattedHeaders(allSubjects) {
  // First row: Main headers and subject names
  const headerRow1 = [
    'SN',
    'STUDENT NAMES',
    'ADMISSION NO',
    'GENDER',
    'CLASS',
    'TERM',
    'SESSION'
  ];
  
  // Add subject names spanning 3 columns each
  allSubjects.forEach(subjectName => {
    const cleanName = cleanSubjectName(subjectName);
    headerRow1.push(cleanName, '', '');
  });
  
  // Add summary headers
  headerRow1.push('TOTAL MARKS', 'AVERAGE', 'POSITION', 'DISPLAY POSITION');
  
  // Second row: Sub-headers for each subject (CA, Exam, Total)
  const headerRow2 = [
    '', // SN
    '', // STUDENT NAMES
    '', // ADMISSION NO
    '', // GENDER
    '', // CLASS
    '', // TERM
    '', // SESSION
  ];
  
  // Add CA, Exam, Total for each subject
  allSubjects.forEach(() => {
    headerRow2.push('CA', 'EXAM', 'TOTAL');
  });
  
  // Empty cells for summary columns
  headerRow2.push('', '', '', '');
  
  return [
    headerRow1.map(header => escapeCSV(header)).join(','),
    headerRow2.map(header => escapeCSV(header)).join(',')
  ];
}

/**
 * Generate data rows for each student
 */
function generateDataRows(studentsData, allSubjects) {
  return studentsData.map((student, index) => {
    const row = [
      index + 1, // SN
      student.student.full_name,
      student.student.admission_number,
      student.student.gender,
      student.class.name,
      student.current_term.name,
      student.session.name
    ];
    
    // Add subject scores for each subject in order
    allSubjects.forEach(subjectName => {
      const subject = student.subjects?.find(s => s.name === subjectName);
      
      if (subject) {
        row.push(
          subject.ca_1_score || '',
          subject.exam_score || '',
          subject.total || ''
        );
      } else {
        // Empty cells for missing subjects
        row.push('', '', '');
      }
    });
    
    // Add performance data
    if (student.performance) {
      row.push(
        student.performance.mark_obtained,
        student.performance.average.toFixed(2),
        student.performance.position,
        student.performance.display_position || ''
      );
    }
    
    return row.map(cell => escapeCSV(cell)).join(',');
  });
}

/**
 * Clean subject name for CSV headers
 */
function cleanSubjectName(name) {
  return name
    .replace(/[^\w\s]/gi, '') // Remove special characters
    .toUpperCase();
}

/**
 * Escape CSV values properly
 */
function escapeCSV(value) {
  if (value === null || value === undefined) {
    return '';
  }
  
  const stringValue = String(value);
  
  // Check if value contains commas, quotes, or newlines
  if (
    stringValue.includes(',') ||
    stringValue.includes('"') ||
    stringValue.includes('\n') ||
    stringValue.includes('\r')
  ) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  
  return stringValue;
}

/**
 * Download CSV file
 */
export function downloadCSV(csvContent, filename = 'student_results.csv') {
  // Add BOM for UTF-8 to support Excel
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csvContent], {
    type: 'text/csv;charset=utf-8;'
  });
  
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  link.href = url;
  link.download = filename;
  link.style.display = 'none';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up
  setTimeout(() => URL.revokeObjectURL(url), 100);
}

/**
 * Generate CSV with alternative format (simpler headers)
 */
export function generateSimpleCSV(studentsData) {
  const allSubjects = getAllUniqueSubjects(studentsData);
  
  // Create headers
  const headers = [
    'SN',
    'STUDENT NAMES',
    'ADMISSION NO',
    'GENDER',
    'CLASS',
    'TERM',
    'SESSION'
  ];
  
  // Add subject columns with CA, Exam, Total
  allSubjects.forEach(subjectName => {
    const cleanName = cleanSubjectName(subjectName);
    headers.push(`${cleanName} CA`, `${cleanName} EXAM`, `${cleanName} TOTAL`);
  });
  
  // Add summary columns
  headers.push('TOTAL MARKS', 'AVERAGE', 'POSITION');
  
  // Create rows
  const rows = studentsData.map((student, index) => {
    const row = [
      index + 1,
      student.student.full_name,
      student.student.admission_number,
      student.student.gender,
      student.class.name,
      student.current_term.name,
      student.session.name
    ];
    
    // Add subject data
    allSubjects.forEach(subjectName => {
      const subject = student.subjects?.find(s => s.name === subjectName);
      if (subject) {
        row.push(
          subject.ca_1_score || '',
          subject.exam_score || '',
          subject.total || ''
        );
      } else {
        row.push('', '', '');
      }
    });
    
    // Add performance data
    if (student.performance) {
      row.push(
        student.performance.mark_obtained,
        student.performance.average.toFixed(2),
        student.performance.position
      );
    }
    
    return row;
  });
  
  // Convert to CSV string
  return [
    headers.map(header => escapeCSV(header)).join(','),
    ...rows.map(row => row.map(cell => escapeCSV(cell)).join(','))
  ].join('\n');
}