// importing the logger to use info() and error() replacing console.log
const logger = require('./logger')

// middleware to log request method, path, and body for debugging
// runs on every incoming request before route handlers
const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  next()
}

// handler for requests with unknown endpoint
// catches any route that doesn't match the defined ones above
// must be after all routes, before error handler
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// error handler middleware
// catches errors passed via next(error) from route handlers
// handles CastError (malformed MongoDB id) with 400
// handles ValidationError (schema validation failed) with 400
// passes everything else to the default Express error handler
const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler
}