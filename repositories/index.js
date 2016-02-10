'use strict';

var Promise = require('bluebird');
var models = require('../models');

function ParlamentarRepository() {
  this.table = 'parlamentares';
};

ParlamentarRepository.prototype.get = function(id) {
  var table = this.table;
  return new Promise(function(resolve, reject) {
    models.knex(table)
      .where('ideCadastro', id)
      .then(function(result) {
        if (result.length === 0) {
          resolve(null);
        } else {
          resolve(result[0]);
        }
      })
      .catch(function(err) {
        reject(err);
      });
  });
};

ParlamentarRepository.prototype.list = function(limit, offset, query) {
  var table = this.table;
  var txNomeParlamentar = query.txNomeParlamentar;
  delete query.txNomeParlamentar;
  delete query.page;
  return new Promise(function(resolve, reject) {
    var knexQuery = models.knex(table)
      .where(query);
    if (txNomeParlamentar) {
      knexQuery
        .andWhere('txNomeParlamentar', '~*', txNomeParlamentar);
    }
    var knexQueryCount = knexQuery.clone();
    knexQuery
      .limit(limit)
      .offset(offset)
      .then(function(result) {
        knexQueryCount
          .count()
          .then(function(count) {
            resolve({
              count: parseInt(count[0].count),
              pages: Math.ceil(count[0].count / limit),
              data: result
            });
          });
      })
      .catch(function(err) {
        reject(err);
      });
  });
};

ParlamentarRepository.prototype.listSummary = function(limit, offset, query) {
  var table = this.table;
  delete query.page;
  return new Promise(function(resolve, reject) {
    models.knex(table)
      .leftOuterJoin('despesas', 'parlamentares.ideCadastro', 'despesas.parlamentarId')
      .select('parlamentares.*')
      .sum('despesas.vlrLiquido as total')
      .orderBy('total', 'desc')
      .groupBy('parlamentares.ideCadastro')
      .where(query)
      .limit(limit)
      .offset(offset)
      .then(function(result) {
        models.knex(table)
          .count()
          .from(function() {
            this
              .from('parlamentares')
              .select('parlamentares.*')
              .leftOuterJoin('despesas', 'parlamentares.ideCadastro', 'despesas.parlamentarId')
              .where(query)
              .groupBy('parlamentares.ideCadastro')
              .as('t1')
          })
          .then(function(count) {
            resolve({
              count: parseInt(count[0].count),
              pages: Math.ceil(count[0].count / limit),
              data: result
            });
          });
      })
      .catch(function(err) {
        reject(err);
      });
  });
};

function SubCotaRepository() {
  this.table = 'subcotas';
};

SubCotaRepository.prototype.get = function(id) {
  var table = this.table;
  return new Promise(function(resolve, reject) {
    models.knex(table)
      .where('numSubCota', id)
      .then(function(result) {
        if (result.length === 0) {
          resolve(null);
        } else {
          resolve(result[0]);
        }
      });
  });
};

SubCotaRepository.prototype.list = function(limit, offset, query) {
  var table = this.table;
  var txtDescricao = query.txtDescricao;
  delete query.txtDescricao;
  delete query.page;
  return new Promise(function(resolve, reject) {
    var knexQuery = models.knex(table)
      .where(query);
    if (txtDescricao) {
      knexQuery.andWhere('txtDescricao', '~*', txtDescricao);
    }
    var knexQueryCount = knexQuery.clone();
    knexQuery
      .limit(limit)
      .offset(offset)
      .then(function(result) {
        knexQueryCount
          .count()
          .then(function(count) {
            resolve({
              count: parseInt(count[0].count),
              pages: Math.ceil(count[0].count / limit),
              data: result
            });
          });
      })
      .catch(function(err) {
        reject(err);
      });
  });
};

function DespesaRepository() {
  this.table = 'despesas';
};

DespesaRepository.prototype.get = function(id) {
  var table = this.table;
  return new Promise(function(resolve, reject) {
    models.knex(table)
      .where('id', id)
      .then(function(result) {
        if (result.length === 0) {
          resolve(null);
        } else {
          resolve(result[0]);
        }
      });
  });
};

DespesaRepository.prototype.list = function(limit, offset, query) {
  var table = this.table;
  delete query.page;
  return new Promise(function(resolve, reject) {
    var knexQuery = models.knex(table)
      .where(query);
    var knexQueryCount = knexQuery.clone();
    knexQuery
      .limit(limit)
      .offset(offset)
      .then(function(result) {
        knexQueryCount
          .count()
          .then(function(count) {
            resolve({
              count: parseInt(count[0].count),
              pages: Math.ceil(count[0].count / limit),
              data: result
            });
          });
      })
      .catch(function(err) {
        reject(err);
      });
  });
};

module.exports = {
  ParlamentarRepository: ParlamentarRepository,
  SubCotaRepository: SubCotaRepository,
  DespesaRepository: DespesaRepository
};
