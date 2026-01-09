const db = require("../config/db");
const dbPromise = db.promise();

const Result = {
  getMunicipalityResults: async (user_id, election_id) => {
    try {
      console.log(
        "Getting results for user:",
        user_id,
        "election:",
        election_id,
      );

      // First, check if user exists
      const [userCheck] = await dbPromise.query(
        `SELECT id, village_id FROM users WHERE id = ?`,
        [user_id],
      );

      if (userCheck.length === 0) {
        console.log("User not found:", user_id);
        return {
          success: false,
          message: "User not found",
        };
      }

      const user = userCheck[0];
      console.log("User found:", user);

      // Get election info
      const [electionInfo] = await dbPromise.query(
        `SELECT e.id as election_id, e.name as election_name, et.type as election_type
         FROM elections e
         JOIN election_types et ON e.election_type_id = et.id
         WHERE e.id = ?`,
        [election_id],
      );

      if (electionInfo.length === 0) {
        return {
          success: false,
          message: "Election not found",
        };
      }

      const election = electionInfo[0];
      console.log("Election found:", election);

      // Get all lists for this election (TEMPORARY: Remove village filter for testing)
      const [lists] = await dbPromise.query(
        `SELECT
            l.id as list_id,
            l.name as list_name,
            l.seats_number,
            COALESCE(v.name, '') as village_name,
            l.village_id
         FROM lists l
         LEFT JOIN villages v ON l.village_id = v.id
         WHERE l.election_id = ?
         ORDER BY l.id`,
        [election_id],
      );

      console.log("Lists found:", lists.length);

      // Process lists
      const processedLists = [];

      for (const list of lists) {
        // Get candidates for this list
        const [candidates] = await dbPromise.query(
          `SELECT
              ca.id as candidate_id,
              CONCAT(u.first_name, ' ', u.last_name) as candidate_name,
              (SELECT COUNT(*) FROM votes v WHERE v.candidate_id = ca.id AND v.election_id = ?) as votes,
              EXISTS(SELECT 1 FROM winner_candidates wc WHERE wc.candidate_id = ca.id AND wc.election_id = ?) as is_winner
           FROM candidates ca
           JOIN users u ON ca.user_id = u.id
           WHERE ca.list_id = ?
           AND ca.election_id = ?
           AND ca.is_approved = 1
           ORDER BY ca.id`,
          [election_id, election_id, list.list_id, election_id],
        );

        // Calculate total votes for this list
        const listVotes = candidates.reduce(
          (sum, candidate) => sum + (candidate.votes || 0),
          0,
        );

        processedLists.push({
          list_id: list.list_id,
          list_name: list.list_name,
          seats_number: list.seats_number,
          village_name: list.village_name,
          total_votes: listVotes,
          candidates: candidates.map((c) => ({
            ...c,
            is_winner: c.is_winner === 1,
          })),
        });
      }

      // Get total votes for the election
      const [totalVotesResult] = await dbPromise.query(
        `SELECT COUNT(*) as total_votes FROM votes WHERE election_id = ?`,
        [election_id],
      );

      // Get registered voters count for the user's village if available
      let totalVoters = 0;
      if (user.village_id) {
        const [registeredVoters] = await dbPromise.query(
          `SELECT COUNT(*) as total_voters FROM users WHERE village_id = ?`,
          [user.village_id],
        );
        totalVoters = registeredVoters[0]?.total_voters || 0;
      }

      // Get village name
      const [villageInfo] = await dbPromise.query(
        `SELECT name FROM villages WHERE id = ?`,
        [user.village_id],
      );

      return {
        success: true,
        data: {
          election: {
            ...election,
            total_votes: totalVotesResult[0]?.total_votes || 0,
            total_voters: totalVoters,
            village_name: villageInfo[0]?.name || "Unknown",
            village_id: user.village_id,
            lists: processedLists,
          },
        },
      };
    } catch (error) {
      console.error("Database error in getMunicipalityResults:", error);
      return {
        success: false,
        message: "Database error: " + error.message,
      };
    }
  },
};

module.exports = Result;
