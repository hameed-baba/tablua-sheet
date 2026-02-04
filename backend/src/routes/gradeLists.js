const express = require("express");
const {
  authenticate,
  authorize,
  checkSchoolAccess,
  checkSystemAccess,
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
  authorize(["super_admin", "admin", "teacher", "student", "parent"]),
  validateQuery(schemas.pagination),
  gradeListController.getAllGradeLists,
  checkSchoolAccess,
  checkSystemAccess,
);

router.get(
  "/:id",
  authenticate,
  authorize(["super_admin", "admin", "teacher", "student", "parent"]),
  gradeListController.getGradeListById,
  checkSchoolAccess,
  checkSystemAccess,
);

router.post(
  "/",
  authenticate,
  authorize(["super_admin", "admin"]),
  validate(schemas.gradeListCreation),
  gradeListController.createGradeList,
  checkSchoolAccess,
  checkSystemAccess,
);

router.put(
  "/:id",
  authenticate,
  authorize(["super_admin", "admin"]),
  gradeListController.updateGradeList,
  checkSchoolAccess,
  checkSystemAccess,
);

router.delete(
  "/:id",
  authenticate,
  authorize(["super_admin", "admin"]),
  gradeListController.deleteGradeList,
  checkSchoolAccess,
  checkSystemAccess,
);

module.exports = router;
