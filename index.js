require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const PORT = process.env.PORT || 3001
const phone_book = require('./data/phone_book.js')
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
      res.json(person);
    } else {
      res.status(404).end()
    }
  })
  .catch(err => next(err));
})

app.delete('/api/persons/:id', (req, res) => {
  const id = req.params.id
  const index = phone_book.findIndex(p => p.id == id)

  if (index) {
    phone_book.splice(index, 1)
    res.status(204).end()
  } else {
    res.status(404).end()
  }
})

app.post('/api/persons',async (req, res) => {
  try {
    const body = req.body;

    if (!body.name) {
      return res.status(400).json({ error: "The mandatory field 'name' is not found" });
    }
    if (!body.number) {
      return res.status(400).json({ error: "The mandatory field 'number' is not found" });
    }

    const existName = await Person.findOne({ name: body.name });

    if (existName) {
      return res.status(400).json({ error: 'name must be unique' });
    }

    const newPerson = new Person({
      name: body.name,
      number: body.number
    });

    const savedPerson = await newPerson.save();
    res.json(savedPerson);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
})

app.get('/info', (req, res) => {
  const time = new Date()
  res.send(`<p>Phonebook has info for ${phone_book.length} people</p>
            <p>${time}</p>`)
})

app.use((req, res) => {
  res.status(404).json({ error: 'Unknown endpoint'})
})

app.use((err, req, res, next) => {
  console.error(err.message)

  if (err.name === 'CastError') {
    return res.status(400).json({ error: 'Invalid ID format' })
  }

  next(err)
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})