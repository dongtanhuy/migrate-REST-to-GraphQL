import React from 'react';
import './App.css';
import Main from './components/Main'
import Footer from './components/Footer'
import Header from './components/Header'
import { Container } from 'todo-components'
import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloProvider } from "react-apollo";
import { HttpLink } from "apollo-link-http";


const SERVER_URL='http://localhost:5000/graphql'


const httpLink = new HttpLink({
  uri: SERVER_URL
});

const client = new ApolloClient({
  link: httpLink,
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

export default App;
