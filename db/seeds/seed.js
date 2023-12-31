const {
  createArticleTopicsTable,
  createUsersTable,
  createArticlesTable,
  createArticleCommentsTable,
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
    .then(createArticleTopicsTable)
    .then(createUsersTable)
    .then(createArticlesTable)
    .then(createArticleCommentsTable)
    .then(() => insertTopics(topics))
    .then(() => insertUsers(users))
    .then(() => insertArticles(articles))
    .then((insertedArticles) => insertComments(comments, insertedArticles))
}

module.exports = seed
