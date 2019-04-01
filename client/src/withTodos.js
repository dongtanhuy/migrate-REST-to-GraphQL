import gql from 'graphql-tag';

const withTodos = gql`
  query Todos {
    todos @rest(type: "Todo", path:"/todos") {
      id
      completed
      text
    }
  }
`

export default withTodos;