// DNS fix for MongoDB Atlas connectivity issues on some networks
require('dns').setServers(['8.8.8.8', '1.1.1.1'])
// loading environment variables from .env file before anything else
require('dotenv').config()
// some important imports
const express = require('express')
const morgan = require('morgan')
// importing the Person model from the models directory
const Person = require('./models/person')

// app instance creation
const app = express()

// json parser middleware for the req.body to be used
app.use(express.json())
// static middleware to display the frontend files from /dist directory
app.use(express.static('dist'))

// morgan for logging some details to console useful for debugging
// notice we first add body token to the rest bcz it doesn t come by default 
morgan.token('body', (req) => {
  return JSON.stringify(req.body)
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

// route handlers

// get all route handler using find method from mongo model Person
// notice the persons we get are people , this matches the collection name mongo creates for convenience (plural of Person)
app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    console.log(persons)
    response.json(persons)
  })
})

// create new person handler — notice the use of Person() constructor + save()
// adapted to mongo from the previous array-based version
app.post('/api/persons', (request, response) => {
  const body = request.body  // extract the JSON body from the request

  // validate — if name or number is missing, return 400 error
  if (!body.name || !body.number) {
    return response.status(400).json({ 
      error: 'name or number missing' 
    })
  }

  // create a new Person document using the mongoose model
  const person = new Person({
    name: body.name,
    number: body.number
  })

  // save to MongoDB — returns a promise
  // once saved, send the saved person back as JSON response
  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
})

// delete handler with mongo model method
// 2 successful cases: either delete when non-existent person id, or delete an existing one
// both return 204 no content since the end state is the same — the person doesn't exist
app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

// update handler with mongo model methods
// notice the use of findById() + save() instead of findByIdAndUpdate()
// this way mongoose validations run on the updated document
app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body

  Person.findById(request.params.id)
    .then(person => {
      if (!person) {
        return response.status(404).end()
      }

      person.name = name
      person.number = number

      return person.save().then((updatedPerson) => {
        response.json(updatedPerson)
      })
    })
    .catch(error => next(error))
})



// get by id handler 
app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

// get info page 
app.get('/info', (request, response, next) => {
  Person.countDocuments({})
    .then(count => {
      const requestTime = new Date().toString()
      response.send(`
        <p>Phonebook has info for ${count} people</p>
        <p>${requestTime}</p>
      `)
    })
    .catch(error => next(error))
})


// Before the last middleware => handler for requests with unknown endpoint
// catches any route that doesn't match the defined ones above
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
// its use — must be after all routes, before error handler
app.use(unknownEndpoint)

/// last middleware => error handler
// catches errors passed via next(error) from route handlers
// handles CastError (malformed MongoDB id) with 400
// passes everything else to the default Express error handler
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}
// its use — must be the very last middleware loaded
app.use(errorHandler)

// laaast one of all => the built-in error handler from Express ....(no code for it)
// .........


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})