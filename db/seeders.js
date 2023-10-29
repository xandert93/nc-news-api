const db = require('./connection')
const { createRef, formatComments, convertTimestampToDate } = require('./seeds/utils')

/* 🔥 with Knex, we don't need pg-format to generate parameterised queries. Knex does this out of the box (cleaner code and more secure against SQL injection ✅).

With Knex, pass the array of entities to .insert() (or other query builder methods), and Knex handles the parameterisation and query formatting.
*/

const insertTopics = (topics) => {
  return db('article_topics').insert(topics)
}

const insertUsers = (users) => {
  return db('users').insert(users)
}

const insertArticles = (articles) => {
  const formattedArticles = articles.map(convertTimestampToDate)

  return db('articles').insert(formattedArticles).returning('*')
}

const insertComments = (comments, insertedArticles) => {
  const articleIdLookup = createRef(insertedArticles, 'title', 'id')
  const formattedComments = formatComments(comments, articleIdLookup)

  return db('article_comments').insert(formattedComments)
}

module.exports = {
  insertTopics,
  insertUsers,
  insertArticles,
  insertComments,
}
