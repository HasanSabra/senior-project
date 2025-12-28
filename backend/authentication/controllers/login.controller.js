const jwt = require("jsonwebtoken");
const argon2 = require("argon2");

const User = require("../models/User.model");

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password are required." });
    }

    const user = await User.findByEmail(email);
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password." });
    }

    const isAuthenticated = await User.verifyAuth(user.id);
    if (!isAuthenticated) {
      return res.status(400).json({
        success: false,
        message: "Please verify your email before logging in.",
      });
    }

    const validPassword = await argon2.verify(user.password, password);
    if (!validPassword) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password." });
    }

    const role = await User.getRole(user.id);
    const token = jwt.sign(
      {
        id: user.id,
        pin: user.pin,
        email: user.email,
        birthdate: user.birthdate,
        is_alive: user.is_alive,
        role: role,
        village_id: user.village_id,
        district_id: user.district_id,
        denomination_id: user.denomination_id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" },
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    const userData = {
      id: user.id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      role: role,
      village_id: user.village_id,
      district_id: user.district_id,
      governorate: user.governorate_id,
      denomination: user.denomination_id,
    };

    res.cookie("user", JSON.stringify(userData));

    return res.status(200).json({
      success: true,
      token: token,
      message: "Login successful.",
    });
  } catch (err) {
    console.error("Error during login:", err.message);
    return res.status(500).json({
      success: false,
      message: "An error occurred during login.",
    });
  }
};
