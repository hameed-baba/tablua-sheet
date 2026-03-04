const express = require("express");
const {
  authenticate,
  checkSchoolAccess,
  authorize,
  checkSystemAccess,
  requireSuperAdmin,
} = require("../middleware/auth");
const {
  validate,
  validateQuery,
  schemas,
} = require("../middleware/validation");
const { schoolSectionController } = require("../controllers");

const router = express.Router();

router.get(
  "/",
  authenticate,
  authorize(["super_admin", "admin", "teacher", "student", "parent"]),
  checkSchoolAccess,
  checkSystemAccess,
  validateQuery(schemas.pagination),
  schoolSectionController.getAll,
);

router.get(
  "/:id",
  authenticate,
  authorize(["super_admin", "admin", "teacher", "student", "parent"]),
  checkSchoolAccess,
  checkSystemAccess,
  schoolSectionController.getById,
);

router.post(
  "/",
  authenticate,
  requireSuperAdmin,
  checkSchoolAccess,
  checkSystemAccess,
  validate(schemas.schoolSectionCreation),
  schoolSectionController.create,
);

router.put(
  "/:id",
  authenticate,
  requireSuperAdmin,
  checkSchoolAccess,
  checkSystemAccess,
  schoolSectionController.update,
);

router.delete(
  "/:id",
  authenticate,
  requireSuperAdmin,
  checkSchoolAccess,
  checkSystemAccess,
  schoolSectionController.delete,
);

module.exports = router;
