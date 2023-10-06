const express = require('express')
const { deleteComment } = require('../controllers/comment-controller.js')

const router = express.Router()

router.route('/:id').delete(deleteComment)

module.exports = router
