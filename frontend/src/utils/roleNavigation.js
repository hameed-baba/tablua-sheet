/**
 * Role-based navigation utilities
 * Helps manage navigation and route access based on user roles
 */

// Role hierarchy and permissions
export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin', 
  TEACHER: 'teacher',
  STUDENT: 'student',
  PARENT: 'parent'
}

// Role hierarchy levels (higher number = more permissions)
export const ROLE_LEVELS = {
  [ROLES.SUPER_ADMIN]: 100,
  [ROLES.ADMIN]: 80,
  [ROLES.TEACHER]: 50,
  [ROLES.STUDENT]: 10,
  [ROLES.PARENT]: 5
}

// Default dashboard routes for each role
export const ROLE_DASHBOARDS = {
  [ROLES.SUPER_ADMIN]: '/dashboard',
  [ROLES.ADMIN]: '/admin',
  [ROLES.TEACHER]: '/teacher',
  [ROLES.STUDENT]: '/student',
  [ROLES.PARENT]: '/parent'
}

// Route names for each role's dashboard
export const DASHBOARD_ROUTE_NAMES = {
  [ROLES.SUPER_ADMIN]: 'dashboard',
  [ROLES.ADMIN]: 'admin-dashboard',
  [ROLES.TEACHER]: 'teacher-dashboard',
  [ROLES.STUDENT]: 'student-dashboard',
  [ROLES.PARENT]: 'parent-dashboard'
}

/**
 * Get the appropriate dashboard route for a user role
 * @param {string|object} role - User role (string or object with slug property)
 * @returns {string} Dashboard path
 */
export function getDashboardRoute(role) {
  const roleSlug = typeof role === 'object' ? role.slug : role
  return ROLE_DASHBOARDS[roleSlug] || ROLE_DASHBOARDS[ROLES.SUPER_ADMIN]
}

/**
 * Get the dashboard route name for a user role
 * @param {string|object} role - User role (string or object with slug property)
 * @returns {string} Route name
 */
export function getDashboardRouteName(role) {
  const roleSlug = typeof role === 'object' ? role.slug : role
  return DASHBOARD_ROUTE_NAMES[roleSlug] || DASHBOARD_ROUTE_NAMES[ROLES.SUPER_ADMIN]
}

/**
 * Check if a user has permission to access a route
 * @param {string|object} userRole - User's role
 * @param {string[]} allowedRoles - Array of allowed roles for the route
 * @returns {boolean} Whether user has access
 */
export function hasRouteAccess(userRole, allowedRoles) {
  if (!allowedRoles || allowedRoles.length === 0) return true
  
  const roleSlug = typeof userRole === 'object' ? userRole.slug : userRole
  return allowedRoles.includes(roleSlug)
}

/**
 * Check if a user role has higher or equal level than required
 * @param {string|object} userRole - User's role
 * @param {string} requiredRole - Minimum required role
 * @returns {boolean} Whether user meets the requirement
 */
export function hasMinimumRole(userRole, requiredRole) {
  const userRoleSlug = typeof userRole === 'object' ? userRole.slug : userRole
  const userLevel = ROLE_LEVELS[userRoleSlug] || 0
  const requiredLevel = ROLE_LEVELS[requiredRole] || 0
  
  return userLevel >= requiredLevel
}

/**
 * Get navigation items based on user role
 * @param {string|object} userRole - User's role
 * @returns {Array} Navigation items for the role
 */
export function getNavigationItems(userRole) {
  const roleSlug = typeof userRole === 'object' ? userRole.slug : userRole
  
  const navigationMap = {
    [ROLES.SUPER_ADMIN]: [
      { name: 'Dashboard', path: '/dashboard', icon: 'dashboard' },
      { name: 'Students', path: '/students', icon: 'students' },
      { name: 'Staff', path: '/staff', icon: 'staff' },
      { name: 'Classes', path: '/classes', icon: 'classes' },
      { name: 'Subjects', path: '/subjects', icon: 'subjects' },
      { name: 'Exams', path: '/add-marks', icon: 'exams' },
      { name: 'Reports', path: '/broadsheet', icon: 'reports' },
      { name: 'Configuration', path: '/configuration', icon: 'settings' }
    ],
    [ROLES.ADMIN]: [
      { name: 'Dashboard', path: '/admin', icon: 'dashboard' },
      { name: 'Students', path: '/admin/students', icon: 'students' },
      { name: 'Staff', path: '/admin/staff', icon: 'staff' },
      { name: 'Classes', path: '/admin/classes', icon: 'classes' },
      { name: 'Subjects', path: '/admin/subjects', icon: 'subjects' },
      { name: 'Exams', path: '/admin/marks', icon: 'exams' },
      { name: 'Reports', path: '/admin/reports', icon: 'reports' }
    ],
    [ROLES.TEACHER]: [
      { name: 'Dashboard', path: '/teacher', icon: 'dashboard' },
      { name: 'My Classes', path: '/teacher/classes', icon: 'classes' },
      { name: 'Enter Marks', path: '/teacher/marks/add', icon: 'exams' },
      { name: 'Attendance', path: '/teacher/attendance', icon: 'attendance' },
      { name: 'Reports', path: '/teacher/reports', icon: 'reports' },
      { name: 'Profile', path: '/teacher/profile', icon: 'profile' }
    ],
    [ROLES.STUDENT]: [
      { name: 'Dashboard', path: '/student', icon: 'dashboard' },
      { name: 'My Grades', path: '/student/grades', icon: 'grades' },
      { name: 'Attendance', path: '/student/attendance', icon: 'attendance' },
      { name: 'Timetable', path: '/student/timetable', icon: 'timetable' },
      { name: 'Profile', path: '/student/profile', icon: 'profile' }
    ],
    [ROLES.PARENT]: [
      { name: 'Dashboard', path: '/parent', icon: 'dashboard' },
      { name: 'Children\'s Grades', path: '/parent/children/grades', icon: 'grades' },
      { name: 'Attendance', path: '/parent/children/attendance', icon: 'attendance' },
      { name: 'Communications', path: '/parent/communications', icon: 'messages' },
      { name: 'Profile', path: '/parent/profile', icon: 'profile' }
    ]
  }
  
  return navigationMap[roleSlug] || navigationMap[ROLES.SUPER_ADMIN]
}

/**
 * Get role display name
 * @param {string|object} role - User role
 * @returns {string} Human-readable role name
 */
export function getRoleDisplayName(role) {
  const roleSlug = typeof role === 'object' ? role.slug : role
  
  const displayNames = {
    [ROLES.SUPER_ADMIN]: 'Super Administrator',
    [ROLES.ADMIN]: 'Administrator', 
    [ROLES.TEACHER]: 'Teacher',
    [ROLES.STUDENT]: 'Student',
    [ROLES.PARENT]: 'Parent'
  }
  
  return displayNames[roleSlug] || 'User'
}

/**
 * Check if user can access admin features
 * @param {string|object} userRole - User's role
 * @returns {boolean} Whether user has admin access
 */
export function isAdmin(userRole) {
  return hasMinimumRole(userRole, ROLES.ADMIN)
}

/**
 * Check if user is super admin
 * @param {string|object} userRole - User's role
 * @returns {boolean} Whether user is super admin
 */
export function isSuperAdmin(userRole) {
  const roleSlug = typeof userRole === 'object' ? userRole.slug : userRole
  return roleSlug === ROLES.SUPER_ADMIN
}

/**
 * Check if user is a teacher
 * @param {string|object} userRole - User's role
 * @returns {boolean} Whether user is a teacher
 */
export function isTeacher(userRole) {
  return hasMinimumRole(userRole, ROLES.TEACHER)
}

export default {
  ROLES,
  ROLE_LEVELS,
  ROLE_DASHBOARDS,
  DASHBOARD_ROUTE_NAMES,
  getDashboardRoute,
  getDashboardRouteName,
  hasRouteAccess,
  hasMinimumRole,
  getNavigationItems,
  getRoleDisplayName,
  isAdmin,
  isSuperAdmin,
  isTeacher
}