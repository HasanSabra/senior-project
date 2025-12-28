const db = require("../config/db");

const dbPromise = db.promise();

const Candidate = {
  isExists: async (candidate_id, election_id) => {
    const [rows] = await dbPromise.query(
      "SELECT COUNT(*) AS count FROM candidates WHERE id = ? AND election_id = ?",
      [candidate_id, election_id],
    );
    return rows[0].count > 0;
  },
};

module.exports = Candidate;
