const Article = require('../models/Article.js')
const Comment = require('../models/Comment.js')
const { BadReqError } = require('../utils/error-types.js')

exports.getArticles = async (req, res, next) => {
  const validQueries = ['topic']

  for (const key in req.query) {
    if (!validQueries.includes(key)) {
      next(new BadReqError(`${key} is not a valid query parameter`))
    }
  }

  try {
    const foundArticles = await Article.findMany(req.query.topic)

    res.json({ articles: foundArticles })
  } catch (err) {
    return next(err)
  }
}

exports.getArticle = async (req, res, next) => {
  const { id } = req.params

  try {
    const foundArticle = await Article.findById(id)

    res.json({ article: foundArticle })
  } catch (err) {
    next(err)
  }
}

exports.updateArticleVoteCount = async (req, res, next) => {
  const { id } = req.params
  const incVal = req.body.vote_increment

  try {
    const updatedArticle = await Article.updateVoteCountById(id, incVal)

    res.json({ article: updatedArticle })
  } catch (err) {
    next(err)
  }
}

exports.getArticleComments = async (req, res, next) => {
  const { id } = req.params

  try {
    await Article.findById(id) // ensure it exists prior
    const foundComments = await Comment.findManyByArticleId(id)

    return res.json({ comments: foundComments })
  } catch (err) {
    next(err)
  }
}

exports.createArticleComment = async (req, res, next) => {
  const { id } = req.params
  const newComment = req.body

  try {
    const createdComment = await Comment.createOne(id, newComment)

    return res.status(201).json({ comment: createdComment, message: 'Comment created!' })
  } catch (err) {
    next(err)
  }
}
