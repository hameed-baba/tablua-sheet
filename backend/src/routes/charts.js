const express = require("express");
const {
  authenticate,
  authorize,
} = require("../middleware/auth");
const chartController = require("../controllers/chartController");

const router = express.Router();

// Dashboard overview statistics
router.get(
  "/dashboard-stats",
  authenticate,
  // authorize("dashboard.read"),
  chartController.getDashboardStats
);

// Student enrollment trends
router.get(
  "/enrollment-trends",
  authenticate,
  authorize("student.read"),
  chartController.getEnrollmentTrends
);

// Students distribution by class
router.get(
  "/class-distribution",
  authenticate,
  // authorize("student.read"),
  chartController.getClassDistribution
);

// Student status distribution
router.get(
  "/student-status",
  authenticate,
  // authorize("student.read"),
  chartController.getStudentStatusDistribution
);

// Subject performance overview
router.get(
  "/subject-performance",
  authenticate,
  // authorize("grade.read"),
  chartController.getSubjectPerformance
);

// Age distribution of students
router.get(
  "/age-distribution",
  authenticate,
  // authorize("student.read"),
  chartController.getAgeDistribution
);

module.exports = router;