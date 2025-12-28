const db = require("../config/db");
const dbPromise = db.promise();

const Candidate = {
  findExistingRequest: async (user_id, election_id) => {
    const [rows] = await dbPromise.query(
      "SELECT * FROM candidates WHERE user_id = ? AND election_id = ?;",
      [user_id, election_id],
    );
    return rows[0];
  },
  sendReq: async (
    experience,
    qual_edu,
    personal_statement,
    manifesto,
    election_id,
    list_id,
    user_id,
  ) => {
    const [result] = await dbPromise.query(
      "INSERT INTO candidates (experience, qual_edu, personal_statement, manifesto, election_id, list_id, user_id, is_request) VALUES (?, ?, ?, ?, ?, ?, ?, 1);",
      [
        experience,
        qual_edu,
        personal_statement,
        manifesto,
        election_id,
        list_id,
        user_id,
      ],
    );

    return result.affectedRows;
  },
  cancelReq: async (candidate_id) => {
    const [result] = await dbPromise.query(
      "DELETE FROM candidates WHERE id = ?;",
      [candidate_id],
    );

    return result.affectedRows;
  },
  addCandidate: async (
    experience,
    qual_edu,
    personal_statement,
    manifesto,
    election_id,
    list_id,
    user_id,
  ) => {
    const [result] = await dbPromise.query(
      "INSERT INTO candidates (experience, qual_edu, personal_statement, manifesto, election_id, list_id, user_id, is_request, is_approved) VALUES (?, ?, ?, ?, ?, ?, ?, 1, 1);",
      [
        experience,
        qual_edu,
        personal_statement,
        manifesto,
        election_id,
        list_id,
        user_id,
      ],
    );

    return result.affectedRows;
  },
  deleteCandidate: async (candidate_id) => {
    const [result] = await dbPromise.query(
      "DELETE FROM candidates WHERE id = ?;",
      [candidate_id],
    );

    return result.affectedRows;
  },
  getAllCandidates: async () => {
    const [rows] = await dbPromise.query("SELECT * FROM candidates;");
    return rows;
  },
  updateCandidate: async (
    candidate_id,
    experience,
    qual_edu,
    personal_statement,
    manifesto,
    election_id,
    list_id,
  ) => {
    const [result] = await dbPromise.query(
      "UPDATE candidates SET experience = ?, qual_edu = ?, personal_statement = ?, manifesto = ?, election_id = ?, list_id = ? WHERE id = ?;",
      [
        experience,
        qual_edu,
        personal_statement,
        manifesto,
        election_id,
        list_id,
        candidate_id,
      ],
    );

    return result.affectedRows;
  },
  approveRequest: async (candidate_id) => {
    const [result] = await dbPromise.query(
      "UPDATE candidates SET is_request = 1, is_approved = 1 WHERE id = ?;",
      [candidate_id],
    );

    return result.affectedRows;
  },
  denieRequest: async (candidate_id) => {
    const [result] = await dbPromise.query(
      "DELETE FROM candidates WHERE id = ?",
      [candidate_id],
    );

    return result.affectedRows;
  },
};

module.exports = Candidate;
