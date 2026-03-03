"use strict";

const { Model } = require("sequelize");
const bcrypt = require("bcryptjs");

module.exports = (sequelize, DataTypes) => {
  class SchoolStaff extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      SchoolStaff.belongsTo(models.Role, {
        foreignKey: "role_id",
        as: "Role",
      });
    }

    async comparePassword(candidatePassword) {
      return bcrypt.compare(candidatePassword, this.password);
    }
  }

  SchoolStaff.init(
    {
      full_name: DataTypes.STRING,
      phone_number: DataTypes.STRING,
      email: DataTypes.STRING,
      address: DataTypes.TEXT,
      state: DataTypes.STRING,
      local_gov: DataTypes.STRING,
      date_of_employment: DataTypes.DATEONLY,
      role_id: DataTypes.INTEGER,
      password: DataTypes.STRING,
      has_school_access: DataTypes.BOOLEAN,
      has_system_access: DataTypes.BOOLEAN,
      is_default_password: DataTypes.BOOLEAN,
      section_ids: DataTypes.STRING,
      gender: DataTypes.STRING,
      date_of_birth: DataTypes.DATEONLY,
      employee_id: DataTypes.STRING,
      salary: DataTypes.DECIMAL,
      // employment_type: DataTypes.STRING,
      employment_type: DataTypes.ENUM(
        "full-time",
        "part-time",
        "contract",
        "internship",
        "substitute",
        "temporary"
      ),
      // qualifications: DataTypes.TEXT,
      qualifications: DataTypes.ENUM(
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
      qualification_title: DataTypes.STRING,
      institution: DataTypes.STRING,
      year_obtained: DataTypes.STRING,
      emergency_contact: DataTypes.STRING,
      emergency_contact_name: DataTypes.STRING,
      emergency_contact_relation: DataTypes.STRING,
      year_of_experience: DataTypes.INTEGER,
      specializations: DataTypes.TEXT,
      status: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "SchoolStaff",
      tableName: "school_staffs",
      paranoid: true,

      hooks: {
        beforeCreate: async (staff) => {
          if (staff.password) {
            staff.password = await bcrypt.hash(staff.password, 12);
          }
        },
        beforeUpdate: async (staff) => {
          if (staff.changed("password")) {
            staff.password = await bcrypt.hash(staff.password, 12);
          }
        },
      },
    }
  );

  return SchoolStaff;
};
