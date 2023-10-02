const request = require('supertest')

const testData = require('../db/data/test-data')

const app = require('../index.js')
const seed = require('../db/seeds/seed.js')
const db = require('../db/connection.js')

const { checkIsObject } = require('../utils/validators.js')

beforeEach(() => seed(testData))
afterAll(() => db.end())

const {
  articles: testArticles,
  comments: testComments,
  topics: testTopics,
  users: testUsers,
} = testData

describe('/api', () => {
  it('GET issues a 200 response where res.body.endpoints returns an object describing all API endpoints', async () => {
    const res = await request(app).get('/api').expect(200)
    const { api } = res.body

    Object.values(api).forEach((endpoint) => {
      expect(typeof endpoint.description === 'string').toBe(true)
      expect(Array.isArray(endpoint.queries)).toBe(true)
      expect(checkIsObject(endpoint.exampleResponse)).toBe(true)
    })
  })
})

describe('/api/not-a-route', () => {
  it('GET issues a 404 response with `cannot GET` message', async () => {
    const res = await request(app).get('/api/not-a-route').expect(404)

    const errMessage = res.error.message
    expect(errMessage).toBe('cannot GET /api/not-a-route (404)')
  })
})

describe('/api/topics', () => {
  it('GET issues a 200 response where res.body.topics returns an array of topics', async () => {
    const res = await request(app).get('/api/topics')
    const { topics } = res.body

    expect(topics).toHaveLength(testTopics.length) // ensure it contains some data!

    topics.forEach((topic) => {
      expect(typeof topic.description).toBe('string')
      expect(typeof topic.slug).toBe('string')
    })
  })
})
