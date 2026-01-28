<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1>Admin Dashboard</h1>
        <p>School Management Overview</p>
      </div>
    </div>

    <!-- Quick Stats -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon students">
          <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
          </svg>
        </div>
        <div class="stat-content">
          <h3>{{ mockData.totalStudents }}</h3>
          <p>Total Students</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon teachers">
          <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
          </svg>
        </div>
        <div class="stat-content">
          <h3>{{ mockData.totalTeachers }}</h3>
          <p>Teaching Staff</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon classes">
          <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
          </svg>
        </div>
        <div class="stat-content">
          <h3>{{ mockData.totalClasses }}</h3>
          <p>Active Classes</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon subjects">
          <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
          </svg>
        </div>
        <div class="stat-content">
          <h3>{{ mockData.totalSubjects }}</h3>
          <p>Subjects</p>
        </div>
      </div>
    </div>

    <!-- Recent Activities -->
    <div class="dashboard-grid">
      <div class="dashboard-card">
        <div class="card-header">
          <h3>Recent Activities</h3>
          <router-link to="/admin/staff/activity" class="view-all">View All</router-link>
        </div>
        <div class="activity-list">
          <div v-for="activity in mockData.recentActivities" :key="activity.id" class="activity-item">
            <div class="activity-icon">
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div class="activity-content">
              <p>{{ activity.description }}</p>
              <span class="activity-time">{{ activity.time }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="dashboard-card">
        <div class="card-header">
          <h3>Class Performance</h3>
          <router-link to="/admin/eaxm/broadsheet" class="view-all">View Reports</router-link>
        </div>
        <div class="performance-list">
          <div v-for="classPerf in mockData.classPerformance" :key="classPerf.class" class="performance-item">
            <div class="class-name">{{ classPerf.class }}</div>
            <div class="performance-bar">
              <div class="progress-bar" :style="{ width: classPerf.average + '%' }"></div>
            </div>
            <div class="average">{{ classPerf.average }}%</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="quick-actions">
      <h3>Quick Actions</h3>
      <div class="actions-grid">
        <router-link to="/admin/student/register" class="action-card">
          <div class="action-icon">
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/>
            </svg>
          </div>
          <h4>Add Student</h4>
          <p>Register new student</p>
        </router-link>

        <router-link to="/admin/staff/register" class="action-card">
          <div class="action-icon">
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
            </svg>
          </div>
          <h4>Add Staff</h4>
          <p>Register new staff member</p>
        </router-link>

        <router-link to="/admin/class/register" class="action-card">
          <div class="action-icon">
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
            </svg>
          </div>
          <h4>Create Class</h4>
          <p>Set up new class</p>
        </router-link>

        <router-link to="/admin/eaxm/add-marks" class="action-card">
          <div class="action-icon">
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/>
            </svg>
          </div>
          <h4>Enter Marks</h4>
          <p>Record student marks</p>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// Mock data for admin dashboard
const mockData = ref({
  totalStudents: 1247,
  totalTeachers: 45,
  totalClasses: 24,
  totalSubjects: 18,
  recentActivities: [
    {
      id: 1,
      description: "New student John Doe registered in JSS 2A",
      time: "2 hours ago"
    },
    {
      id: 2,
      description: "Mathematics marks entered for JSS 3B",
      time: "4 hours ago"
    },
    {
      id: 3,
      description: "Staff meeting scheduled for tomorrow",
      time: "6 hours ago"
    },
    {
      id: 4,
      description: "Parent-teacher conference completed",
      time: "1 day ago"
    }
  ],
  classPerformance: [
    { class: "JSS 3A", average: 85 },
    { class: "JSS 3B", average: 78 },
    { class: "JSS 2A", average: 82 },
    { class: "JSS 2B", average: 75 },
    { class: "JSS 1A", average: 88 }
  ]
})
</script>

<style scoped>
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.stat-icon.students { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
.stat-icon.teachers { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); }
.stat-icon.classes { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); }
.stat-icon.subjects { background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); }

.stat-content h3 {
  font-size: 28px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 4px 0;
}

.stat-content p {
  color: #64748b;
  margin: 0;
  font-size: 14px;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 30px;
}

.dashboard-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.card-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.view-all {
  color: #667eea;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.activity-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.activity-icon {
  width: 32px;
  height: 32px;
  background: rgba(102, 126, 234, 0.1);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #667eea;
  flex-shrink: 0;
}

.activity-content p {
  margin: 0 0 4px 0;
  color: #1e293b;
  font-size: 14px;
}

.activity-time {
  color: #64748b;
  font-size: 12px;
}

.performance-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.performance-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.class-name {
  min-width: 80px;
  font-weight: 500;
  color: #1e293b;
}

.performance-bar {
  flex: 1;
  height: 8px;
  background: #f1f5f9;
  border-radius: 4px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 4px;
}

.average {
  min-width: 40px;
  text-align: right;
  font-weight: 600;
  color: #1e293b;
}

.quick-actions {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.quick-actions h3 {
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 20px 0;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.action-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 20px;
  border: 2px solid #f1f5f9;
  border-radius: 12px;
  text-decoration: none;
  transition: all 0.3s ease;
}

.action-card:hover {
  border-color: #667eea;
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.15);
}

.action-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin-bottom: 12px;
}

.action-card h4 {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 4px 0;
}

.action-card p {
  color: #64748b;
  margin: 0;
  font-size: 14px;
}

@media (max-width: 768px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
  
  .stats-grid {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }
  
  .actions-grid {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  }
}
</style>