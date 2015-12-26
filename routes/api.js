var express = require('express');
var router = express.Router();
var models = require('../models');

router.use(function (req, res, next) {
  var page = 1;
  if (req.query.page) {
    page = req.query.page;
  }
  var limit = 20
  var offset = (page - 1) * limit;
  req.limit = limit;
  req.offset = offset;
  next();
});

router.get('/parlamentares', function(req, res, next) {
  // filters
  var where = {}
  if (req.query.ideCadastro) {
    where.ideCadastro = req.query.ideCadastro
  }
  if (req.query.txNomeParlamentar) {
    where.txNomeParlamentar = {
      $iLike: '%' + req.query.txNomeParlamentar + '%'
    }
  }
  if (req.query.nuCarteiraParlamentar) {
    where.nuCarteiraParlamentar = req.query.nuCarteiraParlamentar
  }
  if (req.query.nuLegislatura) {
    where.nuLegislatura = req.query.nuLegislatura
  }
  if (req.query.sgUF) {
    where.sgUF = req.query.sgUF
  }
  if (req.query.sgPartido) {
    where.sgPartido = req.query.sgPartido
  }
  console.log(req.offset);
  console.log(req.limit);
  models.Parlamentar
    .findAndCountAll({
      where: where,
      offset: req.offset,
      limit: req.limit,
      order: [
        ['txNomeParlamentar', 'ASC'],
      ]
    })
    .then(function(result) {
      res.json({
        count: result.count,
        pages: Math.ceil(result.count / req.limit),
        data: result.rows
      })
    })
    .catch(function(err) {
      res.send(err);
    });

});

router.get('/subcotas', function(req, res, next) {
  // filters
  var where = {}
  if (req.query.numSubCota) {
    where.numSubCota = req.query.numSubCota
  }
  if (req.query.txtDescricao) {
    where.txtDescricao = {
      $iLike: '%' + req.query.txtDescricao + '%'
    }
  }

  models.SubCota
    .findAndCountAll({
      where: where,
      include: [
        {model: models.EspecificacaoSubCota}, 
      ],
      offset: req.offset,
      limit: req.limit,
      order: [
        ['txtDescricao', 'ASC'],
      ]
    })
    .then(function(result) {
      res.json({
        count: result.count,
        pages: Math.ceil(result.count / req.limit),
        data: result.rows
      })
    })
    .catch(function(err) {
      res.send(err);
    });

});

router.get('/despesas', function(req, res, next) {
  // filters
  var where = {}
  if (req.query.txtFornecedor) {
    where.txtFornecedor = {
      $iLike: '%' + req.query.txtFornecedor + '%'
    }
  }
  if (req.query.numAno) {
    where.numAno = req.query.numAno
  }
  if (req.query.numMes) {
    where.numMes = req.query.numMes
  }
  if (req.query.parlamentarId) {
    where.parlamentarId = req.query.parlamentarId
  }
  if (req.query.subCotaId) {
    where.subCotaId = req.query.subCotaId
  }
  if (req.query.especificacaoSubCotaId) {
    where.especificacaoSubCotaId = req.query.especificacaoSubCotaId
  }

  models.Despesa
    .findAndCountAll({
      where: where,
      offset: req.offset,
      limit: req.limit,
      order: [
        ['datEmissao', 'DESC'],
      ]
    })
    .then(function(result) {
      res.json({
        count: result.count,
        pages: Math.ceil(result.count / req.limit),
        data: result.rows
      })
    })
    .catch(function(err) {
      res.send(err);
    });

});

module.exports = router;
