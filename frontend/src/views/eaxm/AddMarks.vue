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
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
        Select Class & Subject
      </h3>

      <div class="selection-grid">
        <div class="form-group">
          <label class="form-label">Session *</label>
          <select
            v-model="selection.session"
            class="form-select"
            @change="loadClasses"
            required
          >
            <option value="">Select Session</option>
            <option
              v-for="session in sessions"
              :key="session.id"
              :value="session.id"
            >
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
          <select
            v-model="selection.class"
            class="form-select"
            @change="handleClassChange"
            required
          >
            <option value="">Select Class</option>
            <option v-for="cls in classes" :key="cls.id" :value="cls.id">
              {{ cls.class_name }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">Subject *</label>
          <select
            v-model="selection.subject"
            class="form-select"
            :disabled="loadingSubjects"
            required
          >
            <option value="">
              {{ loadingSubjects ? "Loading subjects..." : "Select Subject" }}
            </option>
            <option
              v-for="subject in subjects"
              :key="subject.id"
              :value="subject.Subject?.id"
            >
              {{ subject.Subject?.subject_name }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">Assessment Type *</label>
          <select
            v-model="selection.assessmentType"
            class="form-select"
            @change="handleAssessmentTypeChange"
            required
          >
            <option value="">Select Assessment Type</option>
            <option value="CA">Continuous Assessment (CA)</option>
            <option value="EXAM">Examination</option>
          </select>
        </div>
      </div>

      <div class="selection-actions">
        <button
          class="btn-load-students"
          @click="loadStudentsList"
          :disabled="!canLoadStudents || loading"
        >
          <svg
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
          {{ loading ? "Loading..." : "Load Students" }}
        </button>
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
              (Continuous Assessment)
            </span>
            <span v-else> (Examination) </span>
          </p>
        </div>
        <div class="marks-summary">
          <span class="summary-badge">
            <strong>{{ completedCount }}</strong> /
            {{ students.length }} Completed
          </span>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="quick-actions">
        <button class="btn-quick-action auto-fill" @click="autoFillMarks">
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
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
          Auto Fill (Test)
        </button>
        <button
          class="btn btn-submit"
          @click="submitMarks"
          :disabled="submitting || !canSubmit"
        >
          <span v-if="submitting" class="spinner"></span>
          {{ submitting ? "Submitting..." : "Submit Marks" }}
        </button>
        <button class="btn-quick-action" @click="clearAllMarks">
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
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          Clear All Marks
        </button>
      </div>

      <!-- Enhanced Marks Table -->
      <div class="table-container">
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
                    <span v-if="selection.assessmentType === 'CA'"
                      >CA Marks (0-40)</span
                    >
                    <span v-else>Exam Marks (0-60)</span>
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
                    <template v-if="selection.assessmentType === 'CA'">
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
                      <!-- <div class="input-feedback">
                        <span
                          v-if="student.caMarks === 'ABS'"
                          class="absent-msg"
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
                          Student marked as absent
                        </span>
                        <span
                          v-else-if="isInvalidCAMark(student.caMarks)"
                          class="error-msg"
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
                          Enter 0-40 or "ABS"
                        </span>
                        <span
                          v-else-if="isValidCAMark(student.caMarks)"
                          class="success-msg"
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
                        </span>
                      </div> -->
                    </template>

                    <!-- Exam Input -->
                    <template v-else>
                      <div class="exam-marks-simple">
                        <div class="marks-row">
                          <div class="ca-display">
                            CA:
                            {{ student.caMarks || student.existingCA || "--" }}
                          </div>
                          <input
                            type="text"
                            v-model="student.examMarks"
                            class="exam-input"
                            :class="{
                              invalid: isInvalidExamMark(student.examMarks),
                              completed: isValidExamMark(student.examMarks),
                              absent: student.examMarks === 'ABS',
                            }"
                            placeholder="Exam (0-60)"
                            @input="
                              handleMarksInput(student, 'examMarks', $event)
                            "
                            @blur="formatMarksInput(student, 'examMarks')"
                          />
                          <div
                            class="total-display"
                            v-if="
                              student.examMarks && student.examMarks !== 'ABS'
                            "
                          >
                            Total: {{ calculateStudentTotal(student) }}
                          </div>
                        </div>
                      </div>

                      <!-- <div class="input-feedback"> -->
                      <!-- <span
                          v-if="student.examMarks === 'ABS'"
                          class="absent-msg"
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
                          Student marked as absent
                        </span> -->
                      <!-- <span
                          v-else-if="isInvalidExamMark(student.examMarks)"
                          class="error-msg"
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
                          Enter 0-60 or "ABS"
                        </span> -->
                      <!-- <span
                          v-else-if="isValidExamMark(student.examMarks)"
                          class="success-msg"
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
                        </span> -->
                      <!-- </div> -->
                    </template>
                  </div>
                </td>

                <td class="col-status">
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

        <!-- Mobile Card Layout -->
        <div class="mobile-cards">
          <div
            v-for="(student, index) in students"
            :key="student.id"
            class="mobile-card"
            :class="{
              completed: isStudentCompleted(student),
              invalid: isStudentInvalid(student),
              absent: isStudentAbsent(student),
            }"
          >
            <div class="mobile-card-header">
              <div class="sn-badge">{{ index + 1 }}</div>
              <div class="student-info">
                <div class="student-avatar">
                  <span>{{ getStudentInitials(student.full_name) }}</span>
                </div>
                <div class="student-details">
                  <div class="student-name">{{ student.full_name }}</div>
                  <div class="student-admission">
                    <svg
                      width="12"
                      height="12"
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
            </div>

            <div class="mobile-card-body">
              <div class="mobile-marks-section">
                <div class="mobile-marks-label">
                  <span v-if="selection.assessmentType === 'CA'"
                    >CA Marks (0-40 or ABS)</span
                  >
                  <span v-else>Exam Marks (0-60 or ABS)</span>
                </div>

                <div class="marks-input-container">
                  <!-- CA Input -->
                  <template v-if="selection.assessmentType === 'CA'">
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
                    <!-- <div class="input-feedback">
                      <span v-if="student.caMarks === 'ABS'" class="absent-msg">
                        <svg
                          width="12"
                          height="12"
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
                        Student marked as absent
                      </span>
                      <span
                        v-else-if="isInvalidCAMark(student.caMarks)"
                        class="error-msg"
                      >
                        <svg
                          width="12"
                          height="12"
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
                        Enter 0-40 or "ABS"
                      </span>
                      <span
                        v-else-if="isValidCAMark(student.caMarks)"
                        class="success-msg"
                      >
                        <svg
                          width="12"
                          height="12"
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
                      </span>
                    </div> -->
                  </template>

                  <!-- Exam Input -->
                  <template v-else>
                    <div class="mobile-exam-container">
                      <!-- CA Score Display (Read-only) -->
                      <div class="mobile-ca-display">
                        <span class="mobile-ca-label">CA Score:</span>
                        <span class="mobile-ca-score">
                          {{
                            student.caMarks ||
                            student.existingCA ||
                            "Not entered"
                          }}
                        </span>
                      </div>

                      <!-- Exam Score Input -->
                      <input
                        type="text"
                        v-model="student.examMarks"
                        class="enhanced-marks-input"
                        :class="{
                          invalid: isInvalidExamMark(student.examMarks),
                          completed: isValidExamMark(student.examMarks),
                          absent: student.examMarks === 'ABS',
                        }"
                        placeholder="0-60 or ABS"
                        @input="handleMarksInput(student, 'examMarks', $event)"
                        @blur="formatMarksInput(student, 'examMarks')"
                      />

                      <!-- Total Score Display -->
                      <div
                        class="mobile-total-display"
                        v-if="student.examMarks && student.examMarks !== 'ABS'"
                      >
                        <span class="mobile-total-label">Total:</span>
                        <span class="mobile-total-score">
                          {{ calculateStudentTotal(student) }}
                        </span>
                      </div>
                    </div>

                    <!-- <div class="input-feedback">
                      <span
                        v-if="student.examMarks === 'ABS'"
                        class="absent-msg"
                      >
                        <svg
                          width="12"
                          height="12"
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
                        Student marked as absent
                      </span>
                      <span
                        v-else-if="isInvalidExamMark(student.examMarks)"
                        class="error-msg"
                      >
                        <svg
                          width="12"
                          height="12"
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
                        Enter 0-60 or "ABS"
                      </span>
                      <span
                        v-else-if="isValidExamMark(student.examMarks)"
                        class="success-msg"
                      >
                        <svg
                          width="12"
                          height="12"
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
                      </span>
                    </div> -->
                  </template>
                </div>
              </div>

              <div class="mobile-status-section">
                <span class="mobile-marks-label">Status:</span>
                <div class="status-indicator">
                  <span
                    v-if="isStudentAbsent(student)"
                    class="status-badge absent"
                  >
                    <svg
                      width="12"
                      height="12"
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
                      width="12"
                      height="12"
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
                      width="12"
                      height="12"
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
                      width="12"
                      height="12"
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
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Submit Actions -->
      <div class="submit-actions">
        <button class="btn btn-cancel" @click="cancelEntry">Cancel</button>
        <button
          class="btn btn-submit"
          @click="submitMarks"
          :disabled="submitting || !canSubmit"
        >
          <span v-if="submitting" class="spinner"></span>
          {{ submitting ? "Submitting..." : "Submit Marks" }}
        </button>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="empty-state">
      <svg
        width="80"
        height="80"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
      <h3>No Students Loaded</h3>
      <p>
        Select session, term, class, and subject above, then click "Load
        Students" to begin entering marks.
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "../../composables/useToast";
import apiServices from "../../services/apiServices";

const router = useRouter();
const toast = useToast();

const loading = ref(false);
const submitting = ref(false);
const studentsLoaded = ref(false);
const loadingSubjects = ref(false);

const selection = ref({
  session: "",
  term: "",
  class: "",
  subject: "",
  assessmentType: "",
});

// Data arrays
const sessions = ref([]);
const classes = ref([]);
const subjects = ref([]);
const students = ref([]);

// Pagination for students
const pagination = ref({
  currentPage: 1,
  totalPages: 1,
  totalCount: 0,
  limit: 50,
  hasNextPage: false,
  hasPrevPage: false,
});

// Filters for students
const filters = ref({
  search: "",
  gender: "",
});

const canLoadStudents = computed(() => {
  return (
    selection.value.session &&
    selection.value.term &&
    selection.value.class &&
    selection.value.subject &&
    selection.value.assessmentType
  );
});

const completedCount = computed(() => {
  if (selection.value.assessmentType === "CA") {
    return students.value.filter((s) => isValidCAMark(s.caMarks)).length;
  } else {
    return students.value.filter((s) => isValidExamMark(s.examMarks)).length;
  }
});

const canSubmit = computed(() => {
  if (selection.value.assessmentType === "CA") {
    return students.value.every((s) => isValidCAMark(s.caMarks));
  } else {
    return students.value.every((s) => isValidExamMark(s.examMarks));
  }
});

// API Functions
const getAllRowSessions = () => {
  apiServices
    .getAllRowSessions()
    .then((response) => {
      sessions.value = response.data.data || [];
    })
    .catch((error) => {
      console.error("Error fetching sessions:", error);
      toast.error(
        "Failed to Load Sessions",
        "Could not load academic sessions"
      );
    });
};

const getAllRowClases = () => {
  apiServices
    .getAllRowClases()
    .then((response) => {
      classes.value = response.data.data || [];
    })
    .catch((error) => {
      console.error("Error fetching classes:", error);
      toast.error("Failed to Load Classes", "Could not load classes");
    });
};

const loadClassSubjects = (classId) => {
  if (!classId) {
    subjects.value = [];
    return;
  }

  loadingSubjects.value = true;
  apiServices
    .getClassAssignedSubjectByClassId(classId)
    .then((response) => {
      subjects.value = response.data.data || [];
    })
    .catch((error) => {
      console.error("Error fetching subjects:", error);
      toast.error(
        "Failed to Load Subjects",
        "Could not load subjects for this class"
      );
      subjects.value = [];
    })
    .finally(() => {
      loadingSubjects.value = false;
    });
};

const getClassStudents = () => {
  loading.value = true;

  const params = {
    current_class_id: selection.value.class,
    school_subject_id: selection.value.subject,
    current_session_id: selection.value.session,
    current_term_id: selection.value.term,
  };

  console.log("Getting student assigned subjects with params:", params);

  apiServices
    .getAssignedSubjectsByFilters(params)
    .then((response) => {
      console.log("Student assigned subjects response:", response.data);

      const responseData = response.data.data;
      const assignments = responseData.assignments || [];

      // Transform assignments to student format
      const transformedStudents = assignments.map((assignment) => ({
        id: assignment.student.id,
        full_name: assignment.student.full_name,
        admission_number: assignment.student.admission_number,
        email: assignment.student.email,
        phone: assignment.student.phone,
        assignment_id: assignment.assignment_id,
        caMarks: assignment.marks.ca_1_score,
        examMarks: assignment.marks.exam_score,
        existingCA: assignment.marks.ca_1_score,
        existingExam: assignment.marks.exam_score,
      }));

      students.value = transformedStudents;

      // Update pagination (simplified since we're getting all students for the subject)
      pagination.value = {
        currentPage: 1,
        totalPages: 1,
        totalCount: transformedStudents.length,
        limit: transformedStudents.length,
        hasNextPage: false,
        hasPrevPage: false,
      };

      studentsLoaded.value = true;

      const summary = responseData.summary;
      toast.success(
        "Students Loaded",
        `${transformedStudents.length} students loaded successfully. ${
          summary.students_with_ca || 0
        } have CA marks, ${summary.students_with_exam || 0} have exam marks.`
      );

      console.log("Transformed students:", transformedStudents);
    })
    .catch((error) => {
      console.error("Error fetching student assigned subjects:", error);

      if (error.response?.status === 404) {
        toast.warning(
          "No Students Found",
          "No students are assigned to this subject for the selected class, session, and term. Please check the assignments."
        );
      } else {
        toast.error(
          "Failed to Load Students",
          error.response?.data?.message ||
            "An error occurred while fetching student assignments."
        );
      }

      students.value = [];
      studentsLoaded.value = false;
    })
    .finally(() => {
      loading.value = false;
    });
};

// Event Handlers
const handleClassChange = () => {
  // Reset subject selection when class changes
  selection.value.subject = "";
  subjects.value = [];

  // Reset students
  students.value = [];
  studentsLoaded.value = false;

  // Load subjects for the selected class
  if (selection.value.class) {
    loadClassSubjects(selection.value.class);
  }
};

const handleAssessmentTypeChange = () => {
  // Reset students when assessment type changes
  students.value = [];
  studentsLoaded.value = false;
};

const loadStudentsList = () => {
  if (!canLoadStudents.value) {
    toast.error(
      "Validation Error",
      "Please complete all required fields (session, term, class, subject, and assessment type)"
    );
    return;
  }

  // Reset students array and load from API
  students.value = [];
  studentsLoaded.value = false;

  getClassStudents();
};

const calculateGrade = (student) => {
  // This function can be removed or simplified since we're not showing grades
  // Keeping it minimal in case it's needed for backend processing
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

// Helper functions for enhanced table
const getStudentInitials = (fullName) => {
  if (!fullName) return "??";
  const names = fullName.split(" ");
  if (names.length === 1) return names[0].substring(0, 2).toUpperCase();
  return (names[0][0] + names[names.length - 1][0]).toUpperCase();
};

const isStudentAbsent = (student) => {
  if (selection.value.assessmentType === "CA") {
    return student.caMarks === "ABS";
  } else {
    return student.examMarks === "ABS";
  }
};

const isStudentCompleted = (student) => {
  if (selection.value.assessmentType === "CA") {
    return isValidCAMark(student.caMarks);
  } else {
    return isValidExamMark(student.examMarks);
  }
};

const isStudentInvalid = (student) => {
  if (selection.value.assessmentType === "CA") {
    return isInvalidCAMark(student.caMarks);
  } else {
    return isInvalidExamMark(student.examMarks);
  }
};

// Input handling functions
const handleMarksInput = (student, field, event) => {
  // Just update the value and convert to uppercase for ABS
  student[field] = event.target.value.toUpperCase();
  calculateGrade(student);
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
};

const clearAllMarks = () => {
  if (
    confirm(
      "Are you sure you want to clear all marks? This action cannot be undone."
    )
  ) {
    students.value.forEach((student) => {
      if (selection.value.assessmentType === "CA") {
        student.caMarks = null;
      } else {
        student.examMarks = null;
      }
    });
    toast.info("Marks Cleared", "All marks have been cleared.");
  }
};

const autoFillMarks = () => {
  // if (
  //   confirm(
  //     "This will auto-fill random marks for all students (for testing purposes). Continue?"
  //   )
  // ) {
  students.value.forEach((student) => {
    if (selection.value.assessmentType === "CA") {
      // Generate random CA marks between 0-40
      const randomMark = Math.floor(Math.random() * 41); // 0 to 40
      student.caMarks = randomMark.toString();
    } else {
      // Generate random Exam marks between 0-60
      const randomMark = Math.floor(Math.random() * 61); // 0 to 60
      student.examMarks = randomMark.toString();
    }
  });
  toast.success(
    "Auto Fill Complete",
    `Random marks have been generated for all ${students.value.length} students.`
  );
  // }
};

const getSelectedClassName = () => {
  const cls = classes.value.find((c) => c.id == selection.value.class);
  return cls ? cls.class_name : "";
};

const getSelectedSubjectName = () => {
  const subject = subjects.value.find((s) => s.id == selection.value.subject);
  return subject ? subject.Subject?.subject_name || subject.subject_name : "";
};

const cancelEntry = () => {
  if (
    confirm("Are you sure you want to cancel? All unsaved data will be lost.")
  ) {
    router.go(-1);
  }
};

const submitMarks = async () => {
  if (!canSubmit.value) {
    toast.error(
      "Validation Error",
      "Please complete all marks entry before submitting."
    );
    return;
  }

  submitting.value = true;

  try {
    if (selection.value.assessmentType === "CA") {
      // Filter students with CA marks
      const studentsWithCAMarks = students.value.filter(
        (student) =>
          student.caMarks !== null &&
          student.caMarks !== undefined &&
          student.caMarks !== ""
      );

      if (studentsWithCAMarks.length > 0) {
        await updateCA1Score(studentsWithCAMarks);

        toast.success(
          "Marks Submitted Successfully",
          `CA marks for ${studentsWithCAMarks.length} students have been submitted successfully.`
        );

        // // Reset or navigate after successful submission
        // setTimeout(() => {
        //   router.push("/grades");
        // }, 1500);
      } else {
        toast.warning("No Marks to Submit", "No CA marks found to submit.");
      }
    } else if (selection.value.assessmentType === "EXAM") {
      // Filter students with exam marks
      const studentsWithExamMarks = students.value.filter(
        (student) =>
          student.examMarks !== null &&
          student.examMarks !== undefined &&
          student.examMarks !== ""
      );

      if (studentsWithExamMarks.length > 0) {
        await updateExamScore(studentsWithExamMarks);

        toast.success(
          "Marks Submitted Successfully",
          `Exam marks for ${studentsWithExamMarks.length} students have been submitted successfully.`
        );

        // Reset or navigate after successful submission
        // setTimeout(() => {
        //   router.push("/grades");
        // }, 1500);
      } else {
        toast.warning("No Marks to Submit", "No exam marks found to submit.");
      }
    }
  } catch (error) {
    console.error("Error in submitMarks:", error);
    toast.error(
      "Submission Failed",
      error.message || "Failed to submit marks. Please try again."
    );
  } finally {
    submitting.value = false;
  }
};

// Note: Existing marks are now loaded directly by getClassStudents function
// No need for separate CA/Exam score loading functions

const updateCA1Score = async (studentsArray) => {
  // Filter only students whose CA marks have changed
  const changedStudents = studentsArray.filter((studentData) => {
    const currentCA =
      studentData.caMarks === "ABS" ? null : parseFloat(studentData.caMarks);
    const existingCA =
      studentData.existingCA === "ABS"
        ? null
        : parseFloat(studentData.existingCA);

    // Compare current vs existing (handle null/undefined cases)
    return currentCA !== existingCA;
  });

  if (changedStudents.length === 0) {
    toast.info(
      "No Changes Detected",
      "No CA marks have been modified. Nothing to update."
    );
    return Promise.resolve({ status: "success", count: 0 });
  }

  const data = changedStudents.map((studentData) => ({
    student_id: studentData.id,
    current_class_id: selection.value.class,
    school_subject_id: selection.value.subject,
    current_session_id: selection.value.session,
    current_term_id: selection.value.term,
    ca_1_score:
      studentData.caMarks === "ABS" ? null : parseFloat(studentData.caMarks),
  }));

  console.log(
    `Sending CA1 data for ${changedStudents.length} changed students out of ${studentsArray.length} total:`,
    data
  );

  // console.log("Sending CA1 data:", data);
  // console.log("Selection values:", {
  //   class: selection.value.class,
  //   subject: selection.value.subject,
  //   session: selection.value.session,
  //   term: selection.value.term,
  // });

  return apiServices
    .updateCA1Score(data)
    .then((response) => {
      const responseData = response.data;
      // console.log("CA1 Response:", responseData);

      if (responseData.status === "success") {
        toast.success(
          "CA Scores Updated",
          `CA scores updated successfully for ${
            responseData.count || changedStudents.length
          } students`
        );
      } else if (responseData.status === "partial_success") {
        // console.log("Partial success errors:", responseData.errors);
        toast.warning(
          "Partial Success",
          `${responseData.successful_count} CA scores updated successfully, ${responseData.error_count} failed. Check console for details.`
        );

        // Log detailed errors
        responseData.errors?.forEach((error, index) => {
          console.error(`Student ${error.student_id} error:`, error.error);
        });
      }

      return responseData;
    })
    .catch((error) => {
      console.error("Error updating CA1 scores:", error);
      console.error("Full error response:", error.response);
      toast.error(
        "Update Failed",
        error.response?.data?.message ||
          "Failed to update CA scores. Please try again."
      );
      throw error;
    });
};

const updateExamScore = async (studentsArray) => {
  // Filter only students whose exam marks have changed
  const changedStudents = studentsArray.filter((studentData) => {
    const currentExam =
      studentData.examMarks === "ABS"
        ? null
        : parseFloat(studentData.examMarks);
    const existingExam =
      studentData.existingExam === "ABS"
        ? null
        : parseFloat(studentData.existingExam);

    // Compare current vs existing (handle null/undefined cases)
    return currentExam !== existingExam;
  });

  if (changedStudents.length === 0) {
    toast.info(
      "No Changes Detected",
      "No exam marks have been modified. Nothing to update."
    );
    return Promise.resolve({ status: "success", count: 0 });
  }

  const data = changedStudents.map((studentData) => ({
    student_id: studentData.id,
    current_class_id: selection.value.class,
    school_subject_id: selection.value.subject,
    current_session_id: selection.value.session,
    current_term_id: selection.value.term,
    exam_score:
      studentData.examMarks === "ABS"
        ? null
        : parseFloat(studentData.examMarks),
  }));

  console.log(
    `Sending Exam data for ${changedStudents.length} changed students out of ${studentsArray.length} total:`,
    data
  );

  // console.log("Sending Exam data:", data);
  // console.log("Selection values:", {
  //   class: selection.value.class,
  //   subject: selection.value.subject,
  //   session: selection.value.session,
  //   term: selection.value.term,
  // });

  return apiServices
    .updateExamScore(data)
    .then((response) => {
      const responseData = response.data;
      console.log("Exam Response:", responseData);

      if (responseData.status === "success") {
        toast.success(
          "Exam Scores Updated",
          `Exam scores updated successfully for ${
            responseData.count || changedStudents.length
          } students`
        );
      } else if (responseData.status === "partial_success") {
        console.log("Partial success errors:", responseData.errors);
        toast.warning(
          "Partial Success",
          `${responseData.successful_count} exam scores updated successfully, ${responseData.error_count} failed. Check console for details.`
        );

        // Log detailed errors
        responseData.errors?.forEach((error, index) => {
          console.error(`Student ${error.student_id} error:`, error.error);
        });
      }

      return responseData;
    })
    .catch((error) => {
      console.error("Error updating exam scores:", error);
      console.error("Full error response:", error.response);
      toast.error(
        "Update Failed",
        error.response?.data?.message ||
          "Failed to update exam scores. Please try again."
      );
      throw error;
    });
};

// Initialize data on component mount
onMounted(() => {
  getAllRowSessions();
  getAllRowClases();
});
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

.btn-quick-action.auto-fill {
  background: #10b981;
  color: white;
  border-color: #10b981;
}

.btn-quick-action.auto-fill:hover {
  background: #059669;
  border-color: #059669;
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
  width: 80px;
}

.col-student {
  min-width: 280px;
}

.col-marks {
  width: 200px;
}

.col-status {
  width: 140px;
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
  /* margin-top: 5px; */
}

.enhanced-marks-input {
  width: 100%;
  padding: 4px 8px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  transition: all 0.3s ease;
  background: white;
  text-transform: uppercase;
  text-align: center;
}

.enhanced-marks-input:focus {
  outline: none;
  border-color: #667eea;
}

.enhanced-marks-input.invalid {
  border-color: #ef4444;
  background: rgba(239, 68, 68, 0.02);
}

.enhanced-marks-input.completed {
  border-color: #10b981;
  background: rgba(16, 185, 129, 0.02);
}

.enhanced-marks-input.absent {
  border-color: #f59e0b;
  background: rgba(245, 158, 11, 0.05);
  color: #f59e0b;
  font-weight: 600;
}

.input-feedback {
  margin-top: 6px;
  min-height: 20px;
}

.error-msg,
.success-msg,
.absent-msg {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 500;
}

.error-msg {
  color: #ef4444;
}

.success-msg {
  color: #10b981;
}

.absent-msg {
  color: #f59e0b;
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

/* Legacy table styles for backward compatibility */
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

  /* Enhanced table mobile styles */
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
    width: 60px;
  }

  .col-student {
    min-width: 200px;
  }

  .col-marks {
    width: 160px;
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
    padding: 4px 8px;
    font-size: 12px;
  }

  .input-feedback {
    margin-top: 4px;
    min-height: 16px;
  }

  .error-msg,
  .success-msg,
  .absent-msg {
    font-size: 10px;
    gap: 3px;
  }

  .status-badge {
    padding: 3px 6px;
    font-size: 10px;
    gap: 3px;
  }
}

/* Simple exam marks styles */
.exam-marks-simple {
  width: 100%;
}

.marks-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
}

.ca-display {
  background: #f8fafc;
  padding: 4px 8px;
  border-radius: 4px;
  color: #64748b;
  font-weight: 500;
  white-space: nowrap;
}

.exam-input {
  flex: 1;
  padding: 4px 8px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 12px;
  text-align: center;
  min-width: 60px;
  max-width: 80px;
}

.exam-input:focus {
  outline: none;
  border-color: #667eea;
}

.exam-input.invalid {
  border-color: #ef4444;
}

.exam-input.completed {
  border-color: #10b981;
}

.exam-input.absent {
  border-color: #f59e0b;
}

.total-display {
  background: #e0f2fe;
  padding: 4px 8px;
  border-radius: 4px;
  color: #0369a1;
  font-weight: 600;
  white-space: nowrap;
}

/* Mobile exam container styles */
.mobile-exam-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.mobile-ca-display,
.mobile-total-display {
  display: flex;
  justify-content: space-between;
  align-items: center !important;
  padding: 6px 10px;
  background: #f8fafc;
  border-radius: 4px;
  border: 1px solid #e2e8f0;
  font-size: 12px;
}

.mobile-ca-label,
.mobile-total-label {
  font-weight: 600;
  color: #475569;
}

.mobile-ca-score,
.mobile-total-score {
  font-weight: 600;
  color: #1e293b;
}

.mobile-total-display {
  background: #f0f9ff;
  border-color: #0ea5e9;
}

.mobile-total-score {
  color: #0ea5e9;
}

/* Mobile card layout styles */
.mobile-cards {
  display: none;
}

/* Mobile card layout for very small screens */
@media (max-width: 480px) {
  .enhanced-table-wrapper {
    display: none;
  }

  .mobile-cards {
    display: block;
  }
}

.mobile-card {
  background: white;
  border: 1px solid rgba(102, 126, 234, 0.1);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.mobile-card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(102, 126, 234, 0.1);
}

.mobile-card-body {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.mobile-marks-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.mobile-marks-label {
  font-size: 13px;
  font-weight: 600;
  color: #475569;
}

.mobile-status-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
