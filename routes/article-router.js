const express = require('express')

const {
  getArticle,
  getAllArticles,
  getAllArticleComments,
  createArticleComment,
} = require('../controllers/article-controller.js')

const router = express.Router()

router.route('/').get(getAllArticles)
router.route('/:id').get(getArticle)
router.route('/:id/comments').get(getAllArticleComments).post(createArticleComment)

module.exports = router
