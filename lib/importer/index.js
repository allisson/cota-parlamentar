var fs = require('fs');
var async = require('async');
var XmlStream = require('xml-stream');
var models = require('../../models');

module.exports = function(xmlFilePath) {
  models.sequelize.sync().then(function() {

    var xmlFile = fs.createReadStream(xmlFilePath);
    var xml = new XmlStream(xmlFile, 'utf16le');

    xml.on('endElement: DESPESA', function(despesa) {
      xml.pause();

      async.series([
        function(callback) {
          models.Parlamentar
          .findOne({
            where: {
              ideCadastro: despesa.ideCadastro
            }
          })
          .then(function(object) {
            if (object) {
              callback(null, object);
            } else {
              models.Parlamentar.create({
                ideCadastro: despesa.ideCadastro,
                txNomeParlamentar: despesa.txNomeParlamentar,
                nuCarteiraParlamentar: (despesa.nuCarteiraParlamentar) ? despesa.nuCarteiraParlamentar : null,
                nuLegislatura: (despesa.nuLegislatura) ? despesa.nuLegislatura : null,
                sgUF: (despesa.sgUF) ? despesa.sgUF : null,
                sgPartido: (despesa.sgPartido) ? despesa.sgPartido : null,
                codLegislatura: (despesa.codLegislatura) ? despesa.codLegislatura : null
              }).then(function(object) {
                callback(null, object);
              })
              .catch(function(err) {
                callback(err, null);
              });
            }
          })
          .catch(function(err) {
            callback(err, null);
          });
        },
        function(callback) {
          models.SubCota
          .findOne({
            where: {
              numSubCota: despesa.numSubCota
            }
          })
          .then(function(object) {
            if (object) {
              callback(null, object);
            } else {
              models.SubCota.create({
                numSubCota: despesa.numSubCota,
                txtDescricao: despesa.txtDescricao
              }).then(function(object) {
                callback(null, object);
              })
              .catch(function(err) {
                callback(err, null);
              });
            }
          })
          .catch(function(err) {
            callback(err, null);
          });
        },
        function(callback) {
          if (despesa.numEspecificacaoSubCota == '0') {
            callback(null, null);
          } else {
            models.EspecificacaoSubCota
            .findOne({
              where: {
                subCotaId: despesa.numSubCota,
                numEspecificacaoSubCota: despesa.numEspecificacaoSubCota
              }
            })
            .then(function(object) {
              if (object) {
                callback(null, object);
              } else {
                models.EspecificacaoSubCota.create({
                  subCotaId: despesa.numSubCota,
                  numEspecificacaoSubCota: despesa.numEspecificacaoSubCota,
                  txtDescricaoEspecificacao: despesa.txtDescricaoEspecificacao
                }).then(function(object) {
                  callback(null, object);
                })
                .catch(function(err) {
                  callback(err, null);
                });
              }
            })
            .catch(function(err) {
              callback(err, null);
            });
          }
        },
        function(callback) {
          models.Despesa
          .findOne({
            where: {
              parlamentarId: despesa.ideCadastro,
              subCotaId: despesa.numSubCota,
              especificacaoSubCotaId: (despesa.numEspecificacaoSubCota != '0') ? despesa.numEspecificacaoSubCota : null,
                txtFornecedor: despesa.txtFornecedor,
              txtCNPJCPF: despesa.txtCNPJCPF,
              txtNumero: despesa.txtNumero,
              datEmissao: despesa.datEmissao
            }
          })
          .then(function(object) {
            if (object) {
              callback(null, object);
            } else {
              models.Despesa.create({
                parlamentarId: despesa.ideCadastro,
                subCotaId: despesa.numSubCota,
                especificacaoSubCotaId: (despesa.numEspecificacaoSubCota != '0') ? despesa.numEspecificacaoSubCota : null,
                  txtFornecedor: despesa.txtFornecedor,
                txtCNPJCPF: despesa.txtCNPJCPF,
                txtNumero: despesa.txtNumero,
                indTipoDocumento: despesa.indTipoDocumento,
                datEmissao: despesa.datEmissao,
                vlrDocumento: despesa.vlrDocumento,
                vlrGlosa: despesa.vlrGlosa,
                vlrLiquido: despesa.vlrLiquido,
                numMes: despesa.numMes,
                numAno: despesa.numAno,
                numParcela: despesa.numParcela,
                txtPassageiro: despesa.txtPassageiro,
                txtTrecho: despesa.txtTrecho,
                numLote: despesa.numLote,
                numRessarcimento: (despesa.numRessarcimento) ? despesa.numRessarcimento : null,
              }).then(function(object) {
                callback(null, object);
              })
              .catch(function(err) {
                callback(err, null);
              });
            }
          })
          .catch(function(err) {
            callback(err, null);
          });
        }
      ],
      // optional callback
      function(err, results) {
        if (err) {
          console.log(err);
          console.log(despesa);
        }
        xml.resume();
      });
    });

    xml.on('end', function() {
      console.log('acabou');
    });

  });

};
