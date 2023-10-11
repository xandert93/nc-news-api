const request = require('supertest')

const testData = require('../../../db/data/test-data')

const app = require('../../../index.js')
const seed = require('../../../db/seeds/seed.js')
const db = require('../../../db/connection.js')

beforeEach(() => seed(testData))
afterAll(() => db.end())

describe('/api/comments/:id', () => {
  it('DELETE:204 responds with no content', async () => {
    return await request(app).delete('/api/comments/1').expect(204)
  })

  it('DELETE:400 (invalid ID) responds with "Bad Request" error text', async () => {
    const res = await request(app).delete('/api/comments/a').expect(400)

    expect(res.body.message).toMatch(/invalid input syntax for type integer/)
  })

  it('DELETE:404 (valid ID, not found) responds with a "Not Found" error message', async () => {
    const res = await request(app).delete('/api/comments/10000').expect(404)

    expect(res.body.message).toBe('That comment does not exist')
  })
})
