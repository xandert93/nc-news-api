const express = require('express')
const {
  deleteArticleComment,
  getArticleComments,
  createArticleComment,
  updateArticleCommentVoteCount,
} = require('../controllers/comment-controller.js')

const router = express.Router()

router.route('/').post(createArticleComment)
router.route('/:id').delete(deleteArticleComment)
router.route('/:id/vote_count').patch(updateArticleCommentVoteCount)

router.route('/article_id/:article_id').get(getArticleComments)

module.exports = router
