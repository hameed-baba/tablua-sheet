const {
  SchoolStaff,
  SchoolStudent,
  SchoolClass,
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
    const [totalStudents, totalStaff, totalClasses] =
      await Promise.all([
        SchoolStudent.count({ where: { status: true } }),
        SchoolStaff.count({ where: { status: true, has_school_access: true } }),
        SchoolClass.count({ where: { status: true } }),
      ]);

    res.json({
      status: "success",
      message: "Dashboard overview retrieved successfully",
      data: {
        totalStudents,
        totalStaff,
        totalClasses,
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

    // Total active students (regardless of session)
    const totalActiveStudents = await SchoolStudent.count({
      where: { student_status: "active" },
    });

    // Total students registered in active session
    let totalStudentsInActiveSession = 0;
    if (currentSession) {
      totalStudentsInActiveSession = await SchoolStudent.count({
        where: {
          current_session_id: currentSession.id,
        },
      });
    }

    // Total active staff
    const totalActiveStaff = await SchoolStaff.count({
      where: {
        status: true,
        has_school_access: true,
      },
    });

    // Total classes
    const totalClasses = await SchoolClass.count({});

    res.json({
      status: "success",
      message: "Dashboard summary retrieved successfully",
      data: {
        totals: {
          activeStudents: totalActiveStudents,
          studentsInActiveSession: totalStudentsInActiveSession,
          activeStaff: totalActiveStaff,
          totalClasses: totalClasses,
        },
        session: currentSession
          ? {
            id: currentSession.id,
            name: currentSession.session_name,
            startDate: currentSession.start_date,
            endDate: currentSession.end_date,
            status: currentSession.status,
          }
          : null,
        term: currentTerm
          ? {
            id: currentTerm.id,
            name: currentTerm.term_name,
            startDate: currentTerm.start_date,
            endDate: currentTerm.end_date,
            status: currentTerm.status,
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

/**
 * @desc Get chart data for dashboard
 * @route GET /api/dashboard/charts
 */
const getDashboardCharts = asyncHandler(async (req, res) => {
  try {
    // Get current active session and term
    const currentSession = await SchoolSession.findOne({
      where: { status: "active" },
    });

    const currentTerm = await SchoolTerm.findOne({
      where: { status: "active" },
    });

    // 1. Students by Class Distribution
    const studentsByClass = await SchoolStudent.findAll({
      attributes: [
        [SchoolStudent.sequelize.fn("COUNT", SchoolStudent.sequelize.col("SchoolStudent.id")), "count"],
      ],
      include: [
        {
          model: SchoolClass,
          as: "Class",
          attributes: ["class_name"],
          required: true,
        },
      ],
      where: {
        student_status: "active",
      },
      group: ["Class.id", "Class.class_name"],
      raw: true,
    });

    // 2. Students by Gender Distribution
    const studentsByGender = await SchoolStudent.findAll({
      attributes: [
        "gender",
        [SchoolStudent.sequelize.fn("COUNT", SchoolStudent.sequelize.col("id")), "count"],
      ],
      where: {
        student_status: "active",
      },
      group: ["gender"],
      raw: true,
    });

    // 3. Students by Status
    const studentsByStatus = await SchoolStudent.findAll({
      attributes: [
        "student_status",
        [SchoolStudent.sequelize.fn("COUNT", SchoolStudent.sequelize.col("id")), "count"],
      ],
      group: ["student_status"],
      raw: true,
    });

    // 4. Staff by Role Distribution
    const staffByRole = await SchoolStaff.findAll({
      attributes: [
        [SchoolStaff.sequelize.fn("COUNT", SchoolStaff.sequelize.col("SchoolStaff.id")), "count"],
      ],
      include: [
        {
          model: require("../models").Role,
          as: "Role",
          attributes: ["role_name"],
          required: true,
        },
      ],
      where: {
        status: true,
        has_school_access: true,
      },
      group: ["Role.id", "Role.role_name"],
      raw: true,
    });

    // 5. Monthly Student Enrollment Trend (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const enrollmentTrend = await SchoolStudent.findAll({
      attributes: [
        [
          SchoolStudent.sequelize.fn(
            "DATE_FORMAT",
            SchoolStudent.sequelize.col("createdAt"),
            "%Y-%m"
          ),
          "month",
        ],
        [SchoolStudent.sequelize.fn("COUNT", SchoolStudent.sequelize.col("id")), "count"],
      ],
      where: {
        createdAt: {
          [Op.gte]: sixMonthsAgo,
        },
      },
      group: [
        SchoolStudent.sequelize.fn(
          "DATE_FORMAT",
          SchoolStudent.sequelize.col("createdAt"),
          "%Y-%m"
        ),
      ],
      order: [[SchoolStudent.sequelize.fn(
        "DATE_FORMAT",
        SchoolStudent.sequelize.col("createdAt"),
        "%Y-%m"
      ), "ASC"]],
      raw: true,
    });

    // Format the data for frontend
    const formattedData = {
      studentsByClass: studentsByClass.map((item) => ({
        label: item["Class.class_name"],
        value: parseInt(item.count),
      })),
      studentsByGender: studentsByGender.map((item) => ({
        label: item.gender.charAt(0).toUpperCase() + item.gender.slice(1),
        value: parseInt(item.count),
      })),
      studentsByStatus: studentsByStatus.map((item) => ({
        label: item.student_status.charAt(0).toUpperCase() + item.student_status.slice(1),
        value: parseInt(item.count),
      })),
      staffByRole: staffByRole.map((item) => ({
        label: item["Role.role_name"],
        value: parseInt(item.count),
      })),
      enrollmentTrend: enrollmentTrend.map((item) => {
        const [year, month] = item.month.split("-");
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        return {
          label: `${monthNames[parseInt(month) - 1]} ${year}`,
          value: parseInt(item.count),
        };
      }),
    };

    res.json({
      status: "success",
      message: "Dashboard charts data retrieved successfully",
      data: formattedData,
    });
  } catch (error) {
    console.error("Error fetching dashboard charts:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch dashboard charts data",
      debug: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

module.exports = {
  getDashboardOverview,
  getDashboardSummary,
  getDashboardCharts,
};
