const ArticleComment = require('../models/ArticleComment')

exports.createArticleComment = async (req, res) => {
  const newComment = req.body

  const createdComment = await ArticleComment.create(newComment)

  return res.status(201).json({ comment: createdComment, message: 'Comment created!' })
}

exports.deleteArticleComment = async (req, res) => {
  const { id } = req.params

  await ArticleComment.delete(id)
  return res.sendStatus(204)
}

exports.updateArticleCommentRating = async (req, res) => {
  const { id } = req.params
  const { incVal } = req.body

  const updatedComment = await ArticleComment.updateVoteCount(id, incVal)
  return res.json({ comment: updatedComment })
}
