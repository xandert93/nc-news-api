const format = require('pg-format')
const db = require('../connection')
const { convertTimestampToDate, createRef, formatComments } = require('./utils')

const seed = ({ topics, users, articles, comments }) => {
  return db
    .query(`DROP TABLE IF EXISTS comments;`)
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS articles;`)
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS users;`)
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS topics;`)
    })
    .then(() => {
      const topicsTablePromise = db.query(`
      CREATE TABLE topics (
        slug VARCHAR PRIMARY KEY,
        description VARCHAR
      );`)

      const usersTablePromise = db.query(`
      CREATE TABLE users (
        username VARCHAR PRIMARY KEY,
        name VARCHAR NOT NULL,
        avatar_url VARCHAR
      );`)

      return Promise.all([topicsTablePromise, usersTablePromise])
    })
    .then(() => {
      return db.query(`
      CREATE TABLE articles (
        article_id SERIAL PRIMARY KEY,
        title VARCHAR NOT NULL,
        topic VARCHAR NOT NULL REFERENCES topics(slug),
        author VARCHAR NOT NULL REFERENCES users(username),
        body VARCHAR NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        vote_count INT DEFAULT 0 NOT NULL,
        article_img_url VARCHAR DEFAULT 'https://images.pexels.com/photos/97050/pexels-photo-97050.jpeg?w=700&h=700'
      );`)
    })
    .then(() => {
      return db.query(`
      CREATE TABLE comments (
        comment_id SERIAL PRIMARY KEY,
        body VARCHAR NOT NULL,
        article_id INT REFERENCES articles(article_id) NOT NULL,
        author VARCHAR REFERENCES users(username) NOT NULL,
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
        'INSERT INTO users ( username, name, avatar_url) VALUES %L;',
        users.map(({ username, name, avatar_url }) => [username, name, avatar_url])
      )
      const usersPromise = db.query(insertUsersQueryStr)

      return Promise.all([topicsPromise, usersPromise])
    })
    .then(() => {
      const formattedarticles = articles.map(convertTimestampToDate)
      const insertArticlesQueryStr = format(
        'INSERT INTO articles (title, topic, author, body, created_at, vote_count, article_img_url) VALUES %L RETURNING *;',
        formattedarticles.map(
          ({ title, topic, author, body, created_at, vote_count = 0, article_img_url }) => [
            title,
            topic,
            author,
            body,
            created_at,
            vote_count,
            article_img_url,
          ]
        )
      )

      return db.query(insertArticlesQueryStr)
    })
    .then(({ rows: articleRows }) => {
      const articleIdLookup = createRef(articleRows, 'title', 'article_id')
      const formattedcomments = formatComments(comments, articleIdLookup)

      const insertCommentsQueryStr = format(
        'INSERT INTO comments (body, author, article_id, vote_count, created_at) VALUES %L;',
        formattedcomments.map(({ body, author, article_id, vote_count = 0, created_at }) => [
          body,
          author,
          article_id,
          vote_count,
          created_at,
        ])
      )
      return db.query(insertCommentsQueryStr)
    })
}

module.exports = seed
