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
  authorize(["super_admin", "admin","teacher","student","parent"]),
  validateQuery(schemas.pagination),
  gradeListController.getAllGradeLists
);

router.get(
  "/:id",
  authenticate,
  authorize(["super_admin", "admin","teacher","student","parent"]),
  gradeListController.getGradeListById
);

router.post(
  "/",
  authenticate,
  authorize(["super_admin", "admin"]),
  validate(schemas.gradeListCreation),
  gradeListController.createGradeList
);

router.put(
  "/:id",
  authenticate,
  authorize(["super_admin", "admin"]),
  gradeListController.updateGradeList
);

router.delete(
  "/:id",
  authenticate,
  authorize(["super_admin", "admin"]),
  gradeListController.deleteGradeList
);

module.exports = router;
