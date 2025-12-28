const Election = require("../models/Election.model");

exports.getElections = async (req, res) => {
  try {
    const elections = await Election.getAll();

    return res.status(200).json({
      success: true,
      data: elections,
    });
  } catch (err) {
    console.error("Error fetching elections:", err);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching elections.",
    });
  }
};
