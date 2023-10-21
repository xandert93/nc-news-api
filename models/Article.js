const db = require('../db/connection')
const { NotFoundError } = require('../utils/error-types')

class Article {
  static async findMany(topic) {
    const result = await db.query(
      `
      SELECT 
        a.id, 
        json_build_object(
          'username', MAX(u.username),
          'avatar_url', MAX(u.avatar_url)
        ) AS author, 
        a.title, 
        a.topic, 
        a.image_url, 
        a.upvote_count, 
        COUNT(c.id)::integer as comment_count,
        a.created_at 
      FROM articles as a
      LEFT JOIN users as u ON u.username = a.author
      LEFT JOIN comments as c ON a.id = c.article_id
      WHERE $1::varchar IS NULL or topic = $1
      GROUP BY a.id
      ORDER BY a.created_at DESC;
      `,
      [topic]
    )

    return result.rows
  }

  static async findById(id) {
    const result = await db.query(
      `
      SELECT 
        a.id, 
        json_build_object(
          'username', MAX(u.username),
          'avatar_url', MAX(u.avatar_url)
        ) AS author, 
        a.title, 
        a.topic, 
        a.image_url, 
        a.upvote_count, 
        COUNT(c.id)::integer as comment_count,
        a.created_at  
      FROM articles as a
      LEFT JOIN users as u ON u.username = a.author
      LEFT JOIN comments as c ON a.id = c.article_id
      WHERE a.id = $1
      GROUP BY a.id;
      `,
      [id]
    )

    const foundArticle = result.rows[0]

    if (!foundArticle) throw new NotFoundError('article')
    return foundArticle
  }

  static async createOne() {
    const result = await db.query(
      `
      INSERT INTO articles (author, title, body, topic)
      VALUES ()
      RETURNING *;
    `,
      []
    )
  }

  static async updateVoteCountById(id, incVal) {
    const result = await db.query(
      `
      UPDATE articles
      SET upvote_count = upvote_count + $2
      WHERE id = $1
      RETURNING *;
    `,
      [id, incVal]
    )

    const updatedArticle = result.rows[0]

    if (!updatedArticle) throw new NotFoundError('article')
    return updatedArticle
  }
}

module.exports = Article
