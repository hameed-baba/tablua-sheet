"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("school_sessions", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      session_name: {
        type: Sequelize.STRING,
      },
      status: {
        type: Sequelize.ENUM("active", "inactive"),
        defaultValue: "inactive",
      },
      payment_status: {
        type: Sequelize.ENUM("uppaid", "paid", "overdue", "free"),
        defaultValue: "uppaid",
      },
      first_term_start: {
        type: Sequelize.DATE,
      },
      first_term_end: {
        type: Sequelize.DATE,
      },

      second_term_start: {
        type: Sequelize.DATE,
      },
      second_term_end: {
        type: Sequelize.DATE,
      },

      third_term_start: {
        type: Sequelize.DATE,
      },
      third_term_end: {
        type: Sequelize.DATE,
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("school_sessions");
  },
};
