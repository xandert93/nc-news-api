const db = require('../connection')
const { convertTimestampToDate, createRef, formatComments } = require('./utils')

const {
  createTopicsTable,
  createUsersTable,
  createArticlesTable,
  createCommentsTable,
  deleteArticlesTable,
  deleteUsersTable,
  deleteArticleTopicsTable,
  deleteArticleCommentsTable,
} = require('../tables.js')

const {
  insertTopics,
  insertUsers,
  insertArticles,
  insertComments,
} = require('../seeders.js')

const seed = ({ topics, users, articles, comments }) => {
  return deleteArticleCommentsTable()
    .then(deleteArticlesTable)
    .then(deleteUsersTable)
    .then(deleteArticleTopicsTable)
    .then(createTopicsTable)
    .then(createUsersTable)
    .then(createArticlesTable)
    .then(createCommentsTable)
    .then(() => insertTopics(topics))
    .then(() => insertUsers(users))
    .then(() => insertArticles(articles))
    .then((insertedArticles) => insertComments(comments, insertedArticles))
}

module.exports = seed
