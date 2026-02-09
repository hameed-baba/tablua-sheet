"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class SchooInvoice extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      SchooInvoice.belongsTo(models.SchoolSession, {
        foreignKey: "school_session_id",
        as: "Session",
      });

      SchooInvoice.belongsTo(models.SchoolTerm, {
        foreignKey: "school_term_id",
        as: "Term",
      });
    }
  }

  SchooInvoice.init(
    {
      school_session_id: DataTypes.INTEGER,
      school_term_id: DataTypes.INTEGER,
      amount_to_pay: DataTypes.DECIMAL,
      amount_to_paid: DataTypes.DECIMAL,
      balance: {
        type: DataTypes.VIRTUAL(DataTypes.DECIMAL(10, 2)),
        get() {
          const toPay = Number(this.amount_to_pay) || 0;
          const paid = Number(this.amount_to_paid) || 0;
          return toPay - paid;
        },
      },
      status: DataTypes.ENUM("unpaid", "paid", "overdue", "free"),
    },
    {
      sequelize,
      modelName: "SchooInvoice",
      tableName: "school_invoices",
      paranoid: true,
    },
  );

  return SchooInvoice;
};
