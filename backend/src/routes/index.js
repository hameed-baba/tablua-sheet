// Import routes
const express = require("express");
const authRoutes = require('./auth');
const classMasterRoutes = require('./classMasters');
const classSubjectAssignRoutes = require('./classSubjectAssigns');
const gradeListRoutes = require('./gradeLists');
// const gradeSystemRoutes = require('./gradeSystems');
const parentRoutes = require('./parents');
const permissionRoutes = require('./permissions');
const roleRoutes = require('./roles');
const rolePermissionRoutes = require('./rolePermissions');
const schoolClassRoutes = require('./schoolClasses');
const schoolSectionRoutes = require('./schoolSections');
const schoolStaffRoutes = require('./schoolStaffs');
const schoolSubjectRoutes = require('./schoolSubjects');
const schoolTermRoutes = require('./schoolTerms');
const schoolSessionRoutes = require('./schoolSessions');
const schoolStudentRoutes = require('./schoolStudents');

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
router.use('/class-masters', classMasterRoutes);
router.use('/class-subject-assigns', classSubjectAssignRoutes);
router.use('/grade-lists', gradeListRoutes);
// router.use('/grade-systems', gradeSystemRoutes);
router.use('/parents', parentRoutes);
router.use('/permissions', permissionRoutes);
router.use('/roles', roleRoutes);
router.use('/role-permissions', rolePermissionRoutes);
router.use('/school-classes', schoolClassRoutes);
router.use('/school-sections', schoolSectionRoutes);
router.use('/staff', schoolStaffRoutes);
router.use('/school-subjects', schoolSubjectRoutes);
router.use('/school-terms', schoolTermRoutes);
router.use('/school-sessions', schoolSessionRoutes);
router.use('/students', schoolStudentRoutes);

module.exports = router;

