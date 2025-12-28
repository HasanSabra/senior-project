const Candidate = require("../models/Candidate.models");

exports.addCandidate = async (req, res) => {
  try {
    const {
      user_id,
      experience,
      qual_edu,
      personal_statement,
      manifesto,
      election_id,
      list_id,
    } = req.body;

    const requiredFields = [
      "user_id",
      "experience",
      "qual_edu",
      "personal_statement",
      "manifesto",
      "election_id",
    ];

    const missingFields = requiredFields.filter((field) => !req.body[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }

    const existingRequest = await Candidate.findExistingRequest(
      user_id,
      req.body.election_id,
    );

    if (existingRequest) {
      return res.status(409).json({
        success: false,
        message: "You have already submitted a request for this election",
      });
    }

    const newCandidate = await Candidate.addCandidate(
      experience.trim(),
      qual_edu.trim(),
      personal_statement.trim(),
      manifesto.trim(),
      parseInt(election_id),
      parseInt(list_id),
      user_id,
    );

    if (!newCandidate) {
      return res.status(400).json({
        success: false,
        message: "Failed to add candidate",
      });
    }

    return res.status(201).json({
      success: true,
      message: "Candidate added successfully",
      data: newCandidate,
    });
  } catch (err) {
    console.error("Error adding candidate:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.deleteCandidate = async (req, res) => {
  try {
    const candidateId = parseInt(req.params.id);

    if (isNaN(candidateId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid candidate ID",
      });
    }

    const deleted = await Candidate.deleteCandidate(candidateId);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Candidate not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Candidate deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting candidate:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.getAllCandidates = async (req, res) => {
  try {
    const candidates = await Candidate.getAllCandidates();

    return res.status(200).json({
      success: true,
      message: "Candidates retrieved successfully",
      data: candidates,
    });
  } catch (err) {
    console.error("Error retrieving candidates:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.updateCandidate = async (req, res) => {
  try {
    const candidateId = parseInt(req.params.id);
    const {
      experience,
      qual_edu,
      personal_statement,
      manifesto,
      election_id,
      list_id,
    } = req.body;

    if (isNaN(candidateId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid candidate ID",
      });
    }

    const updatedCandidate = await Candidate.updateCandidate(
      candidateId,
      experience,
      qual_edu,
      personal_statement,
      manifesto,
      election_id,
      list_id,
    );

    if (!updatedCandidate) {
      return res.status(404).json({
        success: false,
        message: "Candidate not found or update failed",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Candidate updated successfully",
      data: updatedCandidate,
    });
  } catch (err) {
    console.error("Error updating candidate:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.approveRequest = async (req, res) => {
  try {
    const candidateId = parseInt(req.params.id);

    if (isNaN(candidateId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid request ID",
      });
    }

    const approvedRequest = await Candidate.approveRequest(candidateId);

    if (!approvedRequest) {
      return res.status(404).json({
        success: false,
        message: "Request not found or approval failed",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Request approved successfully",
      data: approvedRequest,
    });
  } catch (err) {
    console.error("Error approving request:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.denieRequest = async (req, res) => {
  try {
    const candidateId = parseInt(req.params.id);

    if (isNaN(candidateId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid request ID",
      });
    }

    const deniedRequest = await Candidate.denieRequest(candidateId);

    if (!deniedRequest) {
      return res.status(404).json({
        success: false,
        message: "Request not found or denial failed",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Request denied successfully",
      data: deniedRequest,
    });
  } catch (err) {
    console.error("Error denying request:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
