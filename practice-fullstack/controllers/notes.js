// router instance for handling all /api/notes routes
const notesRouter = require('express').Router()
// importing the Note model from models directory
const Note = require('../models/note')

// get all route handler using find method from mongo model Note
// notice the notes we get are note+s , this matches the doc collection name mongo creates for convenience
notesRouter.get('/', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
})

// with not found error in case we look for id non existant
notesRouter.get('/:id', (request, response, next) => {
  Note.findById(request.params.id)
    .then(note => {
      if (note) {
        response.json(note)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

// create new note handler notice the use of Note() constructor + save()
notesRouter.post('/', (request, response, next) => {
  const body = request.body

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

// delete handler with mongo model method
// 2 successful cases: either delete when non existant note id, or delete an existant one
notesRouter.delete('/:id', (request, response, next) => {
  Note.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

// update handler with mongo model methods
// notice the use of findById() + save() instead of findByIdAndUpdate()
notesRouter.put('/:id', (request, response, next) => {
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

module.exports = notesRouter