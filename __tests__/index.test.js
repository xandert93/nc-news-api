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
  it('GET:404 issues a response with `cannot GET` message', async () => {
    const res = await request(app).get('/api/not-a-route').expect(404)

    const errMessage = res.error.message

    expect(errMessage).toBe('cannot GET /api/not-a-route (404)')
  })
})

describe('/api/topics', () => {
  it('GET:200 issues a response where res.body.topics returns an array of topics', async () => {
    const res = await request(app).get('/api/topics').expect(200)
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

  describe('GET:200 allows articles to be filtered by topic', () => {
    it('returning matching topics for a present search term', async () => {
      const res = await request(app).get('/api/articles?topic=mitch').expect(200)
      const { articles } = res.body

      const filteredArticles = testArticles
        .filter((article) => article.topic === 'mitch')
        .sort((a1, a2) => a2.created_at - a1.created_at)
        .map((article) => {
          const articleCopy = { ...article }
          delete articleCopy.body
          delete articleCopy.created_at

          return articleCopy
        })

      articles.forEach((article, i) => {
        expect(article).toMatchObject(filteredArticles[i])
      })
    })

    it('returning no topics for an absent search term', async () => {
      const res = await request(app).get('/api/articles?topic=NoSuchTopicBro').expect(200)
      const { articles } = res.body

      expect(articles).toHaveLength(0)
    })

    it('returning all articles for an invalid query parameter', async () => {
      const res = await request(app).get('/api/articles?topi=banana').expect(200)
      const { articles } = res.body

      const actualArticles = [...testArticles]
        .sort((a1, a2) => a2.created_at - a1.created_at)
        .map((article) => {
          const articleCopy = { ...article }
          delete articleCopy.body
          delete articleCopy.created_at

          return articleCopy
        })

      expect(articles).toMatchObject(actualArticles)
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

describe('/api/articles/:id/vote_count', () => {
  it('PATCH:200 issues a response with a database-updated article, where `.vote_count` is incremented by increment', async () => {
    const testArticle = testArticles[0]

    const reqBody = { vote_increment: 3 }

    const res = await request(app)
      .patch('/api/articles/1/vote_count')
      .send(reqBody)
      .expect(200)

    const { article } = res.body

    expect(article).toEqual({
      id: 1,
      ...testArticle,
      created_at: article.created_at, // no way to avoid
      vote_count: testArticle.vote_count + reqBody.vote_increment,
    })
  })

  it('PATCH:400 (insufficient request body) issues a response with `Bad Request` error text', async () => {
    const reqBody = {}

    const res = await request(app)
      .patch('/api/articles/1/vote_count')
      .send(reqBody)
      .expect(400)

    const errText = res.error.text
    expect(errText).toBe('Bad Request')
  })

  it('PATCH:400 (inappropriate request body) issues a response with `Bad Request` error text', async () => {
    const reqBody = { vote_increment: 'banana' }

    const res = await request(app)
      .patch('/api/articles/1/vote_count')
      .send(reqBody)
      .expect(400)

    const errText = res.error.text
    expect(errText).toBe('Bad Request')
  })

  it('PATCH:400 (invalid ID) issues a response with `Bad Request` error text', async () => {
    const reqBody = {}

    const res = await request(app)
      .patch('/api/articles/not-an-id/vote_count')
      .send(reqBody)
      .expect(400)

    const errText = res.error.text
    expect(errText).toBe('Bad Request')
  })

  it('PATCH:404 (valid, but non-existent ID) issues a response with `Not Found` error text', async () => {
    const reqBody = {}

    const res = await request(app)
      .patch('/api/articles/10000/vote_count')
      .send(reqBody)
      .expect(404)

    const errText = res.error.text
    expect(errText).toBe('Not Found')
  })
})

describe('/api/articles/:id/comments', () => {
  describe('GET:200 issues a response with comments that', () => {
    let comments

    beforeEach(async () => {
      const res = await request(app).get('/api/articles/1/comments').expect(200)
      comments = res.body.comments
    })

    it('have a matching article_id', () => {
      const testArticleId = 1

      const matchingCommentCount = testComments.filter((comment) => {
        return comment.article_id === testArticleId
      }).length

      expect(comments).toHaveLength(matchingCommentCount)

      comments.forEach((comment) => {
        expect(comment.article_id).toBe(testArticleId)
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
        (comment1, comment2) => comment2.created_at - comment1.created_at
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
    const res = await request(app).get('/api/articles/10000/comments').expect(404)

    const errText = res.error.text
    expect(errText).toBe('Not Found')
  })

  it('POST:201 issues a response with a database-created comment', async () => {
    const reqBody = { username: testUsers[0].username, body: 'Nice article!' }

    const res = await request(app)
      .post('/api/articles/1/comments')
      .send(reqBody)
      .expect(201)

    const { comment } = res.body

    expect(comment).toEqual({
      id: testComments.length + 1,
      article_id: 1,
      vote_count: 0,
      created_at: comment.created_at, // only way to do this - can't do `new Date(Date.now()).toISOString()`, because it'll always be slightly off the time it was created on DB
      author: reqBody.username,
      body: reqBody.body,
    })
  })

  it('POST:400 (insufficient request body) issues a response with `Bad Request` error text', async () => {
    const reqBody = { username: testUsers[0].username }

    const res = await request(app)
      .post('/api/articles/1/comments')
      .send(reqBody)
      .expect(400)

    const errText = res.error.text
    expect(errText).toBe('Bad Request')
  })
})

describe('/api/users', () => {
  it('GET:200 issues a response where res.body.users returns users', async () => {
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

describe('/api/comments/:id', () => {
  it('DELETE:204 issues a response with no content', async () => {
    return await request(app).delete('/api/comments/1').expect(204)
  })

  it('DELETE:400 (invalid ID) issues a response with `Bad Request` error text', async () => {
    const res = await request(app).delete('/api/comments/a').expect(400)

    const errText = res.error.text
    expect(errText).toBe('Bad Request')
  })

  it('DELETE:404 (valid ID, not found) issues a response with `Not Found` error text', async () => {
    const res = await request(app).delete('/api/comments/10000').expect(404)

    const errText = res.error.text
    expect(errText).toBe('Not Found')
  })
})
