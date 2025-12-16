'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // First, let's check if we have classes and subjects
    const classes = await queryInterface.sequelize.query(
      'SELECT id FROM school_classes ORDER BY id',
      { type: Sequelize.QueryTypes.SELECT }
    );

    const subjects = await queryInterface.sequelize.query(
      'SELECT id FROM school_subjects ORDER BY id',
      { type: Sequelize.QueryTypes.SELECT }
    );

    const staff = await queryInterface.sequelize.query(
      'SELECT id FROM school_staffs ORDER BY id LIMIT 1',
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (classes.length === 0 || subjects.length === 0 || staff.length === 0) {
      console.log('Skipping class subject assignments - missing classes, subjects, or staff');
      return;
    }

    const classSubjectAssigns = [];
    const staffId = staff[0].id;

    // Assign all subjects to all classes (you can modify this logic as needed)
    for (const classItem of classes) {
      for (const subject of subjects) {
        classSubjectAssigns.push({
          school_class_id: classItem.id,
          school_subject_id: subject.id,
          school_staff_id: staffId,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    }

    if (classSubjectAssigns.length > 0) {
      await queryInterface.bulkInsert('class_subject_assigns', classSubjectAssigns);
      console.log(`Created ${classSubjectAssigns.length} class subject assignments`);
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('class_subject_assigns', null, {});
  }
};