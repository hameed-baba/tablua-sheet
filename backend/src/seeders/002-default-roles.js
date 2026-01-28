// module.exports = {
//   up: async (queryInterface, Sequelize) => {
//     const roles = [
//       { id: 1, role_name: 'Super Admin',  createdAt: new Date(), updatedAt: new Date() },
//       { id: 2, role_name: 'School Admin',  createdAt: new Date(), updatedAt: new Date() },
//       { id: 3, role_name: 'Principal',  createdAt: new Date(), updatedAt: new Date() },
//       { id: 4, role_name: 'Teacher',  createdAt: new Date(), updatedAt: new Date() },
//       { id: 5, role_name: 'Class Teacher',  createdAt: new Date(), updatedAt: new Date() },
//       { id: 6, role_name: 'Subject Teacher',  createdAt: new Date(), updatedAt: new Date() }
//     ];

//     await queryInterface.bulkInsert('roles', roles);
//   },

//   down: async (queryInterface, Sequelize) => {
//     await queryInterface.bulkDelete('roles', null, {});
//   }
// };

"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const now = new Date();

    const roles = [
      {
        id: 1,
        role_name: "Super Admin",
        slug: "super_admin",
        description: "Full system access. Manages admins, system settings, and all data.",
        level: 100,
        created_at: now,
        updated_at: now,
      },
      {
        id: 2,
        role_name: "Admin",
        slug: "admin",
        description: "Manages school operations, staff, students, and academic records.",
        level: 80,
        created_at: now,
        updated_at: now,
      },
      {
        id: 3,
        role_name: "Teacher",
        slug: "teacher",
        description: "Handles classes, subjects, attendance, and student assessments.",
        level: 50,
        created_at: now,
        updated_at: now,
      },
      {
        id: 4,
        role_name: "Student",
        slug: "student",
        description: "Views timetable, grades, assignments, and personal academic information.",
        level: 10,
        created_at: now,
        updated_at: now,
      },
      {
        id: 5,
        role_name: "Parent",
        slug: "parent",
        description: "Monitors child academic performance, attendance, and school communications.",
        level: 5,
        created_at: now,
        updated_at: now,
      },
    ];

    await queryInterface.bulkInsert("roles", roles);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("roles", null, {});
  },
};
