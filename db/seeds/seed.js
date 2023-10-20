const format = require('pg-format')
const db = require('../connection')
const { convertTimestampToDate, createRef, formatComments } = require('./utils')

const seed = ({ topics, users, articles, comments }) => {
  return db
    .query(`DROP TABLE IF EXISTS comments`)
    .then(() => db.query(`DROP TABLE IF EXISTS articles`))
    .then(() => db.query(`DROP TABLE IF EXISTS users`))
    .then(() => db.query(`DROP TABLE IF EXISTS topics`))
    .then(() => {
      const topicsTablePromise = db.query(`
      CREATE TABLE topics (
        slug VARCHAR(255) PRIMARY KEY,
        description VARCHAR
      )`)

      const usersTablePromise = db.query(`
      CREATE TABLE users (
        username VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        avatar_url VARCHAR
      )`)

      return Promise.all([topicsTablePromise, usersTablePromise])
    })
    .then(() => {
      return db.query(`
      CREATE TABLE articles (
        id SERIAL PRIMARY KEY,
        author VARCHAR(255) NOT NULL REFERENCES users(username),
        title VARCHAR(255) NOT NULL,
        topic VARCHAR(255) NOT NULL REFERENCES topics(slug),
        body VARCHAR NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        vote_count INT DEFAULT 0 NOT NULL,
        image_url VARCHAR(255) DEFAULT 'https://images.pexels.com/photos/97050/pexels-photo-97050.jpeg?w=700&h=700' NOT NULL
      );`)
    })
    .then(() => {
      return db.query(`
      CREATE TABLE comments (
        id SERIAL PRIMARY KEY,
        article_id INT REFERENCES articles(id) NOT NULL,
        body VARCHAR(255) NOT NULL,      
        author VARCHAR(255) REFERENCES users(username) NOT NULL,
        vote_count INT DEFAULT 0 NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );`)
    })
    .then(() => {
      const insertTopicsQueryStr = format(
        'INSERT INTO topics (slug, description) VALUES %L;',
        topics.map(({ slug, description }) => [slug, description])
      )
      const topicsPromise = db.query(insertTopicsQueryStr)

      const insertUsersQueryStr = format(
        'INSERT INTO users (username, name, avatar_url) VALUES %L;',
        users.map(({ username, name, avatar_url }) => [username, name, avatar_url])
      )
      const usersPromise = db.query(insertUsersQueryStr)

      return Promise.all([topicsPromise, usersPromise])
    })
    .then(() => {
      const formattedarticles = articles.map(convertTimestampToDate)
      const insertArticlesQueryStr = format(
        'INSERT INTO articles (title, topic, author, body, created_at, vote_count, image_url) VALUES %L RETURNING *;',
        formattedarticles.map(
          ({ title, topic, author, body, created_at, vote_count = 0, image_url }) => [
            title,
            topic,
            author,
            body,
            created_at,
            vote_count,
            image_url,
          ]
        )
      )

      return db.query(insertArticlesQueryStr)
    })
    .then(({ rows: articleRows }) => {
      const articleIdLookup = createRef(articleRows, 'title', 'id')
      const formattedcomments = formatComments(comments, articleIdLookup)

      const insertCommentsQueryStr = format(
        'INSERT INTO comments (body, author, article_id, vote_count, created_at) VALUES %L;',
        formattedcomments.map(
          ({ body, author, article_id, vote_count = 0, created_at }) => [
            body,
            author,
            article_id,
            vote_count,
            created_at,
          ]
        )
      )
      return db.query(insertCommentsQueryStr)
    })
}

module.exports = seed
