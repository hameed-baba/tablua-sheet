const express = require("express");
const { authenticate } = require("../middleware/auth");
const { validate, schemas } = require("../middleware/validation");
const { gradeSystemController } = require("../controllers");

const router = express.Router();

router.get(
  "/",
  authenticate,
  authorize(["super_admin", "admin","teacher","student","parent"]),
  gradeSystemController.getAll
);

router.post(
  "/",
  authenticate,
  authorize(["super_admin", "admin"]),
  validate(schemas.gradeSystemCreation),
  gradeSystemController.create
);

router.put(
  "/:id",
  authenticate,
  authorize(["super_admin", "admin"]),
  gradeSystemController.update
);

router.delete(
  "/:id",
  authenticate,
  authorize(["super_admin", "admin"]),
  gradeSystemController.delete
);

module.exports = router;
