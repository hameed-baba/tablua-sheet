"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class RolePermission extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      RolePermission.belongsTo(models.Role, {
        foreignKey: "role_id",
        as: "Role",
      });
      RolePermission.belongsTo(models.Permission, {
        foreignKey: "permissionId",
        as: "Permission",
      });
    }
  }

  RolePermission.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      role_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "roles",
          key: "id",
        },
      },
      permissionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "permissions",
          key: "id",
        },
      },
    },
    {
      sequelize,
      modelName: "RolePermission",
      tableName: "role_permissions",
      paranoid: true,

      indexes: [
        {
          unique: true,
          fields: ["role_id", "permissionId"],
        },
      ],
    }
  );

  return RolePermission;
};
