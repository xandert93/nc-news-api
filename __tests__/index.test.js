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
    const { api } = res.body

    Object.values(api).forEach((endpoint) => {
      expect(typeof endpoint.description === 'string').toBe(true)
      expect(Array.isArray(endpoint.queries)).toBe(true)
      expect(checkIsObject(endpoint.exampleResponse)).toBe(true)
    })
  })
})

describe('/api/not-a-route', () => {
  it('GET:404 issues a response with `cannot GET` message', async () => {
    const res = await request(app).get('/api/not-a-route').expect(404)

    const errMessage = res.error.message

    expect(errMessage).toBe('cannot GET /api/not-a-route (404)')
  })
})

describe('/api/topics', () => {
  it('GET:200 issues a response where res.body.topics returns an array of topics', async () => {
    const res = await request(app).get('/api/topics')
    const { topics } = res.body

    expect(topics).toHaveLength(testTopics.length) // ensure it contains some data!

    topics.forEach((topic) => {
      expect(typeof topic.description).toBe('string')
      expect(typeof topic.slug).toBe('string')
    })
  })
})

describe('/api/articles', () => {
  it('GET:200 issues a response where res.body.articles returns articles', async () => {
    const res = await request(app).get('/api/articles').expect(200)
    const { articles } = res.body

    const propTypes = {
      id: 'number',
      author: 'string',
      title: 'string',
      topic: 'string',
      created_at: 'string',
      vote_count: 'number',
      img_url: 'string',
      comment_count: 'number',
    }

    articles.forEach((article) => {
      for (const key in propTypes) {
        expect(typeof article[key]).toBe(propTypes[key])
      }
    })
  })
})

describe('/api/articles/:id', () => {
  it('GET:200 issues a response where res.body.article returns the matching article', async () => {
    const res = await request(app).get('/api/articles/1').expect(200)
    const { article } = res.body

    expect(article).toEqual({
      id: 1,
      author: 'butter_bridge',
      title: 'Living in the shadow of a great man',
      topic: 'mitch',
      body: 'I find this existence challenging',
      created_at: '2020-07-09T20:11:00.000Z', // hard to replicate programatically
      vote_count: 100,
      img_url:
        'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
    })
  })

  it('GET:400 (invalid ID) issues a response with `Bad Request` error text', async () => {
    const res = await request(app).get('/api/articles/a').expect(400)

    const errText = res.error.text
    expect(errText).toBe('Bad Request')
  })

  it('GET:404 (valid ID, not found) issues a response with `Not Found` error text', async () => {
    const res = await request(app).get('/api/articles/10000').expect(404)

    const errText = res.error.text
    expect(errText).toBe('Not Found')
  })
})

describe('/api/articles/:id/comments', () => {
  describe('GET:200 issues a response with comments that', () => {
    let comments

    beforeEach(async () => {
      const res = await request(app).get('/api/articles/1/comments')
      comments = res.body.comments
    })

    it('have a matching article_id', () => {
      comments.forEach((comment) => {
        expect(comment.article_id).toBe(1)
      })
    })

    it('are of the correct shape', () => {
      const propTypes = {
        id: 'number',
        vote_count: 'number',
        created_at: 'string',
        author: 'string',
        body: 'string',
      }

      comments.forEach((comment) => {
        for (const key in propTypes) {
          expect(typeof comment[key]).toBe(propTypes[key])
        }
      })
    })

    it('are sorted by newest created', () => {
      const sortedComments = [...comments].sort(
        (comment1, comment2) => comment2.createdAt - comment1.createdAt
      )

      expect(sortedComments).toEqual(comments)
    })
  })

  it('GET:400 (invalid ID) issues a response with `Bad Request` error text', async () => {
    const res = await request(app).get('/api/articles/a/comments').expect(400)

    const errText = res.error.text
    expect(errText).toBe('Bad Request')
  })

  it('GET:404 (valid ID, not found) issues a response with `Not Found` error text', async () => {
    const res = await request(app)
      .get('/api/articles/10000/comments')
      .expect(404)

    const errText = res.error.text
    expect(errText).toBe('Not Found')
  })
})
