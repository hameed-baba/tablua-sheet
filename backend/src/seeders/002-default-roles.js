module.exports = {
  up: async (queryInterface, Sequelize) => {
    const roles = [
      { id: 1, role_name: 'Super Admin',  createdAt: new Date(), updatedAt: new Date() },
      { id: 2, role_name: 'School Admin',  createdAt: new Date(), updatedAt: new Date() },
      { id: 3, role_name: 'Principal',  createdAt: new Date(), updatedAt: new Date() },
      { id: 4, role_name: 'Teacher',  createdAt: new Date(), updatedAt: new Date() },
      { id: 5, role_name: 'Class Teacher',  createdAt: new Date(), updatedAt: new Date() },
      { id: 6, role_name: 'Subject Teacher',  createdAt: new Date(), updatedAt: new Date() }
    ];

    await queryInterface.bulkInsert('roles', roles);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('roles', null, {});
  }
};