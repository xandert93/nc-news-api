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

  static async createOne(id, newComment) {
    const result = await db.query(
      `
      INSERT INTO comments (article_id, author, body) VALUES ($1, $2, $3) RETURNING *
    `,
      [id, newComment.username, newComment.body]
    )

    return result.rows[0]
  }

  static async deleteById(id) {
    const result = await db.query(
      `
      DELETE FROM comments
      WHERE id = $1
    `,
      [id]
    )

    return Boolean(result.rowCount)
  }
}

module.exports = Comment
