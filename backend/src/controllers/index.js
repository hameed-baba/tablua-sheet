// Import all controllers
const authController = require("./authController");
const schoolStaffController = require("./schoolStaffController");
const schoolStudentController = require("./schoolStudentController");
const classMasterController = require("./classMasterController");
const schoolTermController = require("./schoolTermController");
const schoolSessionController = require("./schoolSessionController");
const roleController = require("./roleController");
const schoolSubjectController = require("./schoolSubjectController");
const schoolInvoiceController = require("./schoolInvoiceController");
const schoolPaymentController = require("./schoolPaymentController");
const gradeListController = require("./gradeListController");
const parentController = require("./parentController");
const schoolClassController = require("./schoolClasesController");
const classSubjectAssignController = require("./classSubjectAssignController");
const studentSubjectAssignController = require("./studentSubjectAssignController");
const chartController = require("./chartController");
const dashboardController = require("./dashboardController");
const BaseController = require("./baseController");

// Import models for simple controllers
const { SchoolSection } = require("../models");

const schoolSectionController = new BaseController(
  SchoolSection,
  "SchoolSection",
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
  roleController,
  schoolClassController,
  schoolSectionController,
  schoolSubjectController,
  schoolTermController,
  schoolSessionController,
  schoolInvoiceController,
  schoolPaymentController,
  chartController,
  dashboardController,
};
