const Comment = require('../models/Comment')

exports.deleteComment = async (req, res, next) => {
  const { id } = req.params

  try {
    await Comment.deleteById(id)

    return res.sendStatus(204)
  } catch (err) {
    next(err)
  }
}
