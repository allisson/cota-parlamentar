'use strict';
var env = process.env.NODE_ENV || 'development';
var config = require(__dirname + '/../config/config.json')[env];

var knex = require('knex')({
  client: 'pg',
  connection: config,
  debug: false
});

module.exports = {
  knex: knex
};
