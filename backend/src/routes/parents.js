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
const { parentController } = require("../controllers");

const router = express.Router();

router.get(
  "/",
  authenticate,
  authorize(["super_admin", "admin"]),
  validateQuery(schemas.pagination),
  parentController.getAll,
  checkSchoolAccess,
  checkSystemAccess,
);

router.get(
  "/:id",
  authenticate,
  authorize(["super_admin", "admin"]),
  parentController.getById,
  checkSchoolAccess,
  checkSystemAccess,
);

router.post(
  "/",
  authenticate,
  authorize(["super_admin", "admin"]),
  validate(schemas.parentRegistration),
  parentController.createParent,
  checkSchoolAccess,
  checkSystemAccess,
);

router.put(
  "/:id",
  authenticate,
  authorize(["super_admin", "admin"]),
  parentController.updateParent,
  checkSchoolAccess,
  checkSystemAccess,
);

router.delete(
  "/:id",
  authenticate,
  authorize(["super_admin", "admin"]),
  parentController.delete,
  checkSchoolAccess,
  checkSystemAccess,
);

module.exports = router;
