const express = require("express");
const { authenticate, checkSchoolAccess, checkSystemAccess } = require("../middleware/auth");
const { validate, schemas } = require("../middleware/validation");
const { gradeSystemController } = require("../controllers");

const router = express.Router();

router.get(
  "/",
  authenticate,
  authorize(["super_admin", "admin", "teacher", "student", "parent"]),
  gradeSystemController.geAll,
  checkSchoolAccess,
  checkSystemAccess,
);

router.post(
  "/",
  authenticate,
  authorize(["super_admin", "admin"]),
  validate(schemas.gradeSystemCreation),
  gradeSystemController.create,
  checkSchoolAccess,
  checkSystemAccess,
);

router.put(
  "/:id",
  authenticate,
  authorize(["super_admin", "admin"]),
  gradeSystemController.update,
  checkSchoolAccess,
  checkSystemAccess,
);

router.delete(
  "/:id",
  authenticate,
  authorize(["super_admin", "admin"]),
  gradeSystemController.delete,
  checkSchoolAccess,
  checkSystemAccess,
);

module.exports = router;
