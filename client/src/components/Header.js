import { Header } from 'todo-components';

import gql from "graphql-tag";
import { graphql, compose } from "react-apollo";
import withTodos from '../withTodos';

const withCreateTodo = gql`
  mutation CreateTodo($text: String!) {
    createTodo(text: $text)
      @rest(type: "Todo", method: "POST", path:"/todos", bodyKey: "text"){
        id
        text
        completed
      }
  }
`;

export default compose(
  graphql(withCreateTodo, {
    props: ({mutate}) => ({
      createTodo: (text) => {
        mutate({
          variables: {text},
          refetchQueries: [{ query: withTodos}]
        })
      }
    })
  })
)(Header);