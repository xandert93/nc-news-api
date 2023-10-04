const db = require('../db/connection')

class Article {
  static async findMany() {
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
      JOIN comments as c ON a.id = c.article_id
      GROUP BY a.id;
      `
    )

    return result.rows
  }

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
