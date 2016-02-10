process.env.NODE_ENV = 'test'

var assert = require('assert');
var async = require('async');
var models = require('../models');
var repositories = require('../repositories');
var fixtures = require('./fixtures');

before(function(done) {
  models.knex.migrate.latest().then(function() {
    done();
  });
});

describe('ParlamentarRepository', function() {

  var parlamentares = fixtures.makeParlamentar(10);
  var parlamentarRepository = new repositories.ParlamentarRepository();

  before(function(done) {
    async.each(parlamentares, function(parlamentar, callback) {
      models.knex('parlamentares')
        .insert(parlamentar)
        .then(function() {
          callback();
        });
    }, function(err) {
      if (err) {
        console.log(err);
      } else {
        done();
      }
    });
  });

  after(function(done) {
    var ids = [];
    for (var i = 0; i < parlamentares.length; i++) {
      ids.push(parlamentares[i].ideCadastro);
    }
    models.knex('parlamentares')
      .whereIn('ideCadastro', ids)
      .delete()
      .then(function() {
        done();
      });
  });

  it('.get() válido', function(done) {
    var parlamentar = parlamentares[0];
    parlamentarRepository
      .get(parlamentar.ideCadastro)
      .then(function(result) {
        assert.equal(result.ideCadastro, parlamentar.ideCadastro);
        done();
      });
  });

  it('.get() inválido', function(done) {
    parlamentarRepository
      .get(999999999)
      .then(function(result) {
        assert.equal(result, null);
        done();
      });
  });

  it('.list() sem filtros', function(done) {
    parlamentarRepository
      .list(5, 0, {})
      .then(function(result) {
        assert.equal(result.count, 10);
        assert.equal(result.data.length, 5);
        done();
      });
  });

  it('.list() com filtros', function(done) {
    var parlamentar = parlamentares[0];
    parlamentarRepository
      .list(10, 0, {
        nuCarteiraParlamentar: parlamentar.nuCarteiraParlamentar
      })
      .then(function(result) {
        assert.ok(result.count >= 1);
        assert.ok(result.data.length >= 1);
        done();
      });
  });

  it('.listSummary() sem filtros', function(done) {
    parlamentarRepository
      .listSummary(5, 0, {})
      .then(function(result) {
        assert.equal(result.count, 10);
        assert.equal(result.data.length, 5);
        done();
      });
  });

  it('.listSummary() com filtros', function(done) {
    var parlamentar = parlamentares[0];
    parlamentarRepository
      .listSummary(10, 0, {
        nuCarteiraParlamentar: parlamentar.nuCarteiraParlamentar
      })
      .then(function(result) {
        assert.ok(result.count >= 1);
        assert.ok(result.data.length >= 1);
        done();
      });
  });

});

describe('SubCotaRepository', function() {

  var subCotas = fixtures.makeSubCota(10);
  var subCotaRepository = new repositories.SubCotaRepository();

  before(function(done) {
    async.each(subCotas, function(subcota, callback) {
      models.knex('subcotas')
        .insert(subcota)
        .then(function() {
          callback();
        });
    }, function(err) {
      if (err) {
        console.log(err);
      } else {
        done();
      }
    });
  });

  after(function(done) {
    var ids = [];
    for (var i = 0; i < subCotas.length; i++) {
      ids.push(subCotas[i].numSubCota);
    }
    models.knex('subcotas')
      .whereIn('numSubCota', ids)
      .delete()
      .then(function() {
        done();
      });
  });

  it('.get() válido', function(done) {
    var subCota = subCotas[0];
    subCotaRepository
      .get(subCota.numSubCota)
      .then(function(result) {
        assert.equal(result.numSubCota, subCota.numSubCota);
        done();
      });
  });

  it('.get() inválido', function(done) {
    subCotaRepository
      .get(999999999)
      .then(function(result) {
        assert.equal(result, null);
        done();
      });
  });

  it('.list() sem filtros', function(done) {
    subCotaRepository
      .list(5, 0, {})
      .then(function(result) {
        assert.equal(result.count, 10);
        assert.equal(result.data.length, 5);
        done();
      });
  });

  it('.list() com filtros', function(done) {
    var subCota = subCotas[0];
    subCotaRepository
      .list(10, 0, {
        txtDescricao: subCota.txtDescricao
      })
      .then(function(result) {
        assert.ok(result.count >= 1);
        assert.ok(result.data.length >= 1);
        done();
      });
  });

});


describe('DespesaRepository', function() {

  var parlamentares = fixtures.makeParlamentar(2);
  var subCotas = fixtures.makeSubCota(2);
  var despesas = fixtures.makeDespesa(parlamentares[0].ideCadastro, subCotas[0].numSubCota, 5);
  despesas = despesas.concat(fixtures.makeDespesa(parlamentares[1].ideCadastro, subCotas[1].numSubCota, 5));
  var despesaRepository = new repositories.DespesaRepository();

  before(function(done) {
    async.series([
        function(callback) {
          async.each(parlamentares, function(parlamentar, seriesCallback) {
            models.knex('parlamentares')
              .insert(parlamentar)
              .then(function() {
                seriesCallback();
              });
          }, function(err) {
            if (err) {
              console.log(err);
            } else {
              callback(null, null);
            }
          });
        },
        function(callback) {
          async.each(subCotas, function(subcota, seriesCallback) {
            models.knex('subcotas')
              .insert(subcota)
              .then(function() {
                seriesCallback();
              });
          }, function(err) {
            if (err) {
              console.log(err);
            } else {
              callback(null, null);
            }
          });
        },
        function(callback) {
          async.each(despesas, function(despesa, seriesCallback) {
            models.knex('despesas')
              .insert(despesa)
              .then(function() {
                seriesCallback();
              });
          }, function(err) {
            if (err) {
              console.log(err);
            } else {
              callback(null, null);
            }
          });
        },
      ],
      function(err, results) {
        if (err) {
          console.log(err);
        } else {
          done();
        }
      });
  });

  after(function(done) {
    async.series([
        function(callback) {
          var despesaIds = [];
          for (var i = 0; i < despesas.length; i++) {
            despesaIds.push(despesas[i].id);
          }
          models.knex('despesas')
            .whereIn('id', despesaIds)
            .delete()
            .then(function() {
              callback(null, null);
            });
        },
        function(callback) {
          var subCotaIds = [];
          for (var i = 0; i < subCotas.length; i++) {
            subCotaIds.push(subCotas[i].numSubCota);
          }
          models.knex('subcotas')
            .whereIn('numSubCota', subCotaIds)
            .delete()
            .then(function() {
              callback(null, null);
            });
        },
        function(callback) {
          var parlamentarIds = [];
          for (var i = 0; i < parlamentares.length; i++) {
            parlamentarIds.push(parlamentares[i].ideCadastro);
          }
          models.knex('parlamentares')
            .whereIn('ideCadastro', parlamentarIds)
            .delete()
            .then(function() {
              callback(null, null);
            });
        },
      ],
      function(err, results) {
        if (err) {
          console.log(err);
        } else {
          done();
        }
      });

  });

  it('.get() válido', function(done) {
    var despesa = despesas[0];
    despesaRepository
      .get(despesa.id)
      .then(function(result) {
        assert.equal(result.id, despesa.id);
        done();
      });
  });

  it('.get() inválido', function(done) {
    despesaRepository
      .get(999999999)
      .then(function(result) {
        assert.equal(result, null);
        done();
      });
  });

  it('.list() sem filtros', function(done) {
    despesaRepository
      .list(5, 0, {})
      .then(function(result) {
        assert.equal(result.count, 10);
        assert.equal(result.data.length, 5);
        done();
      });
  });

  it('.list() com filtros', function(done) {
    var despesa = despesas[0];
    despesaRepository
      .list(10, 0, {
        numMes: despesa.numMes
      })
      .then(function(result) {
        assert.ok(result.count >= 1);
        assert.ok(result.data.length >= 1);
        done();
      });
  });

});
