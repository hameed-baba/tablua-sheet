"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("student_subject_assigns", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      current_class_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "school_classes",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      school_subject_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "school_subjects",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      student_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "school_students",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      current_session_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "school_sessions",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      current_term_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "school_terms",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      ca_1_score: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      ca_2_score: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      exam_score: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      deletedAt: {
        allowNull: true,
        type: Sequelize.DATE,
      },
    });

    // Add indexes for better query performance
    await queryInterface.addIndex("student_subject_assigns", ["student_id"]);
    await queryInterface.addIndex("student_subject_assigns", [
      "current_class_id",
    ]);
    await queryInterface.addIndex("student_subject_assigns", [
      "school_subject_id",
    ]);
    await queryInterface.addIndex("student_subject_assigns", [
      "current_session_id",
    ]);
    await queryInterface.addIndex("student_subject_assigns", [
      "current_term_id",
    ]);

    // Add composite index for common queries
    await queryInterface.addIndex("student_subject_assigns", [
      "student_id",
      "current_session_id",
      "current_term_id",
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("student_subject_assigns");
  },
};
