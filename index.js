const express = require('express')
const app = express()
const bodyParser = require('body-parser')

app.use(bodyParser.json())

let dummyPersons = [
  {
    name: 'Arto Hellas',
    number: '040-123456',
    id: 1
  },
  {
    name: 'Martti Tienari',
    number: '040-123456',
    id: 2
  },
  {
    name: 'Arto Järvinrn',
    number: '040-123456',
    id: 3
  },
  {
    name: 'Lea Kutvonen',
    number: '040-123456',
    id: 4
  }
]

app.get('/api/persons', (request, response) => {
  response.json(dummyPersons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = dummyPersons.find(person => person.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  dummyPersons = dummyPersons.filter(person => person.id !== id)
  response.status(204).end()
})

app.get('/info', (request, response) => {
  const time = new Date().toString()
  response.send(
    `<p>Puhelinluettelossa ${dummyPersons.length} henkilön tiedot</p><p>${time}</p>`
    )
})

const generateId = () => {
  return Math.floor(Math.random() * 100000000)
}

app.post('/api/persons', (request, response) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number,
    id: generateId()
  }

  dummyPersons = dummyPersons.concat(person)

  response.json(person)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

