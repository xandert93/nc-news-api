const express = require('express')

const getEndpoints = require('./controllers/endpoint-controller.js')
const { topicRouter } = require('./routes')

const app = express()

app.get('/api', getEndpoints)
app.use('/api/topics', topicRouter)

module.exports = app
