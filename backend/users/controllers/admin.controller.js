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
    const {
      pin,
      first_name,
      last_name,
      birthdate,
      family_record,
      is_alive,
      is_admin,
      email,
      password,
      governorate_id,
      district_id,
      village_id,
      gender_id,
      marital_status,
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
      "family_record",
      "governorate_id",
      "district_id",
      "village_id",
      "gender_id",
      "marital_status",
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

    const isUserExists = await User.isExists(user_id);
    if (!isUserExists) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const hashedPassword = await argon.hash(password);

    const updateUser = await User.update(
      pin,
      first_name,
      last_name,
      birthdate,
      family_record,
      is_alive,
      is_admin,
      email,
      hashedPassword,
      governorate_id,
      district_id,
      village_id,
      gender_id,
      marital_status,
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

    const isUserExists = await User.isExists(user_id);
    if (!isUserExists) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const deleteUser = await User.delete(user_id);
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
    return res.status(500).json({
      success: false,
      message: "An error occurred while deleting the citizen.",
    });
  }
};
