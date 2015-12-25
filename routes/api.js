var express = require('express');
var router = express.Router();
var models = require('../models');

router.get('/parlamentares', function(req, res, next) {

  // pagination stuff
  var page = 1;
  if (req.query.page) {
    page = req.query.page;
  }
  var offset = (page - 1) * 20;

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

  models.Parlamentar
    .findAndCountAll({
      where: where,
      offset: offset,
      limit: 20,
      order: [
        ['txNomeParlamentar', 'ASC'],
      ]
    })
    .then(function(result) {
      res.json({
        count: result.count,
        data: result.rows
      })
    })
    .catch(function(err) {
      res.send(err);
    });

});

module.exports = router;
