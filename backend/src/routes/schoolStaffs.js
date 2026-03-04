const express = require("express");
const {
  authenticate,
  checkSystemAccess,
  requireAdmin,
  requireSuperAdmin,
  authorize,
  checkSchoolAccess,
} = require("../middleware/auth");
const {
  validate,
  validateQuery,
  schemas,
} = require("../middleware/validation");
const { schoolStaffController } = require("../controllers");

const router = express.Router();

// Register new staff - Only admins can create staff
router.post(
  "/",
  authenticate,
  requireSuperAdmin,
  checkSystemAccess,
  checkSchoolAccess,
  validate(schemas.staffRegistration),
  schoolStaffController.register,
);

// Get all staff with pagination and filters - Admins and teachers can view
router.get(
  "/",
  authenticate,
  requireSuperAdmin,
  checkSystemAccess,
  checkSchoolAccess,
  validateQuery(schemas.pagination),
  schoolStaffController.getAll,
);

// Get staff by ID - Admins and teachers can view
router.get(
  "/:id",
  authenticate,
  requireSuperAdmin,
  checkSystemAccess,
  checkSchoolAccess,
  schoolStaffController.getById,
);

router.get(
  "/profile/:id",
  authenticate,
  authorize(["super_admin", "admin", "teacher"]),
  schoolStaffController.getStaffProfile,
  checkSystemAccess,
  checkSchoolAccess,
);

router.get(
  "/section/:id",
  authenticate,
  authorize(["super_admin", "admin", "teacher"]),
  checkSystemAccess,
  checkSchoolAccess,
  schoolStaffController.getAllStaffBySection,
);

router.get(
  "/assigned-subjects/:id",
  authenticate,
  checkSystemAccess,
  checkSchoolAccess,
  authorize(["super_admin", "admin", "teacher"]),

  schoolStaffController.getStaffAssigned,
);

// Update staff - Only admins can update
router.put(
  "/:id",
  authenticate,
  requireSuperAdmin,
  checkSystemAccess,
  checkSchoolAccess,
  schoolStaffController.update,
);

router.patch(
  "/:id/toggle-access",
  authenticate,
  requireSuperAdmin,
  schoolStaffController.toggleSchoolAccess,
);

router.patch(
  "/:id/toggle-status",
  authenticate,
  requireSuperAdmin,
  checkSystemAccess,
  checkSchoolAccess,
  schoolStaffController.toggleStaffStatus,
);

// Soft delete staff - Only super admin can delete
router.delete(
  "/:id",
  authenticate,
  requireSuperAdmin,
  checkSystemAccess,
  checkSchoolAccess,
  schoolStaffController.delete,
);

module.exports = router;
