const Topic = require('../models/Topic.js')

exports.getTopics = async (req, res) => {
  const foundTopics = await Topic.findMany()

  return res.json({ topics: foundTopics })
}
