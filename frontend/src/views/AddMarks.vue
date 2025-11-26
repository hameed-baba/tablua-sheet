<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1>Add Student Marks</h1>
        <p>Enter examination marks for students</p>
      </div>
    </div>

    <!-- Selection Filters -->
    <div class="marks-selection-card">
      <h3 class="section-title">
        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        Select Class & Subject
      </h3>

      <div class="selection-grid">
        <div class="form-group">
          <label class="form-label">Session *</label>
          <select v-model="selection.session" class="form-select" @change="loadClasses" required>
            <option value="">Select Session</option>
            <option v-for="session in sessions" :key="session.id" :value="session.id">
              {{ session.session_name }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">Term *</label>
          <select v-model="selection.term" class="form-select" required>
            <option value="">Select Term</option>
            <option value="1">First Term</option>
            <option value="2">Second Term</option>
            <option value="3">Third Term</option>
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">Class *</label>
          <select v-model="selection.class" class="form-select" @change="loadStudents" required>
            <option value="">Select Class</option>
            <option v-for="cls in classes" :key="cls.id" :value="cls.id">
              {{ cls.class_name }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">Subject *</label>
          <select v-model="selection.subject" class="form-select" required>
            <option value="">Select Subject</option>
            <option v-for="subject in subjects" :key="subject.id" :value="subject.id">
              {{ subject.subject_name }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">Assessment Type *</label>
          <select v-model="selection.assessmentType" class="form-select" @change="handleAssessmentTypeChange" required>
            <option value="">Select Assessment Type</option>
            <option value="CA">Continuous Assessment (CA)</option>
            <option value="EXAM">Examination</option>
          </select>
        </div>

        <div class="form-group" v-if="selection.assessmentType === 'CA'">
          <label class="form-label">Number of CAs *</label>
          <select v-model="selection.numberOfCAs" class="form-select" @change="handleCACountChange" required>
            <option value="">Select Number</option>
            <option value="1">1 CA</option>
            <option value="2">2 CAs</option>
            <option value="3">3 CAs</option>
            <option value="4">4 CAs</option>
          </select>
        </div>

        <div class="form-group" v-if="selection.assessmentType === 'EXAM'">
          <label class="form-label">Exam Type *</label>
          <select v-model="selection.examType" class="form-select" required>
            <option value="">Select Exam Type</option>
            <option value="MID_TERM">Mid-Term Exam</option>
            <option value="FINAL">Final Exam</option>
          </select>
        </div>
      </div>

      <div class="selection-actions">
        <button 
          v-if="selection.assessmentType === 'CA' && selection.numberOfCAs"
          class="btn-configure-ca" 
          @click="showCAConfigModal = true"
          :disabled="selection.caMarks.length > 0"
        >
          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {{ selection.caMarks.length > 0 ? 'CA Configured' : 'Configure CA Marks' }}
        </button>
        
        <button 
          class="btn-load-students" 
          @click="loadStudentsList"
          :disabled="!canLoadStudents || loading"
        >
          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          {{ loading ? 'Loading...' : 'Load Students' }}
        </button>
      </div>
    </div>

    <!-- CA Configuration Modal -->
    <div v-if="showCAConfigModal" class="modal-overlay" @click.self="showCAConfigModal = false">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Configure CA Marks</h3>
          <button class="close-btn" @click="showCAConfigModal = false">×</button>
        </div>
        <div class="modal-body">
          <p class="modal-description">
            Set the total marks for each Continuous Assessment (CA)
          </p>
          <div class="ca-config-grid">
            <div v-for="i in parseInt(selection.numberOfCAs)" :key="i" class="ca-config-item">
              <label class="form-label">CA {{ i }} Total Marks *</label>
              <input
                type="number"
                v-model.number="tempCAMarks[i - 1]"
                class="form-input"
                :placeholder="`e.g., 10 or 20`"
                min="1"
                max="100"
                required
              />
            </div>
          </div>
        </div>
        <div class="modal-actions">
          <button class="btn btn-cancel" @click="showCAConfigModal = false">
            Cancel
          </button>
          <button class="btn btn-submit" @click="saveCAConfiguration" :disabled="!isCAConfigValid">
            Save Configuration
          </button>
        </div>
      </div>
    </div>

    <!-- Students Marks Entry -->
    <div v-if="studentsLoaded" class="marks-entry-card">
      <div class="marks-header">
        <div>
          <h3>Enter Marks</h3>
          <p class="marks-info">
            {{ getSelectedClassName() }} - {{ getSelectedSubjectName() }} 
            <span v-if="selection.assessmentType === 'CA'">
              ({{ selection.numberOfCAs }} CA{{ selection.numberOfCAs > 1 ? 's' : '' }})
            </span>
            <span v-else>
              ({{ selection.examType }})
            </span>
          </p>
          <div v-if="selection.assessmentType === 'CA'" class="ca-marks-info">
            <span v-for="(ca, index) in selection.caMarks" :key="index" class="ca-badge">
              CA{{ index + 1 }}: {{ ca.totalMarks }} marks
            </span>
          </div>
        </div>
        <div class="marks-summary">
          <span class="summary-badge">
            <strong>{{ completedCount }}</strong> / {{ students.length }} Completed
          </span>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="quick-actions">
        <button class="btn-quick-action" @click="markAllPresent">
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          Mark All Present
        </button>
        <button class="btn-quick-action" @click="markAllAbsent">
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
          Mark All Absent
        </button>
        <button class="btn-quick-action" @click="clearAllMarks">
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Clear All
        </button>
      </div>

      <!-- Marks Table -->
      <div class="table-responsive">
        <table class="marks-table">
          <thead>
            <tr>
              <th style="width: 50px;">SN</th>
              <th>Student Name</th>
              <th style="width: 180px;">Admission No.</th>
              <th style="width: 120px;">Status</th>
              
              <!-- CA Columns -->
              <template v-if="selection.assessmentType === 'CA'">
                <th v-for="(ca, index) in selection.caMarks" :key="index" style="width: 120px;">
                  CA{{ index + 1 }} ({{ ca.totalMarks }})
                </th>
                <th style="width: 100px;">Total CA</th>
              </template>
              
              <!-- Exam Column -->
              <template v-else>
                <th style="width: 150px;">Exam Marks</th>
              </template>
              
              <th style="width: 100px;">Grade</th>
              <th style="width: 120px;">Remark</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(student, index) in students" :key="student.id" :class="{ 'row-absent': student.status === 'absent' }">
              <td>{{ index + 1 }}</td>
              <td>
                <strong>{{ student.full_name }}</strong>
              </td>
              <td>{{ student.admission_number }}</td>
              <td>
                <select 
                  v-model="student.status" 
                  class="status-select"
                  @change="handleStatusChange(student)"
                >
                  <option value="present">Present</option>
                  <option value="absent">Absent</option>
                </select>
              </td>
              
              <!-- CA Inputs -->
              <template v-if="selection.assessmentType === 'CA'">
                <td v-for="(ca, caIndex) in selection.caMarks" :key="caIndex">
                  <input
                    type="number"
                    v-model.number="student.caScores[caIndex]"
                    class="marks-input"
                    :class="{ 'invalid': isInvalidCAMark(student.caScores[caIndex], ca.totalMarks) }"
                    :placeholder="`0-${ca.totalMarks}`"
                    :max="ca.totalMarks"
                    min="0"
                    :disabled="student.status === 'absent'"
                    @input="calculateTotalCA(student)"
                  />
                </td>
                <td>
                  <strong>{{ student.totalCA || 0 }}</strong>
                </td>
              </template>
              
              <!-- Exam Input -->
              <template v-else>
                <td>
                  <input
                    type="number"
                    v-model.number="student.examMarks"
                    class="marks-input"
                    :class="{ 'invalid': isInvalidExamMark(student.examMarks) }"
                    placeholder="0-100"
                    max="100"
                    min="0"
                    :disabled="student.status === 'absent'"
                    @input="calculateGrade(student)"
                  />
                </td>
              </template>
              
              <td>
                <span v-if="student.status === 'present' && hasValidMarks(student)" 
                      :class="['grade-badge', getGradeClass(student.grade)]">
                  {{ student.grade || '-' }}
                </span>
                <span v-else class="text-muted">-</span>
              </td>
              <td>
                <span v-if="student.status === 'present' && hasValidMarks(student)" 
                      class="remark-text">
                  {{ student.remark || '-' }}
                </span>
                <span v-else class="text-muted">-</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Submit Actions -->
      <div class="submit-actions">
        <button class="btn btn-cancel" @click="cancelEntry">
          Cancel
        </button>
        <button 
          class="btn btn-submit" 
          @click="submitMarks"
          :disabled="submitting || !canSubmit"
        >
          <span v-if="submitting" class="spinner"></span>
          {{ submitting ? 'Submitting...' : 'Submit Marks' }}
        </button>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="empty-state">
      <svg width="80" height="80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <h3>No Students Loaded</h3>
      <p>Select session, term, class, and subject above, then click "Load Students" to begin entering marks.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from '../composables/useToast';

const router = useRouter();
const toast = useToast();

const loading = ref(false);
const submitting = ref(false);
const studentsLoaded = ref(false);
const showCAConfigModal = ref(false);
const tempCAMarks = ref([]);

const selection = ref({
  session: '',
  term: '',
  class: '',
  subject: '',
  assessmentType: '',
  numberOfCAs: '',
  examType: '',
  caMarks: []
});

// Mock data - Replace with API calls
const sessions = ref([
  { id: 1, session_name: '2024/2025' },
  { id: 2, session_name: '2025/2026' }
]);

const classes = ref([
  { id: 1, class_name: 'JSS1' },
  { id: 2, class_name: 'JSS2' },
  { id: 3, class_name: 'JSS3' },
  { id: 4, class_name: 'SS1' },
  { id: 5, class_name: 'SS2' },
  { id: 6, class_name: 'SS3' }
]);

const subjects = ref([
  { id: 1, subject_name: 'Mathematics' },
  { id: 2, subject_name: 'English Language' },
  { id: 3, subject_name: 'Physics' },
  { id: 4, subject_name: 'Chemistry' },
  { id: 5, subject_name: 'Biology' }
]);

const students = ref([]);

const canLoadStudents = computed(() => {
  const baseValid = selection.value.session && selection.value.term && 
                    selection.value.class && selection.value.subject && 
                    selection.value.assessmentType;
  
  if (selection.value.assessmentType === 'CA') {
    return baseValid && selection.value.numberOfCAs && selection.value.caMarks.length > 0;
  } else if (selection.value.assessmentType === 'EXAM') {
    return baseValid && selection.value.examType;
  }
  
  return false;
});

const completedCount = computed(() => {
  if (selection.value.assessmentType === 'CA') {
    return students.value.filter(s => 
      s.status === 'absent' || (s.status === 'present' && s.caScores.every(score => score !== null && score !== ''))
    ).length;
  } else {
    return students.value.filter(s => 
      s.status === 'absent' || (s.status === 'present' && s.examMarks !== null && s.examMarks !== '')
    ).length;
  }
});

const canSubmit = computed(() => {
  if (selection.value.assessmentType === 'CA') {
    return students.value.every(s => 
      s.status === 'absent' || (s.status === 'present' && s.caScores.every((score, idx) => 
        score !== null && score !== '' && !isInvalidCAMark(score, selection.value.caMarks[idx].totalMarks)
      ))
    );
  } else {
    return students.value.every(s => 
      s.status === 'absent' || (s.status === 'present' && s.examMarks !== null && s.examMarks !== '' && !isInvalidExamMark(s.examMarks))
    );
  }
});

const isCAConfigValid = computed(() => {
  return tempCAMarks.value.length === parseInt(selection.value.numberOfCAs) &&
         tempCAMarks.value.every(mark => mark > 0 && mark <= 100);
});

const loadClasses = () => {
  // Load classes based on session
};

const loadStudents = () => {
  // Load students based on class
};

const handleAssessmentTypeChange = () => {
  selection.value.numberOfCAs = '';
  selection.value.examType = '';
  selection.value.caMarks = [];
  tempCAMarks.value = [];
};

const handleCACountChange = () => {
  selection.value.caMarks = [];
  tempCAMarks.value = [];
  showCAConfigModal.value = true;
};

const saveCAConfiguration = () => {
  selection.value.caMarks = tempCAMarks.value.map((totalMarks, index) => ({
    caNumber: index + 1,
    totalMarks: totalMarks
  }));
  showCAConfigModal.value = false;
  toast.success('CA Configuration Saved', `${selection.value.numberOfCAs} CA(s) configured successfully.`);
};

const loadStudentsList = () => {
  loading.value = true;
  
  // Mock API call
  setTimeout(() => {
    const baseStudents = [
      { id: 1, full_name: 'Aminu Bello', admission_number: 'AGP/SS/2022/045' },
      { id: 2, full_name: 'Fatima Sani', admission_number: 'AGP/JS/2021/023' },
      { id: 3, full_name: 'Usman Lawal', admission_number: 'AGP/SS/2020/055' },
      { id: 4, full_name: 'Aisha Abdullahi', admission_number: 'AGP/JS/2022/019' },
      { id: 5, full_name: 'Mohammed Aliyu', admission_number: 'AGP/SS/2021/012' }
    ];

    if (selection.value.assessmentType === 'CA') {
      students.value = baseStudents.map(s => ({
        ...s,
        status: 'present',
        caScores: new Array(parseInt(selection.value.numberOfCAs)).fill(null),
        totalCA: 0,
        grade: '',
        remark: ''
      }));
    } else {
      students.value = baseStudents.map(s => ({
        ...s,
        status: 'present',
        examMarks: null,
        grade: '',
        remark: ''
      }));
    }
    
    studentsLoaded.value = true;
    loading.value = false;
    toast.success('Students Loaded', `${students.value.length} students loaded successfully.`);
  }, 1000);
};

const handleStatusChange = (student) => {
  if (student.status === 'absent') {
    if (selection.value.assessmentType === 'CA') {
      student.caScores = new Array(parseInt(selection.value.numberOfCAs)).fill(null);
      student.totalCA = 0;
    } else {
      student.examMarks = null;
    }
    student.grade = '';
    student.remark = '';
  }
};

const calculateTotalCA = (student) => {
  if (student.status === 'absent') return;
  
  student.totalCA = student.caScores.reduce((sum, score) => {
    return sum + (score || 0);
  }, 0);
  
  calculateGrade(student);
};

const calculateGrade = (student) => {
  if (student.status === 'absent') {
    student.grade = '';
    student.remark = '';
    return;
  }

  let totalMarks, obtainedMarks;
  
  if (selection.value.assessmentType === 'CA') {
    totalMarks = selection.value.caMarks.reduce((sum, ca) => sum + ca.totalMarks, 0);
    obtainedMarks = student.totalCA || 0;
  } else {
    totalMarks = 100;
    obtainedMarks = student.examMarks || 0;
  }

  if (obtainedMarks === 0 || obtainedMarks === null) {
    student.grade = '';
    student.remark = '';
    return;
  }

  const percentage = (obtainedMarks / totalMarks) * 100;

  if (percentage >= 90) {
    student.grade = 'A+';
    student.remark = 'Excellent';
  } else if (percentage >= 80) {
    student.grade = 'A';
    student.remark = 'Very Good';
  } else if (percentage >= 70) {
    student.grade = 'B';
    student.remark = 'Good';
  } else if (percentage >= 60) {
    student.grade = 'C';
    student.remark = 'Credit';
  } else if (percentage >= 50) {
    student.grade = 'D';
    student.remark = 'Pass';
  } else {
    student.grade = 'F';
    student.remark = 'Fail';
  }
};

const isInvalidCAMark = (mark, maxMark) => {
  return mark !== null && mark !== '' && (mark < 0 || mark > maxMark);
};

const isInvalidExamMark = (mark) => {
  return mark !== null && mark !== '' && (mark < 0 || mark > 100);
};

const hasValidMarks = (student) => {
  if (selection.value.assessmentType === 'CA') {
    return student.caScores.some(score => score !== null && score !== '');
  } else {
    return student.examMarks !== null && student.examMarks !== '';
  }
};

const getGradeClass = (grade) => {
  const gradeMap = {
    'A+': 'grade-a',
    'A': 'grade-a',
    'B': 'grade-b',
    'C': 'grade-c',
    'D': 'grade-d',
    'F': 'grade-f'
  };
  return gradeMap[grade] || '';
};

const markAllPresent = () => {
  students.value.forEach(student => {
    student.status = 'present';
  });
  toast.info('Status Updated', 'All students marked as present.');
};

const markAllAbsent = () => {
  students.value.forEach(student => {
    student.status = 'absent';
    if (selection.value.assessmentType === 'CA') {
      student.caScores = new Array(parseInt(selection.value.numberOfCAs)).fill(null);
      student.totalCA = 0;
    } else {
      student.examMarks = null;
    }
    student.grade = '';
    student.remark = '';
  });
  toast.info('Status Updated', 'All students marked as absent.');
};

const clearAllMarks = () => {
  if (confirm('Are you sure you want to clear all marks? This action cannot be undone.')) {
    students.value.forEach(student => {
      if (selection.value.assessmentType === 'CA') {
        student.caScores = new Array(parseInt(selection.value.numberOfCAs)).fill(null);
        student.totalCA = 0;
      } else {
        student.examMarks = null;
      }
      student.grade = '';
      student.remark = '';
      student.status = 'present';
    });
    toast.info('Marks Cleared', 'All marks have been cleared.');
  }
};

const getSelectedClassName = () => {
  const cls = classes.value.find(c => c.id == selection.value.class);
  return cls ? cls.class_name : '';
};

const getSelectedSubjectName = () => {
  const subject = subjects.value.find(s => s.id == selection.value.subject);
  return subject ? subject.subject_name : '';
};

const cancelEntry = () => {
  if (confirm('Are you sure you want to cancel? All unsaved data will be lost.')) {
    router.go(-1);
  }
};

const submitMarks = async () => {
  if (!canSubmit.value) {
    toast.error('Validation Error', 'Please complete all marks entry before submitting.');
    return;
  }

  submitting.value = true;

  try {
    // TODO: Replace with actual API call
    // await apiServices.submitMarks({
    //   ...selection.value,
    //   students: students.value
    // });

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    toast.success(
      'Marks Submitted Successfully',
      `Marks for ${students.value.length} students have been submitted.`
    );

    // Reset or navigate
    setTimeout(() => {
      router.push('/grades');
    }, 1500);
  } catch (error) {
    toast.error(
      'Submission Failed',
      error.message || 'Failed to submit marks. Please try again.'
    );
  } finally {
    submitting.value = false;
  }
};
</script>

<style scoped>
.marks-selection-card,
.marks-entry-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.section-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 20px;
}

.selection-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 20px;
}

.selection-actions {
  display: flex;
  justify-content: flex-end;
}

.btn-load-students {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.btn-load-students:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.btn-load-students:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.marks-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 2px solid rgba(102, 126, 234, 0.1);
}

.marks-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 6px 0;
}

.marks-info {
  font-size: 14px;
  color: #64748b;
  margin: 0;
}

.marks-summary {
  display: flex;
  gap: 12px;
}

.summary-badge {
  padding: 8px 16px;
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
}

.quick-actions {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.btn-quick-action {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  background: white;
  color: #667eea;
  border: 2px solid #667eea;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-quick-action:hover {
  background: #667eea;
  color: white;
}

.marks-table {
  width: 100%;
  border-collapse: collapse;
}

.marks-table th,
.marks-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid rgba(102, 126, 234, 0.1);
}

.marks-table th {
  background: rgba(102, 126, 234, 0.05);
  font-weight: 600;
  font-size: 13px;
  color: #475569;
}

.marks-table td {
  font-size: 13px;
  color: #64748b;
}

.row-absent {
  background: rgba(239, 68, 68, 0.05);
}

.status-select {
  padding: 6px 10px;
  border: 2px solid rgba(102, 126, 234, 0.2);
  border-radius: 6px;
  font-size: 13px;
  width: 100%;
}

.marks-input {
  padding: 8px 10px;
  border: 2px solid rgba(102, 126, 234, 0.2);
  border-radius: 6px;
  font-size: 13px;
  width: 100%;
  transition: all 0.2s ease;
}

.marks-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.marks-input.invalid {
  border-color: #ef4444;
}

.marks-input:disabled {
  background: #f8fafc;
  cursor: not-allowed;
}

.error-text {
  font-size: 11px;
  color: #ef4444;
  display: block;
  margin-top: 2px;
}

.remark-text {
  font-size: 12px;
  color: #64748b;
}

.text-muted {
  color: #cbd5e1;
}

.submit-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid rgba(102, 126, 234, 0.1);
}

.empty-state {
  text-align: center;
  padding: 80px 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.empty-state svg {
  color: #cbd5e1;
  margin-bottom: 20px;
}

.empty-state h3 {
  font-size: 20px;
  color: #475569;
  margin-bottom: 10px;
}

.empty-state p {
  color: #64748b;
  font-size: 14px;
  max-width: 500px;
  margin: 0 auto;
}

.btn-configure-ca {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: white;
  color: #667eea;
  border: 2px solid #667eea;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-configure-ca:hover:not(:disabled) {
  background: #667eea;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.btn-configure-ca:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background: rgba(102, 126, 234, 0.1);
  border-color: rgba(102, 126, 234, 0.3);
}

.ca-marks-info {
  display: flex;
  gap: 8px;
  margin-top: 8px;
  flex-wrap: wrap;
}

.ca-badge {
  padding: 4px 12px;
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 20px;
}

.modal-content {
  background: white;
  border-radius: 16px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 2px solid rgba(102, 126, 234, 0.1);
}

.modal-header h3 {
  font-size: 20px;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  font-size: 32px;
  color: #64748b;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  transition: all 0.2s;
}

.close-btn:hover {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.modal-body {
  padding: 24px;
}

.modal-description {
  color: #64748b;
  font-size: 14px;
  margin-bottom: 20px;
}

.ca-config-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.ca-config-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 20px 24px;
  border-top: 1px solid rgba(102, 126, 234, 0.1);
}

@media (max-width: 768px) {
  .selection-grid {
    grid-template-columns: 1fr;
  }

  .marks-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .table-responsive {
    overflow-x: auto;
  }

  .ca-config-grid {
    grid-template-columns: 1fr;
  }

  .modal-actions {
    flex-direction: column;
  }

  .modal-actions .btn {
    width: 100%;
  }
}
</style>
