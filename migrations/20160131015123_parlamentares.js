exports.up = function(knex, Promise) {
  return knex.schema.createTable('parlamentares', function(table) {
    table.integer('ideCadastro').primary();
    table.string('txNomeParlamentar');
    table.integer('nuCarteiraParlamentar');
    table.integer('nuLegislatura');
    table.string('sgUF');
    table.string('sgPartido');
    table.integer('codLegislatura');
  });
};

exports.down = function(knex, Promise) {
  knex.schema.dropTable('parlamentares');
};
