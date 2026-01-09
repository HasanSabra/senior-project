const db = require("../config/db");

const dbPromise = db.promise();

const Election = {
  isExists: async (election_id) => {
    const [rows] = await dbPromise.query(
      "SELECT COUNT(*) AS count FROM elections WHERE id = ?",
      [election_id],
    );
    return rows[0].count > 0;
  },
  getData: async (election_id) => {
    const [rows] = await dbPromise.query(
      `
        SELECT
          e.name AS election_name,
          e.start_date,
          e.end_date,
          e.is_active,
          et.type AS election_type,
          g.name AS governorate_name,
          d.name AS district_name,
          v.name AS village_name,
          (
            SELECT JSON_ARRAYAGG(
              JSON_OBJECT(
                'list_id', l.id,
                'list_name', l.name,
                'list_description', l.description,
                'seats_number', l.seats_number,
                'constituency_id', l.constituency_id,
                'district_id', l.district_id,
                'village_id', l.village_id,
                'candidates', (
                  SELECT JSON_ARRAYAGG(
                    JSON_OBJECT(
                      'candidate_id', c2.id,
                      'first_name', u2.first_name,
                      'last_name', u2.last_name,
                      'experience', c2.experience,
                      'qual_edu', c2.qual_edu,
                      'denomination', d2.name,
                      'village_id', u2.village_id
                    )
                  )
                  FROM candidates c2
                  JOIN users u2 ON u2.id = c2.user_id
                  LEFT JOIN denominations d2 ON u2.denomination_id = d2.id
                  WHERE c2.list_id = l.id AND c2.election_id = e.id
                )
              )
            )
            FROM lists l
            WHERE l.election_id = e.id
          ) AS lists
        FROM elections e
        LEFT JOIN election_types et ON e.election_type_id = et.id
        LEFT JOIN governorates g ON e.governorate_id = g.id
        LEFT JOIN districts d ON e.district_id = d.id
        LEFT JOIN villages v ON e.village_id = v.id
        WHERE e.id = ?;
      `,
      [election_id],
    );
    return rows[0];
  },
};

module.exports = Election;
