const pg = require('pg')
const path = require('path')

// when Jest runs, it sets NODE_ENV=test. Else assume 'development'
const mode = process.env.NODE_ENV || 'development'

require('dotenv').config({
  path: path.join(__dirname, `/../.env.${mode}`),
})

// prevent connection to default DB of `postgres`:
if (!process.env.PGDATABASE) throw new Error('PGDATABASE not set')

const db = new pg.Pool()

module.exports = db
