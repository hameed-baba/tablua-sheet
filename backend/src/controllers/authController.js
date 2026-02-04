const jwt = require("jsonwebtoken");
const { SchoolStaff, Role, StaffSession } = require("../models");
const { asyncHandler } = require("../middleware/errorHandler");

/**
 * @desc Login user
 * @route POST /api/auth/login
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  try {
    // First, find the staff member with role
    const staff = await SchoolStaff.findOne({
      where: { email },
      include: [
        {
          model: Role,
          as: "Role",
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
      { expiresIn: process.env.JWT_EXPIRES_IN || '1m' }
    );

    // Record login session
    try {
      // End any existing active sessions for this staff
      await StaffSession.update(
        { 
          is_active: false,
          logout_time: new Date()
        },
        {
          where: {
            staff_id: staff.id,
            is_active: true
          }
        }
      );

      // Create new session
      await StaffSession.create({
        staff_id: staff.id,
        login_time: new Date(),
        ip_address: req.ip || req.connection.remoteAddress,
        user_agent: req.get('User-Agent'),
        session_token: token,
        is_active: true
      });
    } catch (sessionError) {
      console.error('Error recording login session:', sessionError);
      // Don't fail login if session recording fails
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
            slug: staff.Role?.slug
          },
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
 * @desc Logout user
 * @route POST /api/auth/logout
 */
const logout = asyncHandler(async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    // Update session to mark as logged out
    await StaffSession.update(
      {
        logout_time: new Date(),
        is_active: false
      },
      {
        where: {
          staff_id: req.user.id,
          session_token: token,
          is_active: true
        }
      }
    );

    res.json({
      status: "success",
      message: "Logged out successfully"
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      status: "error",
      message: "Logout failed"
    });
  }
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
  logout,
  changePassword,
  getProfile,
};
