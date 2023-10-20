const express = require('express')

const {
  getArticle,
  getArticles,
  updateArticleVoteCount,
} = require('../controllers/article-controller.js')

const router = express.Router()

router.route('/').get(getArticles)
router.route('/:id').get(getArticle)
router.patch('/:id/vote_count', updateArticleVoteCount)

module.exports = router
