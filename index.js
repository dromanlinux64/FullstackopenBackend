require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person.js')

app.use(cors())
 
morgan.token('body-post', function bodyPost (req, res) {
  if (req.method ==="POST" || req.method ==="PUT")
     return JSON.stringify(req.body)
   return ""
})


app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body-post'))

app.use(express.json())  

app.use(express.static('dist'))

/* app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
}) */

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/info', (request, response) => {
  Person.find({}).then(persons => {
    const respuesta =`<p> Phonebook has info for ${persons.length} people </p>
    <p> ${Date()} </p>`
    response.send(respuesta)
  })

})


app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id)
  .then(person =>
    response.json(person)
    )

})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
    .then(result=>
      response.status(204).end()
    )
    .catch(error => next(error) 
    )
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(request.params.id, person, {new:true})
  .then(updatedPerson =>{
       response.json(updatedPerson)
  })
  .catch(error =>next(error))
})

/*const generateId = () => {
    const newId = Math.floor(Math.random()*100000)
    return newId
  }*/
  
app.post('/api/persons', (request, response) => {
    const body = request.body
    //console.log(body)
    if (!body.name || !body.number ) {
        return response.status(400).json({ 
          error: 'Name or number is missing' 
        })
    }
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

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 

  next(error)
}

// este debe ser el último middleware cargado, ¡también todas las rutas deben ser registrada antes que esto!
app.use(errorHandler)
  
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

