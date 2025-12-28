const db = require("../config/db");

const dbPromise = db.promise();

const User = {
  hasVoted: async (user_id, election_id) => {
    const [rows] = await dbPromise.query(
      "SELECT COUNT(*) AS count FROM voted WHERE user_id = ? AND election_id = ?",
      [user_id, election_id],
    );
    return rows[0].count > 0;
  },
  castVote: async (election_id, candidate_id) => {
    const [result] = await dbPromise.query(
      "INSERT INTO votes (election_id, candidate_id) VALUES (?, ?)",
      [election_id, candidate_id],
    );
    return result.affectedRows > 0;
  },
  setVoted: async (user_id, election_id) => {
    const [result] = await dbPromise.query(
      "INSERT INTO voted (user_id, election_id) VALUES (?, ?)",
      [user_id, election_id],
    );
    return result.affectedRows > 0;
  },
};

module.exports = User;
