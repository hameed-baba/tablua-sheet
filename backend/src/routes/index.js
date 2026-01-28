// Import routes
const express = require("express");
const authRoutes = require('./auth');
const authTestRoutes = require('./authTest');
const classMasterRoutes = require('./classMasters');
const classSubjectAssignRoutes = require('./classSubjectAssigns');
const studentSubjectAssignRoutes = require('./studentSubjectAssigns');
const gradeListRoutes = require('./gradeLists');
const parentRoutes = require('./parents');
const roleRoutes = require('./roles');
const schoolClassRoutes = require('./schoolClasses');
const schoolSectionRoutes = require('./schoolSections');
const schoolStaffRoutes = require('./schoolStaffs');
const schoolSubjectRoutes = require('./schoolSubjects');
const schoolTermRoutes = require('./schoolTerms');
const schoolSessionRoutes = require('./schoolSessions');
const schoolStudentRoutes = require('./schoolStudents');
const caConfigRoutes = require('./caConfigs');
const pdfRoutes = require('./pdf');
const chartRoutes = require('./charts');
const staffActivityRoutes = require('./staffActivity');
const dashboardRoutes = require('./dashboard');

const router = express.Router();
// Health check route
router.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "School Management System API is running",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  });
});



// Routes
router.use('/auth', authRoutes);
router.use('/auth', authTestRoutes); // Test endpoints for authentication
router.use('/class-masters', classMasterRoutes);
router.use('/class-subject-assigns', classSubjectAssignRoutes);
router.use('/student-subject-assigns', studentSubjectAssignRoutes);
router.use('/grade-lists', gradeListRoutes);
// router.use('/grade-systems', gradeSystemRoutes);
router.use('/parents', parentRoutes);
router.use('/roles', roleRoutes);
router.use('/school-classes', schoolClassRoutes);
router.use('/school-sections', schoolSectionRoutes);
router.use('/staff', schoolStaffRoutes);
router.use('/school-subjects', schoolSubjectRoutes);
router.use('/school-terms', schoolTermRoutes);
router.use('/school-sessions', schoolSessionRoutes);
router.use('/students', schoolStudentRoutes);
router.use('/ca-configs', caConfigRoutes);
router.use('/pdf', pdfRoutes);
router.use('/charts', chartRoutes);
router.use('/staff-activity', staffActivityRoutes);
router.use('/dashboard', dashboardRoutes);

module.exports = router;

