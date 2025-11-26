"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class SchoolSession extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }

  SchoolSession.init(
    {
      session_name: DataTypes.STRING,
      status: DataTypes.ENUM("active", "inactive"),
      payment_status: DataTypes.ENUM("unpaid", "paid", "overdue", "free"),
      first_term_start: DataTypes.DATE,
      first_term_end: DataTypes.DATE,
      second_term_start: DataTypes.DATE,
      second_term_end: DataTypes.DATE,
      third_term_start: DataTypes.DATE,
      third_term_end: DataTypes.DATE,
    },

    {
      sequelize,
      modelName: "SchoolSession",
      tableName: "school_sessions",
      paranoid: true,
    }
  );

  return SchoolSession;
};
