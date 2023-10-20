const express = require('express')
const cors = require('cors')
require('express-async-errors')

const getEndpoints = require('./controllers/endpoint-controller.js')

const { topicRouter, articleRouter, userRouter, commentRouter } = require('./routes')

const {
  clientErrHandler,
  dbErrHandler,
  serverErrHandler,
} = require('./middleware/error-middleware.js')

const app = express()

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => res.send("Welcome to Xander's NC News API"))

app.get('/api', getEndpoints)
app.use('/api/topics', topicRouter)
app.use('/api/articles', articleRouter)
app.use('/api/comments', commentRouter)
app.use('/api/users', userRouter)

app.use(dbErrHandler)
app.use(clientErrHandler)
app.use(serverErrHandler)

module.exports = app
