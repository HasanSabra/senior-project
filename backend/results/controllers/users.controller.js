const Result = require("../models/result.model");

exports.getMunicipalityResults = async (req, res) => {
  try {
    // req.user should be set by authMiddleware after token verification
    const user_id = req.user.id;
    const { election_id } = req.params;

    const result = await Result.getMunicipalityResults(user_id, election_id);

    if (!result.success) {
      return res.status(404).json({
        success: false,
        message: result.message,
      });
    }

    return res.status(200).json({
      success: true,
      data: result.data,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to get results.",
    });
  }
};
