const Comment = require('../models/Comment')

exports.deleteComment = async (req, res, next) => {
  const { id } = req.params

  try {
    const hasDeleted = await Comment.deleteById(id)
    if (!hasDeleted) return res.sendStatus(404)

    return res.sendStatus(204)
  } catch (err) {
    return res.sendStatus(400)
  }
}
