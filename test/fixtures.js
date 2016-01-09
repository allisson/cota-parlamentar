var faker = require('faker');

faker.locale = 'pt_BR';

module.exports = {
  makeParlamentar: function(quantity) {
    if (quantity === undefined) {
      quantity = 1;
    }

    objects = [];

    for (i = 0; i < quantity; i++) {
      objects.push({
        ideCadastro: faker.random.number(),
        txNomeParlamentar: faker.name.findName(),
        nuCarteiraParlamentar: faker.random.number(),
        nuLegislatura: faker.random.number(),
        sgUF: faker.hacker.abbreviation().slice(0, 2),
        sgPartido: faker.hacker.abbreviation(),
        codLegislatura: faker.random.number()
      });
    }

    return objects;
  },
  makeSubCota: function(quantity) {
    if (quantity === undefined) {
      quantity = 1;
    }

    objects = [];

    for (i = 0; i < quantity; i++) {
      objects.push({
        numSubCota: faker.random.number(),
        txtDescricao: faker.commerce.productName(),
      });
    }

    return objects;
  },
  makeEspecificacaoSubCota: function(subCotaId, quantity) {
    if (quantity === undefined) {
      quantity = 1;
    }

    objects = [];

    for (i = 0; i < quantity; i++) {
      objects.push({
        subCotaId: subCotaId,
        numEspecificacaoSubCota: faker.random.number(),
        txtDescricaoEspecificacao: faker.commerce.productName(),
      });
    }

    return objects;
  },
  makeDespesa: function(parlamentarId, subCotaId, especificacaoSubCotaId, quantity) {
    if (quantity === undefined) {
      quantity = 1;
    }

    objects = [];

    for (i = 0; i < quantity; i++) {
      var date = faker.date.past()
      objects.push({
        id: faker.random.number(),
        txtFornecedor: faker.company.companyName(),
        txtCNPJCPF: faker.finance.account(),
        txtNumero: faker.finance.account(),
        indTipoDocumento: faker.random.number(),
        datEmissao: date,
        vlrDocumento: faker.finance.amount(),
        vlrGlosa: faker.finance.amount(),
        vlrLiquido: faker.finance.amount(),
        numMes: date.getMonth() + 1,
        numAno: date.getFullYear(),
        numParcela: faker.random.number(),
        txtPassageiro: faker.name.findName(),
        txtTrecho: faker.commerce.productName(),
        numLote: faker.random.number(),
        numRessarcimento: faker.random.number(),
        parlamentarId: parlamentarId,
        subCotaId: subCotaId,
        especificacaoSubCotaId: (especificacaoSubCotaId) ? especificacaoSubCotaId : null,
      });
    }

    return objects;
  },
};
