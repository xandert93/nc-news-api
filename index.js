const express = require('express')

const getEndpoints = require('./controllers/endpoint-controller.js')

const { topicRouter, articleRouter, userRouter, commentRouter } = require('./routes')

const app = express()
app.use(express.json())

app.get('/api', getEndpoints)
app.use('/api/topics', topicRouter)
app.use('/api/articles', articleRouter)
app.use('/api/comments', commentRouter)
app.use('/api/users', userRouter)

app.use((err, req, res, next) => {
  console.log(err.message)
})

module.exports = app
