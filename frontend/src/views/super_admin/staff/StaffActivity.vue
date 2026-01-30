<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1>Staff Activity Management</h1>
        <p>Monitor and manage staff login sessions and activity</p>
      </div>
      <div class="header-actions">
        <button class="btn btn-secondary" @click="cleanupStaleSessions" :disabled="cleanupLoading">
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="margin-right: 0.5rem;">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          {{ cleanupLoading ? 'Cleaning...' : 'Cleanup Stale Sessions' }}
        </button>
        <button class="btn btn-primary" @click="refreshData" :disabled="loading">
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="margin-right: 0.5rem;">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          {{ loading ? 'Loading...' : 'Refresh' }}
        </button>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-card-header">
          <span class="stat-card-title">Currently Active</span>
          <div class="stat-card-icon" style="background: rgba(16, 185, 129, 0.1); color: #10b981;">
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <div class="stat-card-value">{{ staffActivity.summary?.total_active || 0 }}</div>
        <div class="stat-card-change positive">Staff online now</div>
      </div>

      <div class="stat-card">
        <div class="stat-card-header">
          <span class="stat-card-title">Recently Offline</span>
          <div class="stat-card-icon" style="background: rgba(245, 158, 11, 0.1); color: #f59e0b;">
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <div class="stat-card-value">{{ staffActivity.summary?.total_recently_logged_out || 0 }}</div>
        <div class="stat-card-change">Logged out within 1 hour</div>
      </div>

      <div class="stat-card">
        <div class="stat-card-header">
          <span class="stat-card-title">Total Sessions</span>
          <div class="stat-card-icon" style="background: rgba(59, 130, 246, 0.1); color: #3b82f6;">
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
        </div>
        <div class="stat-card-value">{{ sessionHistory.pagination?.total || 0 }}</div>
        <div class="stat-card-change">All time sessions</div>
      </div>
    </div>

    <!-- Current Activity -->
    <div class="data-table-container mb-4">
      <div class="table-header">
        <h2 class="table-title">Current Staff Activity</h2>
      </div>
      
      <!-- Loading State -->
      <div v-if="loading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>Loading staff activity...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="error-state">
        <p>{{ error }}</p>
        <button class="btn btn-primary btn-sm" @click="loadStaffActivity">Try Again</button>
      </div>

      <!-- Staff Activity Table -->
      <div v-else class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>Staff Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Login Time</th>
              <th>Duration</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <!-- Active Staff -->
            <tr v-for="staff in staffActivity.active_staff" :key="`active-${staff.id}`">
              <td><strong>{{ staff.full_name }}</strong></td>
              <td>{{ staff.email }}</td>
              <td><span class="module-badge">{{ staff.role }}</span></td>
              <td>{{ formatDateTime(staff.login_time) }}</td>
              <td>{{ calculateDuration(staff.login_time) }}</td>
              <td>
                <span class="status-badge status-active">
                  <svg width="8" height="8" fill="currentColor" viewBox="0 0 8 8" style="margin-right: 0.25rem;">
                    <circle cx="4" cy="4" r="4"/>
                  </svg>
                  Online
                </span>
              </td>
            </tr>
            
            <!-- Recently Logged Out Staff -->
            <tr v-for="staff in staffActivity.recently_logged_out" :key="`recent-${staff.id}`">
              <td><strong>{{ staff.full_name }}</strong></td>
              <td>{{ staff.email }}</td>
              <td><span class="module-badge">{{ staff.role }}</span></td>
              <td>{{ formatDateTime(staff.logout_time) }}</td>
              <td>-</td>
              <td>
                <span class="status-badge status-pending">
                  <svg width="8" height="8" fill="currentColor" viewBox="0 0 8 8" style="margin-right: 0.25rem;">
                    <circle cx="4" cy="4" r="4"/>
                  </svg>
                  Recently Offline
                </span>
              </td>
            </tr>

            <!-- Empty State -->
            <tr v-if="!staffActivity.active_staff?.length && !staffActivity.recently_logged_out?.length">
              <td colspan="6" class="text-center">
                <div class="empty-state">
                  <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="margin-bottom: 1rem; opacity: 0.5;">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <p>No staff activity data available</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Session History -->
    <div class="data-table-container">
      <div class="table-header">
        <h2 class="table-title">Session History</h2>
        <div class="table-actions">
          <select v-model="sessionLimit" @change="loadSessionHistory" class="form-select">
            <option value="25">25 sessions</option>
            <option value="50">50 sessions</option>
            <option value="100">100 sessions</option>
          </select>
        </div>
      </div>
      
      <div v-if="sessionLoading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>Loading session history...</p>
      </div>

      <div v-else class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>Staff Name</th>
              <th>Role</th>
              <th>Login Time</th>
              <th>Logout Time</th>
              <th>Duration (min)</th>
              <th>IP Address</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="session in sessionHistory.sessions" :key="session.id">
              <td><strong>{{ session.staff.full_name }}</strong></td>
              <td><span class="module-badge">{{ session.staff.role }}</span></td>
              <td>{{ formatDateTime(session.login_time) }}</td>
              <td>{{ session.logout_time ? formatDateTime(session.logout_time) : '-' }}</td>
              <td>{{ session.duration || '-' }}</td>
              <td>{{ session.ip_address || '-' }}</td>
              <td>
                <span class="status-badge" :class="session.is_active ? 'status-active' : 'status-inactive'">
                  {{ session.is_active ? 'Active' : 'Ended' }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="sessionHistory.pagination" class="pagination-info">
        <p>Showing {{ sessionHistory.sessions?.length || 0 }} of {{ sessionHistory.pagination.total }} sessions</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import apiServices from '../../../services/apiServices'

// Data
const staffActivity = ref({
  active_staff: [],
  recently_logged_out: [],
  summary: {
    total_active: 0,
    total_recently_logged_out: 0,
    total_staff: 0
  }
})

const sessionHistory = ref({
  sessions: [],
  pagination: {
    total: 0,
    limit: 25,
    offset: 0,
    pages: 0
  }
})

// Loading states
const loading = ref(false)
const sessionLoading = ref(false)
const cleanupLoading = ref(false)
const error = ref(null)

// Settings
const sessionLimit = ref(25)

// Load staff activity status
const loadStaffActivity = async () => {
  loading.value = true
  error.value = null
  
  try {
    const response = await apiServices.getStaffActivityStatus()
    staffActivity.value = response.data.data
  } catch (err) {
    console.error('Failed to load staff activity:', err)
    error.value = 'Failed to load staff activity data'
  } finally {
    loading.value = false
  }
}

// Load session history
const loadSessionHistory = async () => {
  sessionLoading.value = true
  
  try {
    const response = await apiServices.getStaffSessions(null, { 
      limit: sessionLimit.value,
      offset: 0 
    })
    sessionHistory.value = response.data.data
  } catch (err) {
    console.error('Failed to load session history:', err)
  } finally {
    sessionLoading.value = false
  }
}

// Cleanup stale sessions
const cleanupStaleSessions = async () => {
  cleanupLoading.value = true
  
  try {
    const response = await apiServices.cleanupStaleSessions()
    alert(`Successfully cleaned up ${response.data.data.sessions_cleaned} stale sessions`)
    await refreshData()
  } catch (err) {
    console.error('Failed to cleanup stale sessions:', err)
    alert('Failed to cleanup stale sessions')
  } finally {
    cleanupLoading.value = false
  }
}

// Refresh all data
const refreshData = async () => {
  await Promise.all([
    loadStaffActivity(),
    loadSessionHistory()
  ])
}

// Format date and time
const formatDateTime = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

// Calculate duration from login time to now
const calculateDuration = (loginTime) => {
  if (!loginTime) return 'N/A'
  
  const now = new Date()
  const login = new Date(loginTime)
  const diffInMinutes = Math.floor((now - login) / (1000 * 60))
  
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m`
  } else {
    const hours = Math.floor(diffInMinutes / 60)
    const minutes = diffInMinutes % 60
    return `${hours}h ${minutes}m`
  }
}

onMounted(() => {
  refreshData()
})
</script>

<style scoped>
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.stat-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.stat-card-title {
  font-size: 0.875rem;
  font-weight: 500;
  color: #6b7280;
}

.stat-card-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-card-value {
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.stat-card-change {
  font-size: 0.875rem;
  color: #6b7280;
}

.stat-card-change.positive {
  color: #10b981;
}

.loading-state, .error-state {
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
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.empty-state {
  padding: 2rem;
  color: #6b7280;
}

.module-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8125rem;
  font-weight: 500;
  background: #edf2f7;
  color: #4a5568;
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

.form-select {
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.875rem;
}

.pagination-info {
  padding: 1rem;
  text-align: center;
  color: #6b7280;
  font-size: 0.875rem;
  border-top: 1px solid #e5e7eb;
}
</style>