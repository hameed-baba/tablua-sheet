"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("grade_lists", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      grade_name: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      grade_type: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      allow_grade: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      allow_remark: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.DATE,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.DATE,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("grade_lists");
  },
};
