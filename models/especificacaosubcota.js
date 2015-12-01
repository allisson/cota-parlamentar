'use strict';
module.exports = function(sequelize, DataTypes) {
  var EspecificacaoSubcota = sequelize.define('EspecificacaoSubcota', {
    num_especificacao_sub_cota: {type: DataTypes.INTEGER, primaryKey: true},
    txt_descricao_especificacao: DataTypes.STRING
  }, {
    tableName: 'especificacaosubcota',
    underscored: true,
    classMethods: {
      associate: function(models) {
        EspecificacaoSubcota.belongsTo(models.Subcota, {
          onDelete: 'CASCADE',
          foreignKey: {
            allowNull: false
          }
        }),
        EspecificacaoSubcota.hasMany(models.Despesa)
      }
    }
  });
  return EspecificacaoSubcota;
};