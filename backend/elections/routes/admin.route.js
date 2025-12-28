const express = require("express");

const admin = require("../controllers/admin.controller");

const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

const router = express.Router();
router.post("/", authMiddleware, roleMiddleware("admin"), admin.createElection);
router.get("/", authMiddleware, roleMiddleware("admin"), admin.getAllElections);
router.put(
  "/:electionId",
  authMiddleware,
  roleMiddleware("admin"),
  admin.updateElection,
);
router.delete(
  "/:electionId",
  authMiddleware,
  roleMiddleware("admin"),
  admin.deleteElection,
);
router.put(
  "/activate/:electionId",
  authMiddleware,
  roleMiddleware("admin"),
  admin.activateElection,
);
router.put(
  "/deactivate/:electionId",
  authMiddleware,
  roleMiddleware("admin"),
  admin.deactivateElection,
);

module.exports = router;
