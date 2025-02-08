const express = require('express')
const app = express()
const PORT = 3001
const phone_book = require('./data/phone_book.js')

app.use(express.json())

app.get('/api/persons', (req, res) => {
  res.json(phone_book)
})

app.get('/api/persons/:id', (req, res) => {
  const id = req.params.id
  const person = phone_book.find(p => p.id == id)

  if (person) {
    res.json(person)
  } else {
    res.status(404).end()
  }
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

app.post('/api/persons', (req, res) => {
  const body = req.body
  const existName = phone_book.find(person => person.name === body.name)

  if (existName) {
    return res.status(400).json({ error: 'name must be unique' })
  } else if (!body.number) {
    return res.status(400).json({ error: "The mandatory field 'number' is not found" })
  } else if (!body.name) {
    return res.status(400).json({ error: "The mandatory field 'name' is not found" })
  }

  const newPerson = {
    id: Math.random() * 9999999999,
    name: body.name,
    number: body.number
  }

  phone_book.push(newPerson)
  res.json(newPerson)
})

app.get('/info', (req, res) => {
  const time = new Date()
  res.send(`<p>Phonebook has info for ${phone_book.length} people</p>
            <p>${time}</p>`)
})


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})