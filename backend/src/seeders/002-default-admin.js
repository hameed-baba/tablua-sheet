const bcrypt = require("bcryptjs");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const hashedPassword = await bcrypt.hash("admin123", 12);

    const admin = {
      id: 1,
      full_name: "System Administrator",
      phone_number: "",
      email: "admin@school.com",
      address: "",
      state: "zamfara",
      local_gov: "talata-mafara",
      date_of_employment: new Date(),
      role_id: 1, // Super Admin role
      password: hashedPassword,
      has_school_access: true,
      has_system_access: true,
      is_default_password: true,
      section_ids: "",
      gender: "male",
      date_of_birth: new Date(),
      employee_id: "",
      salary: 0,
      employment_type: "full-time",
      qualifications: "Bachelor's Degree (BSc)",
      qualification_title: "BSc",
      institution: "University",
      year_obtained: "",
      emergency_contact: "",
      emergency_contact_name: "",
      emergency_contact_relation: "",
      year_of_experience: 0,
      specializations: "",
      status: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await queryInterface.bulkInsert("school_staffs", [admin]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("school_staffs", {
      email: "admin@school.com",
    });
  },
};

// 'use strict';
// // const bcrypt = require('bcrypt');
// const bcrypt = require('bcryptjs');

// module.exports = {
//   async up(queryInterface, Sequelize) {
//     const passwordHash = await bcrypt.hash('Password123', 12);
//     const staff = [];

//     for (let i = 1; i <= 50; i++) {
//       staff.push({
//         full_name: `Staff Member ${i}`,
//         phone_number: `+2348000000${i.toString().padStart(2, '0')}`,
//         email: `staff${i}@school.com`,
//         address: 'Staff Quarters',
//         state: 'Kano',
//         local_gov: 'Nassarawa',
//         date_of_employment: new Date(),
//         role_id: (i % 5) + 1,
//         password: passwordHash,
//         has_school_access: i % 2 === 0,
//         has_system_access: true,
//         is_default_password: true,
//         section_ids: `${(i % 7) + 1},${((i+1) % 7) + 1}`,
//         gender: i % 2 === 0 ? 'female' : 'male',
//         date_of_birth: new Date(1980 + i % 20, 0, 1),
//         employee_id: `EMP${i.toString().padStart(3,'0')}`,
//         salary: 100000 + i * 1000,
//         employment_type: 'full-time',
//         qualifications: "Bachelor's Degree (BSc)",
//         qualification_title: 'BSc',
//         institution: 'University',
//         year_obtained: `${2010 + (i % 10)}`,
//         emergency_contact: `+2348010000${i.toString().padStart(2,'0')}`,
//         emergency_contact_name: `Contact ${i}`,
//         emergency_contact_relation: 'Parent',
//         year_of_experience: `${i % 20}`,
//         specializations: 'General',
//         status: true,
//         createdAt: new Date(),
//         updatedAt: new Date()
//       });
//     }

//     await queryInterface.bulkInsert('school_staffs', staff, {});
// //   },

//   async down(queryInterface, Sequelize) {
//     await queryInterface.bulkDelete('school_staffs', null, {});
//   }
// };
