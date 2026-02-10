'use strict';

const { faker } = require('@faker-js/faker');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    const students = [];

    for (let i = 1; i <= 50; i++) {
      const gender = faker.helpers.arrayElement(["male", "female"]);

      students.push({
        full_name: faker.person.fullName({ sex: gender }),
        gender,
        dob: faker.date.birthdate({ min: 8, max: 15, mode: "age" }),
        address: faker.location.streetAddress(),
        state: faker.location.state().toLowerCase(),
        local_gov: faker.word.sample(),
        religion: faker.helpers.arrayElement(["islam", "christianity"]),
        blood_group: faker.helpers.arrayElement(["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"]),
        admission_number: `AGP/SS/2022/${String(i).padStart(3, "0")}`,
        admitted_class: faker.number.int({ min: 1, max: 5 }),
        admitted_session: faker.number.int({ min: 1, max: 1 }),
        parent_relation: faker.helpers.arrayElement(["father", "mother", "guardian"]),
        student_status: "active",
        current_class_id: faker.number.int({ min: 1, max: 5 }),
        current_session_id: 1,
        parent_id: faker.number.int({ min: 1, max: 3 }),
        createdAt: new Date(),
        updatedAt: new Date(),
        // deletedAt: null,
      });
    }

    await queryInterface.bulkInsert("school_students", students);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("school_students", null, {});
  }
};
