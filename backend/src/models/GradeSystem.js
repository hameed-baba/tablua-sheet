"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class GradeSystem extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      GradeSystem.belongsTo(models.GradeList, {
        foreignKey: "gradeListId",
        as: "GradeList",
      });
    }
  }
  GradeSystem.init(
    {
      grade_list_id: DataTypes.INTEGER,
      from_mark: DataTypes.DECIMAL,
      to_mark: DataTypes.DECIMAL,
      grade: DataTypes.STRING,
      remark: DataTypes.STRING,
      principal_remark: DataTypes.STRING,
      class_teacher_remark: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "GradeSystem",
      tableName: "grade_systems",
      paranoid: true,
    },
  );

  return GradeSystem;
};
