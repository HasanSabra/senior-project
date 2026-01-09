const List = require("../models/List.model");

exports.createList = async (req, res) => {
  try {
    const {
      name,
      description,
      seats_number,
      election_id,
      constituency_id,
      district_id,
      village_id,
    } = req.body;

    const requiredFields = [
      "name",
      "description",
      "seats_number",
      "election_id",
    ];

    const missingFields = requiredFields.filter((field) => !req.body[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }

    const existsingList = await List.isExists(name, election_id);
    if (existsingList) {
      return res.status(400).json({
        success: false,
        message: "List with the same name already exists for this election.",
      });
    }

    const newList = await List.create(
      name,
      description,
      seats_number,
      election_id,
      constituency_id,
      district_id,
      village_id,
    );
    if (!newList) {
      return res.status(500).json({
        success: false,
        message: "Failed to create the list.",
      });
    }

    return res.status(201).json({
      success: true,
      message: "List created successfully.",
    });
  } catch (err) {
    console.error("Error creating list:", err);
    return res.status(500).json({
      success: false,
      message: "An error occurred while creating the list.",
    });
  }
};

exports.getAllLists = async (req, res) => {
  try {
    const lists = await List.getAll();

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

exports.getListsByElectionId = async (req, res) => {
  try {
    const { election_id } = req.params;
    const lists = await List.getByElectionId(election_id);

    return res.status(200).json({
      success: true,
      data: lists,
    });
  } catch (err) {
    console.error("Error fetching lists by election ID:", err);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching the lists by election ID.",
    });
  }
};

exports.updateList = async (req, res) => {
  try {
    const { list_id } = req.params;
    const {
      name,
      description,
      seats_number,
      election_id,
      constituency_id,
      district_id,
      village_id,
    } = req.body;

    const isExist = await List.isExists(null, null, list_id);
    if (!isExist) {
      return res.status(404).json({
        success: false,
        message: "List not found.",
      });
    }

    const updatedList = await List.update(
      list_id,
      name,
      description,
      seats_number,
      election_id,
      constituency_id,
      district_id,
      village_id,
    );
    if (!updatedList) {
      return res.status(404).json({
        success: false,
        message: "List not found or update failed.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "List updated successfully.",
    });
  } catch (err) {
    console.error("Error updating list:", err);
    return res.status(500).json({
      success: false,
      message: "An error occurred while updating the list.",
    });
  }
};

exports.deleteList = async (req, res) => {
  try {
    const { list_id } = req.params;

    const isExist = await List.isExists(null, null, list_id);
    if (!isExist) {
      return res.status(404).json({
        success: false,
        message: "List not found.",
      });
    }

    const deleteList = await List.delete(list_id);
    if (!deleteList) {
      return res.status(500).json({
        success: false,
        message: "Failed to delete the list.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "List deleted successfully.",
    });
  } catch (err) {
    console.error("Error deleting list:", err);
    return res.status(500).json({
      success: false,
      message: "An error occurred while deleting the list.",
    });
  }
};
