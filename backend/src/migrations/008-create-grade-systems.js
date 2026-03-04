"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("grade_systems", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      grade_list_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "grade_lists",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      from_mark: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false,
      },
      to_mark: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false,
      },
      grade: {
        type: Sequelize.STRING(10),
        allowNull: true,
      },
      remark: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      principal_remark: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      class_teacher_remark: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.DATE
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.DATE
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("grade_systems");
  },
};
