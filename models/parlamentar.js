'use strict';
module.exports = function(sequelize, DataTypes) {
  var Parlamentar = sequelize.define('Parlamentar', {
    ideCadastro: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    txNomeParlamentar: DataTypes.STRING,
    nuCarteiraParlamentar: DataTypes.INTEGER,
    nuLegislatura: DataTypes.INTEGER,
    sgUF: DataTypes.STRING(2),
    sgPartido: DataTypes.STRING(20),
    codLegislatura: DataTypes.INTEGER
  }, {
    tableName: 'parlamentar',
    classMethods: {
      associate: function(models) {
        Parlamentar.hasMany(models.Despesa, {
          foreignKey: {
            name: 'parlamentarId'
          }
        })
      }
    }
  });
  return Parlamentar;
};