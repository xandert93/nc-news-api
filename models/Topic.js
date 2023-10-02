const db = require('../db/connection.js')

class Topic {
  static async findMany() {
    const result = await db.query(`
      SELECT * FROM topics;
    `)

    return result.rows
  }

  static async findById(id) {
    const result = await db.query(
      `
      SELECT * FROM topics
      WHERE id = $1;
    `,
      [id]
    )

    return result.rows[0]
  }
}

module.exports = Topic
