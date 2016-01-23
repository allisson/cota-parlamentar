var express = require('express');
var router = express.Router();
var models = require('../models');

router.use(function(req, res, next) {
  var page = 1;
  if (req.query.page) {
    page = req.query.page;
  }
  var limit = 30
  var offset = (page - 1) * limit;
  req.limit = limit;
  req.offset = offset;
  res.set('Cache-Control', 'public, max-age=86400');
  next();
});

router.get('/parlamentares', function(req, res, next) {

  var where = {}
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
  if (req.query.codLegislatura) {
    where.codLegislatura = req.query.codLegislatura
  }

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
      res.status(500).send(err);
    });

});

router.get('/parlamentares/:id', function(req, res, next) {

  models.Parlamentar.findById(req.params.id)
    .then(function(object) {
      if (object) {
        res.json(object);
      } else {
        res.status(404).json({
          error: 'Recurso não encontrado'
        });
      }
    })
    .catch(function(err) {
      res.status(500).send(err);
    });

});

router.get('/subcotas', function(req, res, next) {

  var where = {}
  if (req.query.txtDescricao) {
    where.txtDescricao = {
      $iLike: '%' + req.query.txtDescricao + '%'
    }
  }

  models.SubCota
    .findAndCountAll({
      where: where,
      include: [{
        model: models.EspecificacaoSubCota
      }, ],
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
      res.status(500).send(err);
    });

});

router.get('/subcotas/:id', function(req, res, next) {

  models.SubCota
    .findOne({
      where: {
        numSubCota: req.params.id
      },
      include: [{
        model: models.EspecificacaoSubCota
      }, ],
    })
    .then(function(object) {
      if (object) {
        res.json(object);
      } else {
        res.status(404).json({
          error: 'Recurso não encontrado'
        });
      }
    })
    .catch(function(err) {
      res.status(500).send(err);
    });

});

router.get('/despesas', function(req, res, next) {

  var where = {}

  if (req.query.txtFornecedor) {
    where.txtFornecedor = {
      $iLike: '%' + req.query.txtFornecedor + '%'
    }
  }

  if (req.query.txtCNPJCPF) {
    where.txtCNPJCPF = {
      $iLike: '%' + req.query.txtCNPJCPF + '%'
    }
  }

  if (req.query.txtNumero) {
    where.txtNumero = {
      $iLike: '%' + req.query.txtNumero + '%'
    }
  }

  if (req.query.indTipoDocumento) {
    where.indTipoDocumento = req.query.indTipoDocumento
  }

  if (req.query.datEmissao) {
    where.datEmissao = req.query.datEmissao
  }
  if (req.query.datEmissao__lt || req.query.datEmissao__lte || req.query.datEmissao__gt || req.query.datEmissao__gte) {
    where.datEmissao = {};
  }
  if (req.query.datEmissao__lt) {
    where.datEmissao.$lt = req.query.datEmissao__lt
  }
  if (req.query.datEmissao__lte) {
    where.datEmissao.$lte = req.query.datEmissao__lte
  }
  if (req.query.datEmissao__gt) {
    where.datEmissao.$gt = req.query.datEmissao__gt
  }
  if (req.query.datEmissao__gte) {
    where.datEmissao.$gte = req.query.datEmissao__gte
  }

  if (req.query.vlrDocumento) {
    where.vlrDocumento = req.query.vlrDocumento
  }
  if (req.query.vlrDocumento__lt || req.query.vlrDocumento__lte || req.query.vlrDocumento__gt || req.query.vlrDocumento__gte) {
    where.vlrDocumento = {};
  }
  if (req.query.vlrDocumento__lt) {
    where.vlrDocumento.$lt = req.query.vlrDocumento__lt
  }
  if (req.query.vlrDocumento__lte) {
    where.vlrDocumento.$lte = req.query.vlrDocumento__lte
  }
  if (req.query.vlrDocumento__gt) {
    where.vlrDocumento.$gt = req.query.vlrDocumento__gt
  }
  if (req.query.vlrDocumento__gte) {
    where.vlrDocumento.$gte = req.query.vlrDocumento__gte
  }

  if (req.query.vlrGlosa) {
    where.vlrGlosa = req.query.vlrGlosa
  }
  if (req.query.vlrGlosa__lt || req.query.vlrGlosa__lte || req.query.vlrGlosa__gt || req.query.vlrGlosa__gte) {
    where.vlrGlosa = {};
  }
  if (req.query.vlrGlosa__lt) {
    where.vlrGlosa.$lt = req.query.vlrGlosa__lt
  }
  if (req.query.vlrGlosa__lte) {
    where.vlrGlosa.$lte = req.query.vlrGlosa__lte
  }
  if (req.query.vlrGlosa__gt) {
    where.vlrGlosa.$gt = req.query.vlrGlosa__gt
  }
  if (req.query.vlrGlosa__gte) {
    where.vlrGlosa.$gte = req.query.vlrGlosa__gte
  }

  if (req.query.vlrLiquido) {
    where.vlrLiquido = req.query.vlrLiquido
  }
  if (req.query.vlrLiquido__lt || req.query.vlrLiquido__lte || req.query.vlrLiquido__gt || req.query.vlrLiquido__gte) {
    where.vlrLiquido = {};
  }
  if (req.query.vlrLiquido__lt) {
    where.vlrLiquido.$lt = req.query.vlrLiquido__lt
  }
  if (req.query.vlrLiquido__lte) {
    where.vlrLiquido.$lte = req.query.vlrLiquido__lte
  }
  if (req.query.vlrLiquido__gt) {
    where.vlrLiquido.$gt = req.query.vlrLiquido__gt
  }
  if (req.query.vlrLiquido__gte) {
    where.vlrLiquido.$gte = req.query.vlrLiquido__gte
  }

  if (req.query.numAno) {
    where.numAno = req.query.numAno
  }

  if (req.query.numMes) {
    where.numMes = req.query.numMes
  }

  if (req.query.numParcela) {
    where.numParcela = req.query.numParcela
  }

  if (req.query.txtPassageiro) {
    where.txtPassageiro = {
      $iLike: '%' + req.query.txtPassageiro + '%'
    }
  }

  if (req.query.txtTrecho) {
    where.txtTrecho = {
      $iLike: '%' + req.query.txtTrecho + '%'
    }
  }

  if (req.query.numLote) {
    where.numLote = req.query.numLote
  }

  if (req.query.numRessarcimento) {
    where.numRessarcimento = req.query.numRessarcimento
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
      res.status(500).send(err);
    });

});

router.get('/despesas/:id', function(req, res, next) {

  models.Despesa.findById(req.params.id)
    .then(function(object) {
      if (object) {
        res.json(object);
      } else {
        res.status(404).json({
          error: 'Recurso não encontrado'
        });
      }
    })
    .catch(function(err) {
      res.status(500).send(err);
    });

});

module.exports = router;
