const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

app.use(bodyParser.json())
app.use(cors())
app.use(express.static('build'))

morgan.token('body', (req, res) => {
  return JSON.stringify(req.body)
})

app.use(morgan(':method :url :body :status :res[content-length] - :response-time ms'))

app.get('/api/persons', (request, response) => {
  Person
    .find({})
    .then(persons => {
      response.json(persons.map(person => Person.format(person)))
    })
})

app.get('/api/persons/:id', (request, response) => {
  Person
    .findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(Person.format(person))
      } else {
        response.status(404).end()
      }
    })
    .catch(error => {
      console.log(error)
      response.status(400).send({ error: 'malformatted id' })
    })
})

app.delete('/api/persons/:id', (request, response) => {
  Person
    .findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => {
      console.log(error)
      response.status(400).send({ error: 'malformatted id' })
    })
})

app.get('/info', (request, response) => {
  const time = new Date().toString()
  let amountOfPerson = 0
  Person
    .find({})
    .then(persons => {
      if (persons) {
        amountOfPerson = persons.length
      }
      response.send(
        `<p>Puhelinluettelossa ${amountOfPerson} henkilön tiedot</p><p>${time}</p>`
      )
    })
    .catch(err => {
      console.log(err)
      response.status(404).send({ error: 'error occurred' })
    })

})

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (body.name === undefined || body.number === undefined) {
    return response.status(400).json({ error: 'name or number missing' })
  }

  Person
    .find({ name: body.name })
    .then(persons => {
      return persons[0]
    })
    .then(foundPerson => {
      if (foundPerson) {
        return response.status(400).json({ error: 'name must be unique' })
      }

      const person = new Person({
        name: body.name,
        number: body.number
      })

      person
        .save()
        .then(savedPerson => {
          response.json(Person.format(savedPerson))
        })
    })
    .catch(error => {
      console.log(error)
      response.status(404).send({ error: 'error occurred' })
    })
})

app.put('/api/persons/:id', (request, response) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number
  }

  Person
    .findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedPerson => {
      response.json(Person.format(updatedPerson))
    })
    .catch(error => {
      console.log(error)
      response.status(400).send({ error: 'malformatted id' })
    })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

