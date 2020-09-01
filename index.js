// require("dotenv").config();
const morgan = require('morgan')
const cors = require('cors')
const express = require('express');
const app = express();
const Item = require('./models/Item');

app.use(express.static('build'))
app.use(express.json());

app.use(cors())

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

app.get("/info", (req, res) => {
  Item.countDocuments()
    .then(result => {
      const message = `<h2>PhoneBook has info for ${result} people</h2><br>
      ${new Date()}`
      res.send(message);
    })
});

app.get("/api/persons", (req, res) => {
  Item.find({}).then(result => {
    res.json(result)
    });
})

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  Item.findById(id)
  .then(item => {
    if (item) {
      res.json()(item.toJson())
    } else {
      res.status(404).end()
    }
  })
  const person = persons.find((person) => person.id === id);
  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

// const generateId = () => {
//   const maxId = persons.length > 0 ? Math.max(...persons.map((n) => n.id)) : 0;
//   return maxId + 1;
// };

const checkGetPostBody = (req, res) => {
  const body = req.body;
  if (!body.name) {
    return res.status(400).json({ error: "the name field is missing" });
  }
  if (!body.number) {
    return res.status(400).json({ error: "the number field is missing" });
  }
  return body;
};

app.post("/api/persons", (req, res, next) => {
  const body = checkGetPostBody(req, res);
  // if (persons.find(i => i.name === body.name)) {
  //   return res.status(400).json({ error: "the name must be unique" });
  // }
  const item = new Item({
    name: body.name,
    number: body.number
  });
  item
    .save()
    .then(newItem => {
      res.json(newItem.toJSON());
    })
    .catch(error => next(error));
});

app.put("/api/persons/:id", (req, res, next) => {
  const body = checkGetPostBody(req, res);
  const id = req.params.id;
  const item = { name: body.name, number: body.number };
  Item.findByIdAndUpdate(id, item, { new: true })
    .then(newItem => {
      if (newItem) {
        console.log(newItem);
        res.json(newItem.toJSON());
      }
      //  else {
      //   res.status(404).end();
      // }
    })
    .catch(error => next(error));
});

app.delete("/api/persons/:id", (req, res, next) => {
  const id = req.params.id;
  Item.findByIdAndRemove(id)
    .then(() => {
      Item.find({}).then(result => {
        res.json(result)
        });
      // res.status(204).end();
    })
    .catch(error => next(error));
});

const errorHandler = (error, request, response, next) => {
  console.log(error);

  if (error.name === "CastError" && error.kind == "ObjectId") {
    return response.status(400).send({ error: "malformed id" });
  }

  if (error.name === "ValidationError") {
    return response.status(400).send({ error: error.message });
  }

  next(error);
};
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
