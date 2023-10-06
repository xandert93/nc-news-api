const { RequestError, BadReqError } = require('../utils/error-types.js')

// Only for errors that might be caused by bad requests by client
// Doesn't account for errors that might be caused by us e.g. bad sql syntax, a table not existing etc.
exports.dbErrHandler = (err, req, res, next) => {
  const { code, name, message } = err

  // Not exhaustive. Full list here: https://www.postgresql.org/docs/8.2/errcodes-appendix.html
  // Other PSQL errors may be thrown, but will transfer into `serverErrHandler`, where we can read the error message in the server CLI
  const dbErrCodes = [
    '23502', // NOT NULL violation
    '22P02', // invalid text representation
    '23503', // foreign key (REFERENCES) violation
    '23514', // CHECK key violation
    '23505', // UNIQUE violation
  ]

  const isDbErr = dbErrCodes.includes(code)
  if (isDbErr) return next(new BadReqError(message))

  /*   
  - The default Postgres `err.message` is not useful for the client at all.
  - Could also use a switch/case to send custom messages based on the error code, but I've since discovered that the Postgres error objects aren't particularly descriptive. This makes it hard to send back a meaningful error message to the client. I need to investigate the error object a little more when I have time...
  - Perhaps, like in MongoDB, the schema fields can specify custom error messages? 
  */

  next(err)
}

exports.clientErrHandler = (err, req, res, next) => {
  const { statusCode, name, message } = err

  const isClientErr = err instanceof RequestError
  if (isClientErr) return res.status(statusCode).json({ message })

  next(err)
}

exports.serverErrHandler = (err, req, res, next) => {
  console.log({ serverError: err.message }) // probably caused by us...logging here is useful

  return res.status(500).json({ message: 'Server Error, Bro' })
}
