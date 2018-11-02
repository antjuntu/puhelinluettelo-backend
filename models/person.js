const mongoose = require('mongoose')
const { url } = require('../db')

mongoose.connect(url, { useNewUrlParser: true })

const schema = new mongoose.Schema({
  name: String,
  number: String
})

schema.statics.format = function (person) {
  return {
    name: person.name,
    number: person.number,
    id: person._id
  }
}

const Person = mongoose.model('Person', schema)

module.exports = Person