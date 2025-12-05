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
  "/search/query",
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

// Update student
router.put(
  "/:id",
  authenticate,
  authorize("student.update"),
  schoolStudentController.update
);

// Delete student
router.delete(
  "/:id",
  authenticate,
  authorize("student.delete"),
  schoolStudentController.delete
);

module.exports = router;
