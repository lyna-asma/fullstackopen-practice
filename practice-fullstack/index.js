// this is to fix DNS issue 
require('dns').setServers(['8.8.8.8', '1.1.1.1'])
// to use env
require('dotenv').config()
// some important imports s
const express = require('express')
const morgan = require('morgan')
const Note = require('./models/note')

// app instance creation
const app = express()

// json parser middleware for the req.body to be used
app.use(express.json())
// static middleware to display the frontend files from /dist directory
app.use(express.static('dist'))

// morgan for logging some details to console useful fro debugging
// , notice we first add body token to the rest bcz it doesn t come by default 
morgan.token('body', (req) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


// route handlers 

// get all route handler using find methos from mongo model Note , notice the notes we get are note+s , this matches the doc  collection name mongo creates for convenience 
app.get('/api/notes', (request, response, next) => {
  Note.find({})
    .then(notes => {
      response.json(notes)
    })
    .catch(error => next(error))
})

// with not found error in case we  look for id non existant
app.get('/api/notes/:id', (request, response, next) => {
  Note.findById(request.params.id)
    .then(note => {

      if (note) {
        response.json(note)
      } else {
        response.status(404).end()
      }
    })

    .catch( error => next(error))
})

// create new note hadler notice the use of  Note() constructor + save()
app.post('/api/notes', (request, response, next) => {
  const body = request.body
  if (!body.content) {
    return response.status(400).json({ error: 'content missing' })
  }
  const note = new Note({
    content: body.content,
    important: body.important || false,
  })
  note.save()
    .then(savedNote => {
      response.json(savedNote)
    })
    .catch(error => next(error))
})

// delete handler with mongo model method ( 2 successfull cases either delete when non existant note id , or delete an existant one)
app.delete('/api/notes/:id', (request, response, next) => {
  Note.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})


// update handler with mongo model methods (notice the use of findById() + save() instead of findByIdAndUpdate())
app.put('/api/notes/:id', (request, response, next) => {
  const { content, important } = request.body

  Note.findById(request.params.id)
    .then(note => {
      if (!note) {
        return response.status(404).end()
      }

      note.content = content
      note.important = important

      return note.save().then((updatedNote) => {
        response.json(updatedNote)
      })
    })
    .catch(error => next(error))
})



// before the last middleware => unknowreqhandler
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
// its use
app.use(unknownEndpoint)


/// last middleware => errorhandler 
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}
//its use
app.use(errorHandler)

// laaast one of all => the built i error handler from express ....(no code fro it)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})