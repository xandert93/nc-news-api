const db = require('../db/connection')
const { NotFoundError } = require('../utils/error-types')

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

  static async updateVoteCountById(id, incVal) {
    const result = await db.query(
      `
      UPDATE comments
      SET vote_count = vote_count + $2
      WHERE id = $1
      RETURNING *;
    `,
      [id, incVal]
    )

    const updatedComment = result.rows[0]

    if (!updatedComment) throw new NotFoundError('comment')
    return updatedComment
  }

  static async deleteById(id) {
    const result = await db.query(
      `
      DELETE FROM comments
      WHERE id = $1
    `,
      [id]
    )

    if (!result.rowCount) throw new NotFoundError('comment')
  }
}

module.exports = Comment
