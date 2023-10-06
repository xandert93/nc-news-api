class RequestError extends Error {
  constructor(code, message) {
    super(message) // calls `Error` class' constructor with `message`

    this.name = 'RequestError' // reassign from 'Error' to 'RequestError'
    this.statusCode = code
  }
}

class BadReqError extends RequestError {
  constructor(message) {
    super(400, message)
  }
}

class AuthError extends RequestError {
  constructor(message) {
    super(401, message)
  }
}

class ForbiddenError extends RequestError {
  constructor(message = 'Insufficient permissions') {
    super(403, message)
  }
}

class NotFoundError extends RequestError {
  constructor(rowType) {
    super(404, `That ${rowType} does not exist`)
  }
}

class ConflictError extends RequestError {
  constructor(message) {
    super(409, message)
  }
}

class ExcessReqError extends RequestError {
  constructor() {
    super(429, 'Too many requests') //*** should be used with rate-limiting according to MDN
  }
}

module.exports = {
  RequestError,
  BadReqError,
  AuthError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  ExcessReqError,
}
