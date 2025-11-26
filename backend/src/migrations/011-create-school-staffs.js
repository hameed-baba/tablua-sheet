"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("school_staffs", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      full_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      phone_number: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      address: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      state: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      local_gov: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      date_of_employment: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      role_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "roles",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      has_school_access: {
        type: Sequelize.BOOLEAN,
        defaultValue: false, // handled as false in model
      },
      has_system_access: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      is_default_password: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      section_ids: {
        type: Sequelize.STRING,
        // allowNull: true,
      },
      gender: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      date_of_birth: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      employee_id: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true,
      },
      salary: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },
      employment_type: {
        type: Sequelize.ENUM(
          "full-time",
          "part-time",
          "contract",
          "internship",
          "substitute",
          "temporary"
        ),
        allowNull: true,
      },
      qualifications: {
        type: Sequelize.ENUM(
          "Senior Secondary Certificate (SSCE)",
          "National Diploma (ND)",
          "National Certificate in Education (NCE)",
          "Higher National Diploma (HND)",
          "Bachelor's Degree (BSc)",
          "Master's Degree (MSc)",
          "Doctorate (PhD)",
          "Certificate",
          "Other"
        ),

        allowNull: true,
      },
      qualification_title: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      institution: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      year_obtained: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      emergency_contact: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      emergency_contact_name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      emergency_contact_relation: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      year_of_experience: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      specializations: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      status: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
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
    await queryInterface.dropTable("school_staffs");
  },
};
