const express = require("express");
const {
  authenticate,
  checkSchoolAccess,
  authorize,
} = require("../middleware/auth");
const {
  validate,
  validateQuery,
  schemas,
} = require("../middleware/validation");
const { schoolStudentController } = require("../controllers");

const router = express.Router();

// Register new student
router.post(
  "/",
  authenticate,
  authorize(["super_admin","admin"]),
  validate(schemas.studentRegistrationWithSubjects),
  schoolStudentController.register,
);

// Get all students with pagination and filters
router.get(
  "/",
  authenticate,
  authorize(["super_admin","admin"]),
  validateQuery(schemas.pagination),
  schoolStudentController.getAll,
);

router.get(
  "/session",
  authenticate,
  authorize(["super_admin","admin"]),
  validateQuery(schemas.pagination),
  schoolStudentController.getAllStudentByActiveSession,
);

// Search students by multiple criteria
router.get(
  "/search",
  authenticate,
  authorize(["super_admin","admin"]),
  schoolStudentController.getStudents,
);

// Get student by ID
router.get(
  "/:id",
  authenticate,
  authorize(["super_admin","admin"]),
  schoolStudentController.getById,
);

router.get(
  "/class/:classId",
  authenticate,
  authorize(["super_admin","admin"]),
  schoolStudentController.getStudentsByClassId,
);

router.get(
  "/:id/subjects",
  authenticate,
  authorize(["super_admin","admin"]),
  schoolStudentController.getStudentSubjects,
);

// Debug endpoint to check class subjects
router.get(
  "/debug/class-subjects/:classId",
  authenticate,
  authorize(["super_admin","admin"]),
  schoolStudentController.debugClassSubjects,
);

// Create test class subject assignments
router.post(
  "/debug/create-class-subjects",
  authenticate,
  authorize(["super_admin","admin"]),
  schoolStudentController.createTestClassSubjects,
);

// Debug all promotion data
router.get(
  "/debug/promotion-data",
  authenticate,
  authorize(["super_admin","admin"]),
  schoolStudentController.debugPromotionData,
);

// Debug student assignments
router.get(
  "/debug/assignments/:studentId",
  authenticate,
  authorize(["super_admin","admin"]),
  schoolStudentController.debugStudentAssignments,
);

// Test promotion without full auth (for debugging)
router.post(
  "/debug/test-promote",
  authenticate,
  authorize(["super_admin","admin"]),
  schoolStudentController.testPromote,
);

// Get students by status
router.get(
  "/status/:status",
  authenticate,
  authorize(["super_admin","admin"]),
  schoolStudentController.getStudentsByStatus,
);

// Update student status
router.put(
  "/:id/status",
  authenticate,
  authorize(["super_admin","admin"]),
  schoolStudentController.updateStudentStatus,
);

// Promote single student
router.put(
  "/:id/promote",
  authenticate,
  authorize(["super_admin","admin"]),
  schoolStudentController.promoteStudent,
);

// Bulk promote students
router.put(
  "/bulk-promote",
  authenticate,
  authorize(["super_admin","admin"]),
  schoolStudentController.bulkPromoteStudents,
);

// Update student
router.put(
  "/:id",
  authenticate,
  authorize(["super_admin","admin"]),
  schoolStudentController.updateStudent,
);

// Delete student
router.delete(
  "/:id",
  authenticate,
  authorize(["super_admin","admin"]),
  schoolStudentController.delete,
);

module.exports = router;
