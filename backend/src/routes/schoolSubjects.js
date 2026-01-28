const express = require("express");
const { authenticate, authorize } = require("../middleware/auth");
const {
  validate,
  validateQuery,
  schemas,
} = require("../middleware/validation");
const { schoolSubjectController } = require("../controllers");

const router = express.Router();

router.get(
  "/",
  authenticate,
  authorize(['super_admin', 'admin', 'teacher', 'student', 'parent']),
  validateQuery(schemas.pagination),
  schoolSubjectController.getAllSubjects
);

router.get(
  "/class-assign-subject/:classId",
  authenticate,
  authorize(['super_admin', 'admin', 'teacher', 'student', 'parent']),
  schoolSubjectController.getClassAssignedSubjects
);

router.get(
  "/:id",
  authenticate,
  authorize(['super_admin', 'admin', 'teacher', 'student', 'parent']),
  schoolSubjectController.getById
);

router.get(
  "/class/:classId",
  authenticate,
  authorize(['super_admin', 'admin', 'teacher', 'student', 'parent']),
  schoolSubjectController.getStaffWithSubjectsByClassId
);

router.post(
  "/",
  authenticate,
  authorize(['super_admin', 'admin']),
  validate(schemas.schoolSubjectCreation),
  schoolSubjectController.create
);

router.put(
  "/:id",
  authenticate,
  authorize(['super_admin', 'admin']),

  schoolSubjectController.update
);

router.delete(
  "/:id",
  authenticate,
  authorize(['super_admin', 'admin']),
  schoolSubjectController.delete
);

module.exports = router;
