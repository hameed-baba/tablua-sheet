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
        <button
          class="btn btn-secondary btn-sm"
          @click="refreshDashboard"
          :disabled="isGettingSummary"
          v-if="getUserRole() === 'super_admin'"
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
          {{ isGettingSummary ? "Loading..." : "Refresh" }}
        </button>
        <div class="current-term">
          <span v-if="isGettingSummary">
            <i class="fa fa-spinner fa-spin"></i>
            0000/0000 - Term Term
          </span>
          <span class="" v-else>
            <i class="fa fa-calendar"></i>
            {{ sessionInfo.session }} - {{ sessionInfo.term }}
          </span>
        </div>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="stats-grid" :class="{ loading: isGettingSummary }">
      <div class="stat-card">
        <div class="stat-card-header">
          <span class="stat-card-title">Total Active Students</span>
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
        <i class="fa fa-spinner fa-spin" v-if="isGettingSummary"></i>
        <div class="stat-card-value" v-else>{{ stats.totalStudents || 0 }}</div>
      </div>

      <div class="stat-card">
        <div class="stat-card-header">
          <span class="stat-card-title"
            >Total Students By Session <b>({{ sessionInfo.session }})</b></span
          >
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
        <i class="fa fa-spinner fa-spin" v-if="isGettingSummary"></i>
        <div class="stat-card-value" v-else>
          {{ stats.studentsInActiveSession || 0 }}
        </div>
      </div>

      <div class="stat-card" v-if="getUserRole() === 'super_admin'">
        <div class="stat-card-header">
          <span class="stat-card-title">Active Teaching Staff</span>
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
        <div class="sum-box">
          <i class="fa fa-spinner fa-spin" v-if="isGettingSummary"></i>
          <div class="stat-card-value" v-else>{{ stats.totalStaff || 0 }}</div>
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
        <div class="sum-box">
          <i class="fa fa-spinner fa-spin" v-if="isGettingSummary"></i>
          <div class="stat-card-value" v-else>
            {{ stats.totalClasses || 0 }}
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="quick-actions-section">
      <h2 class="section-title">Quick Actions</h2>
      <div class="quick-actions-grid">
        <router-link to="/students/register" class="quick-action-card">
          <div
            class="action-icon"
            style="
              background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
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

        <router-link
          to="/staff/register"
          class="quick-action-card"
          v-if="getUserRole() === 'super_admin'"
        >
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

    <!-- Charts Section -->
    <div class="charts-section">
      <h2 class="section-title">Analytics Overview</h2>
      <div class="charts-grid">
        <!-- Students by Class -->
        <div class="chart-card">
          <BarChart
            title="Students by Class"
            subtitle="Distribution of active students across classes"
            :data="chartData.studentsByClass"
            :loading="chartsLoading"
            :error="chartsError"
          />
        </div>

        <!-- Students by Gender -->
        <div class="chart-card">
          <DonutChart
            title="Students by Gender"
            subtitle="Gender distribution of active students"
            :data="chartData.studentsByGender"
            :loading="chartsLoading"
            :error="chartsError"
            :colors="['#3b82f6', '#ec4899']"
          />
        </div>

        <!-- Students by Status -->
        <div class="chart-card">
          <BarChart
            title="Students by Status"
            subtitle="Student enrollment status overview"
            :data="chartData.studentsByStatus"
            :loading="chartsLoading"
            :error="chartsError"
            :colors="['#10b981', '#f59e0b', '#ef4444']"
          />
        </div>

        <!-- Enrollment Trend -->
        <div class="chart-card full-width" v-if="false">
          <LineChart
            title="Student Enrollment Trend"
            subtitle="New student registrations over the last 6 months"
            :data="chartData.enrollmentTrend"
            :loading="chartsLoading"
            :error="chartsError"
            :width="800"
            :height="300"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import apiServices from "../../services/apiServices";
import { gsap } from "gsap";
import { getUserRole } from "../../utils/userRole";
import BarChart from "../../components/charts/BarChart.vue";
import DonutChart from "../../components/charts/DonutChart.vue";
import LineChart from "../../components/charts/LineChart.vue";

const stats = ref({
  totalStudents: 0,
  totalStaff: 0,
  totalClasses: 0,
  studentsInActiveSession: 0,
});

const sessionInfo = ref({
  session: null,
  term: null,
});
const isGettingSummary = ref(false);

// Chart data
const chartData = ref({
  studentsByClass: [],
  studentsByGender: [],
  studentsByStatus: [],
  staffByRole: [],
  enrollmentTrend: [],
});
const chartsLoading = ref(false);
const chartsError = ref(null);

// Load chart data
const loadChartData = () => {
  console.log("Loading chart data...");
  chartsLoading.value = true;
  chartsError.value = null;

  apiServices
    .getDashboardCharts()
    .then((response) => {
      console.log("Chart data received:", response.data);
      chartData.value = response.data.data;
      console.log("Chart data set:", chartData.value);
    })
    .catch((error) => {
      console.error("Failed to load chart data:", error);
      chartsError.value = "Failed to load chart data";
    })
    .finally(() => {
      chartsLoading.value = false;
      console.log("Chart loading complete");
    });
};

// Refresh all dashboard data
const refreshDashboard = async () => {
  await Promise.all([getDashboardSummary(), loadChartData()]);
};

const getDashboardSummary = () => {
  isGettingSummary.value = true;
  apiServices
    .getDashboardSummary()
    .then((response) => {
      const data = response.data.data;
      stats.value.totalStudents = data.totals?.activeStudents;
      stats.value.studentsInActiveSession =
        data.totals?.studentsInActiveSession;
      stats.value.totalStaff = data.totals?.activeStaff;
      stats.value.totalClasses = data.totals?.totalClasses;
      sessionInfo.value.session = data.session?.name;
      sessionInfo.value.term = data.term?.name;
    })
    .catch((error) => {
      console.error("Failed to load dashboard summary:", error);
    })
    .finally(() => {
      isGettingSummary.value = false;
    });
};

onMounted(async () => {
  // Load all dashboard data
  await Promise.all([getDashboardSummary(), loadChartData()]);

  gsap.from(".sum-box", {
    opacity: 0,
    y: 30,
    duration: 0.8,
    stagger: 0.2, // each block enters one after another
    ease: "power3.out",
  });
});
</script>

<style scoped>
.current-term {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
  color: white;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
}

.charts-section {
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
}

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

.stats-grid.loading {
  opacity: 0.7;
  pointer-events: none;
}

.stats-grid.loading .stat-card {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%,
  100% {
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

  .charts-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .chart-card.full-width {
    grid-column: 1;
  }

  .quick-actions-grid {
    grid-template-columns: 1fr;
  }
}
</style>
