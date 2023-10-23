const Article = require('../models/Article')
const ArticleComment = require('../models/ArticleComment')

exports.createArticleComment = async (req, res) => {
  const newComment = req.body

  const createdComment = await ArticleComment.createOne(newComment)

  return res
    .status(201)
    .json({ comment: createdComment, message: 'ArticleComment created!' })
}

exports.getArticleComments = async (req, res) => {
  const { article_id } = req.params

  await Article.findById(article_id) // ensure it exists prior
  const foundComments = await ArticleComment.findManyByArticleId(article_id)

  return res.json({ comments: foundComments })
}

exports.deleteArticleComment = async (req, res) => {
  const { id } = req.params

  await ArticleComment.deleteById(id)
  return res.sendStatus(204)
}

exports.updateArticleCommentVoteCount = async (req, res) => {
  const { id } = req.params
  const incVal = req.body.vote_count_incVal

  const updatedComment = await ArticleComment.updateVoteCountById(id, incVal)
  return res.json({ comment: updatedComment })
}
