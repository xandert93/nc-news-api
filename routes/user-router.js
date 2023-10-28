const express = require('express')
const { getUsers, getUserByUsername } = require('../controllers/user-controller.js')
const { getArticlesByUsername } = require('../controllers/article-controller.js')

const router = express.Router()

router.route('/').get(getUsers)
router.route('/:username').get(getUserByUsername)
router.get('/:username/articles', getArticlesByUsername)

module.exports = router
