const { Parser } = require('json2csv');
const fs = require('fs');
const path = require('path');

/**
 * Export student data as CSV
 * @param {Array} studentsData - Array of student objects
 * @param {Object} options - Export options
 * @param {string} options.filename - Output filename
 * @param {boolean} options.includePerformance - Include performance summary
 * @returns {Promise<string>} - CSV string or file path
 */
async function exportStudentsToCSV(studentsData, options = {}) {
    try {
        const {
            filename = `students_results_${new Date().toISOString().split('T')[0]}.csv`,
            includePerformance = true,
            returnAsFile = false
        } = options;

        // Prepare data for CSV
        const csvData = prepareCSVData(studentsData, includePerformance);
        
        // Define CSV fields
        const fields = getCSVFields(studentsData, includePerformance);
        
        // Create CSV parser
        const json2csvParser = new Parser({ fields });
        const csv = json2csvParser.parse(csvData);
        
        if (returnAsFile) {
            // Save to file
            const filePath = path.join(__dirname, 'exports', filename);
            const dirPath = path.dirname(filePath);
            
            // Ensure directory exists
            if (!fs.existsSync(dirPath)) {
                fs.mkdirSync(dirPath, { recursive: true });
            }
            
            fs.writeFileSync(filePath, csv, 'utf8');
            return filePath;
        }
        
        return csv;
    } catch (error) {
        console.error('Error exporting CSV:', error);
        throw error;
    }
}

/**
 * Prepare data for CSV export
 */
function prepareCSVData(studentsData, includePerformance = true) {
    if (!Array.isArray(studentsData)) {
        studentsData = [studentsData];
    }
    
    return studentsData.map((student, index) => {
        const row = {
            SN: index + 1,
            'Student Name': student.student.full_name,
            'Admission Number': student.student.admission_number,
            'Gender': student.student.gender,
            'Class': student.class.name,
            'Term': student.current_term.name,
            'Session': student.session.name
        };
        
        // Add subject columns
        if (student.subjects && student.subjects.length > 0) {
            // Sort subjects by name for consistent column order
            const sortedSubjects = [...student.subjects].sort((a, b) => 
                a.name.localeCompare(b.name)
            );
            
            sortedSubjects.forEach(subject => {
                const safeSubjectName = subject.name.replace(/[^\w\s]/gi, '');
                row[`${safeSubjectName} CA`] = subject.ca_1_score || '';
                row[`${safeSubjectName} Exam`] = subject.exam_score || '';
                row[`${safeSubjectName} Total`] = subject.total || '';
                row[`${safeSubjectName} Grade`] = subject.grade || '';
            });
        }
        
        // Add performance columns if requested
        if (includePerformance && student.performance) {
            row['Total Marks'] = student.performance.mark_obtained;
            row['Obtainable Marks'] = student.performance.mark_obtainable;
            row['Total Subjects'] = student.performance.total_subjects;
            row['Average'] = student.performance.average.toFixed(2);
            row['Position'] = student.performance.position;
            row['Display Position'] = student.performance.display_position || '';
        }
        
        return row;
    });
}

/**
 * Get CSV fields dynamically based on subjects
 */
function getCSVFields(studentsData, includePerformance = true) {
    const baseFields = [
        { label: 'SN', value: 'SN' },
        { label: 'Student Name', value: 'Student Name' },
        { label: 'Admission Number', value: 'Admission Number' },
        { label: 'Gender', value: 'Gender' },
        { label: 'Class', value: 'Class' },
        { label: 'Term', value: 'Term' },
        { label: 'Session', value: 'Session' }
    ];
    
    // Get all unique subjects from all students
    const allSubjects = new Set();
    if (Array.isArray(studentsData)) {
        studentsData.forEach(student => {
            if (student.subjects && student.subjects.length > 0) {
                student.subjects.forEach(subject => {
                    allSubjects.add(subject.name);
                });
            }
        });
    } else if (studentsData.subjects) {
        studentsData.subjects.forEach(subject => {
            allSubjects.add(subject.name);
        });
    }
    
    // Sort subjects alphabetically
    const sortedSubjects = Array.from(allSubjects).sort();
    
    // Add subject columns (CA, Exam, Total, Grade)
    sortedSubjects.forEach(subjectName => {
        const safeSubjectName = subjectName.replace(/[^\w\s]/gi, '');
        baseFields.push({ 
            label: `${safeSubjectName} CA`, 
            value: `${safeSubjectName} CA` 
        });
        baseFields.push({ 
            label: `${safeSubjectName} Exam`, 
            value: `${safeSubjectName} Exam` 
        });
        baseFields.push({ 
            label: `${safeSubjectName} Total`, 
            value: `${safeSubjectName} Total` 
        });
        baseFields.push({ 
            label: `${safeSubjectName} Grade`, 
            value: `${safeSubjectName} Grade` 
        });
    });
    
    // Add performance fields
    if (includePerformance) {
        baseFields.push(
            { label: 'Total Marks', value: 'Total Marks' },
            { label: 'Obtainable Marks', value: 'Obtainable Marks' },
            { label: 'Total Subjects', value: 'Total Subjects' },
            { label: 'Average', value: 'Average' },
            { label: 'Position', value: 'Position' },
            { label: 'Display Position', value: 'Display Position' }
        );
    }
    
    return baseFields;
}

/**
 * Alternative simple CSV generator without json2csv dependency
 */
function generateSimpleCSV(studentsData, options = {}) {
    const { includePerformance = true } = options;
    
    if (!Array.isArray(studentsData)) {
        studentsData = [studentsData];
    }
    
    // Get all unique subjects
    const allSubjects = new Set();
    studentsData.forEach(student => {
        if (student.subjects && student.subjects.length > 0) {
            student.subjects.forEach(subject => {
                allSubjects.add(subject.name);
            });
        }
    });
    
    const sortedSubjects = Array.from(allSubjects).sort();
    
    // Create headers
    const headers = [
        'SN',
        'Student Name',
        'Admission Number',
        'Gender',
        'Class',
        'Term',
        'Session'
    ];
    
    // Add subject headers
    sortedSubjects.forEach(subject => {
        const safeSubjectName = subject.replace(/[^\w\s]/gi, '');
        headers.push(`${safeSubjectName} CA`);
        headers.push(`${safeSubjectName} Exam`);
        headers.push(`${safeSubjectName} Total`);
    });
    
    // Add performance headers
    if (includePerformance) {
        headers.push('Total Marks');
        headers.push('Average');
        headers.push('Position');
        headers.push('Display Position');
    }
    
    // Create rows
    const rows = studentsData.map((student, index) => {
        const row = [
            index + 1, // SN
            student.student.full_name,
            student.student.admission_number,
            student.student.gender,
            student.class.name,
            student.current_term.name,
            student.session.name
        ];
        
        // Add subject data
        sortedSubjects.forEach(subjectName => {
            const subject = student.subjects?.find(s => s.name === subjectName);
            if (subject) {
                row.push(subject.ca_1_score || '');
                row.push(subject.exam_score || '');
                row.push(subject.total || '');
            } else {
                row.push('', '', '');
            }
        });
        
        // Add performance data
        if (includePerformance && student.performance) {
            row.push(student.performance.mark_obtained);
            row.push(student.performance.average.toFixed(2));
            row.push(student.performance.position);
            row.push(student.performance.display_position || '');
        }
        
        return row;
    });
    
    // Convert to CSV string
    const csvContent = [
        headers.join(','),
        ...rows.map(row => 
            row.map(cell => 
                `"${String(cell).replace(/"/g, '""')}"`
            ).join(',')
        )
    ].join('\n');
    
    return csvContent;
}

/**
 * Express route handler for CSV download
 */
async function downloadCSVResults(req, res) {
    try {
        const { studentsData } = req.body; // Assuming data is sent in request body
        const { includePerformance = true } = req.query;
        
        if (!studentsData) {
            return res.status(400).json({
                status: 'error',
                message: 'Student data is required'
            });
        }
        
        // Generate CSV
        const csvContent = generateSimpleCSV(studentsData, { includePerformance });
        
        // Set headers for file download
        const filename = `student_results_${new Date().toISOString().split('T')[0]}.csv`;
        
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.status(200).send(csvContent);
        
    } catch (error) {
        console.error('Error generating CSV:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to generate CSV file',
            error: error.message
        });
    }
}

// Usage examples:

// Example 1: Using json2csv (install: npm install json2csv)
/*
const students = [studentData1, studentData2]; // Your array of student data
exportStudentsToCSV(students, {
    filename: 'student_results.csv',
    includePerformance: true,
    returnAsFile: true
}).then(filePath => {
    console.log('CSV saved to:', filePath);
}).catch(console.error);
*/

// Example 2: Using simple CSV generator (no dependencies)
/*
const csvString = generateSimpleCSV(studentData, { includePerformance: true });
console.log(csvString);

// Save to file
const fs = require('fs');
fs.writeFileSync('student_results.csv', csvString, 'utf8');
*/

// Example 3: Express route usage
/*
router.post('/export-csv', downloadCSVResults);
*/

module.exports = {
    exportStudentsToCSV,
    generateSimpleCSV,
    downloadCSVResults,
    prepareCSVData,
    getCSVFields
};