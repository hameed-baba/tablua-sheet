<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1>Parent Portal</h1>
        <p>Monitor your child's academic progress</p>
      </div>
    </div>

    <!-- Children Overview -->
    <div class="children-section">
      <h3>My Children</h3>
      <div class="children-grid">
        <div v-for="child in mockData.children" :key="child.id" class="child-card" @click="selectChild(child)">
          <div class="child-avatar">
            <span>{{ getInitials(child.name) }}</span>
          </div>
          <div class="child-info">
            <h4>{{ child.name }}</h4>
            <p>{{ child.class }} • {{ child.admissionNumber }}</p>
            <div class="child-stats">
              <span class="stat">Avg: {{ child.average }}%</span>
              <span class="stat">Att: {{ child.attendance }}%</span>
            </div>
          </div>
          <div class="child-status" :class="child.status">
            {{ child.status }}
          </div>
        </div>
      </div>
    </div>

    <!-- Selected Child Details -->
    <div v-if="selectedChild" class="selected-child-section">
      <div class="section-header">
        <h3>{{ selectedChild.name }}'s Academic Overview</h3>
        <div class="child-selector">
          <select v-model="selectedChildId" @change="updateSelectedChild">
            <option v-for="child in mockData.children" :key="child.id" :value="child.id">
              {{ child.name }} - {{ child.class }}
            </option>
          </select>
        </div>
      </div>

      <!-- Academic Stats -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon average">
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
            </svg>
          </div>
          <div class="stat-content">
            <h3>{{ selectedChild.average }}%</h3>
            <p>Overall Average</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon attendance">
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <div class="stat-content">
            <h3>{{ selectedChild.attendance }}%</h3>
            <p>Attendance Rate</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon position">
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/>
            </svg>
          </div>
          <div class="stat-content">
            <h3>{{ selectedChild.position }}</h3>
            <p>Class Position</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon subjects">
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
            </svg>
          </div>
          <div class="stat-content">
            <h3>{{ selectedChild.subjects.length }}</h3>
            <p>Subjects</p>
          </div>
        </div>
      </div>

      <!-- Subject Performance -->
      <div class="dashboard-grid">
        <div class="dashboard-card">
          <div class="card-header">
            <h3>Subject Performance</h3>
            <router-link :to="`/parent/child/${selectedChild.id}/grades`" class="view-all">View Details</router-link>
          </div>
          <div class="subjects-list">
            <div v-for="subject in selectedChild.subjects" :key="subject.id" class="subject-item">
              <div class="subject-info">
                <h4>{{ subject.name }}</h4>
                <p>{{ subject.teacher }}</p>
              </div>
              <div class="subject-performance">
                <div class="performance-bar">
                  <div class="progress-bar" :style="{ width: subject.score + '%' }"></div>
                </div>
                <span class="score" :class="getGradeClass(subject.score)">{{ subject.score }}%</span>
              </div>
            </div>
          </div>
        </div>

        <div class="dashboard-card">
          <div class="card-header">
            <h3>Recent Activities</h3>
          </div>
          <div class="activities-list">
            <div v-for="activity in selectedChild.recentActivities" :key="activity.id" class="activity-item">
              <div class="activity-icon" :class="activity.type">
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path v-if="activity.type === 'grade'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                  <path v-else-if="activity.type === 'attendance'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
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

      <!-- Upcoming Events -->
      <div class="events-card">
        <div class="card-header">
          <h3>Upcoming Events & Reminders</h3>
        </div>
        <div class="events-grid">
          <div v-for="event in selectedChild.upcomingEvents" :key="event.id" class="event-card">
            <div class="event-date">
              <span class="day">{{ formatDay(event.date) }}</span>
              <span class="month">{{ formatMonth(event.date) }}</span>
            </div>
            <div class="event-info">
              <h4>{{ event.title }}</h4>
              <p>{{ event.description }}</p>
              <span class="event-time">{{ event.time }}</span>
            </div>
            <div class="event-type" :class="event.type">
              {{ event.type }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="quick-actions">
      <h3>Quick Actions</h3>
      <div class="actions-grid">
        <router-link to="/parent/children/grades" class="action-card">
          <div class="action-icon">
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
            </svg>
          </div>
          <h4>View Grades</h4>
          <p>Check academic performance</p>
        </router-link>

        <router-link to="/parent/children/attendance" class="action-card">
          <div class="action-icon">
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <h4>Attendance</h4>
          <p>Monitor attendance record</p>
        </router-link>

        <router-link to="/parent/communications" class="action-card">
          <div class="action-icon">
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
            </svg>
          </div>
          <h4>Messages</h4>
          <p>School communications</p>
        </router-link>

        <router-link to="/parent/profile" class="action-card">
          <div class="action-icon">
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
            </svg>
          </div>
          <h4>My Profile</h4>
          <p>Update contact information</p>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const selectedChildId = ref(1)

const selectedChild = computed(() => {
  return mockData.value.children.find(child => child.id === selectedChildId.value)
})

const getInitials = (name) => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase()
}

const getGradeClass = (score) => {
  if (score >= 80) return 'excellent'
  if (score >= 70) return 'good'
  if (score >= 60) return 'average'
  return 'needs-improvement'
}

const formatDay = (dateString) => {
  return new Date(dateString).getDate()
}

const formatMonth = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', { month: 'short' })
}

const selectChild = (child) => {
  selectedChildId.value = child.id
}

const updateSelectedChild = () => {
  // This will automatically update selectedChild computed property
}

// Mock data for parent dashboard
const mockData = ref({
  children: [
    {
      id: 1,
      name: 'John Doe',
      class: 'JSS 2A',
      admissionNumber: 'AGP/SS/2022/001',
      average: 78,
      attendance: 92,
      position: '5th',
      status: 'active',
      subjects: [
        { id: 1, name: 'Mathematics', teacher: 'Mrs. Johnson', score: 83 },
        { id: 2, name: 'English Language', teacher: 'Mr. Smith', score: 77 },
        { id: 3, name: 'Basic Science', teacher: 'Dr. Brown', score: 70 },
        { id: 4, name: 'Social Studies', teacher: 'Mrs. Davis', score: 80 },
        { id: 5, name: 'French', teacher: 'Ms. Marie', score: 63 }
      ],
      recentActivities: [
        {
          id: 1,
          type: 'grade',
          description: 'Mathematics test score: 85/100',
          time: '2 days ago'
        },
        {
          id: 2,
          type: 'attendance',
          description: 'Present in all classes today',
          time: '1 day ago'
        },
        {
          id: 3,
          type: 'event',
          description: 'Science project submitted',
          time: '3 days ago'
        }
      ],
      upcomingEvents: [
        {
          id: 1,
          title: 'Parent-Teacher Meeting',
          description: 'Academic review and discussion',
          date: '2024-02-25',
          time: '10:00 AM',
          type: 'meeting'
        },
        {
          id: 2,
          title: 'Mathematics Test',
          description: 'Algebra and Geometry assessment',
          date: '2024-02-28',
          time: '9:00 AM',
          type: 'exam'
        }
      ]
    },
    {
      id: 2,
      name: 'Jane Doe',
      class: 'JSS 1B',
      admissionNumber: 'AGP/SS/2023/045',
      average: 85,
      attendance: 95,
      position: '2nd',
      status: 'active',
      subjects: [
        { id: 1, name: 'Mathematics', teacher: 'Mr. Wilson', score: 88 },
        { id: 2, name: 'English Language', teacher: 'Mrs. Adams', score: 82 },
        { id: 3, name: 'Basic Science', teacher: 'Dr. Lee', score: 85 },
        { id: 4, name: 'Social Studies', teacher: 'Mr. Taylor', score: 87 },
        { id: 5, name: 'Art', teacher: 'Ms. Garcia', score: 90 }
      ],
      recentActivities: [
        {
          id: 1,
          type: 'grade',
          description: 'English essay scored: 92/100',
          time: '1 day ago'
        },
        {
          id: 2,
          type: 'attendance',
          description: 'Perfect attendance this week',
          time: '2 days ago'
        }
      ],
      upcomingEvents: [
        {
          id: 1,
          title: 'Art Exhibition',
          description: 'Student artwork display',
          date: '2024-03-05',
          time: '2:00 PM',
          type: 'event'
        }
      ]
    }
  ]
})
</script>

<style scoped>
.children-section {
  margin-bottom: 30px;
}

.children-section h3 {
  font-size: 20px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 16px;
}

.children-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.child-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  gap: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.child-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.15);
  border-color: #667eea;
}

.child-avatar {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 20px;
  flex-shrink: 0;
}

.child-info {
  flex: 1;
}

.child-info h4 {
  margin: 0 0 4px 0;
  color: #1e293b;
  font-size: 18px;
}

.child-info p {
  margin: 0 0 8px 0;
  color: #64748b;
  font-size: 14px;
}

.child-stats {
  display: flex;
  gap: 12px;
}

.stat {
  font-size: 12px;
  font-weight: 600;
  color: #667eea;
}

.child-status {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  text-transform: capitalize;
}

.child-status.active {
  background: rgba(16, 185, 129, 0.1);
  color: #059669;
}

.selected-child-section {
  margin-bottom: 30px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.section-header h3 {
  font-size: 20px;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.child-selector select {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: white;
  color: #1e293b;
  font-size: 14px;
}

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

.stat-icon.average { background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); }
.stat-icon.attendance { background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); }
.stat-icon.position { background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%); }
.stat-icon.subjects { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }

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

.subjects-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.subject-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border: 1px solid #f1f5f9;
  border-radius: 8px;
}

.subject-info h4 {
  margin: 0 0 4px 0;
  color: #1e293b;
  font-size: 16px;
}

.subject-info p {
  margin: 0;
  color: #64748b;
  font-size: 14px;
}

.subject-performance {
  display: flex;
  align-items: center;
  gap: 12px;
}

.performance-bar {
  width: 100px;
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

.score {
  font-weight: 600;
  font-size: 14px;
}

.score.excellent { color: #059669; }
.score.good { color: #2563eb; }
.score.average { color: #d97706; }
.score.needs-improvement { color: #dc2626; }

.activities-list {
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
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.activity-icon.grade { background: rgba(102, 126, 234, 0.8); }
.activity-icon.attendance { background: rgba(16, 185, 129, 0.8); }
.activity-icon.event { background: rgba(245, 158, 11, 0.8); }

.activity-content p {
  margin: 0 0 4px 0;
  color: #1e293b;
  font-size: 14px;
}

.activity-time {
  color: #64748b;
  font-size: 12px;
}

.events-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  margin-bottom: 30px;
}

.events-grid {
  display: grid;
  gap: 16px;
}

.event-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  border: 1px solid #f1f5f9;
  border-radius: 8px;
}

.event-date {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 50px;
  padding: 8px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 8px;
}

.day {
  font-size: 18px;
  font-weight: 700;
}

.month {
  font-size: 12px;
  text-transform: uppercase;
}

.event-info {
  flex: 1;
}

.event-info h4 {
  margin: 0 0 4px 0;
  color: #1e293b;
  font-size: 16px;
}

.event-info p {
  margin: 0 0 4px 0;
  color: #64748b;
  font-size: 14px;
}

.event-time {
  color: #667eea;
  font-size: 12px;
  font-weight: 600;
}

.event-type {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  text-transform: capitalize;
}

.event-type.meeting {
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
}

.event-type.exam {
  background: rgba(239, 68, 68, 0.1);
  color: #dc2626;
}

.event-type.event {
  background: rgba(16, 185, 129, 0.1);
  color: #059669;
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
  
  .children-grid {
    grid-template-columns: 1fr;
  }
  
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .subject-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .event-card {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
}
</style>