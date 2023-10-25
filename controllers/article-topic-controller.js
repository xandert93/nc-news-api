const ArticleTopic = require('../models/ArticleTopic.js')

exports.getTopics = async (req, res) => {
  const foundTopics = await ArticleTopic.findMany()

  return res.json({ topics: foundTopics })
}
