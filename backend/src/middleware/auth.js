const jwt = require('jsonwebtoken');
const { SchoolStaff, Role, RolePermission, Permission } = require('../models');

const authenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: 'Access denied. No token provided.'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // First try to find staff without includes to isolate the issue
    const staff = await SchoolStaff.findByPk(decoded.id);

    if (!staff) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    if (!staff.has_school_access) {
      return res.status(401).json({
        success: false,
        message: "User account is deactivated",
      });
    }

    if (!staff.has_system_access) {
      return res.status(401).json({
        success: false,
        message: "School is deactivated",
      });
    }

    // Try to load role separately
    try {
      const staffWithRole = await SchoolStaff.findByPk(decoded.id, {
        include: [{
          model: Role,
          as: 'Role',
          include: [{
            model: Permission,
            as: 'permissions',
            through: { attributes: [] }
          }]
        }]
      });
      req.user = staffWithRole || staff;
    } catch (includeError) {
      // If include fails, just use basic staff info
      req.user = staff;
    }

    next();
  } catch (error) {
    console.error('Authentication error:', error.message);
    return res.status(401).json({
      status: 'error',
      message: 'Invalid token.',
      debug: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const authorize = (requiredPermission) => {
  return async (req, res, next) => {
    try {
      // If no permission is required, just continue
      if (!requiredPermission) {
        return next();
      }

      // Check if user has role and permissions loaded
      if (!req.user.Role) {
        return res.status(403).json({
          status: 'error',
          message: 'User role not found.'
        });
      }

      const userPermissions = req.user.Role.permissions?.map(permission =>
        permission.permission_name
      ) || [];

      // Check if user has the required permission
      if (!userPermissions.includes(requiredPermission)) {
        return res.status(403).json({
          status: 'error',
          message: `Access denied. Required permission`,
        });
      }

      next();
    } catch (error) {
      console.error('Authorization error:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Authorization check failed.'
      });
    }
  };
};

// Helper function to check multiple permissions (user needs ANY of them)
const authorizeAny = (permissions = []) => {
  return async (req, res, next) => {
    try {
      if (!permissions.length) {
        return next();
      }

      if (!req.user.Role) {
        return res.status(403).json({
          status: 'error',
          message: 'User role not found.'
        });
      }

      const userPermissions = req.user.Role.permissions?.map(permission =>
        permission.permission_name
      ) || [];

      const hasAnyPermission = permissions.some(permission =>
        userPermissions.includes(permission)
      );

      if (!hasAnyPermission) {
        return res.status(403).json({
          status: 'error',
          message: `Access denied. Required any of: ${permissions.join(', ')}`
        });
      }

      next();
    } catch (error) {
      console.error('Authorization error:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Authorization check failed.'
      });
    }
  };
};

// Helper function to check multiple permissions (user needs ALL of them)
const authorizeAll = (permissions = []) => {
  return async (req, res, next) => {
    try {
      if (!permissions.length) {
        return next();
      }

      if (!req.user.Role) {
        return res.status(403).json({
          status: 'error',
          message: 'User role not found.'
        });
      }

      const userPermissions = req.user.Role.permissions?.map(permission =>
        permission.permission_name
      ) || [];

      const hasAllPermissions = permissions.every(permission =>
        userPermissions.includes(permission)
      );

      if (!hasAllPermissions) {
        const missingPermissions = permissions.filter(permission =>
          !userPermissions.includes(permission)
        );
        return res.status(403).json({
          status: 'error',
          message: `Access denied. Missing permissions: ${missingPermissions.join(', ')}`
        });
      }

      next();
    } catch (error) {
      console.error('Authorization error:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Authorization check failed.'
      });
    }
  };
};

const checkSchoolAccess = (req, res, next) => {
  if (!req.user.has_school_access) {
    return res.status(403).json({
      status: 'error',
      message: 'School access required.'
    });
  }
  next();
};

const checkSystemAccess = (req, res, next) => {
  if (!req.user.has_system_access) {
    return res.status(403).json({
      status: 'error',
      message: 'System access required.'
    });
  }
  next();
};

module.exports = {
  authenticate,
  authorize,
  authorizeAny,
  authorizeAll,
  checkSchoolAccess,
  checkSystemAccess
};