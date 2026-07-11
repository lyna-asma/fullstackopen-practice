// router instance for handling all /api/notes routes
const notesRouter = require('express').Router()
// importing the Note model from models directory
const Note = require('../models/note')
const User = require('../models/user')
const jwt = require('jsonwebtoken')


// get all route handler using find method from mongo model Note
// notice the notes we get are note+s , this matches the doc collection name mongo creates for convenience
notesRouter.get('/', async (request, response) => {
  const notes = await Note
    .find({}).populate('user', { username: 1, name: 1 })
  response.json(notes)
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

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    // this will remove "Bearer"+ " " , only leaves the JWT
    return authorization.replace('Bearer ', '')
  }
  return null
}

// create new note handler notice the use of Note() constructor + save()
notesRouter.post('/', async (request, response) => {
  const body = request.body
  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  const user = await User.findById(decodedToken.id)


  if (!user) {
    return response.status(400).json({ error: 'userId missing or not valid' })
  }
  const note = new Note({
    content: body.content,
    important: body.important || false,
    user: user._id
  })

  // automatically call the error-handling middleware if an await statement throws an error

  const savedNote = await note.save()
  user.notes = user.notes.concat(savedNote._id)
  await user.save()
  response.status(201).json(savedNote)
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