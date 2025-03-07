const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
} else if(process.argv.length===4){
  console.log('missing name or number')
  process.exit(1)
}

const password = process.argv[2]

const url =
`mongodb+srv://dromanlinux:${password}@cluster0.wugmw.mongodb.net/personApp?retryWrites=true&w=majority`

mongoose.set('strictQuery',false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)


if (process.argv.length===3) { //list all persons
  Person.find({}).then(persons => {
    console.log("phonebook:");
    persons.forEach(person => {
      console.log(person.name, person.number)
    })
    mongoose.connection.close()
  })
} else { //insert a person
    const name = process.argv[3]
    const number = process.argv[4]

    const person = new Person({
      name: name,
      number: number,
    })
    person.save().then(person => {
      console.log(`added ${person.name} number ${person.number} to phonebook`)
      mongoose.connection.close()
    })
}

