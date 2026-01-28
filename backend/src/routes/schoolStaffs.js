const express = require("express");
const {
  authenticate,
  checkSystemAccess,
  requireAdmin,
  requireSuperAdmin,
  authorize,
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
  validate(schemas.staffRegistration),
  schoolStaffController.register,
);

// Get all staff with pagination and filters - Admins and teachers can view
router.get(
  "/",
  authenticate,
  requireSuperAdmin,
  validateQuery(schemas.pagination),
  schoolStaffController.getAll,
);

// Get staff by ID - Admins and teachers can view
router.get(
  "/:id",
  authenticate,
  requireSuperAdmin,
  schoolStaffController.getById,
);

router.get(
  "/profile/:id",
  authenticate,
  requireSuperAdmin,
  schoolStaffController.getStaffProfile,
);

router.get(
  "/section/:id",
  authenticate,
  requireSuperAdmin,
  schoolStaffController.getAllStaffBySection,
);

// Update staff - Only admins can update
router.put(
  "/:id",
  authenticate,
  requireSuperAdmin,
  checkSystemAccess,
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
  schoolStaffController.toggleStaffStatus,
);

// Soft delete staff - Only super admin can delete
router.delete(
  "/:id",
  authenticate,
  requireSuperAdmin,
  checkSystemAccess,
  schoolStaffController.delete,
);

module.exports = router;
