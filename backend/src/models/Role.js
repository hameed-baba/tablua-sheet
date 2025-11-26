"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    static associate(models) {
      // Fix foreign keys here
      Role.hasMany(models.SchoolStaff, {
        foreignKey: "role_id",  // FIXED
        as: "Staff",
      });

      Role.hasMany(models.RolePermission, {
        foreignKey: "role_id",  // FIXED
        as: "RolePermissions",
      });

      Role.belongsToMany(models.Permission, {
        through: models.RolePermission,
        foreignKey: "role_id",      // FIXED
        otherKey: "permissionId",   // Matches migration
        as: "permissions",
      });
    }
  }

  Role.init(
    {
      role_name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Role",
      tableName: "roles",
      paranoid: true,
    }
  );

  return Role;
};
