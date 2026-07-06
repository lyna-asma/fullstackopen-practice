// importing the library necessary for the comm with the cluster 
// we use mongoose instead of mongodb for some prefrences
const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

// we get the url value from the env variable
const url = process.env.MONGODB_URI

// logging to console
console.log('connecting to', url)

// connecting wih the url we specify i env + consition to only accept IP4
mongoose.connect(url, { family: 4 })
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })

  // creation of the schema for our model 
const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

// toJSON transform to format the objects returned by Mongoose
// replaces _id with id (as a string) and removes __v (versioning field)
noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

// assigning the Note model the noteSchema schema
// mongoose will automatically create a collection named 'notes' (plural of 'Note')
module.exports = mongoose.model('Note', noteSchema)