const mongoose = require('mongoose')

const password = process.argv[2]

mongoose.set('strictQuery', false)

mongoose.connect(`mongodb+srv://luchomaciel9:${password}@cluster0.pno8v.mongodb.net/personsApp?retryWrites=true&w=majority&appName=Cluster0`)

const personSchema = mongoose.Schema({
  name: String,
  number: Number
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
  Person.find({}).then(res => {
    console.log('phonebook:')
    res.forEach(person => console.log(person.name, person.number))
    mongoose.connection.close()
  })
} else if (process.argv.length === 5) {
  const name = process.argv[3]
  const number = Number(process.argv[4])

  const person = new Person({
    name,
    number
  })

  person.save().then(() => {
    console.log(`added ${name} number ${number} to phonebook`)
    mongoose.connection.close()
  })
}
