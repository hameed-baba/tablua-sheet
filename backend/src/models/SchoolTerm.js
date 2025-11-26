"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class SchoolTerm extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {}
  }

  SchoolTerm.init(
    {
      term_name: DataTypes.STRING,
      status: DataTypes.ENUM("active", "inactive"),
    },
    {
      sequelize,
      modelName: "SchoolTerm",
      tableName: "school_terms",
      paranoid: true,
    }
  );

  return SchoolTerm;
};
