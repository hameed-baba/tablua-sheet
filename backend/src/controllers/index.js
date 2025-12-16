// Import all controllers
const authController = require("./authController");
const schoolStaffController = require("./schoolStaffController");
const schoolStudentController = require("./schoolStudentController");
const classMasterController = require("./classMasterController");
const rolePermissionController = require("./rolePermissionController");
const schoolTermController = require("./schoolTermController");
const schoolSessionController = require("./schoolSessionController");
const roleController = require("./roleController");
const permissionController = require("./permissionController");
const schoolSubjectController = require("./schoolSubjectController");
const gradeListController = require("./gradeListController");
const parentController = require("./parentController");
const schoolClassController = require("./schoolClasesController");
const classSubjectAssignController = require("./classSubjectAssignController");
const studentSubjectAssignController = require("./studentSubjectAssignController");
// Import base controller for other simple CRUD operations
const BaseController = require("./baseController");

// Import models for simple controllers
const {
  ClassSubjectAssign,
  GradeList,
  GradeSystem,
  Parent,
  Permission,
  Role,
  SchoolClass,
  SchoolSection,
  SchoolSubject,
  SchoolStaff,
  SchoolSession,
} = require("../models");

// Create simple controllers using BaseController
// const classSubjectAssignController = new BaseController(
//   ClassSubjectAssign,
//   "ClassSubjectAssign",
//   [
//     { model: require("../models").SchoolClass, as: "Class" },
//     { model: require("../models").SchoolSubject, as: "Subject" },
//     { model: require("../models").SchoolStaff, as: "Staff" },
//   ]
// );

// const parentController = new BaseController(Parent, "Parent", [
//   { model: require("../models").SchoolStudent, as: "Students" },
// ]);

// const schoolClassController = new BaseController(SchoolClass, "SchoolClass", [
//   { model: require("../models").GradeList, as: "GradeList" },
//   { model: require("../models").SchoolSection, as: "Section" },
//   {
//     model: require("../models").SchoolStaff,
//     as: "SchoolStaff",
//   },
// ]);

const schoolSectionController = new BaseController(
  SchoolSection,
  "SchoolSection"
);

module.exports = {
  authController,
  schoolStaffController,
  schoolStudentController,
  classMasterController,
  classSubjectAssignController,
  studentSubjectAssignController,
  gradeListController,
  parentController,
  permissionController,
  roleController,
  rolePermissionController,
  schoolClassController,
  schoolSectionController,
  schoolSubjectController,
  schoolTermController,
  schoolSessionController,
};
