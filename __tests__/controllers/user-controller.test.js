const request = require('supertest')

const testData = require('../../../db/data/test-data')

const app = require('../../../index.js')
const seed = require('../../../db/seeds/seed.js')
const db = require('../../../db/connection.js')

beforeEach(() => seed(testData))
afterAll(() => db.end())

const {
  articles: testArticles,
  comments: testComments,
  topics: testTopics,
  users: testUsers,
} = testData

describe('/api/users', () => {
  it('GET:200 responds with where res.body.users returns users', async () => {
    const res = await request(app).get('/api/users').expect(200)
    const { users } = res.body

    const propTypes = {
      username: 'string',
      name: 'string',
      avatar_url: 'string',
    }

    users.forEach((user) => {
      for (const key in propTypes) {
        expect(typeof user[key]).toBe(propTypes[key])
      }
    })
  })
})
