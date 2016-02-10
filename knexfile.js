'use strict';

var config = require(__dirname + '/config/config.json');

module.exports = {

  development: {
    client: 'pg',
    connection: config['development'],
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  test: {
    client: 'pg',
    connection: config['test'],
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  production: {
    client: 'pg',
    connection: config['production'],
    migrations: {
      tableName: 'knex_migrations'
    }
  },

};
