<template>
  <!-- Main Content Area -->
  <div class="">
    <!-- Page Header -->

    <!-- Dashboard Content -->
    <div class="content-section">
      <!-- Welcome Section -->
      <div class="welcome-card">
        <h3>Welcome {{ getStaff?.full_name }}</h3>
        <p>Have a great day teaching!</p>
      </div>

      <!-- Stats Cards -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon dashboard-icon">
            <svg
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          </div>
          <div class="stat-content">
            <h3>{{ getSummary?.myClasses }}</h3>
            <p>My Classes</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon exams-icon">
            <i class="fa fa-book"></i>
          </div>
          <div class="stat-content">
            <h3>{{ getSummary?.myTotalSubjects }}</h3>
            <p>My Subjects</p>
          </div>
        </div>
      </div>

      <!-- Assigned Classes & Subjects -->
      <div class="table-section">
        <div class="section-header">
          <h3>My Assigned Classes & Subjects</h3>
        </div>

        <div class="assigned-classes-grid">
          <div
            v-for="classData in getAssignments"
            :key="classData.class_id"
            class="class-card"
          >
            <div class="class-header">
              <h4>{{ classData.class_name }}</h4>
              <span class="subject-count"
                >{{ classData.subjects.length }} subjects</span
              >
            </div>

            <div class="subjects-list">
              <div
                v-for="subject in classData.subjects"
                :key="subject.id"
                class="subject-item"
              >
                <div class="subject-info">
                  <span class="subject-name">{{ subject.subject_name }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty state when no assignments -->
        <div
          v-if="
            !assignedSubjects.assignments ||
            assignedSubjects.assignments.length === 0
          "
          class="empty-state"
        >
          <div class="empty-icon">
            <svg
              width="48"
              height="48"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
          <h4>No Classes Assigned</h4>
          <p>
            You don't have any classes or subjects assigned yet. Please contact
            the administrator.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import apiServices from "../../services/apiServices";
import { useLoginStore } from "../../store/loginStore";
import { useTeacherAssignedSubjectStore } from "../../store/teacherAssignedSubjectStore";
import { storeToRefs } from "pinia";

const teacherAssignedSubjectStore = useTeacherAssignedSubjectStore();
const { getStaff, getSummary, getAssignments, isSubjectLoaded } =
  storeToRefs(teacherAssignedSubjectStore);

const teacherName = ref("Mrs. Sarah Johnson");
const loginStore = useLoginStore();
const assignedSubjects = ref([]);

// Handle tab change from BottomNav component

// Mock data for the new dashboard layout
const getStaffAssigned = () => {
  teacherAssignedSubjectStore.CLEAR_TEACHER_DATA();
  apiServices
    .getStaffAssigned(loginStore.user?.id)
    .then((response) => {
      assignedSubjects.value = response.data.data;
      teacherAssignedSubjectStore.SET_TEACHER_DATA(response.data.data);
    })
    .catch((error) => {
      console.error("Error fetching staff assigned subjects:", error);
    });
};

onMounted(() => {
  if (!isSubjectLoaded.value) {
    getStaffAssigned();
  }
  // getStaffAssigned();
});
</script>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #f8fafc;
}

/* Main Content */
.main-content {
  flex: 1;
  overflow-y: auto;
  padding: 90px 20px 100px 20px; /* Top padding for header, bottom padding for nav */
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

/* Content wrapper to maintain proper width */
.page-header,
.content-section {
  width: 100%;
  max-width: 100%;
}

/* Page Header (below top header) */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.page-header-left h1 {
  font-size: 28px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 4px 0;
}

.date-text {
  color: #64748b;
  margin: 0;
  font-size: 14px;
}

.role-select {
  padding: 8px 12px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  background: white;
  color: #374151;
  min-width: 120px;
}

.role-select:focus {
  outline: none;
  border-color: #667eea;
}

/* Content Sections */
.content-section {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Welcome Card */
.welcome-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 24px;
  border-radius: 12px;
  margin-bottom: 24px;
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.3);
}

.welcome-card h3 {
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 8px 0;
}

.welcome-card p {
  margin: 0;
  opacity: 0.9;
  font-size: 16px;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-icon {
  width: 50px;
  height: 50px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.dashboard-icon {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
.exams-icon {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.stat-content h3 {
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 4px 0;
}

.stat-content p {
  color: #64748b;
  margin: 0;
  font-size: 14px;
}

/* Section Headers */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-header h3 {
  font-size: 20px;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

/* Search Bar */
.search-bar {
  margin-bottom: 20px;
}

.search-input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  background: white;
}

.search-input:focus {
  outline: none;
  border-color: #667eea;
}

/* Buttons */
.add-btn {
  padding: 10px 16px;
  background: #10b981;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.add-btn:hover {
  background: #059669;
}

/* Table Styles */
.table-section {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.data-table {
  border: 2px solid #f1f5f9;
  border-radius: 8px;
  overflow: hidden;
}

.data-table table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th {
  background: #f8fafc;
  padding: 12px 16px;
  text-align: left;
  font-weight: 600;
  color: #374151;
  border-bottom: 2px solid #e5e7eb;
}

.data-table td {
  padding: 12px 16px;
  border-bottom: 1px solid #f1f5f9;
  color: #374151;
}

.data-table tr:hover {
  background: #f8fafc;
}

.action-btn {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  margin-right: 8px;
  transition: all 0.2s;
}

.action-btn.edit {
  background: #3b82f6;
  color: white;
}

.action-btn.edit:hover {
  background: #2563eb;
}

.action-btn.delete {
  background: #ef4444;
  color: white;
}

.action-btn.delete:hover {
  background: #dc2626;
}

/* Assigned Classes & Subjects Styles */
.assigned-classes-grid {
  display: grid;
  gap: 20px;
}

.class-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  border: 1px solid #e5e7eb;
}

.class-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f1f5f9;
}

.class-header h4 {
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.subject-count {
  background: #667eea;
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.subjects-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.subject-item {
  padding: 12px 16px;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  transition: all 0.2s;
}

.subject-item:hover {
  background: #f1f5f9;
  border-color: #667eea;
}

.subject-info {
  flex: 1;
}

.subject-name {
  font-size: 14px;
  font-weight: 500;
  color: #1e293b;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #64748b;
}

.empty-icon {
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
  color: #9ca3af;
}

.empty-state h4 {
  font-size: 18px;
  font-weight: 600;
  color: #374151;
  margin: 0 0 8px 0;
}

.empty-state p {
  margin: 0;
  font-size: 14px;
}
.students-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
}

.student-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  display: flex;
  align-items: center;
  gap: 16px;
}

.student-avatar {
  width: 50px;
  height: 50px;
  background: #667eea;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 18px;
}

.student-info {
  flex: 1;
}

.student-info h4 {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 4px 0;
}

.student-info p {
  color: #64748b;
  margin: 0;
  font-size: 14px;
}

.student-actions {
  display: flex;
  gap: 8px;
}

/* Exam Styles */
.exam-buttons {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.exam-btn {
  padding: 10px 16px;
  border: 2px solid #e5e7eb;
  background: white;
  color: #374151;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.exam-btn:hover {
  border-color: #667eea;
  color: #667eea;
}

.exam-btn.active {
  background: #667eea;
  border-color: #667eea;
  color: white;
}

.exam-section h3 {
  font-size: 20px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 20px 0;
}

.exam-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.exam-card {
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  padding: 20px;
  transition: all 0.2s;
}

.exam-card:hover {
  border-color: #667eea;
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.15);
}

.exam-card h4 {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 8px 0;
}

.exam-card p {
  color: #64748b;
  margin: 0 0 4px 0;
  font-size: 14px;
}

.exam-date {
  color: #667eea !important;
  font-weight: 500;
  margin-bottom: 16px !important;
}

.exam-actions {
  display: flex;
  gap: 8px;
}

.btn-primary {
  padding: 8px 12px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-primary:hover {
  background: #5a67d8;
}

.btn-secondary {
  padding: 8px 12px;
  background: transparent;
  color: #667eea;
  border: 2px solid #667eea;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-secondary:hover {
  background: #667eea;
  color: white;
}

/* Reports Grid */
.reports-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.report-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  text-align: center;
}

.report-card h4 {
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 12px 0;
}

.report-card p {
  color: #64748b;
  margin: 0 0 20px 0;
  font-size: 14px;
}

/* Profile Section */
.profile-section {
  background: white;
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  max-width: 500px;
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 32px;
}

.profile-avatar {
  width: 80px;
  height: 80px;
  background: #667eea;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 32px;
}

.profile-info h3 {
  font-size: 24px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 4px 0;
}

.profile-info p {
  color: #64748b;
  margin: 0;
  font-size: 16px;
}

.profile-details {
  margin-bottom: 32px;
}

.detail-item {
  margin-bottom: 20px;
}

.detail-item label {
  display: block;
  font-weight: 600;
  color: #374151;
  margin-bottom: 4px;
  font-size: 14px;
}

.detail-item p {
  color: #64748b;
  margin: 0;
  font-size: 16px;
}

/* Responsive Design */
@media (max-width: 768px) {
  .main-content {
    padding: 90px 16px 100px 16px;
    max-width: 100%;
  }

  .page-header {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }

  .page-header-left {
    text-align: center;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .students-grid {
    grid-template-columns: 1fr;
  }

  .exam-grid {
    grid-template-columns: 1fr;
  }

  .reports-grid {
    grid-template-columns: 1fr;
  }

  .data-table {
    overflow-x: auto;
  }

  .exam-buttons {
    justify-content: center;
  }

  .student-card {
    flex-direction: column;
    text-align: center;
  }

  .student-actions {
    justify-content: center;
  }
}

@media (max-width: 1200px) {
  .main-content {
    max-width: 95%;
  }
}
</style>