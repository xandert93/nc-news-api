const fs = require('fs/promises')

const getEndpoints = async (req, res) => {
  const endpointLookupStr = await fs.readFile('./endpoints.json')

  return res.json({ api: JSON.parse(endpointLookupStr) })
}

module.exports = getEndpoints
