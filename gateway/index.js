const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require('axios')
const { ApolloServer } = require("apollo-server-express");

const database = require('./database');

const jwt = require('jsonwebtoken');
const SECRET_KEY_JWT = 'hihi'
const tokenWithAdminRole = jwt.sign({ role: 'Admin', user: 'Duy'}, SECRET_KEY_JWT)
const tokenWithUserRole = jwt.sign({ role: 'User', user: 'Duy'}, SECRET_KEY_JWT)
console.log('admin token', tokenWithAdminRole);
console.log('user token', tokenWithUserRole);

const attachUserToContext = (req, res) => {
  const token = req.headers.authorization;
  if (token) {
    const decoded = jwt.verify(
      token.replace('Bearer ', ''),
      SECRET_KEY_JWT
    );
    return decoded;
  } else {
    res
      .status(401)
      .send({ message: 'You must supply a JWT for authorization!' });
  }
};
const app = express();

app.get("/todos", async (req, res) => {
  const todos = await database("todos").select();
  res.status(200).send(todos);
});

// Define typeDefs
const typeDefs = `
  type Todo {
    id: Int
    text: String
    completed: Boolean
    createdAt: String
    updatedAt: String
  }

  type UpdatedCount {
    updated: Int
  }

  type TodoIds {
    ids: [Int]
  }

  type Query {
    todos: [Todo]
  }
  type Mutation {
    createTodo(text: String!): Todo
    toggleTodo(id: Int!): Todo
    toggleAllTodos: UpdatedCount
    removeTodo(id: Int!): Boolean
    editTodo(id: Int!, text: String!): Todo
    clearAllCompleted: TodoIds
  }
  
`;
const resolvers = {
  Query: {
    todos: async () => {
      const todos = await database("todos").select();
      console.log(todos)
      return todos
    }
  },
  Mutation: {
    createTodo:async (_, {text}, {currentUser}) => {
      if (currentUser.role !== 'Admin') {
        throw new Error('You have no permission');
      }
      const [id] = await database('todos').insert({
        text,
        completed: false,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
      return { id, text, completed: false,}
    },
    toggleTodo:  async (_, {id}) => {
      const [todo] = await database('todos').where("id", id);
      await database('todos')
        .where('id', id)
        .update({
          completed: !todo.completed,
          updatedAt: Date.now()
        })
      return {...todo, completed: !todo.completed}
    },
    toggleAllTodos: async () => {
      const isAnyTodoIncomplete = await database("todos").where("completed", false);
      const updated = await database("todos").update({
        completed: !!isAnyTodoIncomplete.length,
        updatedAt: Date.now()
      });
      return { updated }
    },
    removeTodo: async (_, {id}) => {
      await database('todos').where("id", id).delete();
      return true
    },
    editTodo: async (_, {id, text}) => {
      await database('todos').where('id', id).update({
        text: text,
        updatedAt: Date.now()
      })
      const [todo] = await database("todos").where({ id });
      return todo
    },
    clearAllCompleted: async () => {
      const completedTodos = await database('todos').where("completed", true).select("id");
      await database("todos")
        .where("completed", true)
        .delete();
      
      return { ids: completedTodos.map(({ id }) => id) }
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req, res }) => {
    let authToken = null;
    let currentUser = null;
    console.log('hihi');
     try {
        authToken = req.headers.authorization;
        if (authToken) {
            currentUser = await attachUserToContext(req, res);
        }
        console.log(currentUser);
     } catch (e) {
        console.warn(`Unable to authenticate using auth token: ${authToken}`);
     }
    return {
        authToken,
        currentUser,
    };
 },
  playground: {
    settings: {
      'editor.theme': 'dark',
    },
    tabs: [
      {
        endpoint: 'http://localhost:5000/graphql',
      },
    ],
  },
})
server.applyMiddleware({app});

app.listen(5000, () => {
  console.log("Go to http://localhost:5000/graphiql to run queries!");
});