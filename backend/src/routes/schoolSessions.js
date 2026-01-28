const express = require("express");
const {
  authenticate,

  authorize,
} = require("../middleware/auth");
const { schoolSessionController } = require("../controllers");

const router = express.Router();

router.get(
  "/",
  authenticate,
  authorize(["super_admin", "admin"]),
  schoolSessionController.getAll
);

router.get(
  "/row",
  authenticate,
  authorize(["super_admin", "admin"]),
  schoolSessionController.getAllSession
);

// Get active session
router.get(
  "/active",
  authenticate,
  authorize(["super_admin", "admin"]),
  schoolSessionController.getActiveSession
);

router.get(
  "/:id",
  authenticate,
  authorize(["super_admin", "admin"]),
  schoolSessionController.getById
);

router.post(
  "/",
  authenticate,
  authorize(["super_admin", "admin"]),
  schoolSessionController.createSession
);

router.put(
  "/:id",
  authenticate,
  authorize(["super_admin", "admin"]),
  schoolSessionController.update
);

router.put(
  "/:id/activate",
  authenticate,
  authorize(["super_admin", "admin"]),
  schoolSessionController.activateSession
);

router.delete(
  "/:id",
  authenticate,
  authorize(["super_admin", "admin"]),
  schoolSessionController.delete
);

module.exports = router;
