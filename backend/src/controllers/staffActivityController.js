const { SchoolStaff, StaffSession, Role } = require("../models");
const { asyncHandler } = require("../middleware/errorHandler");
const { Op } = require("sequelize");

/**
 * @desc Get active staff and recently logged out staff
 * @route GET /api/staff-activity/status
 */
const getStaffActivityStatus = asyncHandler(async (req, res) => {
  try {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000); // 1 hour ago
    const sixHoursAgo = new Date(Date.now() - 6 * 60 * 60 * 1000); // 6 hours ago for stale session cleanup

    // Clean up stale sessions (sessions older than 6 hours without logout)
    await StaffSession.update(
      {
        logout_time: new Date(),
        is_active: false
      },
      {
        where: {
          is_active: true,
          login_time: {
            [Op.lt]: sixHoursAgo
          },
          logout_time: null
        }
      }
    );

    // Debug: Log all active sessions
    const allActiveSessions = await StaffSession.findAll({
      where: {
        is_active: true,
        logout_time: null
      },
      attributes: ['id', 'staff_id', 'login_time', 'logout_time', 'is_active'],
      order: [['login_time', 'DESC']]
    });

    console.log('Debug - All active sessions:', JSON.stringify(allActiveSessions, null, 2));

    // Get currently active sessions with staff info
    const activeSessions = await StaffSession.findAll({
      where: {
        is_active: true,
        logout_time: null
      },
      include: [
        {
          model: SchoolStaff,
          as: "Staff",
          attributes: ['id', 'full_name', 'email', 'phone_number', 'role_id', 'status', 'has_school_access'],
          include: [
            {
              model: Role,
              as: "Role",
              attributes: ['id', 'role_name']
            }
          ],
          where: {
            status: true,
            has_school_access: true
          }
        }
      ],
      order: [['login_time', 'DESC']]
    });

    console.log('Debug - Active sessions with staff:', activeSessions.length);

    // Get recent logout sessions (within last hour) with staff info
    const recentLogoutSessions = await StaffSession.findAll({
      where: {
        is_active: false,
        logout_time: {
          [Op.gte]: oneHourAgo,
          [Op.lte]: new Date()
        }
      },
      include: [
        {
          model: SchoolStaff,
          as: "Staff",
          attributes: ['id', 'full_name', 'email', 'phone_number', 'role_id', 'status'],
          include: [
            {
              model: Role,
              as: "Role",
              attributes: ['id', 'role_name']
            }
          ],
          where: {
            status: true
          }
        }
      ],
      order: [['logout_time', 'DESC']]
    });

    console.log('Debug - Recent logout sessions:', recentLogoutSessions.length);

    // Remove duplicates and format active staff data
    const activeStaffMap = new Map();
    activeSessions.forEach(session => {
      if (session.Staff && !activeStaffMap.has(session.Staff.id)) {
        activeStaffMap.set(session.Staff.id, {
          id: session.Staff.id,
          full_name: session.Staff.full_name,
          email: session.Staff.email,
          phone_number: session.Staff.phone_number,
          role: session.Staff.Role?.role_name || 'Unknown',
          login_time: session.login_time,
          status: 'active'
        });
      }
    });

    // Remove duplicates and format recently logged out staff data
    // Exclude staff who are currently active
    const recentlyLoggedOutMap = new Map();
    recentLogoutSessions.forEach(session => {
      if (session.Staff &&
        !recentlyLoggedOutMap.has(session.Staff.id) &&
        !activeStaffMap.has(session.Staff.id)) {
        recentlyLoggedOutMap.set(session.Staff.id, {
          id: session.Staff.id,
          full_name: session.Staff.full_name,
          email: session.Staff.email,
          phone_number: session.Staff.phone_number,
          role: session.Staff.Role?.role_name || 'Unknown',
          logout_time: session.logout_time,
          status: 'recently_logged_out'
        });
      }
    });

    const activeStaffData = Array.from(activeStaffMap.values());
    const recentlyLoggedOutData = Array.from(recentlyLoggedOutMap.values());

    console.log('Debug - Final active staff count:', activeStaffData.length);
    console.log('Debug - Final recent logout count:', recentlyLoggedOutData.length);

    res.json({
      status: "success",
      message: "Staff activity status retrieved successfully",
      data: {
        active_staff: activeStaffData,
        recently_logged_out: recentlyLoggedOutData,
        summary: {
          total_active: activeStaffData.length,
          total_recently_logged_out: recentlyLoggedOutData.length,
          total_staff: activeStaffData.length + recentlyLoggedOutData.length
        }
      }
    });

  } catch (error) {
    console.error('Error fetching staff activity status:', error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch staff activity status",
      debug: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @desc Get detailed staff session history
 * @route GET /api/staff-activity/sessions/:staffId?
 */
const getStaffSessions = asyncHandler(async (req, res) => {
  try {
    const { staffId } = req.params;
    const { limit = 50, offset = 0 } = req.query;

    const whereClause = staffId ? { staff_id: staffId } : {};

    const sessions = await StaffSession.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: SchoolStaff,
          as: "Staff",
          attributes: ['id', 'full_name', 'email'],
          include: [
            {
              model: Role,
              as: "Role",
              attributes: ['role_name']
            }
          ]
        }
      ],
      order: [['login_time', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    const formattedSessions = sessions.rows.map(session => ({
      id: session.id,
      staff: {
        id: session.Staff.id,
        full_name: session.Staff.full_name,
        email: session.Staff.email,
        role: session.Staff.Role?.role_name || 'Unknown'
      },
      login_time: session.login_time,
      logout_time: session.logout_time,
      duration: session.logout_time ?
        Math.round((new Date(session.logout_time) - new Date(session.login_time)) / (1000 * 60)) : null,
      is_active: session.is_active,
      ip_address: session.ip_address
    }));

    res.json({
      status: "success",
      message: "Staff sessions retrieved successfully",
      data: {
        sessions: formattedSessions,
        pagination: {
          total: sessions.count,
          limit: parseInt(limit),
          offset: parseInt(offset),
          pages: Math.ceil(sessions.count / limit)
        }
      }
    });

  } catch (error) {
    console.error('Error fetching staff sessions:', error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch staff sessions",
      debug: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @desc Record staff login session
 * @route POST /api/staff-activity/login
 */
const recordLogin = asyncHandler(async (req, res) => {
  try {
    const { staff_id, ip_address, user_agent, session_token } = req.body;

    // End any existing active sessions for this staff
    await StaffSession.update(
      {
        is_active: false,
        logout_time: new Date()
      },
      {
        where: {
          staff_id: staff_id,
          is_active: true
        }
      }
    );

    // Create new session
    const newSession = await StaffSession.create({
      staff_id,
      login_time: new Date(),
      ip_address,
      user_agent,
      session_token,
      is_active: true
    });

    res.json({
      status: "success",
      message: "Login session recorded successfully",
      data: {
        session_id: newSession.id
      }
    });

  } catch (error) {
    console.error('Error recording login session:', error);
    res.status(500).json({
      status: "error",
      message: "Failed to record login session",
      debug: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @desc Record staff logout
 * @route POST /api/staff-activity/logout
 */
const recordLogout = asyncHandler(async (req, res) => {
  try {
    const { staff_id, session_token } = req.body;

    const whereClause = { staff_id, is_active: true };
    if (session_token) {
      whereClause.session_token = session_token;
    }

    const updatedSessions = await StaffSession.update(
      {
        logout_time: new Date(),
        is_active: false
      },
      {
        where: whereClause
      }
    );

    res.json({
      status: "success",
      message: "Logout recorded successfully",
      data: {
        sessions_updated: updatedSessions[0]
      }
    });

  } catch (error) {
    console.error('Error recording logout:', error);
    res.status(500).json({
      status: "error",
      message: "Failed to record logout",
      debug: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @desc Clean up stale sessions manually
 * @route POST /api/staff-activity/cleanup
 */
const cleanupStaleSessions = asyncHandler(async (req, res) => {
  try {
    const sixHoursAgo = new Date(Date.now() - 6 * 60 * 60 * 1000); // 6 hours ago

    const updatedSessions = await StaffSession.update(
      {
        logout_time: new Date(),
        is_active: false
      },
      {
        where: {
          is_active: true,
          login_time: {
            [Op.lt]: sixHoursAgo
          },
          logout_time: null
        }
      }
    );

    res.json({
      status: "success",
      message: "Stale sessions cleaned up successfully",
      data: {
        sessions_cleaned: updatedSessions[0]
      }
    });

  } catch (error) {
    console.error('Error cleaning up stale sessions:', error);
    res.status(500).json({
      status: "error",
      message: "Failed to clean up stale sessions",
      debug: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = {
  getStaffActivityStatus,
  getStaffSessions,
  recordLogin,
  recordLogout,
  cleanupStaleSessions
};