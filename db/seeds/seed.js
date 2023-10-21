const db = require('../connection')
const { convertTimestampToDate, createRef, formatComments } = require('./utils')

const {
  createTopicsTable,
  createUsersTable,
  createArticlesTable,
  createCommentsTable,
} = require('../tables.js')

const {
  insertTopics,
  insertUsers,
  insertArticles,
  insertComments,
} = require('../seeders.js')

const seed = ({ topics, users, articles, comments }) => {
  return db
    .query(`DROP TABLE IF EXISTS comments`)
    .then(() => db.query(`DROP TABLE IF EXISTS articles`))
    .then(() => db.query(`DROP TABLE IF EXISTS users`))
    .then(() => db.query(`DROP TABLE IF EXISTS topics`))
    .then(createTopicsTable)
    .then(createUsersTable)
    .then(createArticlesTable)
    .then(createCommentsTable)
    .then(insertTopics(topics))
    .then(insertUsers(users))
    .then(insertArticles(articles))
    .then(insertComments(comments))
}

module.exports = seed
