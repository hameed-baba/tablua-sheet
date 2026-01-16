<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1>Dashboard</h1>
        <p>
          Welcome back! Here's an overview of your school management system.
        </p>
      </div>
      <div class="header-actions">
        <button class="btn btn-secondary btn-sm" @click="refreshDashboard" :disabled="dashboardLoading">
          <svg
            width="16"
            height="16"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            style="margin-right: 0.5rem"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          {{ dashboardLoading ? 'Loading...' : 'Refresh' }}
        </button>
        <span class="current-term">
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
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          {{ currentSession }} - {{ currentTerm }}
        </span>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="stats-grid" :class="{ 'loading': dashboardLoading }">
      <div class="stat-card">
        <div class="stat-card-header">
          <span class="stat-card-title">Total Students</span>
          <div
            class="stat-card-icon"
            style="background: rgba(59, 130, 246, 0.1); color: #3b82f6"
          >
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
                d="M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
              />
            </svg>
          </div>
        </div>
        <div class="stat-card-value">{{ stats.totalStudents }}</div>
        <div class="stat-card-change positive">
          {{ dashboardStats.activity?.newStudentsThisTerm ? `+${dashboardStats.activity.newStudentsThisTerm} new this term` : '+23 new this term' }}
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-card-header">
          <span class="stat-card-title">Teaching Staff</span>
          <div
            class="stat-card-icon"
            style="background: rgba(16, 185, 129, 0.1); color: #10b981"
          >
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
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
        </div>
        <div class="stat-card-value">{{ stats.totalStaff }}</div>
        <div class="stat-card-change positive">
          {{ staffActivity.summary.total_active }} currently active
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-card-header">
          <span class="stat-card-title">Active Classes</span>
          <div
            class="stat-card-icon"
            style="background: rgba(245, 158, 11, 0.1); color: #f59e0b"
          >
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
        </div>
        <div class="stat-card-value">{{ stats.totalClasses }}</div>
        <div class="stat-card-change positive">All classes running</div>
      </div>

      <!-- <div class="stat-card">
        <div class="stat-card-header">
          <span class="stat-card-title">Today's Attendance</span>
          <div class="stat-card-icon" style="background: rgba(139, 92, 246, 0.1); color: #8b5cf6;">
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
        </div>
        <div class="stat-card-value">92.5%</div>
        <div class="stat-card-change positive">Excellent attendance</div>
      </div> -->
    </div>

    <!-- Charts Section - Commented Out -->
    <!--
    <div class="charts-section"></div>
      <div class="charts-grid">
        <div class="chart-card">
          <BarChart
            title="Students by Class"
            subtitle="Distribution of students across different classes"
            :data="classDistribution"
            :loading="chartsLoading.classDistribution"
            :error="chartsError.classDistribution"
          />
        </div>

        <div class="chart-card">
          <DonutChart
            title="Gender Distribution"
            subtitle="Male vs Female students"
            :data="genderDistribution"
            :loading="chartsLoading.genderDistribution"
            :error="chartsError.genderDistribution"
            :size="180"
          />
          <div class="debug-info" v-if="genderDistribution.length > 0">
            <small>Debug: {{ JSON.stringify(genderDistribution) }}</small>
          </div>
        </div>

        <div class="chart-card full-width">
          <LineChart
            title="Enrollment Trends"
            subtitle="Monthly student enrollment for current year"
            :data="enrollmentTrends"
            :loading="chartsLoading.enrollmentTrends"
            :error="chartsError.enrollmentTrends"
            :width="800"
            :height="300"
          />
        </div>

        <div class="chart-card">
          <DonutChart
            title="Student Status"
            subtitle="Active, graduated, and other statuses"
            :data="studentStatus"
            :loading="chartsLoading.studentStatus"
            :error="chartsError.studentStatus"
            :size="180"
          />
        </div>

        <div class="chart-card">
          <BarChart
            title="Age Distribution"
            subtitle="Students grouped by age ranges"
            :data="ageDistribution"
            :loading="chartsLoading.ageDistribution"
            :error="chartsError.ageDistribution"
            :colors="['#06b6d4', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#10b981']"
          />
        </div>
      </div>
    </div>
    -->

    <!-- Quick Actions -->
    <div class="quick-actions-section">
      <h2 class="section-title">Quick Actions</h2>
      <div class="quick-actions-grid">
        <router-link to="/students/register" class="quick-action-card">
          <div
            class="action-icon"
            style="
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            "
          >
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
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
              />
            </svg>
          </div>
          <div class="action-content">
            <h3>Register Student</h3>
            <p>Add new student to the system</p>
          </div>
        </router-link>

        <router-link to="/staff/register" class="quick-action-card">
          <div
            class="action-icon"
            style="
              background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
            "
          >
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
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
              />
            </svg>
          </div>
          <div class="action-content">
            <h3>Register Staff</h3>
            <p>Add new staff member</p>
          </div>
        </router-link>

        <router-link to="/add-marks" class="quick-action-card">
          <div
            class="action-icon"
            style="
              background: linear-gradient(135deg, #ed8936 0%, #dd6b20 100%);
            "
          >
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
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
              />
            </svg>
          </div>
          <div class="action-content">
            <h3>Add Marks</h3>
            <p>Enter student examination marks</p>
          </div>
        </router-link>

        <!-- <router-link to="/attendance" class="quick-action-card">
          <div class="action-icon" style="background: linear-gradient(135deg, #4299e1 0%, #3182ce 100%);">
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <div class="action-content">
            <h3>Take Attendance</h3>
            <p>Mark student attendance</p>
          </div>
        </router-link>

        <router-link to="/report-card" class="quick-action-card">
          <div class="action-icon" style="background: linear-gradient(135deg, #9f7aea 0%, #805ad5 100%);">
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div class="action-content">
            <h3>Report Card</h3>
            <p>Generate student report cards</p>
          </div>
        </router-link> -->

        <router-link to="/classes" class="quick-action-card">
          <div
            class="action-icon"
            style="
              background: linear-gradient(135deg, #f56565 0%, #e53e3e 100%);
            "
          >
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
          <div class="action-content">
            <h3>Manage Classes</h3>
            <p>View and manage classes</p>
          </div>
        </router-link>
      </div>
    </div>

    <!-- Staff Activity Status -->
    <div class="data-table-container">
      <div class="table-header">
        <h2 class="table-title">Staff Activity Status</h2>
        <div class="table-actions">
          <button
            class="btn btn-secondary btn-sm"
            @click="cleanupStaleSessions"
            :disabled="cleanupLoading"
          >
            <svg
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              style="margin-right: 0.5rem"
            >
              path
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            {{ cleanupLoading ? "Cleaning..." : "Cleanup" }}
          </button>
          <button
            class="btn btn-secondary btn-sm"
            @click="refreshStaffActivity"
            :disabled="staffActivityLoading"
          >
            <svg
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              style="margin-right: 0.5rem"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            {{ staffActivityLoading ? "Loading..." : "Refresh" }}
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="staffActivityLoading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>Loading staff activity...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="staffActivityError" class="error-state">
        <p>{{ staffActivityError }}</p>
        <button class="btn btn-primary btn-sm" @click="loadStaffActivity">
          Try Again
        </button>
      </div>

      <!-- Staff Activity Table -->
      <div v-else class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>Staff Name</th>
              <th class="d-none d-md-table-cell">Email</th>
              <th class="d-none d-lg-table-cell">Role</th>
              <th class="d-none d-sm-table-cell">Time</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <!-- Active Staff -->
            <tr
              v-for="staff in staffActivity.active_staff"
              :key="`active-${staff.id}`"
            >
              <td>
                <strong>{{ staff.full_name }}</strong>
                <div class="d-md-none">
                  <small class="text-muted"
                    >{{ staff.email }} •
                    {{ formatTime(staff.login_time) }}</small
                  >
                </div>
              </td>
              <td class="d-none d-md-table-cell">{{ staff.email }}</td>
              <td class="d-none d-lg-table-cell">
                <span class="module-badge">{{ staff.role }}</span>
              </td>
              <td class="d-none d-sm-table-cell">
                {{ formatTime(staff.login_time) }}
              </td>
              <td>
                <span class="status-badge status-active">
                  <svg
                    width="8"
                    height="8"
                    fill="currentColor"
                    viewBox="0 0 8 8"
                    style="margin-right: 0.25rem"
                  >
                    <circle cx="4" cy="4" r="4" />
                  </svg>
                  Online
                </span>
              </td>
            </tr>

            <!-- Recently Logged Out Staff -->
            <tr
              v-for="staff in staffActivity.recently_logged_out"
              :key="`recent-${staff.id}`"
            >
              <td>
                <strong>{{ staff.full_name }}</strong>
                <div class="d-md-none">
                  <small class="text-muted"
                    >{{ staff.email }} •
                    {{ formatTime(staff.logout_time) }}</small
                  >
                </div>
              </td>
              <td class="d-none d-md-table-cell">{{ staff.email }}</td>
              <td class="d-none d-lg-table-cell">
                <span class="module-badge">{{ staff.role }}</span>
              </td>
              <td class="d-none d-sm-table-cell">
                {{ formatTime(staff.logout_time) }}
              </td>
              <td>
                <span class="status-badge status-pending">
                  <svg
                    width="8"
                    height="8"
                    fill="currentColor"
                    viewBox="0 0 8 8"
                    style="margin-right: 0.25rem"
                  >
                    <circle cx="4" cy="4" r="4" />
                  </svg>
                  Recently Offline
                </span>
              </td>
            </tr>

            <!-- Empty State -->
            <tr
              v-if="
                !staffActivity.active_staff?.length &&
                !staffActivity.recently_logged_out?.length
              "
            >
              <td colspan="5" class="text-center">
                <div class="empty-state">
                  <svg
                    width="48"
                    height="48"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    style="margin-bottom: 1rem; opacity: 0.5"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  <p>No staff activity data available</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Summary -->
      <div v-if="staffActivity.summary" class="activity-summary">
        <div class="summary-item">
          <span class="summary-label">Active Staff:</span>
          <span class="summary-value">{{
            staffActivity.summary.total_active
          }}</span>
        </div>
        <div class="summary-item">
          <span class="summary-label">Recently Offline:</span>
          <span class="summary-value">{{
            staffActivity.summary.total_recently_logged_out
          }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import apiServices from "../services/apiServices";
// import BarChart from '../components/charts/BarChart.vue'
// import DonutChart from '../components/charts/DonutChart.vue'
// import LineChart from '../components/charts/LineChart.vue'

const currentSession = ref("2024/2025 Session");
const currentTerm = ref("First Term");

const stats = ref({
  totalStudents: 0,
  totalStaff: 0,
  totalClasses: 0,
});

const dashboardStats = ref({
  overview: {},
  activity: {},
  session: {},
  cards: [],
});

const sessionInfo = ref({
  session: null,
  term: null,
});

// Chart data
// const classDistribution = ref([])
// const genderDistribution = ref([
//   // Test data to see if chart renders
//   { label: 'Male', value: 50 },
//   { label: 'Female', value: 45 }
// ])
// const enrollmentTrends = ref([])
// const studentStatus = ref([])
// const ageDistribution = ref([])

// Loading states
// const chartsLoading = ref({
//   classDistribution: false,
//   genderDistribution: false,
//   enrollmentTrends: false,
//   studentStatus: false,
//   ageDistribution: false
// })

// Error states
// const chartsError = ref({
//   classDistribution: null,
//   genderDistribution: null,
//   enrollmentTrends: null,
//   studentStatus: null,
//   ageDistribution: null
// })

// Staff Activity Data
const staffActivity = ref({
  active_staff: [],
  recently_logged_out: [],
  summary: {
    total_active: 0,
    total_recently_logged_out: 0,
    total_staff: 0,
  },
});

const staffActivityLoading = ref(false);
const staffActivityError = ref(null);
const cleanupLoading = ref(false);
const dashboardLoading = ref(false);

// Load staff activity status
const loadStaffActivity = async () => {
  staffActivityLoading.value = true;
  staffActivityError.value = null;

  try {
    console.log("Loading staff activity...");
    const response = await apiServices.getStaffActivityStatus();
    console.log("Staff activity response:", response.data);

    staffActivity.value = response.data.data;
  } catch (error) {
    console.error("Failed to load staff activity:", error);
    staffActivityError.value = "Failed to load staff activity data";
  } finally {
    staffActivityLoading.value = false;
  }
};

// Refresh staff activity
const refreshStaffActivity = () => {
  loadStaffActivity();
};

// Refresh all dashboard data
const refreshDashboard = async () => {
  await Promise.all([loadDashboardStats(), loadStaffActivity()]);
};

// Cleanup stale sessions
const cleanupStaleSessions = async () => {
  cleanupLoading.value = true;

  try {
    console.log("Cleaning up stale sessions...");
    const response = await apiServices.cleanupStaleSessions();
    console.log("Cleanup response:", response.data);

    // Show success message (you can add a toast notification here)
    alert(
      `Successfully cleaned up ${response.data.data.sessions_cleaned} stale sessions`
    );

    // Refresh the staff activity data
    await loadStaffActivity();
  } catch (error) {
    console.error("Failed to cleanup stale sessions:", error);
    alert("Failed to cleanup stale sessions");
  } finally {
    cleanupLoading.value = false;
  }
};

// Format time helper
const formatTime = (timeString) => {
  if (!timeString) return "N/A";

  const date = new Date(timeString);
  const now = new Date();
  const diffInMinutes = Math.floor((now - date) / (1000 * 60));

  if (diffInMinutes < 1) {
    return "Just now";
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  } else if (diffInMinutes < 1440) {
    // Less than 24 hours
    const hours = Math.floor(diffInMinutes / 60);
    return `${hours}h ago`;
  } else {
    return (
      date.toLocaleDateString() +
      " " +
      date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  }
};

// Load dashboard statistics
// const loadDashboardStats = async () => {
//   chartsLoading.value.genderDistribution = true
//   chartsError.value.genderDistribution = null

//   try {
//     console.log('Loading dashboard stats...')
//     const response = await apiServices.getDashboardStats()
//     console.log('Dashboard stats response:', response.data)

//     const data = response.data.data

//     stats.value = {
//       totalStudents: data.overview.totalStudents,
//       totalStaff: data.overview.totalStaff,
//       totalClasses: data.overview.totalClasses
//     }

//     // Update gender distribution
//     const genderData = [
//       { label: 'Male', value: data.genderDistribution.male },
//       { label: 'Female', value: data.genderDistribution.female }
//     ]

//     console.log('Gender distribution data:', genderData)
//     genderDistribution.value = genderData

//   } catch (error) {
//     console.error('Failed to load dashboard stats:', error)
//     chartsError.value.genderDistribution = 'Failed to load gender distribution data'
//   } finally {
//     chartsLoading.value.genderDistribution = false
//   }
// }

// Load class distribution
// const loadClassDistribution = async () => {
//   chartsLoading.value.classDistribution = true
//   chartsError.value.classDistribution = null

//   try {
//     const response = await apiServices.getClassDistribution()
//     classDistribution.value = response.data.data.distribution.map(item => ({
//       label: item.className,
//       value: item.count
//     }))
//   } catch (error) {
//     console.error('Failed to load class distribution:', error)
//     chartsError.value.classDistribution = 'Failed to load class distribution data'
//   } finally {
//     chartsLoading.value.classDistribution = false
//   }
// }

// Load enrollment trends
// const loadEnrollmentTrends = async () => {
//   chartsLoading.value.enrollmentTrends = true
//   chartsError.value.enrollmentTrends = null

//   try {
//     const response = await apiServices.getEnrollmentTrends()
//     enrollmentTrends.value = response.data.data.trends
//   } catch (error) {
//     console.error('Failed to load enrollment trends:', error)
//     chartsError.value.enrollmentTrends = 'Failed to load enrollment trends data'
//   } finally {
//     chartsLoading.value.enrollmentTrends = false
//   }
// }

// Load student status distribution
// const loadStudentStatus = async () => {
//   chartsLoading.value.studentStatus = true
//   chartsError.value.studentStatus = null

//   try {
//     const response = await apiServices.getStudentStatusDistribution()
//     studentStatus.value = response.data.data.distribution.map(item => ({
//       label: item.status,
//       value: item.count
//     }))
//   } catch (error) {
//     console.error('Failed to load student status:', error)
//     chartsError.value.studentStatus = 'Failed to load student status data'
//   } finally {
//     chartsLoading.value.studentStatus = false
//   }
// }

// Load age distribution
// const loadAgeDistribution = async () => {
//   chartsLoading.value.ageDistribution = true
//   chartsError.value.ageDistribution = null

//   try {
//     const response = await apiServices.getAgeDistribution()
//     ageDistribution.value = response.data.data.distribution.map(item => ({
//       label: item.ageRange,
//       value: item.count
//     }))
//   } catch (error) {
//     console.error('Failed to load age distribution:', error)
//     chartsError.value.ageDistribution = 'Failed to load age distribution data'
//   } finally {
//     chartsLoading.value.ageDistribution = false
//   }
// }

// Load dashboard statistics
const loadDashboardStats = async () => {
  dashboardLoading.value = true;
  
  try {
    console.log("Loading dashboard stats...");
    const response = await apiServices.getDashboardStats();
    console.log("Dashboard stats response:", response.data);

    const data = response.data.data;

    // Update stats
    stats.value = {
      totalStudents: data.overview.totalStudents,
      totalStaff: data.overview.totalStaff,
      totalClasses: data.overview.totalClasses,
    };

    // Store full dashboard stats
    dashboardStats.value = data;

    // Update session info
    if (data.session.currentSession) {
      currentSession.value =
        data.session.currentSession.session_name || "2024/2025 Session";
    }
    if (data.session.currentTerm) {
      currentTerm.value = data.session.currentTerm.term_name || "First Term";
    }
  } catch (error) {
    console.error("Failed to load dashboard stats:", error);
    // Set default values on error
    stats.value = {
      totalStudents: 0,
      totalStaff: 0,
      totalClasses: 0,
    };
  } finally {
    dashboardLoading.value = false;
  }
};

onMounted(async () => {
  // Load all dashboard data
  await Promise.all([loadDashboardStats(), loadStaffActivity()]);
});
</script>

<style scoped>
.current-term {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
}

/* .charts-section {
  margin-bottom: 2rem;
}

.charts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.chart-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.chart-card.full-width {
  grid-column: 1 / -1;
} */

.quick-actions-section {
  margin-bottom: 2rem;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 1rem;
}

.quick-actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.25rem;
}

.quick-action-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.5);
  transition: all 0.2s;
  text-decoration: none;
  color: inherit;
}

.quick-action-card:hover {
  transform: translateY(-4px);
}

.action-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: white;
}

.action-content h3 {
  margin: 0 0 0.25rem 0;
  font-size: 1rem;
  font-weight: 600;
  color: #2d3748;
  text-shadow: none;
}

.action-content p {
  margin: 0;
  font-size: 0.875rem;
  color: #718096;
}

.module-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8125rem;
  font-weight: 500;
  background: #edf2f7;
  color: #4a5568;
}

.btn-sm {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
}

/* Staff Activity Styles */
.loading-state,
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  text-align: center;
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #f3f4f6;
  border-top: 3px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.error-state p {
  color: #ef4444;
  margin-bottom: 1rem;
}

.empty-state {
  padding: 2rem;
  color: #6b7280;
}

.empty-state svg {
  color: #9ca3af;
}

.activity-summary {
  display: flex;
  gap: 2rem;
  padding: 1rem;
  background: #f8fafc;
  border-top: 1px solid #e2e8f0;
  border-radius: 0 0 12px 12px;
}

.summary-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.summary-label {
  font-size: 0.875rem;
  color: #64748b;
}

.summary-value {
  font-weight: 600;
  color: #1e293b;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8125rem;
  font-weight: 500;
}

.status-active {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.status-pending {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.status-inactive {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.table-actions {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.table-actions .btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.stats-grid.loading {
  opacity: 0.7;
  pointer-events: none;
}

.stats-grid.loading .stat-card {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

@media (max-width: 768px) {
  .current-term {
    width: 100%;
    justify-content: center;
  }

  /* .charts-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .chart-card.full-width {
    grid-column: 1;
  } */

  .quick-actions-grid {
    grid-template-columns: 1fr;
  }
}
</style>
