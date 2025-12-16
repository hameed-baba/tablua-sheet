const express = require("express");
const { authenticate, checkSchoolAccess } = require("../middleware/auth");
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
  validateQuery(schemas.pagination),
  classSubjectAssignController.getAll
);

router.get(
  "/:id",
  authenticate,
  classSubjectAssignController.getById
);

router.get(
  "/class/:classId",
  authenticate,
  classSubjectAssignController.getClassAssignedSubject
);

router.post(
  "/",
  authenticate,
  classSubjectAssignController.validateAssignmentRequest,
  classSubjectAssignController.createAssignment
);

router.put(
  "/:id",
  authenticate,
  checkSchoolAccess,
  classSubjectAssignController.updateAssignment
);

router.delete(
  "/:id",
  authenticate,
  checkSchoolAccess,
  classSubjectAssignController.delete
);

module.exports = router;
