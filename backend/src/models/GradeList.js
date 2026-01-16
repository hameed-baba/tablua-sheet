"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class GradeList extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      GradeList.hasMany(models.GradeSystem, {
        foreignKey: "grade_list_id",
        as: "gradeSystems",
      });

  

      GradeList.hasMany(models.SchoolClass, {
        foreignKey: "grade_list_id",
        as: "SchoolClasses",
      });
    }
  }

  GradeList.init(
    {
      grade_name: DataTypes.STRING,
      grade_type: DataTypes.STRING,
      allow_grade:DataTypes.BOOLEAN,
      allow_remark:DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "GradeList",
      tableName: "grade_lists",
      paranoid: true,
    }
  );

  return GradeList;
};
