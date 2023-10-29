const db = require('../db/connection')
const { NotFoundError } = require('../utils/error-types')

const getBaseQuery = () => {
  return db('articles as a')
    .select('a.id')
    .select(
      db.raw(`
      json_build_object(
        'username', MAX(u.username),
        'first_name', MAX(u.first_name),
        'last_name', MAX(u.last_name),
        'avatar_url', MAX(u.avatar_url)
      ) AS author
    `)
    )
    .select('a.title', 'a.topic', 'a.body', 'a.image_url', 'a.vote_count')
    .select(db.raw('CAST(COUNT(ac.id) AS INT) as comment_count'))
    .select('a.created_at')
    .leftJoin('users as u', 'u.username', '=', 'a.author')
    .leftJoin('article_comments as ac', 'a.id', '=', 'ac.article_id')
}

class Article {
  static find(topic) {
    return getBaseQuery()
      .modify((queryBuilder) => {
        topic && queryBuilder.where('a.topic', topic)
      })
      .groupBy('a.id')
      .orderBy('a.created_at', 'desc')
  }

  static findByUsername(username) {
    return getBaseQuery()
      .where('a.author', username) // 🔥 .where() can also take an object specifying multiple conditions! Faster than writing successive WHERE clauses!
      .groupBy('a.id')
      .orderBy('a.created_at', 'desc')
  }

  static findSuggested(filter, exclude) {
    return getBaseQuery()
      .where(filter)
      .whereNot('a.id', exclude)
      .groupBy('a.id')
      .orderByRaw('RANDOM()')
      .limit(4)
  }

  static async findById(id) {
    const foundArticle = await getBaseQuery().where('a.id', id).groupBy('a.id').first()

    if (!foundArticle) throw new NotFoundError('article')
    return foundArticle
  }

  static async create(newArticle) {
    const [insertedArticle] = await db('articles')
      .insert({
        ...newArticle,
        image_url:
          newArticle.image_url ||
          'https://images.pexels.com/photos/97050/pexels-photo-97050.jpeg?w=700&h=700',
      })
      .returning('*')

    insertedArticle.comment_count = 0
    return insertedArticle
  }

  static async updateVoteCount(id, incVal) {
    const [updatedArticle] = await db('articles')
      .where({ id })
      .increment('vote_count', incVal)
      .returning('*')
    // 🔥 can't chain .first() on "update" query 😔

    if (!updatedArticle) throw new NotFoundError('article')
    return updatedArticle
  }

  static async deleteById(id) {
    const deletionCount = await db('articles').where({ id }).del()

    if (deletionCount === 0) throw new NotFoundError('article')
  }
}

module.exports = Article
