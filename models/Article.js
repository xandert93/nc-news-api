const db = require('../db/connection')

class Article {
  static async findMany(topic) {
    const result = await db.query(
      `
      SELECT 
        a.id, 
        a.author, 
        a.title, 
        a.topic, 
        a.created_at, 
        a.vote_count, 
        a.img_url, 
        COUNT(c.id)::integer as comment_count 
      FROM articles as a
      LEFT JOIN comments as c ON a.id = c.article_id
      WHERE $1::varchar IS NULL or topic = $1
      GROUP BY a.id
      ORDER BY created_at DESC;
      `,
      [topic]
    )

    return result.rows
  }

  static async findById(id) {
    const result = await db.query(
      `
      SELECT a.*, COUNT(c.id)::integer as comment_count FROM articles as a
      LEFT JOIN comments as c ON a.id = c.article_id
      WHERE a.id = $1
      GROUP BY a.id;
      `,
      [id]
    )

    return result.rows[0]
  }

  static async updateVoteCountById(id, incVal) {
    const result = await db.query(
      `
      UPDATE articles
      SET vote_count = vote_count + $2
      WHERE id = $1
      RETURNING *;
    `,
      [id, incVal]
    )

    return result.rows[0]
  }
}

module.exports = Article
