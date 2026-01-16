const { SchoolStaff, SchoolStudent, SchoolClass, StaffSession, SchoolSession, SchoolTerm } = require("../models");
const { asyncHandler } = require("../middleware/errorHandler");
const { Op } = require("sequelize");

/**
 * @desc Get dashboard statistics
 * @route GET /api/dashboard/stats
 */
const getDashboardStats = asyncHandler(async (req, res) => {
  try {
    // Get current active session and term
    const currentSession = await SchoolSession.findOne({
      where: { is_active: true }
    });

    const currentTerm = await SchoolTerm.findOne({
      where: { is_active: true }
    });

    // Get total students count
    const totalStudents = await SchoolStudent.count({
      where: {
        status: true // Only active students
      }
    });

    // Get students enrolled this term
    const studentsThisTerm = currentSession ? await SchoolStudent.count({
      where: {
        status: true,
        current_session_id: currentSession.id
      }
    }) : 0;

    // Calculate new students this term (assuming students created in current session are new)
    const newStudentsThisTerm = currentSession ? await SchoolStudent.count({
      where: {
        status: true,
        current_session_id: currentSession.id,
        createdAt: {
          [Op.gte]: currentSession.createdAt
        }
      }
    }) : 0;

    // Get total staff count
    const totalStaff = await SchoolStaff.count({
      where: {
        status: true,
        has_school_access: true
      }
    });

    // Get currently active staff
    const activeStaffSessions = await StaffSession.count({
      where: {
        is_active: true,
        logout_time: null
      },
      include: [
        {
          model: SchoolStaff,
          as: "Staff",
          where: {
            status: true,
            has_school_access: true
          }
        }
      ]
    });

    // Get total classes count
    const totalClasses = await SchoolClass.count({
      where: {
        status: true // Only active classes
      }
    });

    // Get classes for current session
    const classesThisSession = currentSession ? await SchoolClass.count({
      where: {
        status: true,
        // Add session filter if your classes have session_id
      }
    }) : totalClasses;

    // Calculate attendance rate (mock data for now - you can implement actual attendance logic)
    const attendanceRate = 92.5; // This should be calculated from actual attendance data

    // Get recent activity counts
    const recentStudentRegistrations = await SchoolStudent.count({
      where: {
        status: true,
        createdAt: {
          [Op.gte]: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
        }
      }
    });

    const recentStaffHires = await SchoolStaff.count({
      where: {
        status: true,
        has_school_access: true,
        createdAt: {
          [Op.gte]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
        }
      }
    });

    // Prepare response data
    const dashboardStats = {
      overview: {
        totalStudents,
        totalStaff,
        totalClasses,
        attendanceRate
      },
      activity: {
        activeStaff: activeStaffSessions,
        newStudentsThisTerm,
        recentStudentRegistrations,
        recentStaffHires
      },
      session: {
        currentSession: currentSession ? {
          id: currentSession.id,
          session_name: currentSession.session_name,
          start_date: currentSession.start_date,
          end_date: currentSession.end_date,
          is_active: currentSession.is_active
        } : null,
        currentTerm: currentTerm ? {
          id: currentTerm.id,
          term_name: currentTerm.term_name,
          start_date: currentTerm.start_date,
          end_date: currentTerm.end_date,
          is_active: currentTerm.is_active
        } : null
      },
      cards: [
        {
          title: "Total Students",
          value: totalStudents,
          change: `+${newStudentsThisTerm} new this term`,
          changeType: "positive",
          icon: "students",
          color: {
            background: "rgba(59, 130, 246, 0.1)",
            color: "#3b82f6"
          }
        },
        {
          title: "Teaching Staff",
          value: totalStaff,
          change: `${activeStaffSessions} currently active`,
          changeType: "positive",
          icon: "staff",
          color: {
            background: "rgba(16, 185, 129, 0.1)",
            color: "#10b981"
          }
        },
        {
          title: "Active Classes",
          value: totalClasses,
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
          value: `${attendanceRate}%`,
          change: "Excellent attendance",
          changeType: "positive",
          icon: "attendance",
          color: {
            background: "rgba(139, 92, 246, 0.1)",
            color: "#8b5cf6"
          }
        }
      ]
    };

    res.json({
      status: "success",
      message: "Dashboard statistics retrieved successfully",
      data: dashboardStats
    });

  } catch (error) {
    console.error('Error fetching dashboard statistics:', error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch dashboard statistics",
      debug: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @desc Get dashboard overview (simplified stats)
 * @route GET /api/dashboard/overview
 */
const getDashboardOverview = asyncHandler(async (req, res) => {
  try {
    // Get basic counts
    const [totalStudents, totalStaff, totalClasses, activeStaff] = await Promise.all([
      SchoolStudent.count({ where: { status: true } }),
      SchoolStaff.count({ where: { status: true, has_school_access: true } }),
      SchoolClass.count({ where: { status: true } }),
      StaffSession.count({
        where: { is_active: true, logout_time: null },
        include: [{ model: SchoolStaff, as: "Staff", where: { status: true, has_school_access: true } }]
      })
    ]);

    res.json({
      status: "success",
      message: "Dashboard overview retrieved successfully",
      data: {
        totalStudents,
        totalStaff,
        totalClasses,
        activeStaff,
        attendanceRate: 92.5 // Mock data - implement actual calculation
      }
    });

  } catch (error) {
    console.error('Error fetching dashboard overview:', error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch dashboard overview",
      debug: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @desc Get current session and term info
 * @route GET /api/dashboard/session-info
 */
const getSessionInfo = asyncHandler(async (req, res) => {
  try {
    const currentSession = await SchoolSession.findOne({
      where: { is_active: true }
    });

    const currentTerm = await SchoolTerm.findOne({
      where: { is_active: true }
    });

    res.json({
      status: "success",
      message: "Session information retrieved successfully",
      data: {
        session: currentSession ? {
          id: currentSession.id,
          name: currentSession.session_name,
          startDate: currentSession.start_date,
          endDate: currentSession.end_date,
          isActive: currentSession.is_active
        } : null,
        term: currentTerm ? {
          id: currentTerm.id,
          name: currentTerm.term_name,
          startDate: currentTerm.start_date,
          endDate: currentTerm.end_date,
          isActive: currentTerm.is_active
        } : null
      }
    });

  } catch (error) {
    console.error('Error fetching session info:', error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch session information",
      debug: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = {
  getDashboardStats,
  getDashboardOverview,
  getSessionInfo
};