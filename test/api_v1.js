process.env.NODE_ENV = 'test'

var request = require('supertest');
var assert = require('assert');
var async = require('async');
var app = require('../app');
var models = require('../models');
var fixtures = require('./fixtures');

before(function(done) {
  models.knex.migrate.latest().then(function() {
    done();
  });
});

describe('/api/v1/parlamentares endpoint', function() {

  var parlamentares = fixtures.makeParlamentar(10);

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

  it('GET /api/v1/parlamentares', function(done) {
    request(app)
      .get('/api/v1/parlamentares')
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        assert.equal(res.body.data.length, 10);
        done();
      });
  });

  it('GET /api/v1/parlamentares/:id', function(done) {
    request(app)
      .get('/api/v1/parlamentares/' + parlamentares[0].ideCadastro)
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        assert.equal(res.body.ideCadastro, parlamentares[0].ideCadastro);
        done();
      });
  });

});

describe('/api/v1/subcota endpoint', function() {

  var subCotas = fixtures.makeSubCota(10);

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

  it('GET /api/v1/subcotas', function(done) {
    request(app)
      .get('/api/v1/subcotas')
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        assert.equal(res.body.data.length, 10);
        done();
      });
  });

  it('GET /api/v1/subcotas/:id', function(done) {
    request(app)
      .get('/api/v1/subcotas/' + subCotas[0].numSubCota)
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        assert.equal(res.body.numSubCota, subCotas[0].numSubCota);
        done();
      });
  });

});

describe('/api/v1/despesas endpoint', function() {

  var parlamentares = fixtures.makeParlamentar(2);
  var subCotas = fixtures.makeSubCota(2);
  var despesas = fixtures.makeDespesa(parlamentares[0].ideCadastro, subCotas[0].numSubCota, 5);
  despesas = despesas.concat(fixtures.makeDespesa(parlamentares[1].ideCadastro, subCotas[1].numSubCota, 5));

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

  it('GET /api/v1/despesas', function(done) {
    request(app)
      .get('/api/v1/despesas')
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        assert.equal(res.body.data.length, 10);
        done();
      });
  });

  it('GET /api/v1/despesas/:id', function(done) {
    request(app)
      .get('/api/v1/despesas/' + despesas[0].id)
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        assert.equal(res.body.id, despesas[0].id);
        done();
      });
  });

});

describe('/api/v1/resumo endpoint', function() {

  var parlamentares = fixtures.makeParlamentar(2);
  var subCotas = fixtures.makeSubCota(2);
  var despesas = fixtures.makeDespesa(parlamentares[0].ideCadastro, subCotas[0].numSubCota, 5);
  despesas = despesas.concat(fixtures.makeDespesa(parlamentares[1].ideCadastro, subCotas[1].numSubCota, 5));

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

  it('GET /api/v1/resumo', function(done) {
    request(app)
      .get('/api/v1/resumo')
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        assert.equal(res.body.data.length, 2);
        done();
      });
  });

});
