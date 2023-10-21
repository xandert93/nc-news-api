const User = require('../models/User')

exports.getUsers = async (req, res) => {
  const {} = req.query

  const foundUsers = await User.findMany()

  return res.json({ users: foundUsers })
}

exports.getUserByUsername = async (req, res) => {
  const { username } = req.params

  const foundUser = await User.findByUsername(username)

  return res.json({ user: foundUser })
}
