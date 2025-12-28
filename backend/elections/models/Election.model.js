const db = require("../config/db");

const dbPromise = db.promise();

const Election = {
  isExists: async (name = null, start_date = null, election_id = null) => {
    if (election_id) {
      const [rows] = await dbPromise.query(
        "SELECT * FROM elections WHERE id = ?",
        [election_id],
      );
      return rows.length > 0;
    }

    const [rows] = await dbPromise.query(
      "SELECT * FROM elections WHERE name = ? AND start_date = ?",
      [name, start_date],
    );
    return rows.length > 0;
  },
  create: async (
    name,
    start_date,
    end_date,
    election_type_id,
    governorate_id,
    district_id,
    village_id,
    is_active,
  ) => {
    const [result] = await dbPromise.query(
      "INSERT INTO elections (name, start_date, end_date, election_type_id, governorate_id, district_id, village_id, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [
        name,
        start_date,
        end_date,
        election_type_id,
        governorate_id,
        district_id,
        village_id,
        is_active,
      ],
    );
    return result.insertId;
  },
  getAll: async () => {
    const [rows] = await dbPromise.query("SELECT * FROM elections");
    return rows;
  },
  update: async (
    id,
    name,
    start_date,
    end_date,
    election_type_id,
    governorate_id,
    district_id,
    village_id,
    is_active,
  ) => {
    const [result] = await dbPromise.query(
      "UPDATE elections SET name = ?, start_date = ?, end_date = ?, election_type_id = ?, governorate_id = ?, district_id = ?, village_id = ?, is_active = ? WHERE id = ?",
      [
        name,
        start_date,
        end_date,
        election_type_id,
        governorate_id,
        district_id,
        village_id,
        is_active,
        id,
      ],
    );
    return result.affectedRows > 0;
  },
  delete: async (election_id) => {
    const [result] = await dbPromise.query(
      "DELETE FROM elections WHERE id = ?",
      [election_id],
    );
    return result.affectedRows > 0;
  },
  activate: async (election_id) => {
    const [result] = await dbPromise.query(
      "UPDATE elections SET is_active = 1 WHERE id = ?",
      [election_id],
    );
    return result.affectedRows > 0;
  },
  deactivate: async (election_id) => {
    const [result] = await dbPromise.query(
      "UPDATE elections SET is_active = 0 WHERE id = ?",
      [election_id],
    );
    return result.affectedRows > 0;
  },
};

module.exports = Election;
