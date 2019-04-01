import React from 'react';
import './App.css';
import Main from './components/Main'
import Footer from './components/Footer'
import Header from './components/Header'
import { Container } from 'todo-components'
import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloProvider } from "react-apollo";
import { RestLink } from "apollo-link-rest";


const SERVER_URL='http://localhost:4000'

const restLink = new RestLink({
  uri: SERVER_URL,
});

const client = new ApolloClient({
  link: restLink,
  cache: new InMemoryCache()
});

const App = () => {
  return (
    <ApolloProvider client={client}>
        <Container>
          <Header />
          <Main />
          <Footer />
        </Container>
      </ApolloProvider>
  )
}
// class App extends Component {
//   state = {
//     todos: []
//   }
//   async componentDidMount() {
//     const response = await axios.get(SERVER_URL+'todos')
//     this.setState({todos: response.data})
//   }
//   createTodo = async ({ text }) => {
//     const response = await axios.post(SERVER_URL+'todos', {text})
//     this.setState(({ todos }) => ({
//       todos: todos.concat([response.data])
//     }));
//   };

//   toggleTodo = async ({ id }) => {
//     const response = await axios.put(`${SERVER_URL}todos/${id}/toggle`)
//     const updatedTodo = response.data
//     this.setState(({ todos }) => ({
//       todos: todos.map(todo => {
//         if (todo.id !== id) {
//           return todo;
//         }
//         return updatedTodo;
//       })
//     }));
//   };

//   toggleAllTodos = async () => {
//     await axios.put(SERVER_URL+'todos/toggle')
//     const {data} = await axios.get(SERVER_URL+'todos')
//     this.setState({todos: data})
//   }

//   removeTodo = async id => {
//     await axios.delete(`${SERVER_URL}todo/${id}`)
//     this.setState(({ todos }) => ({
//       todos: todos.filter(todo => {
//         if (todo.id !== id) {
//           return true;
//         }
//         return false;
//       })
//     }));
//   }

//   editTodo = async (id, text) => {
//     const response = await axios.put(`${SERVER_URL}todos/${id}`, {text})
//     const updatedTodo = response.data
//     this.setState(({ todos }) => ({
//       todos: todos.map(todo => {
//         if (todo.id !== id) {
//           return todo;
//         }
//         return updatedTodo;
//       })
//     }));
//   };

//   clearAllCompleted = async () => {
//     const response = await axios.delete(SERVER_URL+'todos/completed')
//     const {ids} = response.data
//     this.setState(({ todos }) => ({
//       todos: todos.filter(todo => {
//         if (ids.includes(todo.id)) {
//           return false;
//         }
//         return true;
//       })
//     }));
//   };

//   render() {
//     return (
//       <Container>
//         <Header createTodo={this.createTodo} />
//         <Main
//           todos={this.state.todos}
//           toggleAllTodos={this.toggleAllTodos}
//           toggleTodo={this.toggleTodo}
//           removeTodo={this.removeTodo}
//           editTodo={this.editTodo}
//         />
//         <Footer
//           todos={this.state.todos}
//           clearAllCompleted={this.clearAllCompleted}
//         />
//       </Container>
//     );
//   }
// }

export default App;
