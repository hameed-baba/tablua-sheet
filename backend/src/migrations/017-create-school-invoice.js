"use strict";

/**  @type {import('sequelize-cli') .Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("school_invoices", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      school_session_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      school_term_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      amount_to_pay: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0,
      },
      amount_to_paid: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0,
      },
      balance: {
        type: Sequelize.VIRTUAL,
      },
      status: {
        type: Sequelize.ENUM("unpaid", "paid", "overdue", "free"),
        defaultValue: "unpaid",
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("school_invoices");
  },
};
