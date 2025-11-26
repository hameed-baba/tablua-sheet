"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class SchoolSubject extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }

  SchoolSubject.init(
    {
      subject_name: {
        type: DataTypes.STRING,
      },
      section_ids: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: "SchoolSubject",
      tableName: "school_subjects",
      paranoid:true
    }
  );

  return SchoolSubject;
};
