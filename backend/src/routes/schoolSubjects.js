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
  authorize("subject.read"),
  validateQuery(schemas.pagination),
  schoolSubjectController.getAllSubjects
);

router.get(
  "/class/:classId",
  authenticate,
  authorize("subject.read"),
  schoolSubjectController.getSubjectsByClassId
);

router.get(
  "/:id",
  authenticate,
  authorize("subject.read"),
  schoolSubjectController.getById
);

router.get(
  "/class/:classId",
  authenticate,
  authorize("subject.read"),
  schoolSubjectController.getSubjectsByClassId
);


router.post(
  "/",
  authenticate,
  authorize("subject.create"),

  validate(schemas.schoolSubjectCreation),
  schoolSubjectController.create
);

router.put(
  "/:id",
  authenticate,
  authorize("subject.update"),

  schoolSubjectController.update
);

router.delete(
  "/:id",
  authenticate,
  authorize("subject.delete"),
  schoolSubjectController.delete
);

module.exports = router;
