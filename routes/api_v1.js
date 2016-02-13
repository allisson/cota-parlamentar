var express = require('express');
var router = express.Router();
var models = require('../models');
var repositories = require('../repositories');

router.use(function(req, res, next) {
  var page = 1;
  if (req.query.page) {
    page = req.query.page;
  }
  var limit = 30
  var offset = (page - 1) * limit;
  req.limit = limit;
  req.offset = offset;
  next();
});

router.get('/parlamentares', function(req, res, next) {

  var query = {};
  if (req.query.ideCadastro) {
    query.ideCadastro = req.query.ideCadastro;
  }
  if (req.query.txNomeParlamentar) {
    query.txNomeParlamentar = req.query.txNomeParlamentar;
  }
  if (req.query.nuCarteiraParlamentar) {
    query.nuCarteiraParlamentar = req.query.nuCarteiraParlamentar;
  }
  if (req.query.nuLegislatura) {
    query.nuLegislatura = req.query.nuLegislatura;
  }
  if (req.query.sgUF) {
    query.sgUF = req.query.sgUF;
  }
  if (req.query.sgPartido) {
    query.sgPartido = req.query.sgPartido;
  }
  if (req.query.codLegislatura) {
    query.codLegislatura = req.query.codLegislatura;
  }

  var parlamentarRepository = new repositories.ParlamentarRepository();
  parlamentarRepository
    .list(req.limit, req.offset, query)
    .then(function(result) {
      res.json(result);
    })
    .catch(function(err) {
      res.status(500).send(err);
    });

});

router.get('/parlamentares/:id', function(req, res, next) {

  var parlamentarRepository = new repositories.ParlamentarRepository();
  parlamentarRepository
    .get(req.params.id)
    .then(function(result) {
      if (result === null) {
        res.status(404).json({
          'erro': 'Parlamentar não encontrado'
        });
      } else {
        res.json(result);
      }
    })
    .catch(function(err) {
      res.status(500).send(err);
    });

});

router.get('/subcotas', function(req, res, next) {

  var query = {};
  if (req.query.numSubCota) {
    query.numSubCota = req.query.numSubCota;
  }
  if (req.query.txtDescricao) {
    query.txtDescricao = req.query.txtDescricao;
  }

  var subCotaRepository = new repositories.SubCotaRepository();
  subCotaRepository
    .list(req.limit, req.offset, query)
    .then(function(result) {
      res.json(result);
    })
    .catch(function(err) {
      res.status(500).send(err);
    });

});

router.get('/subcotas/:id', function(req, res, next) {

  var subCotaRepository = new repositories.SubCotaRepository();
  subCotaRepository
    .get(req.params.id)
    .then(function(result) {
      if (result === null) {
        res.status(404).json({
          'erro': 'Subcota não encontrada'
        });
      } else {
        res.json(result);
      }
    })
    .catch(function(err) {
      res.status(500).send(err);
    });

});

router.get('/despesas', function(req, res, next) {

  var query = {};
  if (req.query.id) {
    query.id = req.query.id;
  }
  if (req.query.parlamentarId) {
    query.parlamentarId = req.query.parlamentarId;
  }
  if (req.query.subCotaId) {
    query.subCotaId = req.query.subCotaId;
  }
  if (req.query.numMes) {
    query.numMes = req.query.numMes;
  }
  if (req.query.numAno) {
    query.numAno = req.query.numAno;
  }

  var despesaRepository = new repositories.DespesaRepository();
  despesaRepository
    .list(req.limit, req.offset, query)
    .then(function(result) {
      res.json(result);
    })
    .catch(function(err) {
      res.status(500).send(err);
    });

});

router.get('/despesas/:id', function(req, res, next) {

  var despesaRepository = new repositories.DespesaRepository();
  despesaRepository
    .get(req.params.id)
    .then(function(result) {
      if (result === null) {
        res.status(404).json({
          'erro': 'Despesa não encontrada'
        });
      } else {
        res.json(result);
      }
    })
    .catch(function(err) {
      res.status(500).send(err);
    });

});

router.get('/resumo', function(req, res, next) {

  var query = {};
  if (req.query.ideCadastro) {
    query.ideCadastro = req.query.ideCadastro;
  }
  if (req.query.sgUF) {
    query.sgUF = req.query.sgUF;
  }
  if (req.query.sgPartido) {
    query.sgPartido = req.query.sgPartido;
  }
  if (req.query.numMes) {
    query.numMes = req.query.numMes;
  }
  if (req.query.numAno) {
    query.numAno = req.query.numAno;
  }

  var parlamentarRepository = new repositories.ParlamentarRepository();
  parlamentarRepository
    .listSummary(req.limit, req.offset, query)
    .then(function(result) {
      res.json(result);
    })
    .catch(function(err) {
      res.status(500).send(err);
    });

});

module.exports = router;
