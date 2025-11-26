module.exports = {
  up: async (queryInterface, Sequelize) => {
    const permissions = [
      "staff.create",
      "staff.read",
      "staff.update",
      "staff.delete",
      "student.create",
      "student.read",
      "student.update",
      "student.delete",
      "class.create",
      "class.read",
      "class.update",
      "class.delete",
      "subject.create",
      "subject.read",
      "subject.update",
      "subject.delete",
      "grade.create",
      "grade.read",
      "grade.update",
      "grade.delete",
      "section.create",
      "section.read",
      "section.update",
      "section.delete",
      "session.create",
      "session.read",
      "session.update",
      "session.delete",
      "term.create",
      "term.read",
      "term.update",
      "term.delete",
      "parent.create",
      "parent.read",
      "parent.update",
      "parent.delete",
    ].map((name) => ({
      permission_name: name,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    await queryInterface.bulkInsert("permissions", permissions);

  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("permissions", null, {});
  },
};
