const Election = require("../models/Election.model");

exports.createElection = async (req, res) => {
  try {
    const {
      name,
      start_date,
      end_date,
      election_type_id,
      governorate_id,
      district_id,
      village_id,
      is_active,
    } = req.body;

    console.log(req.body);

    const requiredFields = [
      "name",
      "start_date",
      "end_date",
      "election_type_id",
    ];

    const missingFields = requiredFields.filter((field) => !req.body[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }

    const existingElection = await Election.isExists(name, start_date, null);
    if (existingElection) {
      return res.status(400).json({
        success: false,
        message: "Election with the same name already exists.",
      });
    }

    const newElection = await Election.create(
      name,
      start_date,
      end_date,
      election_type_id,
      governorate_id,
      district_id,
      village_id,
      is_active,
    );
    if (!newElection) {
      return res.status(500).json({
        success: false,
        message: "Failed to create the election.",
      });
    }

    return res.status(201).json({
      success: true,
      message: "Election created successfully.",
    });
  } catch (err) {
    console.error("Error creating election:", err);
    return res.status(500).json({
      success: false,
      message: "An error occurred while creating the election.",
    });
  }
};

exports.getAllElections = async (req, res) => {
  try {
    const elections = await Election.getAll();
    if (!elections) {
      return res.status(404).json({
        success: false,
        message: "No elections found.",
      });
    }

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

exports.updateElection = async (req, res) => {
  try {
    const { electionId } = req.params;
    const {
      name,
      start_date,
      end_date,
      election_type_id,
      governorate_id,
      district_id,
      village_id,
      is_active,
    } = req.body;

    const isExists = await Election.isExists(null, null, electionId);
    if (!isExists) {
      return res.status(404).json({
        success: false,
        message: "Election not found.",
      });
    }

    const updatedElection = await Election.update(
      electionId,
      name,
      start_date,
      end_date,
      election_type_id,
      governorate_id,
      district_id,
      village_id,
      is_active,
    );
    if (!updatedElection) {
      return res.status(500).json({
        success: false,
        message: "Failed to update the election.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Election updated successfully.",
    });
  } catch (err) {
    console.error("Error updating election:", err);
    return res.status(500).json({
      success: false,
      message: "An error occurred while updating the election.",
    });
  }
};

exports.deleteElection = async (req, res) => {
  try {
    const { electionId } = req.params;

    const isExists = await Election.isExists(null, null, electionId);
    if (!isExists) {
      return res.status(404).json({
        success: false,
        message: "Election not found.",
      });
    }

    const deleted = await Election.delete(electionId);
    if (!deleted) {
      return res.status(500).json({
        success: false,
        message: "Failed to delete the election.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Election deleted successfully.",
    });
  } catch (err) {
    console.error("Error deleting election:", err);
    return res.status(500).json({
      success: false,
      message: "An error occurred while deleting the election.",
    });
  }
};

exports.activateElection = async (req, res) => {
  try {
    const { electionId } = req.params;

    const isExists = await Election.isExists(null, null, electionId);
    if (!isExists) {
      return res.status(404).json({
        success: false,
        message: "Election not found.",
      });
    }

    const activated = await Election.activate(electionId);
    if (!activated) {
      return res.status(500).json({
        success: false,
        message: "Failed to activate the election.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Election activated successfully.",
    });
  } catch (err) {
    console.error("Error activating election:", err);
    return res.status(500).json({
      success: false,
      message: "An error occurred while activating the election.",
    });
  }
};

exports.deactivateElection = async (req, res) => {
  try {
    const { electionId } = req.params;

    const isExists = await Election.isExists(null, null, electionId);
    if (!isExists) {
      return res.status(404).json({
        success: false,
        message: "Election not found.",
      });
    }

    const deactivated = await Election.deactivate(electionId);
    if (!deactivated) {
      return res.status(500).json({
        success: false,
        message: "Failed to deactivate the election.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Election deactivated successfully.",
    });
  } catch (err) {
    console.error("Error deactivating election:", err);
    return res.status(500).json({
      success: false,
      message: "An error occurred while deactivating the election.",
    });
  }
};
