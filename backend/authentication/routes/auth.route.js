const express = require("express");

const signup = require("../controllers/signup.controller");
const login = require("../controllers/login.controller");
const logout = require("../controllers/logout.controller");
const emailVerification = require("../controllers/verify-email.controller");

const router = express.Router();
router.post("/signup", signup.register);
router.post("/login", login.login);
router.post("/logout", logout.logout);
router.post("/verify-email", emailVerification.verifyEmail);

module.exports = router;
