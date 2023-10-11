const Article = require('../models/Article.js')
const Comment = require('../models/Comment.js')
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

exports.getArticleComments = async (req, res) => {
  const { id } = req.params

  await Article.findById(id) // ensure it exists prior
  const foundComments = await Comment.findManyByArticleId(id)

  return res.json({ comments: foundComments })
}

exports.createArticleComment = async (req, res) => {
  const { id } = req.params
  const newComment = req.body

  const createdComment = await Comment.createOne(id, newComment)

  return res.status(201).json({ comment: createdComment, message: 'Comment created!' })
}
