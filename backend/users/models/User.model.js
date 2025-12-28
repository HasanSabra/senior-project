const db = require("../config/db");

const dbPromise = db.promise();

const User = {
  create: async (
    pin,
    first_name,
    last_name,
    birthdate,
    family_record_number,
    is_alive,
    is_admin,
    email,
    password,
    governorate_id,
    district_id,
    village_id,
    gender_id,
    marital_status_id,
    religion_id,
    denomination_id,
    father_id,
    mother_id,
  ) => {
    const [users] = await dbPromise.query(
      "INSERT INTO users (pin, first_name, last_name, birthdate, family_record_number, is_alive, is_admin, email, password, governorate_id, district_id, village_id, gender_id, marital_status_id, religion_id, denomination_id, father_id, mother_id) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);",
      [
        pin,
        first_name,
        last_name,
        birthdate,
        family_record_number,
        is_alive,
        is_admin,
        email,
        password,
        governorate_id,
        district_id,
        village_id,
        gender_id,
        marital_status_id,
        religion_id,
        denomination_id,
        father_id,
        mother_id,
      ],
    );

    return users.insertId;
  },
  getAll: async () => {
    const [users] = await dbPromise.query("SELECT * FROM users;");

    return users;
  },
  isExists: async (user_id) => {
    const [user] = await dbPromise.query("SELECT * FROM users WHERE id = ?;", [
      user_id,
    ]);

    return user.length > 0;
  },
  update: async (
    pin,
    first_name,
    last_name,
    birthdate,
    family_record,
    is_alive,
    is_admin,
    email,
    password,
    governorate_id,
    district_id,
    village_id,
    gender_id,
    marital_status,
    religion_id,
    denomination_id,
    father_id,
    mother_id,
    user_id,
  ) => {
    const [user] = await dbPromise.query(
      "UPDATE users SET pin = ?, first_name = ?, last_name = ?, birthdate = ?, family_record = ?, is_alive = ?, is_admin = ?, email = ?, password = ?, governorate_id = ?, district_id = ?, village_id = ?, gender_id = ?, marital_status = ?, religion_id = ?, denomination_id = ?, father_id = ?, mother_id = ? WHERE id = ?;",
      [
        pin,
        first_name,
        last_name,
        birthdate,
        family_record,
        is_alive,
        is_admin,
        email,
        password,
        governorate_id,
        district_id,
        village_id,
        gender_id,
        marital_status,
        religion_id,
        denomination_id,
        father_id,
        mother_id,
        user_id,
      ],
    );

    return user.affectedRows > 0;
  },
  delete: async (user_id) => {
    const [user] = await dbPromise.query("DELETE FROM users WHERE id = ?;", [
      user_id,
    ]);

    return user.affectedRows > 0;
  },
};

module.exports = User;
