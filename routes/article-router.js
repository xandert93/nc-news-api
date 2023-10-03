const express = require('express')

const { getArticle } = require('../controllers/article-controller')

const router = express.Router()

router.route('/:id').get(getArticle)

module.exports = router
