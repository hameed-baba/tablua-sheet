'use strict';

const { Model } = require('sequelize');

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
        foreignKey: 'schoolClassId',
        as: 'Class'
      });
      ClassSubjectAssign.belongsTo(models.SchoolSubject, {
        foreignKey: 'schoolSubjectId',
        as: 'Subject'
      });
      ClassSubjectAssign.belongsTo(models.SchoolStaff, {
        foreignKey: 'schoolStaffId',
        as: 'Staff'
      });
    }
  }

  ClassSubjectAssign.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    schoolClassId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'school_classes',
        key: 'id'
      }
    },
    schoolSubjectId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'school_subjects',
        key: 'id'
      }
    },
    schoolStaffId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'school_staffs',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'ClassSubjectAssign',
    tableName: 'class_subject_assigns',
    paranoid:true
  });

  return ClassSubjectAssign;
};