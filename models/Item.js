const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
mongoose.set('useFindAndModify', false)

const url = process.env.MONGODB_URI

// const { url, port } = require('./config');
// console.log(url);

console.log(`Connecting to DB ${url}...`)

mongoose
  .connect(url, { useNewUrlParser: true })
  .then(() => {
    console.log(`connecting to DB ${url}...`)
  })
  .catch((error) => {
    console.log(' Error connecting to DB', error)
  })

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  number: {
    type: String,
    required: true,
    unique: true,
    match: [
      new RegExp('.*\\d'.repeat(8)),
      'Number should have at least 8 digits.',
    ],
  },
})

schema.plugin(uniqueValidator)

schema.set('toJSON', {
  transform: (document, returnedObject) => {
    (returnedObject.id = returnedObject._id.toString()),
    delete returnedObject._id
    delete returnedObject.__v
  },
})

module.exports = mongoose.model('Item', schema)
