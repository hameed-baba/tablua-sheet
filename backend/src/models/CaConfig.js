"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class CaConfig extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  CaConfig.init(
    {
      ca_count: DataTypes.INTEGER,
      ca_total_makrs: DataTypes.INTEGER,
      eaxm_total_mark: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "CaConfig",
      tableName: "ca_configs",
      paranoid: true,
    }
  );
  return CaConfig;
};
