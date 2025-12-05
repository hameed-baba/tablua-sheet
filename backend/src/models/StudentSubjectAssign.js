"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class StudentSubjectAssign extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      StudentSubjectAssign.belongsTo(models.SchoolStudent, {
        foreignKey: "student_id",
        as: "Student",
      });

      StudentSubjectAssign.belongsTo(models.SchoolClass, {
        foreignKey: "current_class_id",
        as: "Class",
      });

      StudentSubjectAssign.belongsTo(models.SchoolSubject, {
        foreignKey: "school_subject_id",
        as: "Subject",
      });

      StudentSubjectAssign.belongsTo(models.SchoolSession, {
        foreignKey: "current_session_id",
        as: "Session",
      });

      StudentSubjectAssign.belongsTo(models.SchoolTerm, {
        foreignKey: "current_term_id",
        as: "Term",
      });
    }
  }

  StudentSubjectAssign.init(
    {
      current_class_id: DataTypes.INTEGER,
      school_subject_id: DataTypes.INTEGER,
      student_id: DataTypes.INTEGER,
      current_session_id: DataTypes.INTEGER,
      current_term_id: DataTypes.INTEGER,
      ca_1_score: DataTypes.STRING,
      ca_2_score: DataTypes.STRING,
      ca_3_score: DataTypes.STRING,
      ca_4_score: DataTypes.STRING,
      exam_score: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "StudentSubjectAssign",
      tableName: "student_subject_assigns",
      paranoid: true,
    }
  );

  return StudentSubjectAssign;
};
