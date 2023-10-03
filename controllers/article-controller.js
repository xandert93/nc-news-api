const Article = require('../models/Article.js')

exports.getArticle = async (req, res) => {
  const { id } = req.params

  try {
    const foundArticle = await Article.findById(id)
    if (!foundArticle) return res.sendStatus(404)

    return res.json({ article: foundArticle })
  } catch (err) {
    return res.sendStatus(400)
  }
}
