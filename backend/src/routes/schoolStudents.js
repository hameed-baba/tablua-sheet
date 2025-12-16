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
  authorize("student.create"),
  validate(schemas.studentRegistrationWithSubjects),
  schoolStudentController.register
);

// Get all students with pagination and filters
router.get(
  "/",
  authenticate,
  authorize("student.read"),
  validateQuery(schemas.pagination),
  schoolStudentController.getAll
);

router.get(
  "/session",
  authenticate,
  authorize("student.read"),
  validateQuery(schemas.pagination),
  schoolStudentController.getAllStudentByActiveSession
);

// Search students by multiple criteria
router.get(
  "/search",
  authenticate,
  authorize("student.read"),
  schoolStudentController.getStudents
);

// Get student by ID
router.get(
  "/:id",
  authenticate,
  authorize("student.read"),
  schoolStudentController.getById
);

router.get(
  "/class/:classId",
  authenticate,
  authorize("student.read"),
  schoolStudentController.getStudentsByClassId
);

router.get(
  "/:id/subjects",
  authenticate,
  authorize("student.read"),
  schoolStudentController.getStudentSubjects
);

// Debug endpoint to check class subjects
router.get(
  "/debug/class-subjects/:classId",
  authenticate,
  authorize("student.read"),
  schoolStudentController.debugClassSubjects
);

// Create test class subject assignments
router.post(
  "/debug/create-class-subjects",
  authenticate,
  authorize("student.create"),
  schoolStudentController.createTestClassSubjects
);

// Debug all promotion data
router.get(
  "/debug/promotion-data",
  authenticate,
  authorize("student.read"),
  schoolStudentController.debugPromotionData
);

// Debug student assignments
router.get(
  "/debug/assignments/:studentId",
  authenticate,
  authorize("student.read"),
  schoolStudentController.debugStudentAssignments
);

// Test promotion without full auth (for debugging)
router.post(
  "/debug/test-promote",
  authenticate,
  authorize("student.read"),
  schoolStudentController.testPromote
);

// Get students by status
router.get(
  "/status/:status",
  authenticate,
  authorize("student.read"),
  schoolStudentController.getStudentsByStatus
);

// Update student status
router.put(
  "/:id/status",
  authenticate,
  authorize("student.update"),
  schoolStudentController.updateStudentStatus
);

// Promote single student
router.put(
  "/:id/promote",
  authenticate,
  authorize("student.update"),
  schoolStudentController.promoteStudent
);

// Bulk promote students
router.put(
  "/bulk-promote",
  authenticate,
  authorize("student.update"),
  schoolStudentController.bulkPromoteStudents
);

// Update student
router.put(
  "/:id",
  authenticate,
  authorize("student.update"),
  schoolStudentController.updateStudent
);

// Delete student
router.delete(
  "/:id",
  authenticate,
  authorize("student.delete"),
  schoolStudentController.delete
);

module.exports = router;
