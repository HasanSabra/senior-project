require("dotenv").config();
const jwt = require("jsonwebtoken");
const User = require("../models/User.model");

exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Verification token is required.",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { pin } = decoded;

    const user = await User.findByPIN(pin);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid verification token.",
      });
    }

    const isAuthenticated = await User.verifyAuth(user.id);
    if (isAuthenticated) {
      return res.status(400).json({
        success: false,
        message: "Email already verified. Please log in.",
        redirectTo: "/login",
      });
    }

    const authenticate = await User.authenticate(user.id);
    if (!authenticate) {
      return res.status(500).json({
        success: false,
        message: "Failed to verify email.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Email verified successfully. You can now log in.",
      redirectTo: "/login",
    });
  } catch (err) {
    console.error("Error during email verification:", err.message);

    if (err.name === "TokenExpiredError") {
      return res.status(400).json({
        success: false,
        message: "Verification token has expired. Please request a new one.",
      });
    }

    if (err.name === "JsonWebTokenError") {
      return res.status(400).json({
        success: false,
        message: "Invalid verification token.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "An error occurred during email verification.",
    });
  }
};
