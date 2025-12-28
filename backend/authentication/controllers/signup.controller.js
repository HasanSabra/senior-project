require("dotenv").config();
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");

const User = require("../models/User.model");
const sendVerificationEmail = require("../utils/sendMail");

exports.register = async (req, res) => {
  try {
    const { pin, email, password, confirmPassword } = req.body;

    if (!pin || !email || !password || !confirmPassword) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required." });
    }

    if (password !== confirmPassword) {
      return res
        .status(400)
        .json({ success: false, message: "Passwords do not match." });
    }

    const user = await User.findByPIN(pin);
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid PIN." });
    }

    if (user.email) {
      return res
        .status(400)
        .json({ success: false, message: "User already registered." });
    }

    const isAuthenticated = await User.verifyAuth(user.id);
    if (isAuthenticated) {
      return res.status(400).json({
        success: false,
        message: "Email already verified. Please log in.",
        redirectTo: "/login",
      });
    }

    const hashedPassword = await argon2.hash(password);
    await User.completeRegistration(user.id, email, hashedPassword);

    const token = jwt.sign({ pin }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    try {
      await sendVerificationEmail(email, token);

      return res.status(200).json({
        success: true,
        token: token,
        message:
          "Registration successful. Please check your email to verify your account.",
      });
    } catch (emailError) {
      console.error("Error sending verification email:", emailError);
      return res.status(200).json({
        success: true,
        message:
          "Registration successful. However, we encountered an issue sending the verification email. Please contact support.",
      });
    }
  } catch (err) {
    console.error("Error during registration:", err.message);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};
