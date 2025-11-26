const jwt = require("jsonwebtoken");
const { SchoolStaff, Role, Permission } = require("../models");
const { asyncHandler } = require("../middleware/errorHandler");

/**
 * @desc Login user
 * @route POST /api/auth/login
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  try {
    // First, find the staff member with role and permissions
    const staff = await SchoolStaff.findOne({
      where: { email },
      include: [
        {
          model: Role,
          as: "Role",
          include: [
            {
              model: Permission,
              as: "permissions",
              through: { attributes: [] },
            },
          ],
        },
      ],
    });

    if (!staff) {
      return res.status(401).json({
        status: "error",
        message: "Invalid email or password",
      });
    }

    // Check password
    const isPasswordValid = await staff.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        status: "error",
        message: "Invalid email or password",
      });
    }

    // Check if account is active
    if (!staff.has_school_access) {
      return res.status(401).json({
        success: false,
        message: "Account is deactivated",
      });
    }

    if (!staff.has_system_access) {
      return res.status(401).json({
        success: false,
        message: "School is deactivated",
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: staff.id, email: staff.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    // Extract permissions from the staff's role
    const permissions = staff.Role?.permissions?.map((p) => p.permission_name) || [];
    
    // Debug logging in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Login Debug Info:');
      console.log('Staff ID:', staff.id);
      console.log('Role:', staff.Role?.role_name);
      console.log('Permissions found:', permissions);
    }

    res.json({
      status: "success",
      message: "Login successful",
      data: {
        token,
        user: {
          id: staff.id,
          full_name: staff.full_name,
          email: staff.email,
          phone_number: staff.phone_number,
          role: {
            id: staff.Role?.id,
            name: staff.Role?.role_name,
            description: staff.Role?.description
          },
          permissions,
          is_default_password: staff.is_default_password,
          has_school_access: staff.has_school_access,
          has_system_access: staff.has_system_access,
        },
      },
    });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      status: "error:" + error,
      message: "Login failed",
      debug: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @desc Change user password
 * @route PUT /api/auth/change-password
 */
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!(await req.user.comparePassword(currentPassword))) {
    return res.status(400).json({
      status: "error",
      message: "Current password is incorrect",
    });
  }

  await req.user.update({
    password: newPassword,
    is_default_password: false,
  });

  res.json({
    status: "success",
    message: "Password changed successfully",
  });
});

/**
 * @desc Get user profile
 * @route GET /api/auth/profile
 */
const getProfile = asyncHandler(async (req, res) => {
  const staff = await SchoolStaff.findByPk(req.user.id, {
    include: [
      {
        model: Role,
        as: "Role",
        include: [
          {
            model: Permission,
            as: "permissions",
            through: { attributes: [] },
          },
        ],
      },
    ],
    attributes: { exclude: ["password"] },
  });

  if (!staff) {
    return res.status(404).json({
      status: "error",
      message: "User not found",
    });
  }

  // Extract permissions
  const permissions = staff.Role?.permissions?.map((p) => p.permission_name) || [];

  res.json({
    status: "success",
    data: {
      id: staff.id,
      full_name: staff.full_name,
      email: staff.email,
      phone_number: staff.phone_number,
      address: staff.address,
      state: staff.state,
      local_gov: staff.local_gov,
      date_of_employment: staff.date_of_employment,
      gender: staff.gender,
      role: {
        id: staff.Role?.id,
        name: staff.Role?.role_name,
        description: staff.Role?.description
      },
      permissions,
      has_school_access: staff.has_school_access,
      has_system_access: staff.has_system_access,
      is_default_password: staff.is_default_password,
      createdAt: staff.createdAt,
      updatedAt: staff.updatedAt,
    },
  });
});

module.exports = {
  login,
  changePassword,
  getProfile,
};
