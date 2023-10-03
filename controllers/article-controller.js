const Article = require('../models/Article.js')

exports.getAllArticles = async (req, res) => {
  const {} = req.query

  try {
    const foundArticles = await Article.findMany()
    return res.json({ articles: foundArticles })
  } catch (err) {
    console.log(err)
  }
}

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
