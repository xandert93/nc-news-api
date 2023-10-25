const express = require('express')
const {
  deleteArticleComment,
  createArticleComment,
  updateArticleCommentRating,
} = require('../controllers/article-comment-controller.js')

const router = express.Router()

router.route('/').post(createArticleComment)

router.route('/:id').delete(deleteArticleComment)

router.route('/:id/vote_count').patch(updateArticleCommentRating)

module.exports = router
