const express = require("express");
const { authenticate, checkSchoolAccess, authorize } = require("../middleware/auth");
const {
  validate,
  validateQuery,
  schemas,
} = require("../middleware/validation");
const { studentSubjectAssignController } = require("../controllers");

const router = express.Router();

// Get all student subject assignments
router.get(
  "/",
  authenticate,
  authorize(["super_admin", "admin","teacher","student","parent"]),
  validateQuery(schemas.pagination),
  studentSubjectAssignController.getAll
);

// Get CA scores for a class (must be before /:id route)
router.get(
  "/class-ca-scores",
  authenticate,
  authorize(["super_admin", "admin","teacher","student","parent"]),
  studentSubjectAssignController.getClassCAScores
);

// Get exam scores (CA + Exam) for a class (must be before /:id route)
router.get(
  "/class-exam-scores",
  authenticate,
  authorize(["super_admin", "admin","teacher","student","parent"]),
  studentSubjectAssignController.getClassExamScores
);

// Get student subject assignment by identifiers (query params)
router.get(
  "/by-identifiers",
  authenticate,
  authorize(["super_admin", "admin","teacher","student","parent"]),
  studentSubjectAssignController.getByIdentifiers
);

// Get CA and exam marks for a student's subject assignment
router.get(
  "/marks",
  authenticate,
  authorize(["super_admin", "admin","teacher","student","parent"]),
  studentSubjectAssignController.getMarks
);

// Get all marks for a single student
router.get(
  "/student/:student_id/marks",
  authenticate,
  authorize(["super_admin", "admin","teacher","student","parent"]),
  studentSubjectAssignController.getStudentMarks
);

// Get student assigned subjects by class, subject, session, and term
router.get(
  "/assigned-subjects",
  authenticate,
  authorize(["super_admin", "admin","teacher","student","parent"]),
  studentSubjectAssignController.getStudentAssignedSubjects
);

router.get(
  "/assigned-subjects-2",
  authenticate,
  authorize(["super_admin", "admin","teacher","student","parent"]),
  studentSubjectAssignController.getStudentAssignedSubjects2
);

// Get all student subjects with scores by session, term, and class
router.get(
  "/all-subjects-with-scores",
  authenticate,
  authorize(["super_admin", "admin","teacher","student","parent"]),
  studentSubjectAssignController.getAllStudentSubjectsWithScores
);

// Get student subject assignment by ID (must be after specific routes)
router.get(
  "/:id",
  authenticate,
  authorize(["super_admin", "admin","teacher","student","parent"]),
  studentSubjectAssignController.getById
);

// Create new student subject assignment
router.post(
  "/",
  authenticate,
  authorize(["super_admin", "admin"]),
  checkSchoolAccess,
  studentSubjectAssignController.create
);

// Update CA1 score
router.put(
  "/update-ca1-score",
  authenticate,
  authorize(["super_admin", "admin","teacher"]),
  checkSchoolAccess,
  studentSubjectAssignController.updateCA1Score
);

// Update exam score
router.put(
  "/update-exam-score",
  authenticate,
  authorize(["super_admin", "admin","teacher"]),
  checkSchoolAccess,
  studentSubjectAssignController.updateExamScore
);

// Update both CA1 and exam scores
router.put(
  "/update-scores",
  authenticate,
  authorize(["super_admin", "admin","teacher"]),
  checkSchoolAccess,
  studentSubjectAssignController.updateScores
);

// Update student subject assignment by ID
router.put(
  "/:id",
  authenticate,
  authorize(["super_admin", "admin"]),
  checkSchoolAccess,
  studentSubjectAssignController.update
);

// Delete student subject assignment
router.delete(
  "/:id",
  authenticate,
  authorize(["super_admin", "admin"]),
  checkSchoolAccess,
  studentSubjectAssignController.delete
);

module.exports = router;