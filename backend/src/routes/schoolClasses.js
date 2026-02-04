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
const { schoolClassController } = require("../controllers");

const router = express.Router();

router.get(
  "/",
  authenticate,
  authorize(["super_admin", "admin", "teacher", "student", "parent"]),
  checkSchoolAccess,
  checkSystemAccess,
  validateQuery(schemas.pagination),
  schoolClassController.getAll,
);

router.get(
  "/row",
  authenticate,
  authorize(["super_admin", "admin", "teacher", "student", "parent"]),
  schoolClassController.getAllRowClases,
  checkSchoolAccess,
  checkSystemAccess,
);

router.get(
  "/:id",
  authenticate,
  authorize(["super_admin", "admin", "teacher", "student", "parent"]),
  checkSchoolAccess,
  checkSystemAccess,
  schoolClassController.getById,
);

router.post(
  "/",
  authenticate,
  requireSuperAdmin,
  validate(schemas.schoolClassCreation),
  schoolClassController.create,
  checkSchoolAccess,
  checkSystemAccess,
);

router.put(
  "/:id",
  authenticate,
  requireSuperAdmin,
  schoolClassController.update,
  checkSchoolAccess,
  checkSystemAccess,
);

router.delete(
  "/:id",
  authenticate,
  requireSuperAdmin,
  schoolClassController.delete,
  checkSchoolAccess,
  checkSystemAccess,
);

module.exports = router;
