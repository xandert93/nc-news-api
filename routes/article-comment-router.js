const express = require('express')
const {
  deleteComment,
  getArticleComments,
  createArticleComment,
} = require('../controllers/comment-controller.js')

const router = express.Router()

router.route('/').post(createArticleComment)
router.route('/:id').delete(deleteComment)

router.route('/article_id/:article_id').get(getArticleComments)

module.exports = router
