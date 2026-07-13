// this is to fix DNS issue
require('dns').setServers(['8.8.8.8', '1.1.1.1'])
// some important imports
const express = require('express')
const mongoose = require('mongoose')
// importing the config file for all env variables
const config = require('./utils/config')
// importing the logger to use info() and error() replacing console.log
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')
// noteRouter imports to get the route handlers (controller module) of notes instances
const notesRouter = require('./controllers/notes')
// userRouter
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')

// app instance creation
const app = express()

// connect to mongoDB using the url from config module
logger.info('connecting to', config.MONGODB_URI)
mongoose.connect(config.MONGODB_URI, { family: 4 })
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch(error => {
    logger.error('error connecting to MongoDB:', error.message)
  })

// json parser middleware for the req.body to be used
app.use(express.json())
// static middleware to display the frontend files from /dist directory
app.use(express.static('dist'))
// request logger middleware — logs method, path, body for every request (replaces morgan)
app.use(middleware.requestLogger)

// route handlers
// all /api/notes routes are now handled by the notesRouter in controllers/notes.js
app.use('/api/notes', notesRouter)
// users router use
app.use('/api/users', usersRouter)

app.use('/api/login', loginRouter)

// before the last middleware => unknown endpoint handler (moved to utils/middleware)
app.use(middleware.unknownEndpoint)

// last middleware => error handler (moved to utils/middleware)
app.use(middleware.errorHandler)

// laaast one of all => the built-in error handler from Express ....(no code for it)

module.exports = app