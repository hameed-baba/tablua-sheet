"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const terms = [
      {
        term_name: "Fisrt Term",
        status: "inactive",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        term_name: "Second Term",
        status: "inactive",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        term_name: "Third Term",
        status: "inactive",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    await queryInterface.bulkInsert("school_terms", terms);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("school_terms", null, {});
  },
};
