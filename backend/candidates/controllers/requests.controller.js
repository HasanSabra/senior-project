const Candidate = require("../models/Candidate.models");

exports.cancelRequest = async (req, res) => {
  try {
    const userId = req.user.id;
    const { election_id } = req.params;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const existingRequest = await Candidate.findExistingRequest(
      userId,
      election_id,
    );

    if (!existingRequest) {
      return res.status(409).json({
        success: false,
        message: "There is no request found.",
      });
    }

    const cancelReqeuest = await Candidate.cancelReq(existingRequest.id);
    if (!cancelReqeuest) {
      return res.status(400).json({
        success: false,
        message: "Failed to cancel request",
      });
    }

    return res.status(201).json({
      success: true,
      message: "Request canceled successfully",
    });
  } catch (err) {
    console.error("Error cancelling request:", err);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.sendRequest = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const requiredFields = [
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
      userId,
      req.body.election_id,
    );

    if (existingRequest) {
      return res.status(409).json({
        success: false,
        message: "You have already submitted a request for this election",
      });
    }

    const newRequest = await Candidate.sendReq(
      req.body.experience.trim(),
      req.body.qual_edu.trim(),
      req.body.personal_statement.trim(),
      req.body.manifesto.trim(),
      parseInt(req.body.election_id),
      parseInt(req.body.list_id),
      userId,
    );

    if (!newRequest) {
      return res.status(400).json({
        success: false,
        message: "Failed to send request",
      });
    }

    return res.status(201).json({
      success: true,
      message: "Request sent successfully",
      data: newRequest,
      requestId: newRequest.id,
    });
  } catch (err) {
    console.error("Error sending request:", err);

    let errorMessage = "Internal server error";
    let statusCode = 500;

    if (err.name === "SequelizeValidationError") {
      errorMessage = "Validation failed";
      statusCode = 400;
    } else if (err.name === "SequelizeForeignKeyConstraintError") {
      errorMessage = "Invalid election or list reference";
      statusCode = 400;
    }

    return res.status(statusCode).json({
      success: false,
      message: errorMessage,
      ...(process.env.NODE_ENV === "development" && {
        debug: err.message,
      }),
    });
  }
};
