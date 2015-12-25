'use strict';
module.exports = function(sequelize, DataTypes) {
  var SubCota = sequelize.define('SubCota', {
    numSubCota: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    txtDescricao: DataTypes.STRING
  }, {
    tableName: 'subcota',
    classMethods: {
      associate: function(models) {
        SubCota.hasMany(models.EspecificacaoSubCota, {
          foreignKey: {
            name: 'subCotaId'
          }
        }),
        SubCota.hasMany(models.Despesa, {
          foreignKey: {
            name: 'subCotaId'
          }
        })
      }
    }
  });
  return SubCota;
};