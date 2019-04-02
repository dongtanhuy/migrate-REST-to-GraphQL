import gql from 'graphql-tag';

const withTodos = gql`
  query Todos {
    todos {
      id
      completed
      text
    }
  }
`

export default withTodos;