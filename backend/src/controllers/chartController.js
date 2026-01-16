const { Op, Sequelize } = require("sequelize");
const {
  SchoolStudent,
  SchoolClass,
  SchoolSession,
  SchoolStaff,
  Parent,
  StudentSubjectAssign,
  SchoolSubject,
  SchoolTerm,
} = require("../models");
const { asyncHandler } = require("../middleware/errorHandler");

class ChartController {
  /**
   * @desc Get dashboard overview statistics
   * @route GET /api/charts/dashboard-stats
   */
  getDashboardStats = asyncHandler(async (req, res) => {
    try {
      // Get current active session
      const activeSession = await SchoolSession.findOne({
        where: { status: "active" },
      });

      const sessionId = activeSession?.id;

      // Parallel queries for better performance
      const [
        totalStudents,
        totalStaff,
        totalClasses,
        totalParents,
        activeStudents,
        maleStudents,
        femaleStudents,
        staffByRole,
      ] = await Promise.all([
        // Total students
        SchoolStudent.count(),
        
        // Total staff
        SchoolStaff.count(),
        
        // Total classes
        SchoolClass.count(),
        
        // Total parents
        Parent.count(),
        
        // Active students
        SchoolStudent.count({
          where: { student_status: "active" },
        }),
        
        // Male students
        SchoolStudent.count({
          where: { gender: "male", student_status: "active" },
        }),
        
        // Female students
        SchoolStudent.count({
          where: { gender: "female", student_status: "active" },
        }),
        
        // Staff by role
        SchoolStaff.findAll({
          attributes: [
            "staff_role",
            [Sequelize.fn("COUNT", Sequelize.col("id")), "count"],
          ],
          group: ["staff_role"],
          raw: true,
        }),
      ]);

      const responseData = {
        status: "success",
        data: {
          overview: {
            totalStudents,
            totalStaff,
            totalClasses,
            totalParents,
            activeStudents,
          },
          genderDistribution: {
            male: maleStudents,
            female: femaleStudents,
            total: maleStudents + femaleStudents,
          },
          staffDistribution: staffByRole.map((role) => ({
            role: role.staff_role || "Unassigned",
            count: parseInt(role.count),
          })),
          session: {
            id: sessionId,
            name: activeSession?.session_name || "No Active Session",
          },
        },
      };

      console.log('Dashboard stats response:', JSON.stringify(responseData, null, 2));
      res.json(responseData);
    } catch (error) {
      console.error("Dashboard stats error:", error);
      throw error;
    }
  });

  /**
   * @desc Get student enrollment trends by month
   * @route GET /api/charts/enrollment-trends
   */
  getEnrollmentTrends = asyncHandler(async (req, res) => {
    try {
      const { year = new Date().getFullYear() } = req.query;

      const enrollmentData = await SchoolStudent.findAll({
        attributes: [
          [Sequelize.fn("MONTH", Sequelize.col("createdAt")), "month"],
          [Sequelize.fn("COUNT", Sequelize.col("id")), "count"],
        ],
        where: {
          createdAt: {
            [Op.gte]: new Date(`${year}-01-01`),
            [Op.lt]: new Date(`${parseInt(year) + 1}-01-01`),
          },
        },
        group: [Sequelize.fn("MONTH", Sequelize.col("createdAt"))],
        order: [[Sequelize.fn("MONTH", Sequelize.col("createdAt")), "ASC"]],
        raw: true,
      });

      // Create array for all 12 months
      const monthNames = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
      ];

      const trends = monthNames.map((month, index) => {
        const monthData = enrollmentData.find(
          (item) => parseInt(item.month) === index + 1
        );
        return {
          month,
          count: monthData ? parseInt(monthData.count) : 0,
        };
      });

      res.json({
        status: "success",
        data: {
          year: parseInt(year),
          trends,
          totalEnrollments: trends.reduce((sum, item) => sum + item.count, 0),
        },
      });
    } catch (error) {
      console.error("Enrollment trends error:", error);
      throw error;
    }
  });

  /**
   * @desc Get students distribution by class
   * @route GET /api/charts/class-distribution
   */
  getClassDistribution = asyncHandler(async (req, res) => {
    try {
      const classDistribution = await SchoolStudent.findAll({
        attributes: [
          [Sequelize.fn("COUNT", Sequelize.col("SchoolStudent.id")), "count"],
        ],
        include: [
          {
            model: SchoolClass,
            as: "Class",
            attributes: ["id", "class_name"],
          },
        ],
        where: {
          student_status: "active",
        },
        group: ["Class.id", "Class.class_name"],
        order: [["Class", "class_name", "ASC"]],
        raw: true,
      });

      const distribution = classDistribution.map((item) => ({
        className: item["Class.class_name"] || "Unassigned",
        count: parseInt(item.count),
        classId: item["Class.id"],
      }));

      res.json({
        status: "success",
        data: {
          distribution,
          totalStudents: distribution.reduce((sum, item) => sum + item.count, 0),
        },
      });
    } catch (error) {
      console.error("Class distribution error:", error);
      throw error;
    }
  });

  /**
   * @desc Get student status distribution
   * @route GET /api/charts/student-status
   */
  getStudentStatusDistribution = asyncHandler(async (req, res) => {
    try {
      const statusDistribution = await SchoolStudent.findAll({
        attributes: [
          "student_status",
          [Sequelize.fn("COUNT", Sequelize.col("id")), "count"],
        ],
        group: ["student_status"],
        raw: true,
      });

      const distribution = statusDistribution.map((item) => ({
        status: item.student_status || "Unknown",
        count: parseInt(item.count),
      }));

      res.json({
        status: "success",
        data: {
          distribution,
          totalStudents: distribution.reduce((sum, item) => sum + item.count, 0),
        },
      });
    } catch (error) {
      console.error("Student status distribution error:", error);
      throw error;
    }
  });

  /**
   * @desc Get subject performance overview
   * @route GET /api/charts/subject-performance
   */
  getSubjectPerformance = asyncHandler(async (req, res) => {
    try {
      const { sessionId, termId, classId } = req.query;

      let whereClause = {};
      if (sessionId) whereClause.current_session_id = sessionId;
      if (termId) whereClause.current_term_id = termId;
      if (classId) whereClause.current_class_id = classId;

      const subjectPerformance = await StudentSubjectAssign.findAll({
        attributes: [
          [Sequelize.fn("AVG", Sequelize.col("ca_1_score")), "avgCA1"],
          [Sequelize.fn("AVG", Sequelize.col("ca_2_score")), "avgCA2"],
          [Sequelize.fn("AVG", Sequelize.col("exam_score")), "avgExam"],
          [Sequelize.fn("COUNT", Sequelize.col("StudentSubjectAssign.id")), "studentCount"],
        ],
        include: [
          {
            model: SchoolSubject,
            as: "Subject",
            attributes: ["id", "subject_name"],
          },
        ],
        where: {
          ...whereClause,
          [Op.or]: [
            { ca_1_score: { [Op.ne]: null } },
            { ca_2_score: { [Op.ne]: null } },
            { exam_score: { [Op.ne]: null } },
          ],
        },
        group: ["Subject.id", "Subject.subject_name"],
        raw: true,
      });

      const performance = subjectPerformance.map((item) => ({
        subjectName: item["Subject.subject_name"],
        subjectId: item["Subject.id"],
        averageCA1: parseFloat(item.avgCA1) || 0,
        averageCA2: parseFloat(item.avgCA2) || 0,
        averageExam: parseFloat(item.avgExam) || 0,
        studentCount: parseInt(item.studentCount),
        overallAverage: (
          (parseFloat(item.avgCA1) || 0) +
          (parseFloat(item.avgCA2) || 0) +
          (parseFloat(item.avgExam) || 0)
        ) / 3,
      }));

      res.json({
        status: "success",
        data: {
          performance: performance.sort((a, b) => b.overallAverage - a.overallAverage),
          filters: { sessionId, termId, classId },
        },
      });
    } catch (error) {
      console.error("Subject performance error:", error);
      throw error;
    }
  });

  /**
   * @desc Get age distribution of students
   * @route GET /api/charts/age-distribution
   */
  getAgeDistribution = asyncHandler(async (req, res) => {
    try {
      const students = await SchoolStudent.findAll({
        attributes: ["dob"],
        where: {
          student_status: "active",
          dob: { [Op.ne]: null },
        },
        raw: true,
      });

      // Calculate age groups
      const ageGroups = {
        "5-7": 0,
        "8-10": 0,
        "11-13": 0,
        "14-16": 0,
        "17-19": 0,
        "20+": 0,
      };

      const currentYear = new Date().getFullYear();

      students.forEach((student) => {
        const birthYear = new Date(student.dob).getFullYear();
        const age = currentYear - birthYear;

        if (age >= 5 && age <= 7) ageGroups["5-7"]++;
        else if (age >= 8 && age <= 10) ageGroups["8-10"]++;
        else if (age >= 11 && age <= 13) ageGroups["11-13"]++;
        else if (age >= 14 && age <= 16) ageGroups["14-16"]++;
        else if (age >= 17 && age <= 19) ageGroups["17-19"]++;
        else if (age >= 20) ageGroups["20+"]++;
      });

      const distribution = Object.entries(ageGroups).map(([ageRange, count]) => ({
        ageRange,
        count,
      }));

      res.json({
        status: "success",
        data: {
          distribution,
          totalStudents: students.length,
        },
      });
    } catch (error) {
      console.error("Age distribution error:", error);
      throw error;
    }
  });
}

module.exports = new ChartController();