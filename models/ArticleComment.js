const db = require('../db/connection')
const { NotFoundError } = require('../utils/error-types')

class ArticleComment {
  static async findManyByArticleId(id) {
    const result = await db.query(
      `
      SELECT 
        ac.id, 
        ac.article_id,
        json_build_object(
          'username', u.username,
          'avatar_url', u.avatar_url
        ) AS author,
        ac.body,
        ac.rating,
        ac.created_at
      From article_comments as ac
      LEFT JOIN users as u ON u.username = ac.author
      WHERE article_id = $1
      ORDER BY created_at DESC;
    `,
      [id]
    )

    return result.rows
  }

  static async createOne(newComment) {
    const result = await db.query(
      `
      INSERT INTO article_comments (article_id, author, body) VALUES ($1, $2, $3) RETURNING *
    `,
      [newComment.article_id, newComment.username, newComment.body]
    )

    return result.rows[0]
  }

  static async updateRatingById(id, incVal) {
    const result = await db.query(
      `
      UPDATE article_comments
      SET rating = rating + $2
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
      DELETE From article_comments
      WHERE id = $1
    `,
      [id]
    )

    if (!result.rowCount) throw new NotFoundError('comment')
  }
}

module.exports = ArticleComment
