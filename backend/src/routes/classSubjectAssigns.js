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
const { classSubjectAssignController } = require("../controllers");

const router = express.Router();

router.get(
  "/",
  authenticate,
  authorize(["super_admin", "admin","teacher","student","parent"]),
  validateQuery(schemas.pagination),
  classSubjectAssignController.getAll,
);

router.get("/:id", authenticate, classSubjectAssignController.getById);

router.get(
  "/class/:classId",
  authenticate,
  authorize(["super_admin", "admin","teacher","student","parent"]),
  classSubjectAssignController.getClassAssignedSubject,
);

router.post(
  "/",
  authenticate,
  authorize(["super_admin", "admin","teacher","student","parent"]),
  classSubjectAssignController.validateAssignmentRequest,
  classSubjectAssignController.createAssignment,
);

router.post(
  "/student/assign-subject",
  authenticate,
  authorize(["super_admin", "admin","teacher","student","parent"]),
  classSubjectAssignController.assignSubjectToClassStudents,
);

router.put(
  "/:id",
  authenticate,
  authorize(["super_admin", "admin","teacher","student","parent"]),
  checkSchoolAccess,
  classSubjectAssignController.updateAssignment,
);

router.delete(
  "/:id",
  authenticate,
  checkSchoolAccess,
  authorize(["super_admin", "admin","teacher","student","parent"]),
  classSubjectAssignController.delete,
);

module.exports = router;
