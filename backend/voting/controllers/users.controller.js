const Election = require("../models/Election.model");
const Candidate = require("../models/Candidate.model");
const User = require("../models/User.model");

exports.getData = async (req, res) => {
  try {
    const { election_id } = req.params;

    const electionData = await Election.getData(election_id);

    return res.status(200).json({ success: true, data: electionData });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

exports.hasVoted = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { election_id } = req.params;

    const hasVoted = await User.hasVoted(user_id, election_id);
    if (hasVoted) {
      return res
        .status(200)
        .json({ hasVoted: true, message: "User has already voted" });
    }

    return res
      .status(200)
      .json({ hasVoted: false, message: "User has not voted yet" });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ error: false, message: "Internal server error" });
  }
};

exports.mayoralCastVote = async (req, res) => {
  try {
    const user_id = req.user.id;
    const user_birthdate = req.user.birthdate;
    const { election_id } = req.params;
    const { candidates } = req.body;

    const birthDate = new Date(user_birthdate);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (
      age < 18 ||
      (age === 18 && monthDifference < 0) ||
      (age === 18 &&
        monthDifference === 0 &&
        today.getDate() < birthDate.getDate())
    ) {
      return res
        .status(400)
        .json({ success: false, message: "User is not old enough to vote" });
    }

    const isElectionExists = await Election.isExists(election_id);
    if (!isElectionExists) {
      return res
        .status(404)
        .json({ success: false, message: "Election not found" });
    }

    for (const candidate of candidates) {
      console.log("Checking candidate:", candidate);
      const isCandidateExists = await Candidate.isExists(
        candidate,
        election_id,
      );
      console.log("Candidate exists:", isCandidateExists);
      if (!isCandidateExists) {
        return res.status(400).json({
          success: false,
          message: `Invalid candidate: ${candidate}`,
        });
      }
    }

    for (const candidate of candidates) {
      const vote = await User.castVote(election_id, candidate);
      if (!vote) {
        return res.status(500).json({
          success: false,
          message: `Failed to cast vote for candidate: ${candidate}`,
        });
      }
    }

    const setVoted = await User.setVoted(user_id, election_id);
    if (!setVoted) {
      return res
        .status(500)
        .json({ success: false, message: "Failed to update voting status" });
    }

    return res
      .status(200)
      .json({ success: true, message: "Vote cast successfully" });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

exports.municipalityCastVote = async (req, res) => {
  try {
    const user_id = req.user.id;
    const user_birthdate = req.user.birthdate;
    const { election_id } = req.params;
    const { candidates } = req.body;

    const birthDate = new Date(user_birthdate);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (
      age < 18 ||
      (age === 18 && monthDifference < 0) ||
      (age === 18 &&
        monthDifference === 0 &&
        today.getDate() < birthDate.getDate())
    ) {
      return res
        .status(400)
        .json({ success: false, message: "User is not old enough to vote" });
    }

    const isElectionExists = await Election.isExists(election_id);
    if (!isElectionExists) {
      return res
        .status(404)
        .json({ success: false, message: "Election not found" });
    }

    for (const candidate of candidates) {
      const isCandidateExists = await Candidate.isExists(
        candidate,
        election_id,
      );
      if (!isCandidateExists) {
        return res.status(400).json({
          success: false,
          message: `Invalid candidate: ${candidate}`,
        });
      }
    }

    for (const candidate of candidates) {
      const vote = await User.castVote(election_id, candidate);
      if (!vote) {
        return res.status(500).json({
          success: false,
          message: `Failed to cast vote for candidate: ${candidate}`,
        });
      }
    }

    const setVoted = await User.setVoted(user_id, election_id);
    if (!setVoted) {
      return res
        .status(500)
        .json({ success: false, message: "Failed to update voting status" });
    }

    return res
      .status(200)
      .json({ success: true, message: "Vote cast successfully" });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

exports.parliamentaryCastVote = async (req, res) => {
  try {
    const user_id = req.user.id;
    const user_birthdate = req.user.birthdate;
    const { election_id } = req.params;
    const { candidate, list_id } = req.body;

    const birthDate = new Date(user_birthdate);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (
      age < 18 ||
      (age === 18 && monthDifference < 0) ||
      (age === 18 &&
        monthDifference === 0 &&
        today.getDate() < birthDate.getDate())
    ) {
      return res
        .status(400)
        .json({ success: false, message: "User is not old enough to vote" });
    }

    const isElectionExists = await Election.isExists(election_id);
    if (!isElectionExists) {
      return res
        .status(404)
        .json({ success: false, message: "Election not found" });
    }

    const isCandidateExists = await Candidate.isExists(candidate, election_id);
    if (!isCandidateExists) {
      return res.status(400).json({
        success: false,
        message: `Invalid candidate: ${candidate}`,
      });
    }

    const isListExists = await Candidate.isListExists(
      candidate,
      list_id,
      election_id,
    );
    if (!isListExists) {
      return res.status(400).json({
        success: false,
        message: `Invalid list: ${list_id} for candidate: ${candidate} in election: ${election_id}`,
      });
    }

    const vote = await User.castVote(election_id, candidate, list_id);
    if (!vote) {
      return res.status(500).json({
        success: false,
        message: `Failed to cast vote for candidate: ${candidate}`,
      });
    }

    const setVoted = await User.setVoted(user_id, election_id);
    if (!setVoted) {
      return res
        .status(500)
        .json({ success: false, message: "Failed to update voting status" });
    }

    return res
      .status(200)
      .json({ success: true, message: "Vote cast successfully" });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

exports.speakerCastVote = async (req, res) => {
  try {
    const user_id = req.user.id;
    const user_birthdate = req.user.birthdate;
    const { election_id } = req.params;
    const { candidate } = req.body;

    const birthDate = new Date(user_birthdate);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (
      age < 18 ||
      (age === 18 && monthDifference < 0) ||
      (age === 18 &&
        monthDifference === 0 &&
        today.getDate() < birthDate.getDate())
    ) {
      return res
        .status(400)
        .json({ success: false, message: "User is not old enough to vote" });
    }

    const isElectionExists = await Election.isExists(election_id);
    if (!isElectionExists) {
      return res
        .status(404)
        .json({ success: false, message: "Election not found" });
    }

    const isCandidateExists = await Candidate.isExists(candidate, election_id);
    if (!isCandidateExists) {
      return res.status(400).json({
        success: false,
        message: `Invalid candidate: ${candidate}`,
      });
    }

    const castVote = await User.castVote(election_id, candidate);
    if (!castVote) {
      return res.status(500).json({
        success: false,
        message: `Failed to cast vote for candidate: ${candidate}`,
      });
    }

    const setVoted = await User.setVoted(user_id, election_id);
    if (!setVoted) {
      return res
        .status(500)
        .json({ success: false, message: "Failed to update voting status" });
    }

    return res
      .status(200)
      .json({ success: true, message: "Vote cast successfully" });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
