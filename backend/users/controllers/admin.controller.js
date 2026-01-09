const argon = require("argon2");

const User = require("../models/User.model");

exports.create = async (req, res) => {
  try {
    const {
      pin,
      first_name,
      last_name,
      birthdate,
      family_record_number,
      is_alive,
      is_admin,
      email,
      password,
      governorate_id,
      district_id,
      village_id,
      gender_id,
      marital_status_id,
      religion_id,
      denomination_id,
      father_id,
      mother_id,
    } = req.body;

    const requiredFields = [
      "pin",
      "first_name",
      "last_name",
      "birthdate",
      "family_record_number",
      "governorate_id",
      "district_id",
      "village_id",
      "gender_id",
      "marital_status_id",
      "religion_id",
      "denomination_id",
    ];

    const missingFields = requiredFields.filter((field) => !req.body[field]);
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }

    const hashedPassword = await argon.hash(password);

    const newUser = await User.create(
      pin,
      first_name,
      last_name,
      birthdate,
      family_record_number,
      is_alive,
      is_admin,
      email,
      hashedPassword,
      governorate_id,
      district_id,
      village_id,
      gender_id,
      marital_status_id,
      religion_id,
      denomination_id,
      father_id,
      mother_id,
    );

    if (!newUser) {
      return res.status(500).json({
        success: false,
        message: "Failed to add citizen.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Citizen added successfully.",
    });
  } catch (err) {
    console.error("Error adding citizen:", err);
    return res.status(500).json({
      success: false,
      message: "An error occurred while adding the citizen.",
    });
  }
};

exports.get = async (req, res) => {
  try {
    const users = await User.getAll();

    return res.status(200).json({
      success: true,
      data: users,
    });
  } catch (err) {
    console.error("Error fetching citizens:", err);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching the citizen.",
    });
  }
};

exports.update = async (req, res) => {
  try {
    const user_id = req.params.user_id;

    // Debug logging
    console.log("Update request body:", req.body);
    console.log("User ID:", user_id);

    const {
      pin,
      first_name,
      last_name,
      birthdate,
      family_record_number,
      is_alive,
      is_admin,
      email,
      password,
      governorate_id,
      district_id,
      village_id,
      gender_id,
      marital_status_id,
      religion_id,
      denomination_id,
      father_id,
      mother_id,
    } = req.body;

    const requiredFields = [
      "pin",
      "first_name",
      "last_name",
      "birthdate",
      "family_record_number",
      "governorate_id",
      "district_id",
      "village_id",
      "gender_id",
      "marital_status_id",
      "religion_id",
      "denomination_id",
    ];

    // Debug field checking with proper validation
    const missingFields = requiredFields.filter((field) => {
      const value = req.body[field];
      // Check for null, undefined, empty string, but allow 0 and false
      const isMissing = value === null || value === undefined || value === "";
      if (isMissing) {
        console.log(`Missing field: ${field}, value:`, value);
      }
      return isMissing;
    });

    if (missingFields.length > 0) {
      console.log("Validation failed - missing fields:", missingFields);
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }

    const isUserExists = await User.isExists(user_id);
    if (!isUserExists) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    let hashedPassword = null;
    if (password && password.trim() !== "") {
      hashedPassword = await argon.hash(password);
    }

    const updateUser = await User.update(
      pin,
      first_name,
      last_name,
      birthdate,
      family_record_number,
      is_alive,
      is_admin,
      email,
      hashedPassword,
      governorate_id,
      district_id,
      village_id,
      gender_id,
      marital_status_id,
      religion_id,
      denomination_id,
      father_id,
      mother_id,
      user_id,
    );

    if (!updateUser) {
      return res.status(500).json({
        success: false,
        message: "Failed to add citizen.",
      });
    }

    return res.status(201).json({
      success: true,
      message: "Citizen updated successfully.",
    });
  } catch (err) {
    console.error("Error updating citizen:", err);
    return res.status(500).json({
      success: false,
      message: "An error occurred while updating the citizen.",
    });
  }
};

exports.delete = async (req, res) => {
  try {
    const user_id = req.params.user_id;

    // Debug logging
    console.log("Delete request for user ID:", user_id);

    const isUserExists = await User.isExists(user_id);
    if (!isUserExists) {
      console.log("User not found:", user_id);
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Check if user is referenced as parent by other users
    const hasChildrenAsParent = await User.hasChildrenAsParent(user_id);
    if (hasChildrenAsParent) {
      console.log("User has children references, cannot delete:", user_id);
      return res.status(400).json({
        success: false,
        message:
          "Cannot delete user as they are referenced as a parent by other users.",
      });
    }

    console.log("User exists, attempting to delete:", user_id);
    const deleteUser = await User.delete(user_id);
    console.log("Delete result:", deleteUser);

    if (!deleteUser) {
      return res.status(500).json({
        success: false,
        message: "Failed to delete user.",
      });
    }

    return res.status(201).json({
      success: true,
      message: "Citizen deleted successfully.",
    });
  } catch (err) {
    console.error("Error deleting citizen:", err);
    console.error("Error details:", err.message);
    console.error("Error code:", err.code);
    return res.status(500).json({
      success: false,
      message: "An error occurred while deleting the citizen.",
    });
  }
};
