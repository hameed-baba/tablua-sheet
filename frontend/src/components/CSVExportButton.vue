<template>
  <div>
    <!-- Export Button -->
    <button 
      @click="exportToCSV" 
      class="export-btn"
      :disabled="isExporting"
    >
      <span v-if="isExporting">
        <i class="fas fa-spinner fa-spin"></i> Exporting...
      </span>
      <span v-else>
        <i class="fas fa-download"></i> Export to CSV
      </span>
    </button>
    
    <!-- Optional: Progress Indicator -->
    <div v-if="isExporting" class="export-progress">
      <div class="progress-bar" :style="{ width: exportProgress + '%' }"></div>
    </div>
    
    <!-- Optional: Error/Success Messages -->
    <div v-if="exportMessage" :class="['export-message', exportStatus]">
      {{ exportMessage }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'CSVExportButton',
  props: {
    studentsData: {
      type: Array,
      required: true,
      default: () => []
    },
    includePerformance: {
      type: Boolean,
      default: true
    },
    includeGrades: {
      type: Boolean,
      default: true
    },
    filename: {
      type: String,
      default: 'student_results'
    }
  },
  data() {
    return {
      isExporting: false,
      exportProgress: 0,
      exportMessage: '',
      exportStatus: '' // 'success' or 'error'
    }
  },
  methods: {
    async exportToCSV() {
      try {
        this.isExporting = true;
        this.exportProgress = 0;
        this.exportMessage = '';
        this.exportStatus = '';
        
        // Simulate progress for large datasets
        if (this.studentsData.length > 50) {
          this.exportProgress = 30;
        }
        
        // Generate CSV content
        const csvContent = this.generateCSVContent();
        this.exportProgress = 70;
        
        // Create and download the file
        this.downloadCSVFile(csvContent);
        this.exportProgress = 100;
        
        // Show success message
        this.exportMessage = `CSV exported successfully! ${this.studentsData.length} records processed.`;
        this.exportStatus = 'success';
        
        // Emit event for parent component
        this.$emit('export-complete', {
          success: true,
          count: this.studentsData.length,
          filename: this.getFullFilename()
        });
        
      } catch (error) {
        console.error('Export failed:', error);
        this.exportMessage = `Export failed: ${error.message}`;
        this.exportStatus = 'error';
        
        this.$emit('export-error', error);
        
      } finally {
        // Reset progress after delay
        setTimeout(() => {
          this.isExporting = false;
          this.exportProgress = 0;
        }, 2000);
      }
    },
    
    generateCSVContent() {
      if (!Array.isArray(this.studentsData) || this.studentsData.length === 0) {
        throw new Error('No student data available for export');
      }
      
      // Get all unique subjects from all students
      const allSubjects = this.getAllUniqueSubjects();
      
      // Create headers
      const headers = this.generateHeaders(allSubjects);
      
      // Create data rows
      const rows = this.studentsData.map((student, index) => {
        return this.generateStudentRow(student, index, allSubjects);
      });
      
      // Combine headers and rows
      return [headers, ...rows].join('\n');
    },
    
    getAllUniqueSubjects() {
      const subjectSet = new Set();
      
      this.studentsData.forEach(student => {
        if (student.subjects && student.subjects.length > 0) {
          student.subjects.forEach(subject => {
            subjectSet.add(subject.name);
          });
        }
      });
      
      // Sort alphabetically for consistent column order
      return Array.from(subjectSet).sort((a, b) => a.localeCompare(b));
    },
    
    generateHeaders(allSubjects) {
      const baseHeaders = [
        'SN',
        'STUDENT NAMES',
        'ADMISSION NO',
        'GENDER',
        'CLASS',
        'TERM',
        'SESSION'
      ];
      
      // Add subject columns (CA, EXAM, TOTAL for each subject)
      const subjectHeaders = [];
      allSubjects.forEach(subjectName => {
        const safeName = this.sanitizeColumnName(subjectName);
        subjectHeaders.push(`${safeName}_CA`, `${safeName}_EXAM`, `${safeName}_TOTAL`);
        
        if (this.includeGrades) {
          subjectHeaders.push(`${safeName}_GRADE`);
        }
      });
      
      // Add performance headers
      const performanceHeaders = [];
      if (this.includePerformance) {
        performanceHeaders.push('TOTAL_MARKS', 'AVERAGE', 'POSITION', 'DISPLAY_POSITION');
      }
      
      // Combine all headers
      return [...baseHeaders, ...subjectHeaders, ...performanceHeaders]
        .map(header => this.escapeCSV(header))
        .join(',');
    },
    
    generateStudentRow(student, index, allSubjects) {
      const rowData = [
        index + 1, // SN
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
          rowData.push(
            subject.ca_1_score || '',
            subject.exam_score || '',
            subject.total || ''
          );
          
          if (this.includeGrades) {
            rowData.push(subject.grade || '');
          }
        } else {
          // Empty cells for missing subjects
          rowData.push('', '', '');
          if (this.includeGrades) {
            rowData.push('');
          }
        }
      });
      
      // Add performance data
      if (this.includePerformance && student.performance) {
        rowData.push(
          student.performance.mark_obtained,
          student.performance.average.toFixed(2),
          student.performance.position,
          student.performance.display_position || ''
        );
      }
      
      // Escape and join row data
      return rowData.map(cell => this.escapeCSV(cell)).join(',');
    },
    
    sanitizeColumnName(name) {
      // Remove special characters and convert to uppercase
      return name
        .replace(/[^\w\s]/gi, '')
        .replace(/\s+/g, '_')
        .toUpperCase();
    },
    
    escapeCSV(value) {
      if (value === null || value === undefined) {
        return '';
      }
      
      const stringValue = String(value);
      
      // Escape double quotes and wrap in quotes if contains commas, quotes, or newlines
      if (stringValue.includes(',') || 
          stringValue.includes('"') || 
          stringValue.includes('\n') || 
          stringValue.includes('\r')) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }
      
      return stringValue;
    },
    
    downloadCSVFile(csvContent) {
      // Create blob
      const blob = new Blob(['\uFEFF' + csvContent], { 
        type: 'text/csv;charset=utf-8;' 
      });
      
      // Create download link
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', this.getFullFilename());
      link.style.visibility = 'hidden';
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 100);
    },
    
    getFullFilename() {
      const timestamp = new Date().toISOString().split('T')[0];
      return `${this.filename}_${timestamp}.csv`;
    },
    
    // Alternative: Export with Excel format (XLSX)
    exportToExcel() {
      // This would require xlsx library
      console.log('Excel export requires xlsx library');
      // Implement with: import * as XLSX from 'xlsx';
    }
  }
}
</script>

<style scoped>
.export-btn {
  background-color: #4CAF50;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: background-color 0.3s;
}

.export-btn:hover:not(:disabled) {
  background-color: #45a049;
}

.export-btn:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
  opacity: 0.7;
}

.export-progress {
  margin-top: 10px;
  width: 200px;
  height: 4px;
  background-color: #f0f0f0;
  border-radius: 2px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background-color: #4CAF50;
  transition: width 0.3s ease;
}

.export-message {
  margin-top: 10px;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 14px;
}

.export-message.success {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.export-message.error {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}
</style>