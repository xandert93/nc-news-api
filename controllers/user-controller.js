const User = require('../models/User')

exports.getUsers = async (req, res) => {
  const {} = req.query

  const foundUsers = await User.findMany()

  return res.json({ users: foundUsers })
}
