exports.up = function(knex, Promise) {
  return knex.schema.createTable('subcotas', function(table) {
    table.integer('numSubCota').primary();
    table.string('txtDescricao');
  });
};

exports.down = function(knex, Promise) {
  knex.schema.dropTable('subcotas');
};
