const db = require('./connection')

function createUsersTable() {
  return db.query(`
        CREATE TABLE users (
          username VARCHAR(255) PRIMARY KEY,
          first_name VARCHAR(255) NOT NULL,
          last_name VARCHAR(255) NOT NULL,
          avatar_url VARCHAR(255),
          created_at TIMESTAMP DEFAULT NOW()
        )`)
}

function createTopicsTable() {
  return db.query(`
    CREATE TABLE article_topics (
      name VARCHAR(20) PRIMARY KEY,
      description VARCHAR(100)
    )`)
}

function createArticlesTable() {
  return db.query(`
        CREATE TABLE articles (
          id SERIAL PRIMARY KEY,
          author VARCHAR(255) NOT NULL REFERENCES users(username),
          title VARCHAR(255) NOT NULL,
          topic VARCHAR(255) NOT NULL REFERENCES article_topics(name),
          body VARCHAR NOT NULL,
          image_url VARCHAR(255) DEFAULT 'https://images.pexels.com/photos/97050/pexels-photo-97050.jpeg?w=700&h=700',
          upvote_count INT DEFAULT 0,
          created_at TIMESTAMP DEFAULT NOW()
        );`)
}

function createCommentsTable() {
  return db.query(`
        CREATE TABLE article_comments (
          id SERIAL PRIMARY KEY,
          article_id INT REFERENCES articles(id) NOT NULL,
          author VARCHAR(255) REFERENCES users(username) NOT NULL,
          body VARCHAR NOT NULL,      
          upvote_count INT DEFAULT 0,
          created_at TIMESTAMP DEFAULT NOW()
        );`)
}

module.exports = {
  createTopicsTable,
  createUsersTable,
  createArticlesTable,
  createCommentsTable,
}
