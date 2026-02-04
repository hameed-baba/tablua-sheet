const express = require("express");
const {
  authenticate,
  authorize,
  authorizeAny,
  requireSuperAdmin,
  checkSchoolAccess,
} = require("../middleware/auth");
const { validate, schemas } = require("../middleware/validation");
const { roleController } = require("../controllers");

const router = express.Router();

// Role routes without permission checks
router.get(
  "/",
  authenticate,
  requireSuperAdmin,
  checkSchoolAccess,
  checkSchoolAccess,
  roleController.getAllRoles,
);
router.get(
  "/:id",
  authenticate,
  requireSuperAdmin,
  checkSchoolAccess,
  checkSchoolAccess,
  roleController.getRoleById,
);

router.post(
  "/",
  authenticate,
  requireSuperAdmin,
  checkSchoolAccess,
  checkSchoolAccess,
  validate(schemas.roleCreation),
  roleController.createRole,
);

router.put(
  "/:id",
  authenticate,
  requireSuperAdmin,
  checkSchoolAccess,
  checkSchoolAccess,
  roleController.updateRole,
);
router.delete(
  "/:id",
  authenticate,
  requireSuperAdmin,
  checkSchoolAccess,
  checkSchoolAccess,
  roleController.deleteRole,
);

module.exports = router;
