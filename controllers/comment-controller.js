const Article = require('../models/Article')
const Comment = require('../models/Comment')

exports.createArticleComment = async (req, res) => {
  const { article_id } = req.params
  const newComment = req.body

  const createdComment = await Comment.createOne(article_id, newComment)

  return res.status(201).json({ comment: createdComment, message: 'Comment created!' })
}

exports.getArticleComments = async (req, res) => {
  const { article_id } = req.params

  await Article.findById(article_id) // ensure it exists prior
  const foundComments = await Comment.findManyByArticleId(article_id)

  return res.json({ comments: foundComments })
}

exports.deleteComment = async (req, res) => {
  const { id } = req.params

  await Comment.deleteById(id)
  return res.sendStatus(204)
}

exports.updateCommentVoteCount = async (req, res) => {
  const { id } = req.params
  const incVal = req.body.vote_increment

  const updatedComment = await Comment.updateVoteCountById(id, incVal)
  return res.json({ comment: updatedComment })
}
