const express = require("express");
const {
  authenticate,
  checkSchoolAccess,
  authorize,
  checkSystemAccess,
} = require("../middleware/auth");
const {
  validate,
  validateQuery,
  schemas,
} = require("../middleware/validation");
const { classSubjectAssignController } = require("../controllers");

const router = express.Router();

router.get(
  "/",
  authenticate,
  authorize(["super_admin", "admin", "teacher", "student", "parent"]),
  validateQuery(schemas.pagination),
  classSubjectAssignController.getAll,
  checkSystemAccess,
  checkSchoolAccess,
);

router.get(
  "/:id",
  authenticate,
  authorize(["super_admin", "admin", "teacher", "student", "parent"]),
  classSubjectAssignController.getById,
  checkSystemAccess,
  checkSchoolAccess,
);

router.get(
  "/class/:classId",
  authenticate,
  authorize(["super_admin", "admin", "teacher", "student", "parent"]),
  classSubjectAssignController.getClassAssignedSubject,
  checkSystemAccess,
  checkSchoolAccess,
);

router.post(
  "/",
  authenticate,
  authorize(["super_admin", "admin"]),
  classSubjectAssignController.validateAssignmentRequest,
  classSubjectAssignController.createAssignment,
  checkSystemAccess,
  checkSchoolAccess,
);

router.post(
  "/student/assign-subject",
  authenticate,
  authorize(["super_admin", "admin"]),
  checkSystemAccess,
  classSubjectAssignController.assignSubjectToClassStudents,
);

router.put(
  "/:id",
  authenticate,
  authorize(["super_admin", "admin"]),
  checkSchoolAccess,
  checkSystemAccess,
  classSubjectAssignController.updateAssignment,
);

router.delete(
  "/:id",
  authenticate,
  checkSchoolAccess,
  authorize(["super_admin", "admin"]),
  checkSchoolAccess,
  checkSystemAccess,
  classSubjectAssignController.delete,
);

module.exports = router;
