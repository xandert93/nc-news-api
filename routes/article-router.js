const express = require('express')

const {
  getArticle,
  getArticles,
  updateArticleRating,
  createArticle,
  getArticleComments,
} = require('../controllers/article-controller.js')

const router = express.Router()

router.route('/').get(getArticles).post(createArticle)

router.route('/:id').get(getArticle)
router.get('/:id/comments', getArticleComments)

router.patch('/:id/vote_count', updateArticleRating)

module.exports = router
