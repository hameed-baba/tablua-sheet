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
  authorize("subject.read"),
  validateQuery(schemas.pagination),
  classSubjectAssignController.getAll,
);

router.get("/:id", authenticate, classSubjectAssignController.getById);

router.get(
  "/class/:classId",
  authenticate,
  authorize("subject.read"),
  classSubjectAssignController.getClassAssignedSubject,
);

router.post(
  "/",
  authenticate,
  authorize("subject.create"),
  classSubjectAssignController.validateAssignmentRequest,
  classSubjectAssignController.createAssignment,
);

router.post(
  "/student/assign-subject",
  authenticate,
  authorize("subject.create"),
  classSubjectAssignController.assignSubjectToClassStudents,
);

router.put(
  "/:id",
  authenticate,
  authorize("subject.create"),
  checkSchoolAccess,
  classSubjectAssignController.updateAssignment,
);

router.delete(
  "/:id",
  authenticate,
  checkSchoolAccess,
  authorize("subject.delete"),
  classSubjectAssignController.delete,
);

module.exports = router;
