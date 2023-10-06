const express = require('express')
const { getTopics } = require('../controllers/topic-controller.js')

const router = express.Router()

router.route('/').get(getTopics)

module.exports = router
