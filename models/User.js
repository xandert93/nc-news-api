const db = require('../db/connection')

class User {
  static async findMany() {
    const result = await db.query(
      `
      SELECT * FROM users;
      `
    )

    return result.rows
  }

  static async findOneByUsername(username) {
    const result = await db.query(
      `
      SELECT * FROM users
      WHERE username = $1;
      `,
      [username]
    )

    return result.rows[0]
  }
}

module.exports = User
