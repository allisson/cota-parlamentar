process.env.NODE_ENV = 'test'

var request = require('supertest');
var assert = require('assert');
var faker = require('faker');
var async = require('async');
var app = require('../app');
var models = require('../models');
var fixtures = require('./fixtures');

before(function(done) {
  models.sequelize.sync({
    force: true
  }).then(function() {
    done();
  });
});

describe('/api/parlamentares endpoint', function() {

  var parlamentares = fixtures.makeParlamentar(10);

  before(function(done) {
    models.Parlamentar.bulkCreate(parlamentares).then(function() {
      done();
    });
  });

  it('GET /api/parlamentares', function(done) {
    request(app)
      .get('/api/parlamentares')
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        assert.equal(res.body.data.length, 10);
        done();
      });
  });

  it('GET /api/parlamentares/:id', function(done) {
    request(app)
      .get('/api/parlamentares/' + parlamentares[0].ideCadastro)
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        assert.equal(res.body.ideCadastro, parlamentares[0].ideCadastro);
        done();
      });
  });

});

describe('/api/subcota endpoint', function() {

  var subCotas = fixtures.makeSubCota(10);

  before(function(done) {
    models.SubCota.bulkCreate(subCotas).then(function() {
      done();
    });
  });

  it('GET /api/subcotas', function(done) {
    request(app)
      .get('/api/subcotas')
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        assert.equal(res.body.data.length, 10);
        done();
      });
  });

  it('GET /api/subcotas/:id', function(done) {
    request(app)
      .get('/api/subcotas/' + subCotas[0].numSubCota)
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        assert.equal(res.body.numSubCota, subCotas[0].numSubCota);
        done();
      });
  });

});


describe('/api/despesas endpoint', function() {

  var parlamentares = fixtures.makeParlamentar(2);
  var subCotas = fixtures.makeSubCota(2);
  var despesas = fixtures.makeDespesa(parlamentares[0].ideCadastro, subCotas[0].numSubCota, 5);
  despesas = despesas.concat(fixtures.makeDespesa(parlamentares[1].ideCadastro, subCotas[1].numSubCota, 5));

  before(function(done) {
    async.series(
      [
        function(callback) {
          models.Parlamentar.bulkCreate(parlamentares).then(function() {
            callback(null, null);
          });
        },
        function(callback) {
          models.SubCota.bulkCreate(subCotas).then(function() {
            callback(null, null);
          });
        },
        function(callback) {
          models.Despesa.bulkCreate(despesas).then(function() {
            callback(null, null);
          });
        },
      ],
      // optional callback
      function(err, results) {
        if (err) {
          done(err);
        }
        done();
      });
  });

  it('GET /api/despesas', function(done) {
    request(app)
      .get('/api/despesas')
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        assert.equal(res.body.data.length, 10);
        done();
      });
  });

  it('GET /api/despesas/:id', function(done) {
    request(app)
      .get('/api/despesas/' + despesas[0].id)
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        assert.equal(res.body.id, despesas[0].id);
        done();
      });
  });

});
