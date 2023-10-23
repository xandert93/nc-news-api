const express = require('express')

const {
  getArticle,
  getArticles,
  updateArticleVoteCount,
  createArticle,
} = require('../controllers/article-controller.js')

const router = express.Router()

router.route('/').get(getArticles).post(createArticle)
router.route('/:id').get(getArticle)
router.patch('/:id/upvote_count', updateArticleVoteCount)

module.exports = router
