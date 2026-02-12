<template>
  <div>
    <!-- Export Button with Options -->
    <div class="export-section">
      <div class="export-options">
        <label class="option-item">
          <input type="checkbox" v-model="includePerformance" />
          <span>Include Performance Summary</span>
        </label>
        
        <label class="option-item">
          <input type="checkbox" v-model="formatForExcel" />
          <span>Format for Excel</span>
        </label>
        
        <div class="filename-input">
          <label>Filename:</label>
          <input 
            type="text" 
            v-model="filename" 
            placeholder="student_results"
          />
          <span class="file-ext">.csv</span>
        </div>
      </div>
      
      <div class="export-buttons">
        <button 
          @click="exportAllStudents"
          class="btn-export btn-export-all"
          :disabled="isExporting"
        >
          <span v-if="isExporting">
            <i class="fas fa-spinner fa-spin"></i> Exporting...
          </span>
          <span v-else>
            <i class="fas fa-download"></i> Export All Students
          </span>
        </button>
        
        <button 
          v-if="selectedStudents.length > 0"
          @click="exportSelectedStudents"
          class="btn-export btn-export-selected"
        >
          <i class="fas fa-check-circle"></i> Export Selected ({{ selectedStudents.length }})
        </button>
        
        <button 
          @click="exportCurrentPage"
          class="btn-export btn-export-page"
        >
          <i class="fas fa-file-export"></i> Export Current Page
        </button>
      </div>
    </div>
    
    <!-- Student Table -->
    <div class="student-table">
      <table>
        <thead>
          <tr>
            <th width="50">
              <input 
                type="checkbox" 
                v-model="selectAll" 
                @change="toggleSelectAll"
              />
            </th>
            <th>SN</th>
            <th>Student Name</th>
            <th>Admission No</th>
            <th>Class</th>
            <th>Total Marks</th>
            <th>Average</th>
            <th>Position</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(student, index) in displayedStudents" :key="student.student.id">
            <td>
              <input 
                type="checkbox" 
                :value="student" 
                v-model="selectedStudents"
              />
            </td>
            <td>{{ (currentPage - 1) * pageSize + index + 1 }}</td>
            <td>{{ student.student.full_name }}</td>
            <td>{{ student.student.admission_number }}</td>
            <td>{{ student.class.name }}</td>
            <td>{{ student.performance.mark_obtained }}</td>
            <td>{{ student.performance.average.toFixed(2) }}</td>
            <td>{{ student.performance.position }}</td>
            <td>
              <button 
                @click="exportSingleStudent(student)"
                class="btn-action btn-export-single"
                title="Export this student"
              >
                <i class="fas fa-user-edit"></i>
              </button>
              <button 
                @click="previewStudent(student)"
                class="btn-action btn-preview"
                title="Preview results"
              >
                <i class="fas fa-eye"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      
      <!-- Pagination -->
      <div class="pagination" v-if="studentsData.length > pageSize">
        <button @click="prevPage" :disabled="currentPage === 1">
          <i class="fas fa-chevron-left"></i>
        </button>
        <span>Page {{ currentPage }} of {{ totalPages }}</span>
        <button @click="nextPage" :disabled="currentPage === totalPages">
          <i class="fas fa-chevron-right"></i>
        </button>
      </div>
    </div>
    
    <!-- CSV Preview Modal -->
    <div v-if="showPreview" class="modal-overlay" @click.self="closePreview">
      <div class="modal-content">
        <div class="modal-header">
          <h3>CSV Preview</h3>
          <button @click="closePreview" class="btn-close">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <div class="preview-container">
            <pre>{{ previewContent }}</pre>
          </div>
          <div class="preview-info">
            <p><strong>Rows:</strong> {{ previewRows }}</p>
            <p><strong>Columns:</strong> {{ previewColumns }}</p>
          </div>
        </div>
        <div class="modal-footer">
          <button @click="downloadPreview" class="btn-download">
            <i class="fas fa-download"></i> Download CSV
          </button>
          <button @click="copyToClipboard" class="btn-copy">
            <i class="fas fa-copy"></i> Copy to Clipboard
          </button>
          <button @click="closePreview" class="btn-cancel">
            Close
          </button>
        </div>
      </div>
    </div>
    
    <!-- Notification Toast -->
    <div v-if="showToast" class="toast" :class="toastType">
      <div class="toast-content">
        <i :class="toastIcon"></i>
        <span>{{ toastMessage }}</span>
      </div>
      <button @click="showToast = false" class="toast-close">
        <i class="fas fa-times"></i>
      </button>
    </div>
  </div>
</template>

<script>
import { generateStudentCSV, downloadCSV } from '../utils/csvExport';

export default {
  name: 'StudentCSVExport',
  props: {
    studentsData: {
      type: Array,
      required: true,
      default: () => []
    },
    pageSize: {
      type: Number,
      default: 10
    }
  },
  data() {
    return {
      selectedStudents: [],
      selectAll: false,
      currentPage: 1,
      includePerformance: true,
      formatForExcel: true,
      filename: 'student_results',
      isExporting: false,
      showPreview: false,
      previewContent: '',
      previewRows: 0,
      previewColumns: 0,
      showToast: false,
      toastMessage: '',
      toastType: 'success',
      toastIcon: 'fas fa-check-circle'
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.studentsData.length / this.pageSize);
    },
    displayedStudents() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.studentsData.slice(start, end);
    }
  },
  methods: {
    // Export all students
    async exportAllStudents() {
      try {
        this.isExporting = true;
        
        const csvContent = generateStudentCSV(this.studentsData);
        const fullFilename = `${this.filename}_${new Date().toISOString().split('T')[0]}.csv`;
        
        downloadCSV(csvContent, fullFilename);
        
        this.showToastMessage(
          `Exported ${this.studentsData.length} students successfully`,
          'success'
        );
        
      } catch (error) {
        console.error('Export failed:', error);
        this.showToastMessage(`Export failed: ${error.message}`, 'error');
      } finally {
        this.isExporting = false;
      }
    },
    
    // Export selected students
    exportSelectedStudents() {
      if (this.selectedStudents.length === 0) {
        this.showToastMessage('Please select students to export', 'warning');
        return;
      }
      
      const csvContent = generateStudentCSV(this.selectedStudents);
      const fullFilename = `selected_students_${this.selectedStudents.length}_${new Date().toISOString().split('T')[0]}.csv`;
      
      downloadCSV(csvContent, fullFilename);
      
      this.showToastMessage(
        `Exported ${this.selectedStudents.length} selected students`,
        'success'
      );
    },
    
    // Export single student
    exportSingleStudent(student) {
      const csvContent = generateStudentCSV([student]);
      const safeName = student.student.full_name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      const fullFilename = `${safeName}_results_${new Date().toISOString().split('T')[0]}.csv`;
      
      downloadCSV(csvContent, fullFilename);
      
      this.showToastMessage(
        `Exported ${student.student.full_name}'s results`,
        'success'
      );
    },
    
    // Export current page
    exportCurrentPage() {
      const csvContent = generateStudentCSV(this.displayedStudents);
      const fullFilename = `page_${this.currentPage}_students_${new Date().toISOString().split('T')[0]}.csv`;
      
      downloadCSV(csvContent, fullFilename);
      
      this.showToastMessage(
        `Exported page ${this.currentPage} (${this.displayedStudents.length} students)`,
        'success'
      );
    },
    
    // Preview CSV before downloading
    previewStudent(student) {
      const csvContent = generateStudentCSV([student]);
      const lines = csvContent.split('\n');
      
      this.previewContent = lines.slice(0, 6).join('\n'); // Show first 6 lines
      this.previewRows = lines.length;
      this.previewColumns = lines[0].split(',').length;
      this.showPreview = true;
    },
    
    // Download previewed CSV
    downloadPreview() {
      const csvContent = generateStudentCSV([this.selectedStudents[0]]);
      const fullFilename = `preview_results_${new Date().toISOString().split('T')[0]}.csv`;
      
      downloadCSV(csvContent, fullFilename);
      this.closePreview();
    },
    
    // Copy to clipboard
    async copyToClipboard() {
      try {
        const csvContent = generateStudentCSV([this.selectedStudents[0]]);
        await navigator.clipboard.writeText(csvContent);
        
        this.showToastMessage('CSV copied to clipboard', 'success');
      } catch (error) {
        console.error('Copy failed:', error);
        this.showToastMessage('Failed to copy to clipboard', 'error');
      }
    },
    
    // Close preview modal
    closePreview() {
      this.showPreview = false;
      this.previewContent = '';
    },
    
    // Toggle select all
    toggleSelectAll() {
      if (this.selectAll) {
        this.selectedStudents = [...this.displayedStudents];
      } else {
        this.selectedStudents = [];
      }
    },
    
    // Pagination
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    
    // Show toast message
    showToastMessage(message, type = 'success') {
      this.toastMessage = message;
      this.toastType = type;
      this.toastIcon = type === 'success' ? 'fas fa-check-circle' : 
                      type === 'error' ? 'fas fa-exclamation-circle' : 
                      'fas fa-info-circle';
      this.showToast = true;
      
      // Auto hide after 3 seconds
      setTimeout(() => {
        this.showToast = false;
      }, 3000);
    }
  },
  watch: {
    selectedStudents(newVal) {
      this.selectAll = newVal.length === this.displayedStudents.length;
    }
  }
};
</script>

<style scoped>
.export-section {
  background: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.export-options {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
}

.option-item {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.option-item input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.filename-input {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-left: auto;
}

.filename-input label {
  font-weight: 600;
  color: #555;
}

.filename-input input {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  min-width: 200px;
}

.file-ext {
  color: #666;
  font-size: 14px;
}

.export-buttons {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.btn-export {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.btn-export:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-export-all {
  background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
  color: white;
}

.btn-export-all:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn-export-selected {
  background: #4CAF50;
  color: white;
}

.btn-export-selected:hover {
  background: #45a049;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.4);
}

.btn-export-page {
  background: #2196F3;
  color: white;
}

.btn-export-page:hover {
  background: #0b7dda;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(33, 150, 243, 0.4);
}

.student-table {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

th {
  padding: 16px 12px;
  text-align: left;
  font-weight: 600;
  color: #2c3e50;
  border-bottom: 2px solid #ddd;
}

td {
  padding: 14px 12px;
  border-bottom: 1px solid #eee;
}

tbody tr:hover {
  background-color: #f8f9fa;
}

.btn-action {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  margin: 0 2px;
}

.btn-export-single {
  background: #9c27b0;
  color: white;
}

.btn-export-single:hover {
  background: #7b1fa2;
}

.btn-preview {
  background: #ff9800;
  color: white;
}

.btn-preview:hover {
  background: #f57c00;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  padding: 20px;
  background: #f8f9fa;
}

.pagination button {
  padding: 8px 16px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
}

.pagination button:hover:not(:disabled) {
  background: #007bff;
  color: white;
  border-color: #007bff;
}

.pagination button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 800px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.modal-header {
  padding: 20px 24px;
  background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
}

.btn-close {
  background: none;
  border: none;
  color: white;
  font-size: 20px;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.btn-close:hover {
  background: rgba(255, 255, 255, 0.2);
}

.modal-body {
  padding: 24px;
  flex: 1;
  overflow: auto;
}

.preview-container {
  background: #f8f9fa;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 16px;
  max-height: 300px;
  overflow: auto;
  font-family: 'Courier New', monospace;
  font-size: 13px;
  line-height: 1.4;
}

.preview-info {
  margin-top: 16px;
  padding: 12px;
  background: #e3f2fd;
  border-radius: 6px;
}

.preview-info p {
  margin: 4px 0;
  color: #1976d2;
}

.modal-footer {
  padding: 20px 24px;
  background: #f8f9fa;
  border-top: 1px solid #ddd;
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.modal-footer button {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.btn-download {
  background: #4CAF50;
  color: white;
}

.btn-download:hover {
  background: #45a049;
}

.btn-copy {
  background: #2196F3;
  color: white;
}

.btn-copy:hover {
  background: #0b7dda;
}

.btn-cancel {
  background: #6c757d;
  color: white;
}

.btn-cancel:hover {
  background: #5a6268;
}

/* Toast Notification */
.toast {
  position: fixed;
  bottom: 24px;
  right: 24px;
  background: white;
  border-radius: 8px;
  padding: 16px 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-width: 300px;
  max-width: 400px;
  z-index: 1001;
  animation: slideIn 0.3s ease;
}

.toast.success {
  border-left: 4px solid #4CAF50;
}

.toast.error {
  border-left: 4px solid #f44336;
}

.toast.warning {
  border-left: 4px solid #ff9800;
}

.toast-content {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.toast i {
  font-size: 20px;
}

.toast.success i {
  color: #4CAF50;
}

.toast.error i {
  color: #f44336;
}

.toast.warning i {
  color: #ff9800;
}

.toast-close {
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 4px;
  margin-left: 12px;
}

.toast-close:hover {
  color: #333;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
</style>