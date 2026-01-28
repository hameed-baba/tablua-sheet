# Authentication & Authorization System

## Overview
The school management system uses JWT-based authentication with role-based authorization. Users are authenticated via login and authorized based on their assigned roles.

## Roles & Permissions

### Available Roles
1. **Super Admin** (`super_admin`) - Level 100
   - Full system access
   - Can manage all users and system settings
   - Highest privilege level

2. **Admin** (`admin`) - Level 80
   - Manages school operations
   - Can manage staff, students, and academic records
   - Cannot manage other admins or system settings

3. **Teacher** (`teacher`) - Level 50
   - Handles classes, subjects, attendance
   - Can view and manage student assessments
   - Limited administrative access

4. **Student** (`student`) - Level 10
   - Views personal academic information
   - Access to timetable, grades, assignments

5. **Parent** (`parent`) - Level 5
   - Monitors child's academic performance
   - Views attendance and school communications

## Authentication Flow

### 1. Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@school.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "full_name": "John Admin",
      "email": "admin@school.com",
      "role": {
        "id": 2,
        "name": "Admin",
        "description": "Manages school operations..."
      }
    }
  }
}
```

### 2. Using the Token
Include the token in the Authorization header for all protected routes:
```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Middleware Usage

### Basic Authentication
```javascript
const { authenticate } = require('../middleware/auth');

// Any authenticated user can access
router.get('/profile', authenticate, controller.getProfile);
```

### Role-Based Authorization

#### Specific Role Requirements
```javascript
const { requireSuperAdmin, requireAdmin, requireTeacher } = require('../middleware/auth');

// Only super admin
router.delete('/users/:id', authenticate, requireSuperAdmin, controller.deleteUser);

// Admin or super admin
router.post('/staff', authenticate, requireAdmin, controller.createStaff);

// Teacher, admin, or super admin
router.get('/classes', authenticate, requireTeacher, controller.getClasses);
```

#### Custom Role Combinations
```javascript
const { authorize } = require('../middleware/auth');

// Specific roles only
router.get('/reports', 
  authenticate, 
  authorize(['admin', 'super_admin']), 
  controller.getReports
);

// Multiple roles allowed
router.get('/students', 
  authenticate, 
  authorize(['teacher', 'admin', 'super_admin']), 
  controller.getStudents
);
```

#### Level-Based Authorization
```javascript
const { authorizeLevel } = require('../middleware/auth');

// Minimum level 80 (Admin and above)
router.get('/sensitive-data', 
  authenticate, 
  authorizeLevel(80), 
  controller.getSensitiveData
);
```

## Test Endpoints

Test your authentication with these endpoints:

### 1. Basic Authentication Test
```http
GET /api/auth/test/authenticated
Authorization: Bearer <your-token>
```

### 2. Super Admin Test
```http
GET /api/auth/test/super-admin
Authorization: Bearer <super-admin-token>
```

### 3. Admin Test
```http
GET /api/auth/test/admin
Authorization: Bearer <admin-or-super-admin-token>
```

### 4. Teacher Test
```http
GET /api/auth/test/teacher
Authorization: Bearer <teacher-admin-or-super-admin-token>
```

### 5. Level-Based Test
```http
GET /api/auth/test/level-80
Authorization: Bearer <level-80-or-higher-token>
```

## Error Responses

### 401 Unauthorized
```json
{
  "status": "error",
  "message": "Access denied. No token provided."
}
```

### 403 Forbidden
```json
{
  "status": "error",
  "message": "Insufficient permissions. Required roles: admin, super_admin"
}
```

## Best Practices

1. **Always authenticate first**: Use `authenticate` middleware before any authorization checks
2. **Use specific role checks**: Prefer `requireAdmin` over generic `authorize(['admin'])`
3. **Combine checks when needed**: Stack multiple middleware for complex requirements
4. **Handle errors gracefully**: Provide clear error messages for authorization failures
5. **Test thoroughly**: Use the test endpoints to verify your authentication setup

## Example Route Protection

```javascript
const express = require('express');
const {
  authenticate,
  requireAdmin,
  requireSuperAdmin,
  authorize,
  checkSchoolAccess
} = require('../middleware/auth');

const router = express.Router();

// Public route (no authentication)
router.get('/public-info', controller.getPublicInfo);

// Authenticated users only
router.get('/profile', authenticate, controller.getProfile);

// Admin and above
router.post('/staff', authenticate, requireAdmin, controller.createStaff);
router.put('/staff/:id', authenticate, requireAdmin, controller.updateStaff);

// Super admin only
router.delete('/staff/:id', authenticate, requireSuperAdmin, controller.deleteStaff);

// Multiple roles with additional checks
router.get('/reports', 
  authenticate, 
  authorize(['admin', 'super_admin']), 
  checkSchoolAccess,
  controller.getReports
);

module.exports = router;
```

This authentication system provides flexible, secure access control for your school management system.