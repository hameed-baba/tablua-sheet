"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class ClassSubjectAssign extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ClassSubjectAssign.belongsTo(models.SchoolClass, {
        foreignKey: "school_class_id",
        as: "Class",
      });
      ClassSubjectAssign.belongsTo(models.SchoolSubject, {
        foreignKey: "school_subject_id",
        as: "Subject",
      });
      ClassSubjectAssign.belongsTo(models.SchoolStaff, {
        foreignKey: "school_staff_id",
        as: "Staff",
      });

      ClassSubjectAssign.hasMany(models.StudentSubjectAssign, {
        foreignKey: "school_subject_id",
        sourceKey: "school_subject_id",
        as: "StudentAssignments",
      });
    }
  }

  ClassSubjectAssign.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      school_class_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "school_classes",
          key: "id",
        },
      },
      school_subject_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "school_subjects",
          key: "id",
        },
      },
      school_staff_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "school_staffs",
          key: "id",
        },
      },
    },
    {
      sequelize,
      modelName: "ClassSubjectAssign",
      tableName: "class_subject_assigns",
      paranoid: true,
    },
  );

  return ClassSubjectAssign;
};
