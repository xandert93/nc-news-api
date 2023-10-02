const fs = require('fs/promises')

const getEndpoints = async (req, res) => {
  const endpointLookupStr = await fs.readFile('./endpoints.json')

  return res.status(200).json({ api: JSON.parse(endpointLookupStr) })
}

module.exports = getEndpoints
