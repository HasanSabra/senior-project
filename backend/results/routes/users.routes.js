// users.routes.js
const express = require("express");
const usersController = require("../controllers/users.controller"); // Make sure this path is correct
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.get(
  "/municipality/:election_id",
  authMiddleware,
  usersController.getMunicipalityResults,
);

module.exports = router;
