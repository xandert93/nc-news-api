const express = require('express')

const { topicRouter } = require('./routes/index.js')

const app = express()

app.use('/api/topics', topicRouter)

module.exports = app
