const pg = require('pg')
const path = require('path')

// when Jest runs, it sets NODE_ENV=test. Else assume 'development'
const mode = process.env.NODE_ENV || 'development'
const isInProduction = mode === 'production'

require('dotenv').config({
  path: path.join(__dirname, `/../.env.${mode}`),
})

// prevent connection to default DB of `postgres`:
if (!process.env.PGDATABASE) throw new Error('PGDATABASE not set')

if (isInProduction && !process.env.PGDATABASE_URL) {
  throw new Error('Production PGDATABASE_URL not set')
}

const db = new pg.Pool({
  ...(isInProduction && {
    connectionString: process.env.PGDATABASE_URL,
    max: 2,
  }),
})

module.exports = db
