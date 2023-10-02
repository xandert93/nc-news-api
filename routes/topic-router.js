const express = require('express')
const { getAllTopics } = require('../controllers/topic-controller.js')

const router = express.Router()

router.route('/').get(getAllTopics)

module.exports = router
