const db = require('../db/connection')
const { NotFoundError } = require('../utils/error-types')

class ArticleComment {
  static findByArticleId(id) {
    return db('article_comments as ac')
      .select('ac.id', 'ac.article_id')
      .select(
        db.raw(`
        json_build_object(
          'username', u.username,
          'avatar_url', u.avatar_url
        ) AS author
      `)
      )
      .select('ac.body', 'ac.vote_count', 'ac.created_at')
      .leftJoin('users as u', 'u.username', '=', 'ac.author')
      .where('article_id', id)
      .orderBy('created_at', 'desc')
  }

  static async create(newComment) {
    const [insertedComment] = await db('article_comments')
      .insert(newComment)
      .returning('*')
    // 🔥 can't chain .first() on "insert" query 😔

    return insertedComment
  }

  static async updateVoteCount(id, incVal) {
    const updatedComment = await db('article_comments')
      .where({ id })
      .increment('vote_count', incVal)
      .returning('*')
      .first()

    if (!updatedComment) throw new NotFoundError('comment')
    return updatedComment
  }

  static async delete(id) {
    const deletionCount = await db('article_comments').where({ id }).del()

    if (deletionCount === 0) throw new NotFoundError('comment')
  }
}

module.exports = ArticleComment
