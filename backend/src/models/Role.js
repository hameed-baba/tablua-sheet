// "use strict";

// const { Model } = require("sequelize");

// module.exports = (sequelize, DataTypes) => {
//   class Role extends Model {
//     static associate(models) {
//       // Fix foreign keys here
//       Role.hasMany(models.SchoolStaff, {
//         foreignKey: "role_id", // FIXED
//         as: "Staff",
//       });
//     }
//   }

//   Role.init(
//     {
//       role_name: DataTypes.STRING,
//     },
//     {
//       sequelize,
//       modelName: "Role",
//       tableName: "roles",
//       paranoid: true,
//     },
//   );

//   return Role;
// };

"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    static associate(models) {
      Role.hasMany(models.SchoolStaff, {
        foreignKey: "role_id",
        as: "Staff",
      });
    }
  }

  Role.init(
    {
      role_name: DataTypes.STRING,
      slug: DataTypes.STRING,
      description: DataTypes.TEXT,
      level: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Role",
      tableName: "roles",
      timestamps: true,
      paranoid: true,
      underscored: true, // very important
    },
  );

  return Role;
};
