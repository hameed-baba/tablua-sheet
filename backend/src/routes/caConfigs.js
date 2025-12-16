const express = require("express");
const router = express.Router();
const caConfigController = require("../controllers/caConfigController");
const { authenticate } = require("../middleware/auth");

router.get("/", authenticate, caConfigController.getAll);
router.get("/latest", authenticate, caConfigController.getLatestConfig);
router.get("/:id", authenticate, caConfigController.getById);
router.post("/", authenticate, caConfigController.create);
router.put("/:id", authenticate, caConfigController.update);
router.delete("/:id", authenticate, caConfigController.delete);

module.exports = router;
