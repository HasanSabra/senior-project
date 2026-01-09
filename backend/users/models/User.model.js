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

    if (
      email &&
      password &&
      (email !== null || email !== "") &&
      (password !== null || password !== "")
    ) {
      await dbPromise.query("INSERT INTO auth_users (user_id) VALUES (?);", [
        users.insertId,
      ]);
    }

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
    user_id,
  ) => {
    let query, params;

    if (password) {
      // Update with new password
      query =
        "UPDATE users SET pin = ?, first_name = ?, last_name = ?, birthdate = ?, family_record_number = ?, is_alive = ?, is_admin = ?, email = ?, password = ?, governorate_id = ?, district_id = ?, village_id = ?, gender_id = ?, marital_status_id = ?, religion_id = ?, denomination_id = ?, father_id = ?, mother_id = ? WHERE id = ?;";
      params = [
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
        user_id,
      ];
    } else {
      // Update without changing password
      query =
        "UPDATE users SET pin = ?, first_name = ?, last_name = ?, birthdate = ?, family_record_number = ?, is_alive = ?, is_admin = ?, email = ?, governorate_id = ?, district_id = ?, village_id = ?, gender_id = ?, marital_status_id = ?, religion_id = ?, denomination_id = ?, father_id = ?, mother_id = ? WHERE id = ?;";
      params = [
        pin,
        first_name,
        last_name,
        birthdate,
        family_record_number,
        is_alive,
        is_admin,
        email,
        governorate_id,
        district_id,
        village_id,
        gender_id,
        marital_status_id,
        religion_id,
        denomination_id,
        father_id,
        mother_id,
        user_id,
      ];
    }

    const [user] = await dbPromise.query(query, params);

    return user.affectedRows > 0;
  },
  delete: async (user_id) => {
    try {
      console.log("User.delete called with user_id:", user_id);
      const [user] = await dbPromise.query("DELETE FROM users WHERE id = ?;", [
        user_id,
      ]);
      console.log("Delete query result:", user);
      console.log("Affected rows:", user.affectedRows);

      return user.affectedRows > 0;
    } catch (error) {
      console.error("Error in User.delete:", error);
      console.error("Error code:", error.code);
      console.error("Error sqlMessage:", error.sqlMessage);
      throw error;
    }
  },
  hasChildrenAsParent: async (user_id) => {
    try {
      console.log("Checking if user has children references:", user_id);
      const [children] = await dbPromise.query(
        "SELECT COUNT(*) as count FROM users WHERE father_id = ? OR mother_id = ?;",
        [user_id, user_id],
      );
      console.log(
        "Children count for user:",
        user_id,
        "count:",
        children[0].count,
      );
      return children[0].count > 0;
    } catch (error) {
      console.error("Error checking children references:", error);
      throw error;
    }
  },
};

module.exports = User;
