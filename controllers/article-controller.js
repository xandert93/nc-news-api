const Article = require('../models/Article.js')
const ArticleComment = require('../models/ArticleComment.js')

const { BadReqError, NotFoundError } = require('../utils/error-types.js')

exports.getArticles = async (req, res) => {
  const validQueries = ['topic']

  for (const key in req.query) {
    if (!validQueries.includes(key)) {
      const errMessage = `${key} is not a valid query parameter`
      throw new BadReqError(errMessage)
    }
  }

  const foundArticles = await Article.findMany(req.query.topic)

  return res.json({ articles: foundArticles })
}

exports.getArticlesByUsername = async (req, res) => {
  const { username } = req.params

  const foundArticles = await Article.findManyByUsername(username)

  return res.json({ articles: foundArticles })
}

exports.createArticle = async (req, res) => {
  const newArticle = req.body

  const insertedArticle = await Article.createOne(newArticle)

  return res.json({ article: insertedArticle })
}

exports.getArticle = async (req, res) => {
  const { id } = req.params

  const foundArticle = await Article.findById(id)

  return res.json({ article: foundArticle })
}

exports.updateArticleRating = async (req, res) => {
  const { id } = req.params
  const { incVal } = req.body

  const updatedArticle = await Article.updateVoteCountById(id, incVal)

  return res.json({ article: updatedArticle })
}

exports.getArticleComments = async (req, res) => {
  const { id } = req.params

  await Article.findById(id) // ⚠️ ensure it exists prior
  const foundComments = await ArticleComment.findManyByArticleId(id)

  return res.json({ comments: foundComments })
}
