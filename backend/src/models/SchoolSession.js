"use strict";

const { Model, ENUM } = require("sequelize");

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
      // payment_status: ENUM("unpaid", "paid", "overdue", "free"),
      first_term_start: DataTypes.DATE,
      first_term_end: DataTypes.DATE,
      second_term_start: DataTypes.DATE,
      second_term_end: DataTypes.DATE,
      third_term_start: DataTypes.DATE,
      third_term_end: DataTypes.DATE,
      first_term_payment_mode: DataTypes.ENUM("paid", "free"),
      second_term_payment_mode: DataTypes.ENUM("paid", "free"),
      third_term_payment_mode: DataTypes.ENUM("paid", "free"),
      first_term_was_paid: DataTypes.BOOLEAN,
      second_term_was_paid: DataTypes.BOOLEAN,
      third_term_was_paid: DataTypes.BOOLEAN,
    },

    {
      sequelize,
      modelName: "SchoolSession",
      tableName: "school_sessions",
      paranoid: true,
    },
  );

  return SchoolSession;
};
