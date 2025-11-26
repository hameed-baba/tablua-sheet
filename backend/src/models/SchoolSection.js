"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class SchoolSection extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {}
  }

  SchoolSection.init(
    {
      section_name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "SchoolSection",
      tableName: "school_sections",
      paranoid: true,

    }
  );

  return SchoolSection;
};
