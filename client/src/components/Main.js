import gql from "graphql-tag";
import { graphql, compose } from "react-apollo";
import { Main } from 'todo-components';
import withTodos from '../withTodos';


const withToggleAllTodos = gql`
  mutation ToggleAllTodos($body: Boolean) {
    toggleAllTodos(body: $body)
      @rest(
        method: "PUT"
        type: "Todo"
        path: "/todos/toggle"
        bodyKey: "body"
      ) {
      updated
    }
  }
`

const withToggleTodo = gql`
  mutation ToggleTodo($id: Int!, $body: Boolean) {
    toggleTodo(id:$id, body:$body)
      @rest(
        method: "PUT"
        type: "Todo"
        path: "/todos/:id/toggle"
        bodyKey: "body"
      ){
        id
        completed
        text
      }
  }
`;

const withRemoveTodo = gql`
  mutation RemoveTodo($id: Int!) {
    removeTodo(id: $id)
      @rest(
        method: "DELETE"
        type: "todo"
        path: "/todo/:id"
      ){
        NoResponse
      }
  }
`;

const withEditTodo = gql`
  mutation EditTodo($id: Int!, $text: String!) {
    editTodo(id: $id, text: $text)
      @rest(method: "PUT", type: "Todo", path: "/todos/{args.id}", bodyKey: "text") {
      id
      text
      completed
    }
  }
`;
export default compose(
  graphql(withTodos, {
    props: ({ data: { todos }}) => ({ todos })
  }),
  graphql(withToggleAllTodos, {
    props: ({mutate}) => ({
      toggleAllTodos: () => {
        mutate({
          variables: { body: {} },
          refetchQueries: [{ query: withTodos }]
        })
      }
    })
  }),
  graphql(withToggleTodo, {
    props: ({mutate}) => ({
      toggleTodo: ({ id }) => {
        mutate({
          variables: {id, body: {}},
          refetchQueries: [{ query: withTodos }]
        })
      }
    })
  }),
  graphql(withEditTodo, {
    props: ({ mutate }) => ({
      editTodo: (id, text) =>
        mutate({
          variables: { id, text: {text} },
          refetchQueries: [{ query: withTodos }]
        })
    })
  }),
  graphql(withRemoveTodo, {
    props: ({mutate}) => ({
      removeTodo: id => {
        mutate({
          variables: {id},
          refetchQueries: [{ query: withTodos }]
        })
      }
    })
  }),
)(Main);