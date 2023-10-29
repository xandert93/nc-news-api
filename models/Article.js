const db = require('../db/connection')
const { NotFoundError } = require('../utils/error-types')

class Article {
  static find(topic) {
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
      .select(db.raw('CAST(COUNT(ac.id) AS INTEGER) as comment_count')) // Cast to INTEGER
      .select('a.created_at')
      .leftJoin('users as u', 'u.username', '=', 'a.author')
      .leftJoin('article_comments as ac', 'a.id', '=', 'ac.article_id')
      .modify((queryBuilder) => {
        topic && queryBuilder.where('topic', topic)
      })
      .groupBy('a.id')
      .orderBy('a.created_at', 'desc')
  }

  static findByUsername(username) {
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
      .select(db.raw('CAST(COUNT(ac.id) AS INTEGER) as comment_count')) // Cast to INTEGER
      .select('a.created_at')
      .leftJoin('users as u', 'u.username', '=', 'a.author')
      .leftJoin('article_comments as ac', 'a.id', '=', 'ac.article_id')
      .where('a.author', username)
      .groupBy('a.id')
      .orderBy('a.created_at', 'desc')
  }

  static findAuthorSuggested(username, exclude) {
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
      .select(db.raw('CAST(COUNT(ac.id) AS INTEGER) as comment_count'))
      .select('a.created_at')
      .leftJoin('users as u', 'u.username', '=', 'a.author')
      .leftJoin('article_comments as ac', 'a.id', '=', 'ac.article_id')
      .where('a.author', username)
      .whereNot('a.id', exclude)
      .groupBy('a.id')
      .orderByRaw('RANDOM()')
      .limit(4)
  }

  static findSuggested(topic, exclude) {
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
      .select(db.raw('CAST(COUNT(ac.id) AS INTEGER) as comment_count'))
      .select('a.created_at')
      .leftJoin('users as u', 'u.username', '=', 'a.author')
      .leftJoin('article_comments as ac', 'a.id', '=', 'ac.article_id')
      .where('a.topic', topic)
      .whereNot('a.id', exclude)
      .groupBy('a.id')
      .orderByRaw('RANDOM()')
      .limit(4)
  }

  static async findById(id) {
    const foundArticle = await db('articles as a')
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
      .select(db.raw('CAST(COUNT(ac.id) AS INTEGER) as comment_count'))
      .select('a.created_at')
      .leftJoin('users as u', 'u.username', '=', 'a.author')
      .leftJoin('article_comments as ac', 'a.id', '=', 'ac.article_id')
      .where('a.id', id)
      .groupBy('a.id')
      .first()

    if (!foundArticle) throw new NotFoundError('article')
    return foundArticle
  }

  static async create(newArticle) {
    const insertedArticle = await db('articles')
      .insert({
        ...newArticle,
        image_url:
          newArticle.image_url ||
          'https://images.pexels.com/photos/97050/pexels-photo-97050.jpeg?w=700&h=700',
      })
      .returning('*')

    insertedArticle[0].comment_count = 0

    return insertedArticle[0]
  }

  static async updateVoteCount(id, incVal) {
    const [updatedArticle] = await db('articles')
      .where({ id })
      .increment('vote_count', incVal)
      .returning('*')

    if (!updatedArticle) throw new NotFoundError('article')
    return updatedArticle
  }
}

module.exports = Article
