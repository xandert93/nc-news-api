const Comment = require('../models/Comment')

exports.deleteComment = async (req, res) => {
  const { id } = req.params

  await Comment.deleteById(id)
  return res.sendStatus(204)
}
