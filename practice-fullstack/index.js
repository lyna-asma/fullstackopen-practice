// importing the Express application from app.js
const app = require('./app')
// importing the config file for all env variables
const config = require('./utils/config')
// importing the logger to use info() and error() replacing console.log
const logger = require('./utils/logger')

// start the server — listens on the port from config
app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
})