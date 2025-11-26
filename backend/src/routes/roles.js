const express = require("express");
const {
  authenticate,
  authorize,
  authorizeAny,
} = require("../middleware/auth");
const { validate, schemas } = require("../middleware/validation");
const { roleController } = require("../controllers");

const router = express.Router();

// Option 1: With specific permissions (recommended for production)
router.get("/", authenticate, authorize('role.read'), roleController.getAllRoles);
router.get("/:id", authenticate, authorize('role.read'), roleController.getRoleById);

router.post(
  "/",
  authenticate,
  authorize('role.create'),
  validate(schemas.roleCreation),
  roleController.createRole
);

router.put("/:id", authenticate, authorize('role.update'), roleController.updateRole);
router.delete("/:id", authenticate, authorize('role.delete'), roleController.deleteRole);


module.exports = router;
