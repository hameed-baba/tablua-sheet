"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class SchoolClass extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      SchoolClass.belongsTo(models.SchoolSection, {
        foreignKey: "section_id",
        as: "Section",
      });

         SchoolClass.belongsTo(models.SchoolStaff, {
        foreignKey: "school_staff_id",
        as: "SchoolStaff",
      });

         SchoolClass.belongsTo(models.GradeList, {
        foreignKey: "grade_list_id",
        as: "GradeList",
      });
    
    }
  }

  SchoolClass.init(
    {
      class_name: DataTypes.STRING,
      section_id: DataTypes.INTEGER,
      grade_list_id: DataTypes.INTEGER,
      school_staff_id:DataTypes.INTEGER
    },
    {
      sequelize,
      modelName: "SchoolClass",
      tableName: "school_classes",
      paranoid: true,
    }
  );

  return SchoolClass;
};
