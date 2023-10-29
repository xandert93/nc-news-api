const path = require('path')

const knex = require('knex')

// when Jest runs, it sets NODE_ENV=test. Else assume 'development'
const mode = process.env.NODE_ENV || 'development'
const isInProduction = mode === 'production'

require('dotenv').config({
  path: path.join(__dirname, `/../.env.${mode}`),
})

// prevent connection to default DB of `postgres`:
if (!isInProduction) {
  if (!process.env.PGDATABASE) throw new Error('PGDATABASE not set')
} else {
  if (!process.env.PGDATABASE_URL) throw new Error('Production PGDATABASE_URL not set')
}

const configs = {
  nonProduction: {
    client: 'pg',
    connection: {
      user: process.env.PGUSER,
      password: process.env.PGPASSWORD,
      database: process.env.PGDATABASE,
    },
  },
  production: {
    client: 'pg',
    connection: process.env.PGDATABASE_URL,
    pool: {
      max: 10, // Specify max number of connections in connection pool to avoid overloading database server
    },
  },
}

const db = knex(configs[!isInProduction ? 'nonProduction' : 'production'])

module.exports = db
