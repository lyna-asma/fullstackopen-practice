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

app.get('/api/notes/:id', (request, response) => {
  Note.findById(request.params.id).then(note => {
    response.json(note)
  })
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

app.delete('/api/notes/:id', (request, response) => {
  Note.findByIdAndDelete(request.params.id).then(() => {
    response.status(204).end()
  })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})