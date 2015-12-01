'use strict';
module.exports = function(sequelize, DataTypes) {
  var Subcota = sequelize.define('Subcota', {
    num_sub_cota: {type: DataTypes.INTEGER, primaryKey: true},
    txt_descricao: DataTypes.STRING
  }, {
    tableName: 'subcota',
    underscored: true,
    classMethods: {
      associate: function(models) {
        Subcota.hasMany(models.EspecificacaoSubcota),
        Subcota.hasMany(models.Despesa)
      }
    }
  });
  return Subcota;
};