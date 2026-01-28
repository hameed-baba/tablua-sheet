/**
 * Authentication and Authorization Examples
 * 
 * This file shows how to use the authentication middleware in your routes
 */

const {
  authenticate,
  authorize,
  authorizeAny,
  authorizeLevel,
  requireSuperAdmin,
  requireAdmin,
  requireTeacher,
  checkSchoolAccess,
  checkSystemAccess
} = require('./auth');

// Example route implementations:

// 1. Basic authentication (any logged-in user)
// router.get('/profile', authenticate, controller.getProfile);

// 2. Role-based authorization (specific roles)
// router.post('/users', authenticate, requireAdmin, controller.createUser);
// router.delete('/users/:id', authenticate, requireSuperAdmin, controller.deleteUser);

// 3. Multiple roles allowed (user needs ANY of these roles)
// router.get('/reports', authenticate, authorize(['admin', 'super_admin', 'teacher']), controller.getReports);

// 4. Level-based authorization (minimum level required)
// router.get('/sensitive-data', authenticate, authorizeLevel(80), controller.getSensitiveData);

// 5. Combined checks
// router.put('/system-settings', 
//   authenticate, 
//   requireSuperAdmin, 
//   checkSystemAccess, 
//   controller.updateSystemSettings
// );

/**
 * Role Hierarchy (based on level):
 * - Super Admin: level 100 (highest)
 * - Admin: level 80
 * - Teacher: level 50
 * - Student: level 10
 * - Parent: level 5 (lowest)
 * 
 * Role Slugs:
 * - super_admin
 * - admin
 * - teacher
 * - student
 * - parent
 */

module.exports = {
  // Export examples for reference
  examples: {
    // Only super admin can access
    superAdminOnly: [authenticate, requireSuperAdmin],
    
    // Admin or super admin can access
    adminAccess: [authenticate, requireAdmin],
    
    // Teacher, admin, or super admin can access
    teacherAccess: [authenticate, requireTeacher],
    
    // Any authenticated user with school access
    schoolAccess: [authenticate, checkSchoolAccess],
    
    // High-level users only (admin level and above)
    highLevelAccess: [authenticate, authorizeLevel(80)],
    
    // Multiple specific roles
    multipleRoles: [authenticate, authorize(['admin', 'teacher'])],
  }
};