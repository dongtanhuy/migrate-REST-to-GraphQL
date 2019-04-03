const knex = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: "./database/data.sqlite3"
  }
})

knex.schema
  .createTable('todos', todo => {
    todo.increments('id').primary();
    todo.string('text');
    todo.dateTime('createdAt');
    todo.dateTime('updatedAt');
    todo.boolean('completed');
  })
  .then(() => console.log('Todos Table created'))
  .catch(() => console.log("Table already exists"));

module.exports = knex;