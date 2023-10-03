const db = require('../db/connection')

class Comment {
  static async findManyByArticleId(id) {
    const result = await db.query(
      `
      SELECT * from comments WHERE article_id = $1
      ORDER BY created_at DESC;
    `,
      [id]
    )

    return result.rows
  }
}

module.exports = Comment
