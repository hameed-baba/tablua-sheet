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
  authorize("parent.read"),
  validateQuery(schemas.pagination),
  parentController.getAll
);

router.get(
  "/:id",
  authenticate,
  authorize("parent.read"),
  parentController.getById
);

router.post(
  "/",
  authenticate,
  authorize("parent.create"),
  validate(schemas.parentRegistration),
  parentController.createParent
);

router.put(
  "/:id",
  authenticate,
  authorize("parent.update"),
  parentController.updateParent
);

router.delete(
  "/:id",
  authenticate,
  authorize("parent.delete"),
  parentController.delete
);

module.exports = router;
