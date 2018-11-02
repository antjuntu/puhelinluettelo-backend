const mongoose = require('mongoose')
const { url } = require('./db')

mongoose.connect(url, { useNewUrlParser: true })

const Person = mongoose.model('Person', {
  name: String,
  number: String
})

if(process.argv.length === 4) {

  const name = process.argv[2]
  const number = process.argv[3]

  const person = new Person({
    name,
    number
  })

  person
    .save()
    .then(() => {
      console.log(`lisätään henkilö ${name} numero ${number} luetteloon`)
      mongoose.connection.close()
    })
} else {
  console.log('puhelinluettelo:')
  Person
    .find({})
    .then((result) => {
      result.forEach(person => console.log(person.name, person.number))
      mongoose.connection.close()
    })
}

// let dummyPersons = [
//   {
//     name: 'Arto Hellas',
//     number: '040-123456',
//     id: 1
//   },
//   {
//     name: 'Martti Tienari',
//     number: '040-123456',
//     id: 2
//   },
//   {
//     name: 'Arto Järvinrn',
//     number: '040-123456',
//     id: 3
//   },
//   {
//     name: 'Lea Kutvonen',
//     number: '040-123456',
//     id: 4
//   }
// ]

