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

describe('/api/articles', () => {
  it('GET:200 responds with where res.body.articles returns articles', async () => {
    const res = await request(app).get('/api/articles').expect(200)
    const { articles } = res.body

    const propTypes = {
      id: 'number',
      author: 'string',
      title: 'string',
      topic: 'string',
      created_at: 'string',
      vote_count: 'number',
      image_url: 'string',
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
  })

  it('GET:400 (invalid query parameter) responds with a "Bad Request" error message', async () => {
    const res = await request(app).get('/api/articles?topi=banana').expect(400)

    expect(res.body.message).toBe('topi is not a valid query parameter')
  })
})

describe('/api/articles/:id', () => {
  describe('GET:200 responds with where res.body.article returns', () => {
    it('the matching article', async () => {
      const res = await request(app).get('/api/articles/1').expect(200)
      const { article } = res.body

      expect(article).toMatchObject({
        author: 'butter_bridge',
        title: 'Living in the shadow of a great man',
        topic: 'mitch',
        body: 'I find this existence challenging',
        vote_count: 100,
        image_url:
          'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
      })
    })

    it('the matching article with its aggregated comment_count', async () => {
      const res = await request(app).get('/api/articles/1').expect(200)
      const commentCount = res.body.article.comment_count

      const actualCommentCount = testComments.filter((comment) => {
        return comment.article_id === 1
      }).length

      expect(commentCount).toEqual(actualCommentCount)
    })
  })

  it('GET:400 (invalid ID) responds with a "Bad Request" error message', async () => {
    const res = await request(app).get('/api/articles/a').expect(400)

    expect(res.body.message).toMatch(/invalid input syntax for type integer/)
  })

  it('GET:404 (valid ID, not found) responds with a "Not Found" error message', async () => {
    const res = await request(app).get('/api/articles/10000').expect(404)

    expect(res.body.message).toBe('That article does not exist')
  })
})

describe('/api/articles/:id/vote_count', () => {
  it('PATCH:200 responds with a database-updated article, where `.vote_count` is incremented by increment', async () => {
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

  it('PATCH:400 (insufficient request body) responds with a "Bad Request" error message', async () => {
    const reqBody = {}

    const res = await request(app)
      .patch('/api/articles/1/vote_count')
      .send(reqBody)
      .expect(400)

    expect(res.body.message).toMatch(/violates not-null constraint/)
  })

  it('PATCH:400 (inappropriate request body) responds with a "Bad Request" error message', async () => {
    const reqBody = { vote_increment: 'banana' }

    const res = await request(app)
      .patch('/api/articles/1/vote_count')
      .send(reqBody)
      .expect(400)

    expect(res.body.message).toMatch(/invalid input syntax for type integer/)
  })

  it('PATCH:400 (invalid ID) responds with a "Bad Request" error message', async () => {
    const reqBody = {}

    const res = await request(app)
      .patch('/api/articles/not-an-id/vote_count')
      .send(reqBody)
      .expect(400)

    expect(res.body.message).toMatch(/invalid input syntax for type integer/)
  })

  it('PATCH:404 (valid, but non-existent ID) responds with a "Not Found" error message', async () => {
    const reqBody = {}

    const res = await request(app)
      .patch('/api/articles/10000/vote_count')
      .send(reqBody)
      .expect(404)

    expect(res.body.message).toBe('That article does not exist')
  })
})

describe('/api/articles/:id/comments', () => {
  describe('GET:200 responds with comments that', () => {
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

  it('GET:400 (invalid ID) responds with a "Bad Request" error message', async () => {
    const res = await request(app).get('/api/articles/a/comments').expect(400)

    expect(res.body.message).toMatch(/invalid input syntax for type integer/)
  })

  it('GET:404 (valid ID, not found) responds with a "Not Found" error message', async () => {
    const res = await request(app).get('/api/articles/10000/comments').expect(404)

    expect(res.body.message).toBe('That article does not exist')
  })

  it('POST:201 responds with a database-created comment', async () => {
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

  it('POST:400 (insufficient request body) responds with a "Bad Request" error message', async () => {
    const reqBody = { username: testUsers[0].username }

    const res = await request(app)
      .post('/api/articles/1/comments')
      .send(reqBody)
      .expect(400)

    expect(res.body.message).toMatch(/violates not-null constraint/)
  })
})
