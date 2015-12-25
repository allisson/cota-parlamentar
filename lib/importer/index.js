var fs = require('fs');
var async = require('async');
var XmlStream = require('xml-stream');
var Set = require('collections/set');
var models = require('../../models');

module.exports = function(xmlFilePath) {
  models.sequelize.sync().then(function() {

    var xmlFile = fs.createReadStream(xmlFilePath);
    var xml = new XmlStream(xmlFile, 'utf16le');
    var parlamentarSet = new Set({});
    var subCotaSet = new Set({});
    var especificacaoSubCotaSet = new Set({});

    xml.on('endElement: DESPESA', function(despesa) {
      xml.pause();

      async.series(
        [
          function(callback) {
            if (parlamentarSet.get(despesa.ideCadastro) == undefined) {
              models.Parlamentar
                .findCreateFind({
                  where: {
                    ideCadastro: despesa.ideCadastro
                  },
                  defaults: {
                    txNomeParlamentar: despesa.txNomeParlamentar,
                    nuCarteiraParlamentar: (despesa.nuCarteiraParlamentar) ? despesa.nuCarteiraParlamentar : null,
                    nuLegislatura: (despesa.nuLegislatura) ? despesa.nuLegislatura : null,
                    sgUF: (despesa.sgUF) ? despesa.sgUF : null,
                    sgPartido: (despesa.sgPartido) ? despesa.sgPartido : null,
                    codLegislatura: (despesa.codLegislatura) ? despesa.codLegislatura : null
                  }
                })
                .spread(function(object, created) {
                  callback(null, null);
                })
                .catch(function(err) {
                  callback(err, null);
                });
            } else {
              callback(null, null);
            }
          },
          function(callback) {
            if (subCotaSet.get(despesa.numSubCota) == undefined) {
              models.SubCota
                .findCreateFind({
                  where: {
                    numSubCota: despesa.numSubCota
                  },
                  defaults: {
                    txtDescricao: despesa.txtDescricao
                  }
                })
                .spread(function(object, created) {
                  callback(null, null);
                })
                .catch(function(err) {
                  callback(err, null);
                });
            } else {
              callback(null, null);
            }
          },
          function(callback) {
            if (despesa.numEspecificacaoSubCota == '0') {
              callback(null, null);
            } else {
              if (especificacaoSubCotaSet.get(despesa.numEspecificacaoSubCota) == undefined) {
                models.EspecificacaoSubCota
                  .findCreateFind({
                    where: {
                      subCotaId: despesa.numSubCota,
                      numEspecificacaoSubCota: despesa.numEspecificacaoSubCota,
                    },
                    defaults: {
                      txtDescricaoEspecificacao: despesa.txtDescricaoEspecificacao
                    }
                  })
                  .spread(function(object, created) {
                    callback(null, null);
                  })
                  .catch(function(err) {
                    callback(err, null);
                  });
              } else {
                callback(null, null);
              }
            }
          },
          function(callback) {
            models.Despesa
              .create({
                parlamentarId: despesa.ideCadastro,
                subCotaId: despesa.numSubCota,
                especificacaoSubCotaId: (despesa.numEspecificacaoSubCota != '0') ? despesa.numEspecificacaoSubCota : null,
                txtFornecedor: despesa.txtFornecedor,
                txtCNPJCPF: despesa.txtCNPJCPF,
                txtNumero: despesa.txtNumero,
                indTipoDocumento: despesa.indTipoDocumento,
                datEmissao: (despesa.datEmissao) ? despesa.datEmissao : new Date(parseInt(despesa.numAno), parseInt(despesa.numMes -1 ), 1),
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
              })
              .then(function(object) {
                callback(null, null);
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
          parlamentarSet.add(despesa.ideCadastro);
          subCotaSet.add(despesa.numSubCota);
          especificacaoSubCotaSet.add(despesa.numEspecificacaoSubCota);
          xml.resume();
        });
    });

    xml.on('end', function() {
      console.log('acabou');
    });

  });

};
