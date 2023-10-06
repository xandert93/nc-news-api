const db = require('../db/connection.js')
const { NotFoundError } = require('../utils/error-types.js')

class Topic {
  static async findMany() {
    const result = await db.query(`
      SELECT * FROM topics;
    `)

    return result.rows
  }

  static async findById(id) {
    const result = await db.query(
      `
      SELECT * FROM topics
      WHERE id = $1;
    `,
      [id]
    )

    const foundTopic = result.rows[0]

    if (!foundTopic) throw new NotFoundError('topic')

    return foundTopic
  }
}

module.exports = Topic
