const db = require("../config/db");

const dbPromise = db.promise();

const List = {
  isExists: async (name = null, election_id = null, list_id = null) => {
    if (list_id) {
      const [rows] = await dbPromise.query("SELECT * FROM lists WHERE id = ?", [
        list_id,
      ]);
      return rows.length > 0;
    }

    const [rows] = await dbPromise.query(
      "SELECT * FROM lists WHERE name = ? AND election_id = ?",
      [name, election_id],
    );
    return rows.length > 0;
  },
  create: async (
    name,
    description,
    seats_number,
    election_id,
    constituency_id,
    district_id,
    village_id,
  ) => {
    const [result] = await dbPromise.query(
      "INSERT INTO lists (name, description, seats_number, election_id, constituency_id, district_id, village_id) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        name,
        description,
        seats_number,
        election_id,
        constituency_id,
        district_id,
        village_id,
      ],
    );
    return result.insertId;
  },
  getAll: async () => {
    const [rows] = await dbPromise.query("SELECT * FROM lists");
    return rows;
  },
  getByElectionId: async (election_id) => {
    const [rows] = await dbPromise.query(
      "SELECT * FROM lists WHERE election_id = ?",
      [election_id],
    );
    return rows;
  },
  update: async (
    list_id,
    name,
    description,
    seats_number,
    election_id,
    constituency_id,
    district_id,
    village_id,
  ) => {
    const [result] = await dbPromise.query(
      "UPDATE lists SET name = ?, description = ?, seats_number = ?, election_id = ?, constituency_id = ?, district_id = ?, village_id = ? WHERE id = ?",
      [
        name,
        description,
        seats_number,
        election_id,
        constituency_id,
        district_id,
        village_id,
        list_id,
      ],
    );

    return result.affectedRows > 0;
  },
  delete: async (list_id) => {
    const [result] = await dbPromise.query("DELETE FROM lists WHERE id = ?", [
      list_id,
    ]);
    return result.affectedRows > 0;
  },
};

module.exports = List;
