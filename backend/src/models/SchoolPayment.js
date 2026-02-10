"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class SchoolPayment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      SchoolPayment.belongsTo(models.SchoolInvoice, {
        foreignKey: "invoice_id",
        as: "Invoice",
      });
    }
  }

  SchoolPayment.init(
    {
      invoice_id: DataTypes.INTEGER,
      amount_to_paid: DataTypes.DECIMAL,
      getway: DataTypes.STRING,
      getway_ref: DataTypes.STRING,
      payment_method: DataTypes.ENUM("online", "offline"),
      payment_status: DataTypes.ENUM("success", "failed"),
      description: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "SchoolPayment",
      tableName: "school_payments",
      paranoid: true,
    },
  );

  return SchoolPayment;
};
