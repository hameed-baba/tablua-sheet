"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Permission extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Permission.hasMany(models.RolePermission, {
        foreignKey: "permissionId",
        as: "RolePermissions",
      });
      Permission.belongsToMany(models.Role, {
        through: models.RolePermission,
        foreignKey: "permissionId",
        otherKey: "role_id",
        as: "roles",
      });
    }
  }

  Permission.init(
    {
      permission_name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Permission",
      tableName: "permissions",
      paranoid: true,

    }
  );

  return Permission;
};
