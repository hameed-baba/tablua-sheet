const express = require("express");
const { authenticate, authorize, authorizeAny } = require("../middleware/auth");
const { validate, schemas } = require("../middleware/validation");
const { roleController } = require("../controllers");

const router = express.Router();

// Role routes without permission checks
router.get("/", authenticate, roleController.getAllRoles);
router.get("/:id", authenticate, roleController.getRoleById);

router.post(
  "/",
  authenticate,
  validate(schemas.roleCreation),
  roleController.createRole,
);

router.put(
  "/:id",
  authenticate,
  roleController.updateRole,
);
router.delete(
  "/:id",
  authenticate,
  roleController.deleteRole,
);

module.exports = router;
