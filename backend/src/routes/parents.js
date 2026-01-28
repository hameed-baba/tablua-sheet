const express = require("express");
const { authenticate, authorize } = require("../middleware/auth");
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
  parentController.getAll
);

router.get(
  "/:id",
  authenticate,
  authorize(["super_admin", "admin"]),
  parentController.getById
);

router.post(
  "/",
  authenticate,
  authorize(["super_admin", "admin"]),
  validate(schemas.parentRegistration),
  parentController.createParent
);

router.put(
  "/:id",
  authenticate,
  authorize(["super_admin", "admin"]),
  parentController.updateParent
);

router.delete(
  "/:id",
  authenticate,
  authorize(["super_admin", "admin"]),
  parentController.delete
);

module.exports = router;
