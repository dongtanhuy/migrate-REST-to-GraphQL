const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const database = require('./database');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Get all todos
app.get("/todos", async (req, res) => {
  const todos = await database("todos").select();
  res.status(200).send(todos);
});

// Create new todo
app.post('/todos', async (req, res) => {
  const {text} = req.body
  const [id] = await database('todos').insert({
    text,
    completed: false,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });
  res.status(200).send({ id, text, completed: false,})
});

// Toggle todo
app.put('/todos/:id/toggle', async (req,res) => {
  const { id } = req.params;
  const [todo] = await database('todos').where("id", id);
  await database('todos')
    .where('id', id)
    .update({
      completed: !todo.completed,
      updatedAt: Date.now()
    })
  res.status(200).send({...todo, completed: !todo.completed})
});

// Toggle all todos
app.put('/todos/toggle', async (req, res) => {
  const isAnyTodoIncomplete = await database("todos").where("completed", false);
  const updated = await database("todos").update({
    completed: !!isAnyTodoIncomplete.length,
    updatedAt: Date.now()
  });
  res.status(200).send({ updated }); 
});

// Remove todo
app.delete('/todo/:id', async (req, res) => {
  const {id} = req.params
  await database('todos').where("id", id).delete();
  res.status(200).send({ id });
});

//Edit todo
app.put('/todos/:id', async (req, res) => {
  const { id } = req.params
  const { text } = req.body
  await database('todos').where('id', id).update({
    text: text,
    updatedAt: Date.now()
  })
  const [todo] = await database("todos").where({ id });
  res.status(200).send(todo);
});

// Clear all complete task
app.delete('/todos/completed', async (req,res) => {
  const completedTodos = await database('todos').where("completed", true).select("id");
  await database("todos")
    .where("completed", true)
    .delete();
  res.status(200).send({ ids: completedTodos.map(({ id }) => id) });
})

const server = app.listen(4000, function() {
  console.log("app running on port.", server.address().port);
});