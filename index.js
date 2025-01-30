require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person.js')

app.use(cors())
 
morgan.token('body-post', function bodyPost (req, res) {
  if (req.method ==="POST")
     return JSON.stringify(req.body)
   return ""
})


app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body-post'))



app.use(express.json())  


let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]


app.use(express.static('dist'))

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id)
  .then(person =>
    response.json(person)
    )

})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(p => p.id !== id)
  
    response.status(204).end()
})

const generateId = () => {
    const newId = Math.floor(Math.random()*100000)
    return newId
  }
  
app.post('/api/persons', (request, response) => {
    const body = request.body
    //console.log(body)
    if (!body.name || !body.number ) {
        return response.status(400).json({ 
          error: 'Name or number is missing' 
        })
      }
/*    if (persons.some(person=>person.name===body.name))
    {
        return response.status(400).json({ 
          error: `${body.name} already exist` 
        })
    } */
      
    const person = new Person({
      name: body.name,
      number: body.number,
    })
  
    person.save()
      .then(person =>
        response.json(person)
      )
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)
  
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

