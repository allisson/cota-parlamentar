exports.up = function(knex, Promise) {
  return knex.schema.createTable('despesas', function(table) {
    table.increments();
    table.integer('parlamentarId').references('parlamentares.ideCadastro');
    table.integer('subCotaId').references('subcotas.numSubCota');
    table.string('txtFornecedor');
    table.string('txtCNPJCPF');
    table.string('txtNumero');
    table.integer('indTipoDocumento');
    table.dateTime('datEmissao');
    table.decimal('vlrDocumento');
    table.decimal('vlrGlosa');
    table.decimal('vlrLiquido');
    table.integer('numMes');
    table.integer('numAno');
    table.integer('numParcela');
    table.string('txtPassageiro');
    table.string('txtTrecho');
    table.integer('numLote');
    table.integer('numRessarcimento');
  });
};

exports.down = function(knex, Promise) {
  knex.schema.dropTable('despesas');
};
