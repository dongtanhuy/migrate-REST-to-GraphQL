const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require('axios')
const { ApolloServer } = require("apollo-server-express");
const { makeExecutableSchema } = require("graphql-tools");


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
      const response = await axios.get('http://localhost:4000/todos')
      return response.data
    }
  },
  Mutation: {
    createTodo:async (_, {text}) => {
      const response = await axios.post('http://localhost:4000/todos', {text})
      return response.data
    },
    toggleTodo:  async (_, {id}) => {
      const response = await axios.put(`http://localhost:4000/todos/${id}/toggle`)
      return response.data
    },
    toggleAllTodos: async () => {
      const response = await axios.put('http://localhost:4000/todos/toggle')
      return response.data
    },
    removeTodo: async (_, {id}) => {
      await axios.delete(`http://localhost:4000/todo/${id}`)
      return true
    },
    editTodo: async (_, {id, text}) => {
      const response = await axios.put(`http://localhost:4000/todos/${id}`, {text})
      return response.data
    },
    clearAllCompleted: async () => {
      const response = await axios.delete('http://localhost:4000/todos/completed')
      const {ids} = response.data
      return ids
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