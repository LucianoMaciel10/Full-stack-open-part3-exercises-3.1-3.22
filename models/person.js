const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

mongoose.set('strictQuery', false)

console.log('connecting to', url)

mongoose.connect(url)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personSchema = mongoose.Schema({
  name: {
    type: String,
    minLength: [3, "The name must be at least 3 characters long"],
    required: [true, "The mandatory field 'name' is not found"],
    unique: true
  },
  number: {
    type: String,
    validate: {
      validator: function(value) {
        return /^\d{2,3}-\d{8}$/.test(value)
      },
      message: props => `${props.value}' is not a valid phone number! It must be in the format XX-XXXXXXXX or XXX-XXXXXXXX`
    },
    required: [true, "The mandatory field 'number' is not found"]
  }
})

personSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id.toString()
    delete ret._id
    delete ret.__v
  }
})

const Person = mongoose.model('Person', personSchema)

module.exports = Person