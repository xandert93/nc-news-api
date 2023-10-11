const request = require('supertest')

const testData = require('../db/data/test-data')

const app = require('../index.js')
const seed = require('../db/seeds/seed.js')
const db = require('../db/connection.js')

const { checkIsObject } = require('../utils/validators.js')
const endpoints = require('../endpoints.json')

beforeEach(() => seed(testData))
afterAll(() => db.end())

const {
  articles: testArticles,
  comments: testComments,
  topics: testTopics,
  users: testUsers,
} = testData

describe('/api', () => {
  it('GET:200 response where res.body.endpoints returns an object describing all API endpoints', async () => {
    const res = await request(app).get('/api').expect(200)
    const { endpoints } = res.body

    Object.values(endpoints).forEach((endpoint) => {
      expect(typeof endpoint.description === 'string').toBe(true)
      expect(Array.isArray(endpoint.queries)).toBe(true)
      expect(checkIsObject(endpoint.exampleResponse)).toBe(true)
    })
  })
})

describe('/api/not-a-route', () => {
  it('GET:404 responds with `cannot GET` message', async () => {
    const res = await request(app).get('/api/not-a-route').expect(404)

    expect(res.error.message).toBe('cannot GET /api/not-a-route (404)')
  })
})
