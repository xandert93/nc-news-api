const db = require('../db/connection')

class Article {
  static async findMany() {}

  static async findById(id) {
    const result = await db.query(
      `
      SELECT * FROM articles
      WHERE id = $1;
      `,
      [id]
    )

    return result.rows[0]
  }
}

module.exports = Article
