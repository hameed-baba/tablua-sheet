"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class StaffSession extends Model {
    static associate(models) {
      StaffSession.belongsTo(models.SchoolStaff, {
        foreignKey: "staff_id",
        as: "Staff",
      });
    }
  }

  StaffSession.init(
    {
      staff_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'school_staffs',
          key: 'id'
        }
      },
      login_time: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      },
      logout_time: {
        type: DataTypes.DATE,
        allowNull: true
      },
      ip_address: {
        type: DataTypes.STRING,
        allowNull: true
      },
      user_agent: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      },
      session_token: {
        type: DataTypes.STRING,
        allowNull: true
      }
    },
    {
      sequelize,
      modelName: "StaffSession",
      tableName: "staff_sessions",
      timestamps: true
    }
  );

  return StaffSession;
};