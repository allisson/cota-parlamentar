'use strict';
module.exports = function(sequelize, DataTypes) {
  var Despesa = sequelize.define('Despesa', {
    txt_numero: DataTypes.STRING,
    ind_tipo_documento: DataTypes.INTEGER,
    dat_emissao: DataTypes.DATE,
    vlr_documento: DataTypes.DECIMAL,
    vlr_glosa: DataTypes.DECIMAL,
    vlr_liquido: DataTypes.DECIMAL,
    num_mes: DataTypes.INTEGER,
    num_ano: DataTypes.INTEGER,
    num_parcela: DataTypes.INTEGER,
    txt_passageiro: DataTypes.STRING,
    txt_trecho: DataTypes.STRING,
    num_lote: DataTypes.INTEGER,
    num_ressarcimento: DataTypes.INTEGER
  }, {
    tableName: 'despesa',
    underscored: true,
    classMethods: {
      associate: function(models) {
        Despesa.belongsTo(models.Parlamentar, {
          onDelete: 'CASCADE',
          foreignKey: {
            allowNull: false
          }
        }),
        Despesa.belongsTo(models.Subcota, {
          onDelete: 'CASCADE',
          foreignKey: {
            allowNull: false
          }
        }),
        Despesa.belongsTo(models.EspecificacaoSubcota, {
          onDelete: 'CASCADE',
          foreignKey: {
            allowNull: true
          }
        }),
        Despesa.belongsTo(models.Fornecedor, {
          onDelete: 'CASCADE',
          foreignKey: {
            allowNull: false
          }
        })
      }
    }
  });
  return Despesa;
};