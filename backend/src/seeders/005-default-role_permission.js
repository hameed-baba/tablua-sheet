'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Fetch all permission IDs from the permissions table
    const [permissions] = await queryInterface.sequelize.query(
      `SELECT id FROM permissions;`
    );

    // Map all permissions to Super Admin (role_id = 1)
    const rolePermissions = permissions.map(permission => ({
      role_id: 1, // Super Admin
      permissionId: permission.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    // Insert into the junction table
    await queryInterface.bulkInsert('role_permissions', rolePermissions);
  },

  down: async (queryInterface, Sequelize) => {
    // Remove all role-permission relations for Super Admin
    await queryInterface.bulkDelete('role_permissions', { role_id: 1 }, {});
  }
};
