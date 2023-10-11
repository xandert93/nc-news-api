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

describe('/api/topics', () => {
  it('GET:200 responds with where res.body.topics returns an array of topics', async () => {
    const res = await request(app).get('/api/topics').expect(200)
    const { topics } = res.body

    expect(topics).toHaveLength(testTopics.length) // ensure it contains some data!

    topics.forEach((topic) => {
      expect(typeof topic.description).toBe('string')
      expect(typeof topic.slug).toBe('string')
    })
  })
})
