'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ClassMaster extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ClassMaster.belongsTo(models.SchoolStaff, {
        foreignKey: 'schoolStaffId',
        as: 'Staff'
      });
      ClassMaster.belongsTo(models.SchoolSection, {
        foreignKey: 'schoolSectionId',
        as: 'Section'
      });
      ClassMaster.belongsTo(models.SchoolClass, {
        foreignKey: 'schoolClassId',
        as: 'Class'
      });
    }
  }

  ClassMaster.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    schoolId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    schoolStaffId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'school_staffs',
        key: 'id'
      }
    },
    schoolSectionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'school_sections',
        key: 'id'
      }
    },
    schoolClassId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'school_classes',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'ClassMaster',
    tableName: 'class_masters',
    paranoid:true
  });

  return ClassMaster;
};