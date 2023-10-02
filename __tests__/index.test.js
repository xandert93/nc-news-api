const request = require('supertest')

const testData = require('../db/data/test-data/index.js')

const app = require('../index.js')
const seed = require('../db/seeds/seed.js')
const db = require('../db/connection.js')

beforeEach(() => seed(testData))
afterAll(() => db.end())

const {
  articles: testArticles,
  comments: testComments,
  topics: testTopics,
  users: testUsers,
} = testData

describe('GET @ /api/topics', () => {
  let req

  beforeEach(() => {
    req = request(app).get('/api/topics')
  })

  it('issues a 200 response', () => {
    return req.expect(200)
  })

  it('issues a response where res.body.topics returns an array', async () => {
    const res = await req
    const { topics } = res.body

    expect(Array.isArray(topics)).toBe(true)
  })

  it('issues a response where res.body.topics returns an array of topics', async () => {
    const res = await req
    const { topics } = res.body

    topics.forEach((topic) => {
      expect(typeof topic.description).toBe('string')
      expect(typeof topic.slug).toBe('string')
    })
  })
})
