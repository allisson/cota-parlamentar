'use strict';
module.exports = function(sequelize, DataTypes) {
  var Despesa = sequelize.define('Despesa', {
    txtFornecedor: DataTypes.STRING,
    txtCNPJCPF: DataTypes.STRING,
    txtNumero: DataTypes.STRING,
    indTipoDocumento: DataTypes.INTEGER,
    datEmissao: DataTypes.DATE,
    vlrDocumento: DataTypes.DECIMAL,
    vlrGlosa: DataTypes.DECIMAL,
    vlrLiquido: DataTypes.DECIMAL,
    numMes: DataTypes.INTEGER,
    numAno: DataTypes.INTEGER,
    numParcela: DataTypes.INTEGER,
    txtPassageiro: DataTypes.STRING,
    txtTrecho: DataTypes.STRING,
    numLote: DataTypes.INTEGER,
    numRessarcimento: DataTypes.INTEGER
  }, {
    tableName: 'despesa',
    classMethods: {
      associate: function(models) {
        Despesa.belongsTo(models.Parlamentar, {
          onDelete: 'CASCADE',
          foreignKey: {
            name: 'parlamentarId',
            allowNull: false
          }
        }),
        Despesa.belongsTo(models.SubCota, {
          onDelete: 'CASCADE',
          foreignKey: {
            name: 'subCotaId',
            allowNull: false
          }
        }),
        Despesa.belongsTo(models.EspecificacaoSubCota, {
          onDelete: 'CASCADE',
          foreignKey: {
            name: 'especificacaoSubCotaId',
            allowNull: true
          }
        })
      }
    }
  });
return Despesa;
};
