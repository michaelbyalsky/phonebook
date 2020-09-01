const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]

const url =`mongodb+srv://mikib213:${password}@cluster0.d9oxu.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

const itemSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Item = mongoose.model('Item', itemSchema)

if (process.argv.length === 3) {
  console.log('phonebook:')
  Item.find({}).then(result => {
    result.forEach(item => {
      console.log(item.name, item.number)
    })
    mongoose.connection.close()
  })
  return
}

const name = process.argv[3]
const number = process.argv[4]

const item = new Item({ name, number })

item.save().then(item => {
  console.log(`Added ${item.name} number ${item.number} to phonebook`)
  mongoose.connection.close()
})