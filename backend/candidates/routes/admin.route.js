const express = require("express");

const admin = require("../controllers/admin.controller");

const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

const router = express.Router();
router.post("/", authMiddleware, roleMiddleware("admin"), admin.addCandidate);
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  admin.deleteCandidate,
);
router.get(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  admin.getAllCandidates,
);
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  admin.updateCandidate,
);
router.post(
  "/approve/:id",
  authMiddleware,
  roleMiddleware("admin"),
  admin.approveRequest,
);
router.post(
  "/deny/:id",
  authMiddleware,
  roleMiddleware("admin"),
  admin.denieRequest,
);

module.exports = router;
