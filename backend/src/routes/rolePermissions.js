const express = require('express');
const { authenticate, checkSchoolAccess, authorize } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validation');
const { rolePermissionController } = require('../controllers');

const router = express.Router();

// Assign permission to role
router.post('/', 
  authenticate, 
  checkSchoolAccess, 
  validate(schemas.rolePermissionAssignment),
  rolePermissionController.assignPermission
);

// Get permissions for a role
router.get('/:role_id', authenticate, authorize('role.read'), rolePermissionController.getRolePermissions);

// Remove permission from role
router.delete('/:role_id/:permissionId', authenticate, checkSchoolAccess, rolePermissionController.removePermission);

module.exports = router;