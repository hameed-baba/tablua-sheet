// Test script to demonstrate the Dashboard API response format
// This shows what the API will return

const sampleDashboardResponse = {
  status: "success",
  message: "Dashboard statistics retrieved successfully",
  data: {
    overview: {
      totalStudents: 1250,
      totalStaff: 45,
      totalClasses: 18,
      attendanceRate: 92.5
    },
    activity: {
      activeStaff: 12,
      newStudentsThisTerm: 23,
      recentStudentRegistrations: 8,
      recentStaffHires: 3
    },
    session: {
      currentSession: {
        id: 1,
        session_name: "2024/2025 Session",
        start_date: "2024-09-01",
        end_date: "2025-07-31",
        is_active: true
      },
      currentTerm: {
        id: 1,
        term_name: "First Term",
        start_date: "2024-09-01",
        end_date: "2024-12-20",
        is_active: true
      }
    },
    cards: [
      {
        title: "Total Students",
        value: 1250,
        change: "+23 new this term",
        changeType: "positive",
        icon: "students",
        color: {
          background: "rgba(59, 130, 246, 0.1)",
          color: "#3b82f6"
        }
      },
      {
        title: "Teaching Staff",
        value: 45,
        change: "12 currently active",
        changeType: "positive",
        icon: "staff",
        color: {
          background: "rgba(16, 185, 129, 0.1)",
          color: "#10b981"
        }
      },
      {
        title: "Active Classes",
        value: 18,
        change: "All classes running",
        changeType: "positive",
        icon: "classes",
        color: {
          background: "rgba(245, 158, 11, 0.1)",
          color: "#f59e0b"
        }
      },
      {
        title: "Today's Attendance",
        value: "92.5%",
        change: "Excellent attendance",
        changeType: "positive",
        icon: "attendance",
        color: {
          background: "rgba(139, 92, 246, 0.1)",
          color: "#8b5cf6"
        }
      }
    ]
  }
};

console.log('Dashboard API Response Format:');
console.log(JSON.stringify(sampleDashboardResponse, null, 2));

console.log('\n=== API Endpoints ===');
console.log('GET /api/dashboard/stats - Complete dashboard statistics');
console.log('GET /api/dashboard/overview - Simplified overview');
console.log('GET /api/dashboard/session-info - Current session and term info');

console.log('\n=== Frontend Usage ===');
console.log('apiServices.getDashboardStats() - Get complete stats');
console.log('apiServices.getDashboardOverview() - Get basic overview');
console.log('apiServices.getSessionInfo() - Get session info');

module.exports = sampleDashboardResponse;