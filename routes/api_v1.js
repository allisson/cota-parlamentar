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

  var parlamentarRepository = new repositories.ParlamentarRepository();
  parlamentarRepository
    .list(req.limit, req.offset, req.query)
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

  var subCotaRepository = new repositories.SubCotaRepository();
  subCotaRepository
    .list(req.limit, req.offset, req.query)
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

  var despesaRepository = new repositories.DespesaRepository();
  despesaRepository
    .list(req.limit, req.offset, req.query)
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

  var parlamentarRepository = new repositories.ParlamentarRepository();
  parlamentarRepository
    .listSummary(req.limit, req.offset, req.query)
    .then(function(result) {
      res.json(result);
    })
    .catch(function(err) {
      res.status(500).send(err);
    });

});

module.exports = router;
