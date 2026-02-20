"use strict";

/**  @type {import('sequelize-cli') .Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("school_pyaments", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      invoice_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      amount_paid: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0,
      },
      getway: {
        type: Sequelize.STRING,
      },
      getway_ref: {
        type: Sequelize.STRING,
      },
      payment_method: {
        type: Sequelize.ENUM("online", "offline"),
      },
      payment_status: {
        type: Sequelize.ENUM("success", "failed"),
      },
      description: {
        type: Sequelize.TEXT,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("school_pyaments");
  },
};
