const Comment = require('../models/Comment')

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
