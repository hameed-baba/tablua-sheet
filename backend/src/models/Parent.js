"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Parent extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Parent.hasMany(models.SchoolStudent, {
        foreignKey: "parent_id",
        as: "Students",
      });
    }
  }

  Parent.init(
    {
      full_name: {
        type: DataTypes.STRING,
      },
      religion: {
        type: DataTypes.ENUM("islam","christianity","other"),
      },
      gender: {
        type: DataTypes.ENUM("male", "female"),
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
      phone_number: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: "Parent",
      tableName: "parents",
      paranoid: true,
    }
  );

  return Parent;
};
