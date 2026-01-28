<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1>Teacher Dashboard</h1>
        <p>Welcome back, {{ teacherName }}</p>
      </div>
    </div>

    <!-- Teacher Stats -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon classes">
          <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
          </svg>
        </div>
        <div class="stat-content">
          <h3>{{ mockData.myClasses.length }}</h3>
          <p>My Classes</p>
        </div>
      </div>

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
        <div class="stat-icon subjects">
          <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
          </svg>
        </div>
        <div class="stat-content">
          <h3>{{ mockData.mySubjects.length }}</h3>
          <p>Subjects Teaching</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon assignments">
          <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
          </svg>
        </div>
        <div class="stat-content">
          <h3>{{ mockData.pendingAssignments }}</h3>
          <p>Pending Marks</p>
        </div>
      </div>
    </div>

    <!-- My Classes -->
    <div class="dashboard-grid">
      <div class="dashboard-card">
        <div class="card-header">
          <h3>My Classes</h3>
          <router-link to="/teacher/classes" class="view-all">View All</router-link>
        </div>
        <div class="classes-list">
          <div v-for="classItem in mockData.myClasses" :key="classItem.id" class="class-item">
            <div class="class-info">
              <h4>{{ classItem.name }}</h4>
              <p>{{ classItem.students }} students • {{ classItem.subject }}</p>
            </div>
            <div class="class-actions">
              <router-link :to="`/teacher/marks/add?class=${classItem.id}`" class="btn-small">
                Add Marks
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <div class="dashboard-card">
        <div class="card-header">
          <h3>Recent Activities</h3>
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
    </div>

    <!-- Today's Schedule -->
    <div class="schedule-card">
      <div class="card-header">
        <h3>Today's Schedule</h3>
        <span class="date">{{ currentDate }}</span>
      </div>
      <div class="schedule-grid">
        <div v-for="period in mockData.todaySchedule" :key="period.id" class="period-card">
          <div class="period-time">{{ period.time }}</div>
          <div class="period-info">
            <h4>{{ period.subject }}</h4>
            <p>{{ period.class }} • {{ period.room }}</p>
          </div>
          <div class="period-status" :class="period.status">
            {{ period.status }}
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="quick-actions">
      <h3>Quick Actions</h3>
      <div class="actions-grid">
        <router-link to="/teacher/marks/add" class="action-card">
          <div class="action-icon">
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/>
            </svg>
          </div>
          <h4>Enter Marks</h4>
          <p>Record student marks</p>
        </router-link>

        <router-link to="/teacher/attendance" class="action-card">
          <div class="action-icon">
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <h4>Take Attendance</h4>
          <p>Mark student attendance</p>
        </router-link>

        <router-link to="/teacher/reports" class="action-card">
          <div class="action-icon">
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
            </svg>
          </div>
          <h4>View Reports</h4>
          <p>Class performance reports</p>
        </router-link>

        <router-link to="/teacher/profile" class="action-card">
          <div class="action-icon">
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
            </svg>
          </div>
          <h4>My Profile</h4>
          <p>Update profile information</p>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const teacherName = ref('Mrs. Sarah Johnson')

const currentDate = computed(() => {
  return new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
})

// Mock data for teacher dashboard
const mockData = ref({
  myClasses: [
    { id: 1, name: 'JSS 2A', students: 35, subject: 'Mathematics' },
    { id: 2, name: 'JSS 2B', students: 32, subject: 'Mathematics' },
    { id: 3, name: 'JSS 3A', students: 28, subject: 'Mathematics' },
    { id: 4, name: 'JSS 1A', students: 40, subject: 'Basic Science' }
  ],
  totalStudents: 135,
  mySubjects: ['Mathematics', 'Basic Science'],
  pendingAssignments: 8,
  recentActivities: [
    {
      id: 1,
      description: "Entered Mathematics marks for JSS 2A",
      time: "1 hour ago"
    },
    {
      id: 2,
      description: "Took attendance for JSS 3A",
      time: "3 hours ago"
    },
    {
      id: 3,
      description: "Generated report card for JSS 2B",
      time: "5 hours ago"
    },
    {
      id: 4,
      description: "Updated lesson plan for Basic Science",
      time: "1 day ago"
    }
  ],
  todaySchedule: [
    {
      id: 1,
      time: '8:00 - 8:40',
      subject: 'Mathematics',
      class: 'JSS 2A',
      room: 'Room 12',
      status: 'completed'
    },
    {
      id: 2,
      time: '8:40 - 9:20',
      subject: 'Mathematics',
      class: 'JSS 2B',
      room: 'Room 12',
      status: 'completed'
    },
    {
      id: 3,
      time: '10:00 - 10:40',
      subject: 'Basic Science',
      class: 'JSS 1A',
      room: 'Lab 1',
      status: 'current'
    },
    {
      id: 4,
      time: '11:20 - 12:00',
      subject: 'Mathematics',
      class: 'JSS 3A',
      room: 'Room 12',
      status: 'upcoming'
    }
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

.stat-icon.classes { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
.stat-icon.students { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); }
.stat-icon.subjects { background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); }
.stat-icon.assignments { background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); }

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

.classes-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.class-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border: 1px solid #f1f5f9;
  border-radius: 8px;
}

.class-info h4 {
  margin: 0 0 4px 0;
  color: #1e293b;
  font-size: 16px;
}

.class-info p {
  margin: 0;
  color: #64748b;
  font-size: 14px;
}

.btn-small {
  padding: 6px 12px;
  background: #667eea;
  color: white;
  text-decoration: none;
  border-radius: 6px;
  font-size: 12px;
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

.schedule-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  margin-bottom: 30px;
}

.schedule-card .card-header {
  margin-bottom: 20px;
}

.date {
  color: #64748b;
  font-size: 14px;
}

.schedule-grid {
  display: grid;
  gap: 12px;
}

.period-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  border: 1px solid #f1f5f9;
  border-radius: 8px;
}

.period-time {
  min-width: 100px;
  font-weight: 600;
  color: #1e293b;
  font-size: 14px;
}

.period-info {
  flex: 1;
}

.period-info h4 {
  margin: 0 0 4px 0;
  color: #1e293b;
  font-size: 16px;
}

.period-info p {
  margin: 0;
  color: #64748b;
  font-size: 14px;
}

.period-status {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  text-transform: capitalize;
}

.period-status.completed {
  background: rgba(16, 185, 129, 0.1);
  color: #059669;
}

.period-status.current {
  background: rgba(245, 158, 11, 0.1);
  color: #d97706;
}

.period-status.upcoming {
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
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
  
  .period-card {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
}
</style>