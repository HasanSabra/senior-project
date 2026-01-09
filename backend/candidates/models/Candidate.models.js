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
    const [rows] = await dbPromise.query(`
      SELECT
        c.*,
        CONCAT(u.first_name, ' ', u.last_name) as name,
        u.email,
        e.name as election_name,
        l.name as list_name,
        c.creation_date as created_at,
        c.update_date as updated_at,
        CASE
          WHEN c.is_request = 1 AND c.is_approved = 1 THEN 'approved'
          WHEN c.is_request = 1 AND c.is_approved = 0 THEN 'pending'
          ELSE 'rejected'
        END as status
      FROM candidates c
      LEFT JOIN users u ON c.user_id = u.id
      LEFT JOIN elections e ON c.election_id = e.id
      LEFT JOIN lists l ON c.list_id = l.id
      ORDER BY c.creation_date DESC;
    `);
    return rows;
  },
  getCandidatesByStatus: async (status) => {
    let whereClause = "";
    switch (status) {
      case "pending":
        whereClause = "WHERE c.is_request = 1 AND c.is_approved = 0";
        break;
      case "approved":
        whereClause = "WHERE c.is_request = 1 AND c.is_approved = 1";
        break;
      case "rejected":
        whereClause =
          "WHERE c.is_request = 0 OR (c.is_request = 1 AND c.is_approved IS NULL)";
        break;
      default:
        whereClause = "";
    }

    const [rows] = await dbPromise.query(`
      SELECT
        c.*,
        CONCAT(u.first_name, ' ', u.last_name) as name,
        u.email,
        e.name as election_name,
        l.name as list_name,
        c.creation_date as created_at,
        c.update_date as updated_at,
        CASE
          WHEN c.is_request = 1 AND c.is_approved = 1 THEN 'approved'
          WHEN c.is_request = 1 AND c.is_approved = 0 THEN 'pending'
          ELSE 'rejected'
        END as status
      FROM candidates c
      LEFT JOIN users u ON c.user_id = u.id
      LEFT JOIN elections e ON c.election_id = e.id
      LEFT JOIN lists l ON c.list_id = l.id
      ${whereClause}
      ORDER BY c.creation_date DESC;
    `);
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
      "UPDATE candidates SET is_request = 0, is_approved = 0 WHERE id = ?;",
      [candidate_id],
    );

    return result.affectedRows;
  },
};

module.exports = Candidate;
