const db = require('./connection')
const pgFormat = require('pg-format')
const { createRef, formatComments, convertTimestampToDate } = require('./seeds/utils')

const insertTopics = (topics) => () => {
  return db.query(
    pgFormat(
      'INSERT INTO article_topics (name, description) VALUES %L;',
      topics.map((t) => [t.name, t.description])
    )
  )
}

const insertUsers = (users) => () => {
  return db.query(
    pgFormat(
      'INSERT INTO users (username, first_name, last_name, avatar_url) VALUES %L;',
      users.map((u) => [u.username, u.first_name, u.last_name, u.avatar_url])
    )
  )
}

const insertArticles = (articles) => async () => {
  const formattedarticles = articles.map(convertTimestampToDate)

  const result = await db.query(
    pgFormat(
      'INSERT INTO articles (author, topic, title, body, image_url, rating, created_at) VALUES %L RETURNING *;',
      formattedarticles.map((art) => [
        art.author,
        art.topic,
        art.title,
        art.body,
        art.image_url,
        art.rating || 0, // to do with the way test seed data and dev seed data are different
        art.created_at,
      ])
    )
  )

  return result.rows
}

const insertComments = (comments) => (insertedArticles) => {
  const articleIdLookup = createRef(insertedArticles, 'title', 'id')
  const formattedComments = formatComments(comments, articleIdLookup)

  return db.query(
    pgFormat(
      'INSERT INTO article_comments (body, author, article_id, rating, created_at) VALUES %L;',
      formattedComments.map((com) => [
        com.body,
        com.author,
        com.article_id,
        com.rating,
        com.created_at,
      ])
    )
  )
}

module.exports = {
  insertTopics,
  insertUsers,
  insertArticles,
  insertComments,
}
