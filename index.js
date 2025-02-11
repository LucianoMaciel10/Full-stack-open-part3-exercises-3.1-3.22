require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const PORT = process.env.PORT || 3001
const Person = require('./models/person.js')

morgan.token('body', (req) => {
  return req.method === 'POST' ? JSON.stringify(req.body) : ''
})

app.use(express.static('dist'))
app.use(cors())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms - :body'))
app.use(express.json())

app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons)
  })
})

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id).then(person => {
    if (person) {
      res.json(person)
    } else {
      res.status(404).end()
    }
  })
    .catch(err => next(err))
})

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then((deletePerson) => {
      res.json(deletePerson)
    })
    .catch(err => next(err))
})

app.put('/api/persons/:id', (req, res, next) => {
  const { name, number } = req.body

  const person = {
    name,
    number
  }

  Person.findByIdAndUpdate(
    req.params.id, 
    person, 
    { new: true, runValidators: true, context: 'query' }
  )
    .then((updatePerson) => {
      res.json(updatePerson)
    })
    .catch(err => next(err))
})

app.post('/api/persons',async (req, res, next) => {
  try {
    const { name, number } = req.body

    const newPerson = new Person({ name, number })

    const savedPerson = await newPerson.save()
    res.json(savedPerson)
  } catch (error) {
    next(error)
  }
})

app.get('/info', (req, res, next) => {
  const time = new Date()
  Person.find({})
    .then(people => {
      res.send(`<p>Phonebook has info for ${people.length} people</p>
                <p>${time}</p>`)
    })
    .catch(err => next(err))
})

app.use((req, res) => {
  res.status(404).json({ error: 'Unknown endpoint'})
})

app.use((err, req, res) => {
  console.error(err.message)

  if (err.name === 'CastError') {
    return res.status(400).json({ error: 'Invalid ID format' })
  } else if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message })
  } else if (err.name === 'MongoServerError' && err.code === 11000) {
    return res.status(400).json({ error: 'name must be unique' })
  }

  res.status(500).json({ error: 'Internal server error' })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})