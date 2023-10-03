const Article = require('../models/Article.js')
const Comment = require('../models/Comment.js')

exports.getAllArticles = async (req, res) => {
  const {} = req.query

  try {
    const foundArticles = await Article.findMany()
    return res.json({ articles: foundArticles })
  } catch (err) {
    console.log(err)
  }
}

exports.getArticle = async (req, res) => {
  const { id } = req.params

  try {
    const foundArticle = await Article.findById(id)
    if (!foundArticle) return res.sendStatus(404)

    return res.json({ article: foundArticle })
  } catch (err) {
    return res.sendStatus(400)
  }
}

exports.getAllArticleComments = async (req, res) => {
  const { id } = req.params

  try {
    const foundComments = await Comment.findManyByArticleId(id)
    if (!foundComments.length) return res.sendStatus(404)

    return res.json({ comments: foundComments })
  } catch (err) {
    return res.sendStatus(400)
  }
}

exports.createArticleComment = async (req, res) => {
  const { id } = req.params
  const newComment = req.body

  try {
    const createdComment = await Comment.createOne(id, newComment)
    return res.status(201).json({ comment: createdComment, message: 'Comment created!' })
  } catch (err) {
    return res.sendStatus(400)
  }
}
