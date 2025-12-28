const List = require("../models/List.model");

exports.getAllLists = async (req, res) => {
  try {
    const { election_id } = req.params;
    const lists = await List.getAll(election_id);
    if (!lists) {
      return res.status(404).json({
        success: false,
        message: "No lists found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: lists,
    });
  } catch (err) {
    console.error("Error fetching lists:", err);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching the lists.",
    });
  }
};
