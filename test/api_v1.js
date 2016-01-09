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

describe('/api/v1/parlamentares endpoint', function() {

  var parlamentares = fixtures.makeParlamentar(10);

  before(function(done) {
    models.Parlamentar.bulkCreate(parlamentares).then(function() {
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

  it('GET /api/v1/parlamentares?txNomeParlamentar=:filter', function(done) {
    request(app)
      .get('/api/v1/parlamentares?txNomeParlamentar=' + parlamentares[0].txNomeParlamentar)
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        assert.notEqual(res.body.data.length, 0);
        done();
      });
  });

  it('GET /api/v1/parlamentares?nuCarteiraParlamentar=:filter', function(done) {
    request(app)
      .get('/api/v1/parlamentares?nuCarteiraParlamentar=' + parlamentares[0].nuCarteiraParlamentar)
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        assert.notEqual(res.body.data.length, 0);
        done();
      });
  });

  it('GET /api/v1/parlamentares?nuLegislatura=:filter', function(done) {
    request(app)
      .get('/api/v1/parlamentares?nuLegislatura=' + parlamentares[0].nuLegislatura)
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        assert.notEqual(res.body.data.length, 0);
        done();
      });
  });

  it('GET /api/v1/parlamentares?sgUF=:filter', function(done) {
    request(app)
      .get('/api/v1/parlamentares?sgUF=' + parlamentares[0].sgUF)
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        assert.notEqual(res.body.data.length, 0);
        done();
      });
  });

  it('GET /api/v1/parlamentares?sgPartido=:filter', function(done) {
    request(app)
      .get('/api/v1/parlamentares?sgPartido=' + parlamentares[0].sgPartido)
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        assert.notEqual(res.body.data.length, 0);
        done();
      });
  });

  it('GET /api/v1/parlamentares?codLegislatura=:filter', function(done) {
    request(app)
      .get('/api/v1/parlamentares?codLegislatura=' + parlamentares[0].codLegislatura)
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        assert.notEqual(res.body.data.length, 0);
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
    models.SubCota.bulkCreate(subCotas).then(function() {
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

  it('GET /api/v1/subcotas?txtDescricao=:filter', function(done) {
    request(app)
      .get('/api/v1/subcotas?txtDescricao=' + subCotas[0].txtDescricao)
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        assert.notEqual(res.body.data.length, 0);
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
  var especificacaoSubCota = fixtures.makeEspecificacaoSubCota(subCotas[0].numSubCota, 1);
  var despesas = fixtures.makeDespesa(parlamentares[0].ideCadastro, subCotas[0].numSubCota, null, 5);
  despesas = despesas.concat(fixtures.makeDespesa(parlamentares[1].ideCadastro, subCotas[1].numSubCota, null, 5));
  despesas[0].especificacaoSubCotaId = especificacaoSubCota[0].numEspecificacaoSubCota;
  despesas[0].vlrDocumento = 10;
  despesas[0].vlrGlosa = 10;
  despesas[0].vlrLiquido = 10;
  despesas[0].datEmissao = new Date(2015, 01, 01, 0, 0, 0);
  despesas[1].vlrDocumento = 5;
  despesas[1].vlrGlosa = 5;
  despesas[1].vlrLiquido = 5;
  despesas[1].datEmissao = new Date(2014, 01, 01, 0, 0, 0);
  despesas[2].vlrDocumento = 15;
  despesas[2].vlrGlosa = 15;
  despesas[2].vlrLiquido = 15;
  despesas[2].datEmissao = new Date(2016, 01, 01, 0, 0, 0);

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
          models.EspecificacaoSubCota.bulkCreate(especificacaoSubCota).then(function() {
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

  it('GET /api/v1/despesas?txtFornecedor=:filter', function(done) {
    request(app)
      .get('/api/v1/despesas?txtFornecedor=' + despesas[0].txtFornecedor)
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        assert.notEqual(res.body.data.length, 0);
        done();
      });
  });

  it('GET /api/v1/despesas?txtCNPJCPF=:filter', function(done) {
    request(app)
      .get('/api/v1/despesas?txtCNPJCPF=' + despesas[0].txtCNPJCPF)
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        assert.notEqual(res.body.data.length, 0);
        done();
      });
  });

  it('GET /api/v1/despesas?txtNumero=:filter', function(done) {
    request(app)
      .get('/api/v1/despesas?txtNumero=' + despesas[0].txtNumero)
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        assert.notEqual(res.body.data.length, 0);
        done();
      });
  });

  it('GET /api/v1/despesas?txtNumero=:filter', function(done) {
    request(app)
      .get('/api/v1/despesas?txtNumero=' + despesas[0].txtNumero)
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        assert.notEqual(res.body.data.length, 0);
        done();
      });
  });

  it('GET /api/v1/despesas?indTipoDocumento=:filter', function(done) {
    request(app)
      .get('/api/v1/despesas?indTipoDocumento=' + despesas[0].indTipoDocumento)
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        assert.notEqual(res.body.data.length, 0);
        done();
      });
  });

  it('GET /api/v1/despesas?datEmissao=:filter', function(done) {
    request(app)
      .get('/api/v1/despesas?datEmissao=' + despesas[0].datEmissao.toISOString())
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        assert.notEqual(res.body.data.length, 0);
        done();
      });
  });
  it('GET /api/v1/despesas?datEmissao__lt=:filter', function(done) {
    request(app)
      .get('/api/v1/despesas?datEmissao__lt=' + despesas[0].datEmissao.toISOString())
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        assert.notEqual(res.body.data.length, 0);
        done();
      });
  });
  it('GET /api/v1/despesas?datEmissao__lte=:filter', function(done) {
    request(app)
      .get('/api/v1/despesas?datEmissao__lte=' + despesas[0].datEmissao.toISOString())
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        assert.notEqual(res.body.data.length, 0);
        done();
      });
  });
  it('GET /api/v1/despesas?datEmissao__gt=:filter', function(done) {
    request(app)
      .get('/api/v1/despesas?datEmissao__gt=' + despesas[0].datEmissao.toISOString())
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        assert.notEqual(res.body.data.length, 0);
        done();
      });
  });
  it('GET /api/v1/despesas?datEmissao__gte=:filter', function(done) {
    request(app)
      .get('/api/v1/despesas?datEmissao__gte=' + despesas[0].datEmissao.toISOString())
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        assert.notEqual(res.body.data.length, 0);
        done();
      });
  });

  it('GET /api/v1/despesas?vlrDocumento=:filter', function(done) {
    request(app)
      .get('/api/v1/despesas?vlrDocumento=' + despesas[0].vlrDocumento)
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        assert.notEqual(res.body.data.length, 0);
        done();
      });
  });
  it('GET /api/v1/despesas?vlrDocumento__lt=:filter', function(done) {
    request(app)
      .get('/api/v1/despesas?vlrDocumento__lt=' + despesas[0].vlrDocumento)
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        assert.notEqual(res.body.data.length, 0);
        done();
      });
  });
  it('GET /api/v1/despesas?vlrDocumento__lte=:filter', function(done) {
    request(app)
      .get('/api/v1/despesas?vlrDocumento__lte=' + despesas[0].vlrDocumento)
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        assert.notEqual(res.body.data.length, 0);
        done();
      });
  });
  it('GET /api/v1/despesas?vlrDocumento__gt=:filter', function(done) {
    request(app)
      .get('/api/v1/despesas?vlrDocumento__gt=' + despesas[0].vlrDocumento)
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        assert.notEqual(res.body.data.length, 0);
        done();
      });
  });
  it('GET /api/v1/despesas?vlrDocumento__gte=:filter', function(done) {
    request(app)
      .get('/api/v1/despesas?vlrDocumento__gte=' + despesas[0].vlrDocumento)
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        assert.notEqual(res.body.data.length, 0);
        done();
      });
  });

  it('GET /api/v1/despesas?vlrGlosa=:filter', function(done) {
    request(app)
      .get('/api/v1/despesas?vlrGlosa=' + despesas[0].vlrGlosa)
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        assert.notEqual(res.body.data.length, 0);
        done();
      });
  });
  it('GET /api/v1/despesas?vlrGlosa__lt=:filter', function(done) {
    request(app)
      .get('/api/v1/despesas?vlrGlosa__lt=' + despesas[0].vlrGlosa)
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        assert.notEqual(res.body.data.length, 0);
        done();
      });
  });
  it('GET /api/v1/despesas?vlrGlosa__lte=:filter', function(done) {
    request(app)
      .get('/api/v1/despesas?vlrGlosa__lte=' + despesas[0].vlrGlosa)
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        assert.notEqual(res.body.data.length, 0);
        done();
      });
  });
  it('GET /api/v1/despesas?vlrGlosa__gt=:filter', function(done) {
    request(app)
      .get('/api/v1/despesas?vlrGlosa__gt=' + despesas[0].vlrGlosa)
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        assert.notEqual(res.body.data.length, 0);
        done();
      });
  });
  it('GET /api/v1/despesas?vlrGlosa__gte=:filter', function(done) {
    request(app)
      .get('/api/v1/despesas?vlrGlosa__gte=' + despesas[0].vlrGlosa)
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        assert.notEqual(res.body.data.length, 0);
        done();
      });
  });

  it('GET /api/v1/despesas?vlrLiquido=:filter', function(done) {
    request(app)
      .get('/api/v1/despesas?vlrLiquido=' + despesas[0].vlrLiquido)
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        assert.notEqual(res.body.data.length, 0);
        done();
      });
  });
  it('GET /api/v1/despesas?vlrLiquido__lt=:filter', function(done) {
    request(app)
      .get('/api/v1/despesas?vlrLiquido__lt=' + despesas[0].vlrLiquido)
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        assert.notEqual(res.body.data.length, 0);
        done();
      });
  });
  it('GET /api/v1/despesas?vlrLiquido__lte=:filter', function(done) {
    request(app)
      .get('/api/v1/despesas?vlrLiquido__lte=' + despesas[0].vlrLiquido)
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        assert.notEqual(res.body.data.length, 0);
        done();
      });
  });
  it('GET /api/v1/despesas?vlrLiquido__gt=:filter', function(done) {
    request(app)
      .get('/api/v1/despesas?vlrLiquido__gt=' + despesas[0].vlrLiquido)
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        assert.notEqual(res.body.data.length, 0);
        done();
      });
  });
  it('GET /api/v1/despesas?vlrLiquido__gte=:filter', function(done) {
    request(app)
      .get('/api/v1/despesas?vlrLiquido__gte=' + despesas[0].vlrLiquido)
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        assert.notEqual(res.body.data.length, 0);
        done();
      });
  });

  it('GET /api/v1/despesas?numAno=:filter', function(done) {
    request(app)
      .get('/api/v1/despesas?numAno=' + despesas[0].numAno)
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        assert.notEqual(res.body.data.length, 0);
        done();
      });
  });

  it('GET /api/v1/despesas?numMes=:filter', function(done) {
    request(app)
      .get('/api/v1/despesas?numMes=' + despesas[0].numMes)
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        assert.notEqual(res.body.data.length, 0);
        done();
      });
  });

  it('GET /api/v1/despesas?numParcela=:filter', function(done) {
    request(app)
      .get('/api/v1/despesas?numParcela=' + despesas[0].numParcela)
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        assert.notEqual(res.body.data.length, 0);
        done();
      });
  });

  it('GET /api/v1/despesas?txtPassageiro=:filter', function(done) {
    request(app)
      .get('/api/v1/despesas?txtPassageiro=' + despesas[0].txtPassageiro)
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        assert.notEqual(res.body.data.length, 0);
        done();
      });
  });

  it('GET /api/v1/despesas?txtTrecho=:filter', function(done) {
    request(app)
      .get('/api/v1/despesas?txtTrecho=' + despesas[0].txtTrecho)
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        assert.notEqual(res.body.data.length, 0);
        done();
      });
  });

  it('GET /api/v1/despesas?numLote=:filter', function(done) {
    request(app)
      .get('/api/v1/despesas?numLote=' + despesas[0].numLote)
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        assert.notEqual(res.body.data.length, 0);
        done();
      });
  });

  it('GET /api/v1/despesas?numRessarcimento=:filter', function(done) {
    request(app)
      .get('/api/v1/despesas?numRessarcimento=' + despesas[0].numRessarcimento)
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        assert.notEqual(res.body.data.length, 0);
        done();
      });
  });

  it('GET /api/v1/despesas?parlamentarId=:filter', function(done) {
    request(app)
      .get('/api/v1/despesas?parlamentarId=' + despesas[0].parlamentarId)
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        assert.notEqual(res.body.data.length, 0);
        done();
      });
  });

  it('GET /api/v1/despesas?subCotaId=:filter', function(done) {
    request(app)
      .get('/api/v1/despesas?subCotaId=' + despesas[0].subCotaId)
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        assert.notEqual(res.body.data.length, 0);
        done();
      });
  });

  it('GET /api/v1/despesas?especificacaoSubCotaId=:filter', function(done) {
    request(app)
      .get('/api/v1/despesas?especificacaoSubCotaId=' + despesas[0].especificacaoSubCotaId)
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        assert.equal(res.body.data.length, 1);
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
