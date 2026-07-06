require('dns').setServers(['8.8.8.8', '1.1.1.1'])
require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const Note = require('./models/note')

const app = express()
app.use(express.json())
app.use(express.static('dist'))

morgan.token('body', (req) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/api/notes', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
})

// with not found error in case we  look for id non existant
app.get('/api/notes/:id', (request, response) => {
  Note.findById(request.params.id)
    .then(note => {

      if (note) {
        response.json(note)
      } else {
        response.status(404).end()
      }
    })

    .catch( error => next(error)

      // The 400 (Bad Request) status code indicates that the server cannot or will not process the request due to something that
      //  is perceived to be a client error (e.g., malformed request syntax, invalid request message framing, or deceptive request routing).
     
    )
})
app.post('/api/notes', (request, response) => {
  const body = request.body
  if (!body.content) {
    return response.status(400).json({ error: 'content missing' })
  }
  const note = new Note({
    content: body.content,
    important: body.important || false,
  })
  note.save().then(savedNote => {
    response.json(savedNote)
  })
})

app.delete('/api/notes/:id', (request, response, next) => {
  Note.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

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


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})