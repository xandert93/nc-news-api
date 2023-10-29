const db = require('../db/connection')

class User {
  static async find() {
    return db('users')
  }

  static async findByUsername(username) {
    return db('users').where({ username }).first()
  }
}

module.exports = User
