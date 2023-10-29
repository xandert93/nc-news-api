const db = require('./connection')

const deleteArticleCommentsTable = () => {
  return db.schema.dropTableIfExists('article_comments')
}

const deleteArticlesTable = () => {
  return db.schema.dropTableIfExists('articles')
}

const deleteUsersTable = () => {
  return db.schema.dropTableIfExists('users')
}
const deleteArticleTopicsTable = () => {
  return db.schema.dropTableIfExists('article_topics')
}

const createUsersTable = () => {
  return db.schema.createTable('users', (table) => {
    table.string('username', 255).primary()
    table.string('first_name', 255).notNullable()
    table.string('last_name', 255).notNullable()
    table.string('avatar_url', 255)
    table.timestamp('created_at').defaultTo(db.fn.now())
  })
}

const createTopicsTable = () => {
  return db.schema.createTable('article_topics', (table) => {
    table.string('name', 20).primary()
    table.string('description', 100)
  })
}

const defaultArticleImgUrl =
  'https://images.pexels.com/photos/97050/pexels-photo-97050.jpeg?w=700&h=700'

const createArticlesTable = () => {
  return db.schema.createTable('articles', (table) => {
    table.increments('id').primary()
    table.string('author', 255).notNullable().references('username').inTable('users')
    table.string('title', 255).notNullable()
    table.string('topic', 255).notNullable().references('name').inTable('article_topics')
    table.text('body').notNullable()
    table.string('image_url', 255).defaultTo(defaultArticleImgUrl)
    table.integer('vote_count').defaultTo(0)
    table.timestamp('created_at').defaultTo(db.fn.now())
  })
}

const createCommentsTable = () => {
  return db.schema.createTable('article_comments', (table) => {
    table.increments('id').primary()
    table.integer('article_id').notNullable().references('id').inTable('articles')
    table.string('author', 255).notNullable().references('username').inTable('users')
    table.text('body').notNullable()
    table.integer('vote_count').defaultTo(0)
    table.timestamp('created_at').defaultTo(db.fn.now())
  })
}

module.exports = {
  deleteArticleCommentsTable,
  deleteArticlesTable,
  deleteUsersTable,
  deleteArticleTopicsTable,
  createTopicsTable,
  createUsersTable,
  createArticlesTable,
  createCommentsTable,
}
