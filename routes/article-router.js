const express = require('express')

const {
  getArticle,
  getArticles,
  getArticleComments,
  createArticleComment,
  updateArticleVoteCount,
} = require('../controllers/article-controller.js')

const router = express.Router()

router.route('/').get(getArticles)

router.route('/:id').get(getArticle)

router.patch('/:id/vote_count', updateArticleVoteCount)

router.route('/:id/comments').get(getArticleComments).post(createArticleComment)

module.exports = router
