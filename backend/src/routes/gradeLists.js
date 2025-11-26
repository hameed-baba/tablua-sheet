const express = require("express");
const {
  authenticate,
  authorize,
} = require("../middleware/auth");
const {
  validate,
  validateQuery,
  schemas,
} = require("../middleware/validation");
const { gradeListController } = require("../controllers");

const router = express.Router();

router.get(
  "/",
  authenticate,
  authorize("grade.read"),
  validateQuery(schemas.pagination),
  gradeListController.getAllGradeLists
);

router.get(
  "/:id",
  authenticate,
  authorize("grade.read"),
  gradeListController.getGradeListById
);

router.post(
  "/",
  authenticate,
  authorize("grade.create"),
  validate(schemas.gradeListCreation),
  gradeListController.createGradeList
);

router.put(
  "/:id",
  authenticate,
  authorize("grade.update"),
  gradeListController.updateGradeList
);

router.delete(
  "/:id",
  authenticate,
  authorize("grade.delete"),
  gradeListController.deleteGradeList
);

module.exports = router;
