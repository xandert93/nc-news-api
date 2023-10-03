const db = require('../db/connection')

class Article {
  static async findMany() {
    const result = await db.query(
      `
      SELECT a.id, a.author, a.title, a.topic, a.created_at, a.vote_count, a.img_url, COUNT(c.id) as comment_count FROM articles as a
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
}

module.exports = Article
