const express = require('express')

const { getArticle, getAllArticles } = require('../controllers/article-controller.js')

const router = express.Router()

router.route('/').get(getAllArticles)
router.route('/:id').get(getArticle)

module.exports = router
