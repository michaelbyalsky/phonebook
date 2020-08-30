const repl = require("repl");
// const morganBody = require('morgan-body');
// const bodyParser  = require('body-parser')

const morgan = require('morgan')

const express = require("express");
const app = express();

// morganBody(app);

app.use(express.json());

const cors = require('cors')
app.use(cors())

// app.use(morgan({format: 'POST body length in bytes :req[Content-Length]', immediate: true}))
app.use(morgan(function (tokens, req, res) {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'), '-',
      tokens['response-time'](req, res), 'ms',
      JSON.stringify(req.body)
    ].join(' ')
  }))
// app.use(bodyParser.json());


// morgan(function (tokens, req, res) {
//     return [
//       tokens.method(req, res),
//       tokens.url(req, res),
//       tokens.status(req, res),
//       tokens.res(req, res, 'content-length'), '-',
//       tokens['response-time'](req, res), 'ms'
//     ].join(' ')
//   })


// const unknownEndpoint = (request, response) => {
//     response.status(404).send({ error: 'unknown endpoint' })
//   }
  
// app.use(unknownEndpoint)

// const requestLogger = (request, response, next) => {
//     console.log('Method:', request.method)
//     console.log('Path:  ', request.path)
//     console.log('Body:  ', request.body)
//     console.log('---')
//     next()
//   }

//   app.use(requestLogger)


let persons = [
  {
    name: "Arto Hellas",
    number: "040-123456",
    id: 1,
  },
  {
    name: "Ada Lovelace",
    number: "39-44-5323523",
    id: 2,
  },
  {
    name: "Dan Abramov",
    number: "12-43-234345",
    id: 3,
  },
  {
    name: "Mary Poppendieck",
    number: "39-23-6423122",
    id: 4,
  },
];

app.get("/info", (req, res) => {
  const length = persons.length;
  res.send(`<h2>PhoneBook has info for ${length} people</h2><br>
    ${new Date()}`);
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);
  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

const generateId = () => {
  const maxId = persons.length > 0 ? Math.max(...persons.map((n) => n.id)) : 0;
  return maxId + 1;
};

app.post("/api/notes", (request, response) => {
  const body = request.body;

  if (!body.number || !body.name) {
    return response.status(400).json({
      error: "number or name missing",
    });
  } else if (persons.find((person) => person.name === body.name)) {
    return response.status(400).json({
      error: "name is already exists",
    });
  } else {
    const person = {
      name: body.name,
      number: body.number,
      id: generateId(),
    };

    persons = persons.concat(person);

    response.json(person);
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);

  response.status(204).end();
});

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
