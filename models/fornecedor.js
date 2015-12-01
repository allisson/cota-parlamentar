'use strict';
module.exports = function(sequelize, DataTypes) {
  var Fornecedor = sequelize.define('Fornecedor', {
    txt_cnpj_cpf: {type: DataTypes.STRING(14), primaryKey: true},
    txt_fornecedor: DataTypes.STRING
  }, {
    tableName: 'fornecedor',
    underscored: true,
    classMethods: {
      associate: function(models) {
        Fornecedor.hasMany(models.Despesa)
      }
    }
  });
  return Fornecedor;
};