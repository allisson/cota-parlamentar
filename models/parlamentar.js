'use strict';
module.exports = function(sequelize, DataTypes) {
  var Parlamentar = sequelize.define('Parlamentar', {
    ide_cadastro: {type: DataTypes.INTEGER, primaryKey: true},
    tx_nome_parlamentar: DataTypes.STRING,
    nu_carteira_parlamentar: DataTypes.INTEGER,
    nu_legislatura: DataTypes.INTEGER,
    sg_uf: DataTypes.STRING(2),
    sg_partido: DataTypes.STRING(10),
    cod_legislatura: DataTypes.INTEGER,
  }, {
    tableName: 'parlamentar',
    underscored: true,
    classMethods: {
      associate: function(models) {
        Parlamentar.hasMany(models.Despesa)
      }
    }
  });
  return Parlamentar;
};