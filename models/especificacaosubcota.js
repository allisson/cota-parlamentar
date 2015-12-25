'use strict';
module.exports = function(sequelize, DataTypes) {
  var EspecificacaoSubCota = sequelize.define('EspecificacaoSubCota', {
    numEspecificacaoSubCota: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    txtDescricaoEspecificacao: DataTypes.STRING
  }, {
    tableName: 'especificacaosubcota',
    classMethods: {
      associate: function(models) {
        EspecificacaoSubCota.belongsTo(models.SubCota, {
          onDelete: 'CASCADE',
          foreignKey: {
            name: 'subCotaId',
            allowNull: false
          }
        }),
        EspecificacaoSubCota.hasMany(models.Despesa, {
          foreignKey: {
            name: 'especificacaoSubCotaId'
          }
        })
      }
    }
  });
  return EspecificacaoSubCota;
};