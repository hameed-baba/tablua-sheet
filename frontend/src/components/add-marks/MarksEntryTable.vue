<template>
  <div class="marks-entry-card">
    <div class="marks-header">
      <div>
        <h3>Enter Marks</h3>
        <p class="marks-info">
          {{ className }} - {{ subjectName }}
          <span v-if="assessmentType === 'CA'"> (Continuous Assessment) </span>
          <span v-else> (Examination) </span>
        </p>
      </div>
      <div class="marks-summary mt-1">
        <span class="summary-badge">
          <strong>{{ completedCount }}</strong> /
          {{ students.length }} Completed
        </span>
      </div>
    </div>

    <!-- Quick Actions -->
 

    <!-- Enhanced Marks Table -->
    <div class="table-container mt-2">
      <div class="table-header">
        <div class="table-title">
          <svg
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
            />
          </svg>
          Students Marks Entry
        </div>
        <div class="table-stats">
          <span class="stat-item">
            <span class="stat-label">Total:</span>
            <span class="stat-value">{{ students.length }}</span>
          </span>
          <span class="stat-item">
            <span class="stat-label">Completed:</span>
            <span class="stat-value completed">{{ completedCount }}</span>
          </span>
          <span class="stat-item">
            <span class="stat-label">Remaining:</span>
            <span class="stat-value remaining">{{
              students.length - completedCount
            }}</span>
          </span>
        </div>
      </div>

      <div class="enhanced-table-wrapper">
        <table class="enhanced-marks-table">
          <thead>
            <tr>
              <th class="col-sn">
                <div class="th-content">
                  <span>#</span>
                </div>
              </th>
              <th class="col-student">
                <div class="th-content">
                  <svg
                    width="16"
                    height="16"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <span>Student Information</span>
                </div>
              </th>
              <th class="col-marks">
                <div class="th-content">
                  <svg
                    width="16"
                    height="16"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span v-if="assessmentType === 'CA'">CA Marks</span>
                  <span v-else>Marks Entry</span>
                </div>
              </th>
              <th class="col-status">
                <div class="th-content">
                  <svg
                    width="16"
                    height="16"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                  <span>Status</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(student, index) in students"
              :key="student.id"
              class="student-row"
              :class="{
                completed: isStudentCompleted(student),
                invalid: isStudentInvalid(student),
              }"
            >
              <td class="col-sn">
                <div class="sn-badge">{{ index + 1 }}</div>
              </td>

              <td class="col-student">
                <div class="student-info">
                  <div class="student-avatar">
                    <span>{{ getStudentInitials(student.full_name) }}</span>
                  </div>
                  <div class="student-details">
                    <div class="student-name">{{ student.full_name }}</div>
                    <div class="student-admission">
                      <svg
                        width="14"
                        height="14"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                        />
                      </svg>
                      {{ student.admission_number }}
                    </div>
                  </div>
                </div>
              </td>

              <td class="col-marks">
                <div class="marks-input-container">
                  <!-- CA Input -->
                  <template v-if="assessmentType === 'CA'">
                    <div class="marks-input-wrapper">
                      <input
                        type="text"
                        v-model="student.caMarks"
                        class="enhanced-marks-input"
                        :class="{
                          invalid: isInvalidCAMark(student.caMarks),
                          completed: isValidCAMark(student.caMarks),
                          absent: student.caMarks === 'ABS',
                        }"
                        placeholder="0-40 or ABS"
                        @input="handleMarksInput(student, 'caMarks', $event)"
                        @blur="formatMarksInput(student, 'caMarks')"
                      />
                    </div>
                  </template>

                  <!-- Exam Input -->
                  <template v-else>
                    <div class="exam-marks-container">
                      <div class="marks-input-row">
                        <div class="ca-score-display">
                          <span class="score-label">CA:</span>
                          <span class="score-value">{{
                            student.caMarks || student.existingCA || "--"
                          }}</span>
                        </div>

                        <div class="exam-input-wrapper">
                          <input
                            type="text"
                            v-model="student.examMarks"
                            class="enhanced-marks-input exam-input"
                            :class="{
                              invalid: isInvalidExamMark(student.examMarks),
                              completed: isValidExamMark(student.examMarks),
                              absent: student.examMarks === 'ABS',
                            }"
                            placeholder="0-60 or ABS"
                            @input="
                              handleMarksInput(student, 'examMarks', $event)
                            "
                            @blur="formatMarksInput(student, 'examMarks')"
                          />
                        </div>

                        <div
                          class="total-score-display"
                          v-if="
                            student.examMarks && student.examMarks !== 'ABS'
                          "
                        >
                          <span class="score-label">Total:</span>
                          <span class="total-value">{{
                            calculateStudentTotal(student)
                          }}</span>
                        </div>
                      </div>
                    </div>
                  </template>
                </div>
              </td>

              <td class="col-status status-cols">
                <div class="status-indicator">
                  <span
                    v-if="isStudentAbsent(student)"
                    class="status-badge absent"
                  >
                    <svg
                      width="14"
                      height="14"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18 21l-2.636-2.636M6 6l2.636 2.636"
                      />
                    </svg>
                    Absent
                  </span>
                  <span
                    v-else-if="isStudentCompleted(student)"
                    class="status-badge completed"
                  >
                    <svg
                      width="14"
                      height="14"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Completed
                  </span>
                  <span
                    v-else-if="isStudentInvalid(student)"
                    class="status-badge invalid"
                  >
                    <svg
                      width="14"
                      height="14"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Invalid
                  </span>
                  <span v-else class="status-badge pending">
                    <svg
                      width="14"
                      height="14"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Pending
                  </span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Submit Actions -->
    <div class="submit-actions">
      <button class="btn btn-cancel" @click="$emit('cancel')">Cancel</button>
      <button
        class="btn btn-submit"
        @click="$emit('submit')"
        :disabled="submitting || !canSubmit"
      >
        <span v-if="submitting" class="spinner"></span>
        {{ submitting ? "Submitting..." : "Submit Marks" }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

// Props
const props = defineProps({
  students: {
    type: Array,
    required: true,
    default: () => [],
  },
  assessmentType: {
    type: String,
    required: true,
    validator: (value) => ["CA", "EXAM"].includes(value),
  },
  className: {
    type: String,
    default: "",
  },
  subjectName: {
    type: String,
    default: "",
  },
  submitting: {
    type: Boolean,
    default: false,
  },
});

// Emits
const emit = defineEmits([
  "update:students",
  "submit",
  "cancel",
  "clear-marks",
]);

// Computed properties
const completedCount = computed(() => {
  if (props.assessmentType === "CA") {
    return props.students.filter((s) => isValidCAMark(s.caMarks)).length;
  } else {
    return props.students.filter((s) => isValidExamMark(s.examMarks)).length;
  }
});

const canSubmit = computed(() => {
  if (props.assessmentType === "CA") {
    return props.students.every((s) => isValidCAMark(s.caMarks));
  } else {
    return props.students.every((s) => isValidExamMark(s.examMarks));
  }
});

// Validation functions for marks
const isValidCAMark = (mark) => {
  if (mark === null || mark === "") return false;
  if (mark === "ABS") return true;
  const numMark = parseFloat(mark);
  return !isNaN(numMark) && numMark >= 0 && numMark <= 40;
};

const isValidExamMark = (mark) => {
  if (mark === null || mark === "") return false;
  if (mark === "ABS") return true;
  const numMark = parseFloat(mark);
  return !isNaN(numMark) && numMark >= 0 && numMark <= 60;
};

const isInvalidCAMark = (mark) => {
  if (mark === null || mark === "") return false;
  if (mark === "ABS") return false;
  const numMark = parseFloat(mark);
  return isNaN(numMark) || numMark < 0 || numMark > 40;
};

const isInvalidExamMark = (mark) => {
  if (mark === null || mark === "") return false;
  if (mark === "ABS") return false;
  const numMark = parseFloat(mark);
  return isNaN(numMark) || numMark < 0 || numMark > 60;
};

// Helper functions
const getStudentInitials = (fullName) => {
  if (!fullName) return "??";
  const names = fullName.split(" ");
  if (names.length === 1) return names[0].substring(0, 2).toUpperCase();
  return (names[0][0] + names[names.length - 1][0]).toUpperCase();
};

const isStudentAbsent = (student) => {
  if (props.assessmentType === "CA") {
    return student.caMarks === "ABS";
  } else {
    return student.examMarks === "ABS";
  }
};

const isStudentCompleted = (student) => {
  if (props.assessmentType === "CA") {
    return isValidCAMark(student.caMarks);
  } else {
    return isValidExamMark(student.examMarks);
  }
};

const isStudentInvalid = (student) => {
  if (props.assessmentType === "CA") {
    return isInvalidCAMark(student.caMarks);
  } else {
    return isInvalidExamMark(student.examMarks);
  }
};

// Calculate total score for a student (CA + Exam)
const calculateStudentTotal = (student) => {
  const caScore = parseFloat(student.caMarks || student.existingCA || 0);
  const examScore = parseFloat(student.examMarks || 0);

  // Only calculate if both scores are valid numbers
  if (
    !isNaN(caScore) &&
    !isNaN(examScore) &&
    student.examMarks &&
    student.examMarks !== "ABS"
  ) {
    return caScore + examScore;
  }

  return 0;
};

// Input handling functions
const handleMarksInput = (student, field, event) => {
  // Just update the value and convert to uppercase for ABS
  student[field] = event.target.value.toUpperCase();
  // Emit the updated students array
  emit("update:students", props.students);
};

const formatMarksInput = (student, field) => {
  const value = student[field];
  if (value && value !== "ABS" && !isNaN(parseFloat(value))) {
    const numValue = parseFloat(value);
    if (numValue % 1 === 0) {
      student[field] = numValue.toString();
    } else {
      student[field] = numValue.toFixed(1);
    }
  }
  // Emit the updated students array
  emit("update:students", props.students);
};

</script>

<style scoped>
/* Component styles here - keeping it minimal for now */
.marks-entry-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}
/* Add other styles as needed */
.marks -header {
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

/* Enhanced Table Styles */
.table-container {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(102, 126, 234, 0.1);
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.table-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 18px;
  font-weight: 600;
}

.table-stats {
  display: flex;
  gap: 20px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.stat-label {
  font-size: 12px;
  opacity: 0.8;
  font-weight: 400;
}

.stat-value {
  font-size: 16px;
  font-weight: 700;
}

.stat-value.completed {
  color: #10b981;
}

.stat-value.remaining {
  color: #f59e0b;
}

.enhanced-table-wrapper {
  overflow-x: auto;
}

.enhanced-marks-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
}

.enhanced-marks-table th {
  background: #f8fafc;
  border-bottom: 2px solid rgba(102, 126, 234, 0.1);
  padding: 0;
  position: sticky;
  top: 0;
  z-index: 10;
}

.th-content {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px 20px;
  font-weight: 600;
  font-size: 14px;
  color: #475569;
}

.col-sn {
  width: 60px;
}

.col-student {
  min-width: 250px;
}

.col-marks {
  width: 300px;
}

.col-status {
  width: 120px;
}

.student-row {
  transition: all 0.2s ease;
  border-bottom: 1px solid rgba(102, 126, 234, 0.08);
}

.student-row:hover {
  background: rgba(102, 126, 234, 0.02);
}

.student-row.completed {
  background: rgba(16, 185, 129, 0.03);
}

.student-row.invalid {
  background: rgba(239, 68, 68, 0.03);
}

.enhanced-marks-table td {
  padding: 16px 20px;
  vertical-align: middle;
}

.sn-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 50%;
  font-weight: 600;
  font-size: 14px;
}

.student-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.student-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 50%;
  font-weight: 600;
  font-size: 14px;
  flex-shrink: 0;
}

.student-details {
  flex: 1;
  min-width: 0;
}

.student-name {
  font-weight: 600;
  font-size: 15px;
  color: #1e293b;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.student-admission {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #64748b;
}

.marks-input-container {
  position: relative;
}

.marks-input-wrapper {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.exam-marks-container {
  width: 100%;
}

.marks-input-row {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.ca-score-display {
  display: flex;
  align-items: center;
  gap: 4px;
  background: #f8fafc;
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
  min-width: 60px;
}

.score-label {
  font-size: 11px;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
}

.score-value {
  font-size: 12px;
  font-weight: 600;
  color: #1e293b;
}

.exam-input-wrapper {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
  min-width: 80px;
}

.total-score-display {
  display: flex;
  align-items: center;
  gap: 4px;
  background: linear-gradient(135deg, #e0f2fe 0%, #f0f9ff 100%);
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid #0ea5e9;
  min-width: 70px;
}

.total-value {
  font-size: 12px;
  font-weight: 700;
  color: #0369a1;
}

.marks-range-hint {
  font-size: 10px;
  color: #64748b;
  text-align: center;
  opacity: 0.7;
  font-weight: 500;
}

.enhanced-marks-input {
  width: 100%;
  padding: 8px 12px;
  border: 2px solid #e2e8f0;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s ease;
  background: white;
  text-transform: uppercase;
  text-align: center;
  min-height: 40px;
}

.enhanced-marks-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.enhanced-marks-input.invalid {
  border-color: #ef4444;
  background: rgba(239, 68, 68, 0.05);
  color: #ef4444;
}

.enhanced-marks-input.completed {
  border-color: #10b981;
  background: rgba(16, 185, 129, 0.05);
  color: #059669;
}

.enhanced-marks-input.absent {
  border-color: #f59e0b;
  background: rgba(245, 158, 11, 0.05);
  color: #d97706;
  font-weight: 700;
}

.exam-input {
  max-width: 100px;
}

.status-indicator {
  display: flex;
  justify-content: center;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-badge.completed {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
  border: 1px solid rgba(16, 185, 129, 0.2);
}

.status-badge.invalid {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.2);
}

.status-badge.pending {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
  border: 1px solid rgba(245, 158, 11, 0.2);
}

.status-badge.absent {
  background: rgba(245, 158, 11, 0.15);
  color: #d97706;
  border: 1px solid rgba(245, 158, 11, 0.3);
}

.submit-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid rgba(102, 126, 234, 0.1);
}

.spinner {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid #ffffff;
  border-radius: 50%;
  border-top-color: transparent;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-cancel {
  background: #f8fafc;
  color: #64748b;
  border: 2px solid #e2e8f0;
}

.btn-cancel:hover {
  background: #e2e8f0;
  color: #475569;
}

.btn-submit {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.btn-submit:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

@media (max-width: 768px) {
  .marks-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .table-header {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
    padding: 16px;
  }

  .table-title {
    font-size: 16px;
  }

  .table-stats {
    width: 100%;
    justify-content: space-between;
    gap: 12px;
  }

  .stat-item {
    flex-direction: row;
    gap: 6px;
    align-items: center;
  }

  .stat-label {
    font-size: 11px;
  }

  .stat-value {
    font-size: 14px;
  }

  .th-content {
    padding: 10px 12px;
    font-size: 12px;
    gap: 6px;
  }

  .enhanced-marks-table td {
    padding: 10px 12px;
  }

  .col-sn {
    width: 50px;
  }

  .col-student {
    min-width: 180px;
  }

  .col-marks {
    width: 250px;
  }

  .col-status {
    width: 100px;
  }

  .sn-badge {
    width: 28px;
    height: 28px;
    font-size: 12px;
  }

  .student-info {
    gap: 8px;
  }

  .student-avatar {
    width: 32px;
    height: 32px;
    font-size: 12px;
  }

  .student-name {
    font-size: 13px;
  }

  .student-admission {
    font-size: 11px;
  }

  .enhanced-marks-input {
    padding: 6px 8px;
    font-size: 12px;
    min-height: 32px;
  }

  .marks-input-row {
    flex-direction: column;
    gap: 6px;
    align-items: stretch;
  }

  .ca-score-display,
  .total-score-display {
    justify-content: center;
  }

  .status-badge {
    padding: 3px 6px;
    font-size: 10px;
    gap: 3px;
  }

  .marks-range-hint {
    font-size: 9px;
  }
}

@media (max-width: 530px) {
  .col-status,
  .ca-score-display,
  .total-score-display {
    display: none;
  }
}
</style>
