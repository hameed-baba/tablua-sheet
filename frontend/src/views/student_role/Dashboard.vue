<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1>Student Portal</h1>
        <p>Welcome back, {{ studentName }}</p>
      </div>
      <div class="student-info">
        <div class="student-avatar">
          <span>{{ getInitials(studentName) }}</span>
        </div>
        <div class="student-details">
          <h3>{{ studentName }}</h3>
          <p>{{ mockData.studentInfo.class }} • {{ mockData.studentInfo.admissionNumber }}</p>
        </div>
      </div>
    </div>

    <!-- Academic Overview -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon subjects">
          <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
          </svg>
        </div>
        <div class="stat-content">
          <h3>{{ mockData.subjects.length }}</h3>
          <p>Subjects</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon average">
          <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
          </svg>
        </div>
        <div class="stat-content">
          <h3>{{ mockData.overallAverage }}%</h3>
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
          <h3>{{ mockData.attendanceRate }}%</h3>
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
          <h3>{{ mockData.classPosition }}</h3>
          <p>Class Position</p>
        </div>
      </div>
    </div>

    <!-- Current Grades -->
    <div class="dashboard-grid">
      <div class="dashboard-card">
        <div class="card-header">
          <h3>Current Term Grades</h3>
          <router-link to="/student/grades" class="view-all">View All</router-link>
        </div>
        <div class="grades-list">
          <div v-for="subject in mockData.subjects" :key="subject.id" class="grade-item">
            <div class="subject-info">
              <h4>{{ subject.name }}</h4>
              <p>{{ subject.teacher }}</p>
            </div>
            <div class="grade-scores">
              <div class="score-item">
                <span class="score-label">CA</span>
                <span class="score-value">{{ subject.ca }}/40</span>
              </div>
              <div class="score-item">
                <span class="score-label">Exam</span>
                <span class="score-value">{{ subject.exam }}/60</span>
              </div>
              <div class="total-score" :class="getGradeClass(subject.total)">
                {{ subject.total }}/100
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="dashboard-card">
        <div class="card-header">
          <h3>Upcoming Events</h3>
        </div>
        <div class="events-list">
          <div v-for="event in mockData.upcomingEvents" :key="event.id" class="event-item">
            <div class="event-date">
              <span class="day">{{ formatDay(event.date) }}</span>
              <span class="month">{{ formatMonth(event.date) }}</span>
            </div>
            <div class="event-info">
              <h4>{{ event.title }}</h4>
              <p>{{ event.description }}</p>
              <span class="event-time">{{ event.time }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Today's Schedule -->
    <div class="schedule-card">
      <div class="card-header">
        <h3>Today's Timetable</h3>
        <span class="date">{{ currentDate }}</span>
      </div>
      <div class="schedule-grid">
        <div v-for="period in mockData.todaySchedule" :key="period.id" class="period-card">
          <div class="period-time">{{ period.time }}</div>
          <div class="period-info">
            <h4>{{ period.subject }}</h4>
            <p>{{ period.teacher }} • {{ period.room }}</p>
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
        <router-link to="/student/grades" class="action-card">
          <div class="action-icon">
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
            </svg>
          </div>
          <h4>View Grades</h4>
          <p>Check your academic performance</p>
        </router-link>

        <router-link to="/student/attendance" class="action-card">
          <div class="action-icon">
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <h4>Attendance</h4>
          <p>View attendance record</p>
        </router-link>

        <router-link to="/student/timetable" class="action-card">
          <div class="action-icon">
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
          </div>
          <h4>Timetable</h4>
          <p>View class schedule</p>
        </router-link>

        <router-link to="/student/profile" class="action-card">
          <div class="action-icon">
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
            </svg>
          </div>
          <h4>My Profile</h4>
          <p>View personal information</p>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const studentName = ref('John Doe')

const currentDate = computed(() => {
  return new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
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

// Mock data for student dashboard
const mockData = ref({
  studentInfo: {
    class: 'JSS 2A',
    admissionNumber: 'AGP/SS/2022/001'
  },
  overallAverage: 78,
  attendanceRate: 92,
  classPosition: '5th',
  subjects: [
    { id: 1, name: 'Mathematics', teacher: 'Mrs. Johnson', ca: 35, exam: 48, total: 83 },
    { id: 2, name: 'English Language', teacher: 'Mr. Smith', ca: 32, exam: 45, total: 77 },
    { id: 3, name: 'Basic Science', teacher: 'Dr. Brown', ca: 28, exam: 42, total: 70 },
    { id: 4, name: 'Social Studies', teacher: 'Mrs. Davis', ca: 30, exam: 50, total: 80 },
    { id: 5, name: 'French', teacher: 'Ms. Marie', ca: 25, exam: 38, total: 63 }
  ],
  upcomingEvents: [
    {
      id: 1,
      title: 'Mathematics Test',
      description: 'Algebra and Geometry',
      date: '2024-02-15',
      time: '10:00 AM'
    },
    {
      id: 2,
      title: 'Science Fair',
      description: 'Project presentation',
      date: '2024-02-20',
      time: '2:00 PM'
    },
    {
      id: 3,
      title: 'Parent-Teacher Meeting',
      description: 'Academic review',
      date: '2024-02-25',
      time: '9:00 AM'
    }
  ],
  todaySchedule: [
    {
      id: 1,
      time: '8:00 - 8:40',
      subject: 'Mathematics',
      teacher: 'Mrs. Johnson',
      room: 'Room 12',
      status: 'completed'
    },
    {
      id: 2,
      time: '8:40 - 9:20',
      subject: 'English Language',
      teacher: 'Mr. Smith',
      room: 'Room 8',
      status: 'completed'
    },
    {
      id: 3,
      time: '10:00 - 10:40',
      subject: 'Basic Science',
      teacher: 'Dr. Brown',
      room: 'Lab 1',
      status: 'current'
    },
    {
      id: 4,
      time: '11:20 - 12:00',
      subject: 'Social Studies',
      teacher: 'Mrs. Davis',
      room: 'Room 15',
      status: 'upcoming'
    }
  ]
})
</script>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.student-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.student-avatar {
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
}

.student-details h3 {
  margin: 0 0 4px 0;
  color: #1e293b;
  font-size: 18px;
}

.student-details p {
  margin: 0;
  color: #64748b;
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

.stat-icon.subjects { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
.stat-icon.average { background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); }
.stat-icon.attendance { background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); }
.stat-icon.position { background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%); }

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

.grades-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.grade-item {
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

.grade-scores {
  display: flex;
  align-items: center;
  gap: 12px;
}

.score-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.score-label {
  font-size: 10px;
  color: #64748b;
  text-transform: uppercase;
  font-weight: 600;
}

.score-value {
  font-size: 12px;
  color: #1e293b;
  font-weight: 600;
}

.total-score {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 700;
  min-width: 60px;
  text-align: center;
}

.total-score.excellent {
  background: rgba(16, 185, 129, 0.1);
  color: #059669;
}

.total-score.good {
  background: rgba(59, 130, 246, 0.1);
  color: #2563eb;
}

.total-score.average {
  background: rgba(245, 158, 11, 0.1);
  color: #d97706;
}

.total-score.needs-improvement {
  background: rgba(239, 68, 68, 0.1);
  color: #dc2626;
}

.events-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.event-item {
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
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
  
  .stats-grid {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }
  
  .actions-grid {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  }
  
  .grade-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .period-card {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
}
</style>