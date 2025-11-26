"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class SchoolStudent extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      SchoolStudent.belongsTo(models.SchoolClass, {
        foreignKey: "current_class_id",
        as: "Class",
      });
      SchoolStudent.belongsTo(models.SchoolSession, {
        foreignKey: "current_session_id",
        as: "Session",
      });
      SchoolStudent.belongsTo(models.Parent, {
        foreignKey: "parent_id",
        as: "Parent",
      });
    }
  }

  SchoolStudent.init(
    {
      full_name: {
        type: DataTypes.STRING,
      },
      gender: {
        type: DataTypes.ENUM("male", "female"),
      },
      dob: {
        type: DataTypes.STRING,
      },
      address: {
        type: DataTypes.STRING,
      },
      state: {
        type: DataTypes.STRING,
      },
      local_gov: {
        type: DataTypes.STRING,
      },
      religion: {
        type: DataTypes.ENUM("islam", "christianity", "other"),
      },
      blood_group: {
        type: DataTypes.STRING,
      },
      admission_number: {
        type: DataTypes.STRING,
      },
      admitted_class: {
        type: DataTypes.INTEGER,
      },
      admitted_session: {
        type: DataTypes.INTEGER,
      },
      parent_relation: {
        type: DataTypes.STRING,
      },
      student_status: {
        type: DataTypes.ENUM(
          "active",
          "graduated",
          "transfer",
          "expell",
          "leave"
        ),
      },
      current_class_id: {
        type: DataTypes.INTEGER,
      },
      current_session_id: {
        type: DataTypes.INTEGER,
      },
      parent_id: {
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      modelName: "SchoolStudent",
      tableName: "school_students",
      paranoid: true,
    }
  );

  return SchoolStudent;
};
