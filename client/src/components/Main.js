import gql from "graphql-tag";
import { graphql, compose } from "react-apollo";
import { Main } from 'todo-components';
import withTodos from '../withTodos';


const withToggleAllTodos = gql`
  mutation ToggleAllTodos {
    toggleAllTodos
    {
      updated
    }
  }
`

const withToggleTodo = gql`
  mutation ToggleTodo($id: Int!) {
    toggleTodo(id:$id)
    {
      id
      completed
      text
    }
  }
`;

const withRemoveTodo = gql`
  mutation RemoveTodo($id: Int!) {
    removeTodo(id: $id)
  }
`;

const withEditTodo = gql`
  mutation EditTodo($id: Int!, $text: String!) {
    editTodo(id: $id, text: $text)
    {
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
        })
      }
    }),
    options: {
      update: (proxy, { data: { toggleTodo } }) => {
        const data = proxy.readQuery({ query: withTodos });
        const { todos } = data;
        const newTodos = todos.map(todo => Object.assign(todo, { completed : !todo.completed }));
        proxy.writeQuery({ query: withTodos, data: { 
          todos: newTodos
        } });
      },
    }
  }),
  graphql(withToggleTodo, {
    props: ({mutate}) => ({
      toggleTodo: ({ id }) => {
        mutate({
          variables: {id},
        })
      }
    }),
    options: {
      update: (proxy, { data: { toggleTodo } }) => {
        const data = proxy.readQuery({ query: withTodos });
        const { todos } = data;
        todos[todos.findIndex(el => el._id === toggleTodo.id)] = toggleTodo;
        proxy.writeQuery({ query: withTodos, data });
      },
    }
  }),
  graphql(withEditTodo, {
    props: ({ mutate }) => ({
      editTodo: (id, text) =>
        mutate({
          variables: { id, text },
        })
    }),
    options: {
      update: (proxy, { data: { toggleTodo } }) => {
        const data = proxy.readQuery({ query: withTodos });
        const { todos } = data;
        todos[todos.findIndex(el => el._id === toggleTodo.id)] = toggleTodo;
        proxy.writeQuery({ query: withTodos, data });
      },
    }
  }),
  graphql(withRemoveTodo, {
    props: ({mutate, client, query}) => ({
      removeTodo: id => {
        mutate({
          variables: {id},
          refetchQueries: [{ query: withTodos }]
        });
      }
    })
  }),
)(Main);