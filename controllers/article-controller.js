const Article = require('../models/Article.js')

const { BadReqError } = require('../utils/error-types.js')

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

exports.updateArticleVoteCount = async (req, res) => {
  const { id } = req.params
  const incVal = req.body.vote_increment

  const updatedArticle = await Article.updateVoteCountById(id, incVal)

  return res.json({ article: updatedArticle })
}
