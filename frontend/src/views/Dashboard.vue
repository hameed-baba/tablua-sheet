<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1>Dashboard</h1>
        <p>Welcome back! Here's an overview of your school management system.</p>
      </div>
      <div class="header-actions">
        <span class="current-term">
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {{ currentSession }} - {{ currentTerm }}
        </span>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-card-header">
          <span class="stat-card-title">Total Students</span>
          <div class="stat-card-icon" style="background: rgba(59, 130, 246, 0.1); color: #3b82f6;">
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
            </svg>
          </div>
        </div>
        <div class="stat-card-value">{{ stats.totalStudents }}</div>
        <div class="stat-card-change positive">+23 new this term</div>
      </div>

      <div class="stat-card">
        <div class="stat-card-header">
          <span class="stat-card-title">Teaching Staff</span>
          <div class="stat-card-icon" style="background: rgba(16, 185, 129, 0.1); color: #10b981;">
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        </div>
        <div class="stat-card-value">{{ stats.totalStaff }}</div>
        <div class="stat-card-change positive">3 new hires</div>
      </div>

      <div class="stat-card">
        <div class="stat-card-header">
          <span class="stat-card-title">Active Classes</span>
          <div class="stat-card-icon" style="background: rgba(245, 158, 11, 0.1); color: #f59e0b;">
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
        </div>
        <div class="stat-card-value">{{ stats.totalClasses }}</div>
        <div class="stat-card-change positive">All classes running</div>
      </div>

      <div class="stat-card">
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
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="quick-actions-section">
      <h2 class="section-title">Quick Actions</h2>
      <div class="quick-actions-grid">
        <router-link to="/students/register" class="quick-action-card">
          <div class="action-icon" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <div class="action-content">
            <h3>Register Student</h3>
            <p>Add new student to the system</p>
          </div>
        </router-link>

        <router-link to="/staff/register" class="quick-action-card">
          <div class="action-icon" style="background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);">
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <div class="action-content">
            <h3>Register Staff</h3>
            <p>Add new staff member</p>
          </div>
        </router-link>

        <router-link to="/add-marks" class="quick-action-card">
          <div class="action-icon" style="background: linear-gradient(135deg, #ed8936 0%, #dd6b20 100%);">
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          </div>
          <div class="action-content">
            <h3>Add Marks</h3>
            <p>Enter student examination marks</p>
          </div>
        </router-link>

        <router-link to="/attendance" class="quick-action-card">
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
        </router-link>

        <router-link to="/classes" class="quick-action-card">
          <div class="action-icon" style="background: linear-gradient(135deg, #f56565 0%, #e53e3e 100%);">
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div class="action-content">
            <h3>Manage Classes</h3>
            <p>View and manage classes</p>
          </div>
        </router-link>
      </div>
    </div>

    <!-- Recent Activities -->
    <div class="data-table-container">
      <div class="table-header">
        <h2 class="table-title">Recent Activities</h2>
        <button class="btn btn-secondary btn-sm">View All</button>
      </div>
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>Activity</th>
              <th class="d-none d-md-table-cell">User</th>
              <th class="d-none d-lg-table-cell">Module</th>
              <th class="d-none d-sm-table-cell">Date & Time</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="activity in recentActivities" :key="activity.id">
              <td>
                <strong>{{ activity.activity }}</strong>
                <div class="d-md-none">
                  <small class="text-muted">{{ activity.user }} • {{ activity.date }}</small>
                </div>
              </td>
              <td class="d-none d-md-table-cell">{{ activity.user }}</td>
              <td class="d-none d-lg-table-cell">
                <span class="module-badge">{{ activity.module }}</span>
              </td>
              <td class="d-none d-sm-table-cell">{{ activity.date }}</td>
              <td>
                <span class="status-badge" :class="getStatusClass(activity.status)">
                  {{ activity.status }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const currentSession = ref('2024/2025 Session')
const currentTerm = ref('First Term')

const stats = ref({
  totalStudents: 847,
  totalStaff: 42,
  totalClasses: 18
})

const recentActivities = ref([
  {
    id: 1,
    activity: 'New student registered',
    user: 'Admin User',
    module: 'Students',
    date: 'Nov 18, 2024 10:30 AM',
    status: 'Success'
  },
  {
    id: 2,
    activity: 'Marks added for Grade 9',
    user: 'Mrs. Emily Davis',
    module: 'Grades',
    date: 'Nov 18, 2024 09:15 AM',
    status: 'Success'
  },
  {
    id: 3,
    activity: 'Attendance marked',
    user: 'Mr. Michael Chen',
    module: 'Attendance',
    date: 'Nov 18, 2024 08:45 AM',
    status: 'Success'
  },
  {
    id: 4,
    activity: 'New class created',
    user: 'Admin User',
    module: 'Classes',
    date: 'Nov 17, 2024 04:20 PM',
    status: 'Success'
  },
  {
    id: 5,
    activity: 'Report card generated',
    user: 'Mrs. Sarah Johnson',
    module: 'Reports',
    date: 'Nov 17, 2024 02:10 PM',
    status: 'Success'
  },
  {
    id: 6,
    activity: 'Staff profile updated',
    user: 'Mr. Ahmed Suleiman',
    module: 'Staff',
    date: 'Nov 17, 2024 11:30 AM',
    status: 'Success'
  }
])

const getStatusClass = (status) => {
  const statusMap = {
    'Success': 'status-active',
    'Pending': 'status-pending',
    'Failed': 'status-inactive',
    'Warning': 'status-pending'
  }
  return statusMap[status] || 'status-active'
}

onMounted(() => {
  // Load dashboard data
})
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

@media (max-width: 768px) {
  .current-term {
    width: 100%;
    justify-content: center;
  }

  .quick-actions-grid {
    grid-template-columns: 1fr;
  }
}
</style>
