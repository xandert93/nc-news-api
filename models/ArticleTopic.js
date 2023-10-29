const db = require('../db/connection.js')

class ArticleTopic {
  static async find() {
    return db('article_topics')
  }
}

module.exports = ArticleTopic
