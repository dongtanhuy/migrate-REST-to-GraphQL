const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require('axios')
const { ApolloServer } = require("apollo-server-express");

const database = require('./database');


const app = express();

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
    createTodo:async (_, {text}) => {
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
  resolvers
})
server.applyMiddleware({app});

app.listen(5000, () => {
  console.log("Go to http://localhost:5000/graphiql to run queries!");
});