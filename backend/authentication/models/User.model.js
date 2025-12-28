const db = require("../config/db");
const dbPromise = db.promise();

const User = {
  findByPIN: async (pin) => {
    const [rows] = await dbPromise.query("SELECT * FROM users WHERE pin = ?;", [
      pin,
    ]);
    return rows[0];
  },
  findByEmail: async (email) => {
    const [rows] = await dbPromise.query(
      "SELECT * FROM users WHERE email = ?;",
      [email],
    );
    return rows[0];
  },
  getRole: async (user_id) => {
    const [rowsAdmin] = await dbPromise.query(
      "SELECT * FROM users where id = ? AND is_admin = 1;",
      [user_id],
    );

    if (rowsAdmin.length > 0) {
      return "admin";
    }

    const [rowsParliament] = await dbPromise.query(
      "SELECT pm.id AS parliament_member_id FROM parliament_members pm JOIN candidates c ON pm.candidate_id = c.id JOIN users u ON c.user_id = u.id WHERE u.id = ? AND pm.is_current = 1;",
      [user_id],
    );

    if (rowsParliament.length > 0) {
      return "parliament_member";
    }

    const [rowsCandidate] = await dbPromise.query(
      "SELECT * FROM candidates WHERE user_id = ?;",
      [user_id],
    );

    if (rowsCandidate.length > 0) {
      return "candidate";
    }

    const [rows] = await dbPromise.query("SELECT * FROM users WHERE id = ?;", [
      user_id,
    ]);

    if (rows.length > 0) {
      return "voter";
    }
  },
  verifyAuth: async (user_id) => {
    const [rows] = await dbPromise.query(
      "SELECT * FROM auth_users WHERE user_id = ?;",
      [user_id],
    );
    return rows.length > 0;
  },
  completeRegistration: async (user_id, email, pass) => {
    const [result] = await dbPromise.query(
      "UPDATE users SET email = ?, password = ? WHERE id = ?;",
      [email, pass, user_id],
    );
    return result.affectedRows > 0;
  },
  authenticate: async (user_id) => {
    const [result] = await dbPromise.query(
      "INSERT INTO auth_users (user_id) VALUES (?);",
      [user_id],
    );
    return result.affectedRows > 0;
  },
};

module.exports = User;
