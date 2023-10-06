const db = require('../db/connection')

class User {
  static async findMany() {
    const result = await db.query(
      `
      SELECT username, name, avatar_url FROM users;
      `
    )

    return result.rows
  }
}

module.exports = User
