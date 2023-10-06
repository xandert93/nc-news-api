const express = require('express')
const { getUsers } = require('../controllers/user-controller.js')

const router = express.Router()

router.route('/').get(getUsers)

module.exports = router
