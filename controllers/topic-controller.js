const Topic = require('../models/Topic.js')

exports.getAllTopics = async (req, res) => {
  const foundTopics = await Topic.findMany()

  return res.json({ topics: foundTopics })
}
