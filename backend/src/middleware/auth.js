const jwt = require("jsonwebtoken");
const { SchoolStaff, Role } = require("../models");

const authenticate = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        status: "error",
        message: "Access denied. No token provided.",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ HANDLE SYSTEM OWNER FIRST (NO DB CHECK)
    if (decoded.is_owner) {
      req.user = {
        id: "owner",
        email: decoded.email,
        is_owner: true,
        Role: {
          slug: "system_owner",
          level: 999, // highest level
        },
        has_school_access: true,
        has_system_access: true,
      };

      return next();
    }

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
        include: [
          {
            model: Role,
            as: "Role",
          },
        ],
      });
      req.user = staffWithRole || staff;
    } catch (includeError) {
      // If include fails, just use basic staff info
      req.user = staff;
    }

    next();
  } catch (error) {
    console.error("Authentication error:", error.message);
    return res.status(401).json({
      status: "error",
      message: "Invalid token.",
      debug: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

const authorize = (requiredRoles = []) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          status: "error",
          message: "Authentication required.",
        });
      }

         // ✅ BYPASS FOR SYSTEM OWNER
      if (req.user.is_owner === true) {
        return next();
      }

      // If no roles specified, just check if user is authenticated
      if (requiredRoles.length === 0) {
        return next();
      }

      // Get user's role
      const userRole = req.user.Role?.slug;

      if (!userRole) {
        return res.status(403).json({
          status: "error",
          message: "User role not found.",
        });
      }

      // Check if user has required role
      if (!requiredRoles.includes(userRole)) {
        return res.status(403).json({
          status: "error",
          message:
            "Insufficient permissions. Required roles: " +
            requiredRoles.join(", "),
        });
      }

      next();
    } catch (error) {
      console.error("Authorization error:", error);
      return res.status(500).json({
        status: "error",
        message: "Authorization check failed.",
      });
    }
  };
};

// Helper function to check multiple roles (user needs ANY of them)
const authorizeAny = (roles = []) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          status: "error",
          message: "Authentication required.",
        });
      }

      if (roles.length === 0) {
        return next();
      }

      const userRole = req.user.Role?.slug;

      if (!userRole) {
        return res.status(403).json({
          status: "error",
          message: "User role not found.",
        });
      }

      if (!roles.includes(userRole)) {
        return res.status(403).json({
          status: "error",
          message:
            "Insufficient permissions. Required roles: " + roles.join(", "),
        });
      }

      next();
    } catch (error) {
      console.error("Authorization error:", error);
      return res.status(500).json({
        status: "error",
        message: "Authorization check failed.",
      });
    }
  };
};

// Helper function to check role level (user needs minimum level)
const authorizeLevel = (minLevel = 0) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          status: "error",
          message: "Authentication required.",
        });
      }

      const userLevel = req.user.Role?.level || 0;

      if (userLevel < minLevel) {
        return res.status(403).json({
          status: "error",
          message: "Insufficient permissions. Required level: " + minLevel,
        });
      }

      next();
    } catch (error) {
      console.error("Authorization error:", error);
      return res.status(500).json({
        status: "error",
        message: "Authorization check failed.",
      });
    }
  };
};

const checkSchoolAccess = (req, res, next) => {
  if (!req.user.has_school_access) {
    return res.status(403).json({
      status: "error",
      message: "School access required.",
    });
  }
  next();
};

const checkSystemAccess = (req, res, next) => {
  if (!req.user.has_system_access) {
    return res.status(403).json({
      status: "error",
      message: "System access required.",
    });
  }
  next();
};

// Specific role checks
const requireSuperAdmin = authorize(["super_admin"]);
const requireAdmin = authorize(["admin", "super_admin"]);
const requireTeacher = authorize(["teacher", "admin", "super_admin"]);

module.exports = {
  authenticate,
  authorize,
  authorizeAny,
  authorizeLevel,
  requireSuperAdmin,
  requireAdmin,
  requireTeacher,
  checkSchoolAccess,
  checkSystemAccess,
};
