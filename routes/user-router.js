const express = require('express')
const { getUsers, getUserByUsername } = require('../controllers/user-controller.js')

const router = express.Router()

router.route('/').get(getUsers)
router.route('/:username').get(getUserByUsername)

module.exports = router
