"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("school_students", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      full_name: {
        type: Sequelize.STRING,
      },
      gender: {
        type: Sequelize.ENUM("male", "female"),
      },
      dob: {
        type: Sequelize.STRING,
      },
      address: {
        type: Sequelize.STRING,
      },
      state: {
        type: Sequelize.STRING,
      },
      local_gov: {
        type: Sequelize.STRING,
      },
      religion: {
        type: Sequelize.ENUM("islam", "christianity", "other"),
      },
      blood_group: {
        type: Sequelize.STRING,
      },
      admission_number: {
        type: Sequelize.STRING,
      },
      admitted_class: {
        type: Sequelize.INTEGER,
      },
      admitted_session: {
        type: Sequelize.INTEGER,
      },
      parent_relation: {
        type: Sequelize.STRING,
      },
      student_status: {
        type: Sequelize.ENUM(
          "active",
          "graduated",
          "transferred",
          "suspended",
          "withdrawn",
          "leave"
        ),
      },
      current_class_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "school_classes",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      current_session_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "school_sessions",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      parent_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "parents",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      deletedAt:{
        allowNull: false,
        type: Sequelize.DATE,
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("school_students");
  },
};
