const {
  SchoolStaff,
  SchoolStudent,
  SchoolClass,
  StaffSession,
  SchoolSession,
  SchoolTerm,
} = require("../models");
const { asyncHandler } = require("../middleware/errorHandler");
const { Op } = require("sequelize");

/**
 * @desc Get dashboard overview (simplified stats)
 * @route GET /api/dashboard/overview
 */
const getDashboardOverview = asyncHandler(async (req, res) => {
  try {
    // Get basic counts
    const [totalStudents, totalStaff, totalClasses, activeStaff] =
      await Promise.all([
        SchoolStudent.count({ where: { status: true } }),
        SchoolStaff.count({ where: { status: true, has_school_access: true } }),
        SchoolClass.count({ where: { status: true } }),
        StaffSession.count({
          where: { is_active: true, logout_time: null },
          include: [
            {
              model: SchoolStaff,
              as: "Staff",
              where: { status: true, has_school_access: true },
            },
          ],
        }),
      ]);

    res.json({
      status: "success",
      message: "Dashboard overview retrieved successfully",
      data: {
        totalStudents,
        totalStaff,
        totalClasses,
        activeStaff,
        attendanceRate: 92.5, // Mock data - implement actual calculation
      },
    });
  } catch (error) {
    console.error("Error fetching dashboard overview:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch dashboard overview",
      debug: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

const getDashboardSummary = asyncHandler(async (req, res) => {
  try {
    // Active session
    const currentSession = await SchoolSession.findOne({
      where: { status: "active" },
    });

    // Active term
    const currentTerm = await SchoolTerm.findOne({
      where: { status: "active" },
    });

    // Total active students
    const totalStudents = await SchoolStudent.count({
      where: { student_status: "active" },
    });

    // Total active staff
    const totalStaff = await SchoolStaff.count({
      where: {
        status: true,
        has_school_access: true,
      },
    });

    // Total active classes
    const totalClasses = await SchoolClass.count({});
    res.json({
      status: "success",
      message: "Dashboard summary retrieved successfully",
      data: {
        totals: {
          students: totalStudents,
          staff: totalStaff,
          classes: totalClasses,
        },
        session: currentSession
          ? {
              id: currentSession.id,
              name: currentSession.session_name,
              startDate: currentSession.start_date,
              endDate: currentSession.end_date,
              isActive: currentSession.is_active,
            }
          : null,
        term: currentTerm
          ? {
              id: currentTerm.id,
              name: currentTerm.term_name,
              startDate: currentTerm.start_date,
              endDate: currentTerm.end_date,
              isActive: currentTerm.is_active,
            }
          : null,
      },
    });
  } catch (error) {
    console.error("Error fetching dashboard summary:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch dashboard summary",
    });
  }
});

module.exports = {
  getDashboardOverview,
  getDashboardSummary,
};
