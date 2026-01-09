const express = require("express");

const adminController = require("../controllers/admin.controller");

const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

const router = express.Router();

router.post(
  "/calculate/municipality",
  authMiddleware,
  roleMiddleware("admin"),
  adminController.calculateMunicipalityResults,
);
router.post(
  "/calculate/mayoral",
  authMiddleware,
  roleMiddleware("admin"),
  adminController.calculateMayoralResults,
);
router.post(
  "/calculate/parliamentary",
  authMiddleware,
  roleMiddleware("admin"),
  adminController.calculateParliamentaryResults,
);
router.post(
  "/calculate/speaker",
  authMiddleware,
  roleMiddleware("admin"),
  adminController.calcuateSpeakerResults,
);

module.exports = router;
