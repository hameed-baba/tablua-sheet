# School Management System API Documentation

## Authentication

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@school.com",
  "password": "admin123"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "staff": {
      "id": 1,
      "full_name": "System Administrator",
      "email": "admin@school.com",
      "role": "Super Admin",
      "hasSchoolAccess": true,
      "hasSystemAccess": true,
      "is_default_password": true
    }
  }
}
```

## Staff Management

### Register Staff
```http
POST /api/staff/register
Authorization: Bearer <token>
Content-Type: application/json

{
  "full_name": "John Doe",
  "phone_number": "+1234567890",
  "email": "john.doe@school.com",
  "address": "123 Main Street",
  "state": "California",
  "local_gov": "Los Angeles",
  "date_of_employment": "2024-01-15",
  "role_id": 4,
  "password": "password123",
  "hasSchoolAccess": true,
  "hasSystemAccess": false,
  "gender": "male",
  "schoolId": 1
}
```

### Get All Staff
```http
GET /api/staff?page=1&limit=10&search=john
Authorization: Bearer <token>
```

## Student Management

### Register Student
```http
POST /api/students/register
Authorization: Bearer <token>
Content-Type: application/json

{
  "full_name": "Jane Smith",
  "gender": "female",
  "dob": "2010-05-15",
  "address": "456 Oak Avenue",
  "state": "California",
  "local_gov": "Los Angeles",
  "religion": "Christianity",
  "blood_group": "O+",
  "admission_number": "STU2024001",
  "admitted_class": "Grade 5",
  "admitted_session": "2024/2025",
  "status": "active",
  "schoolClassId": 1,
  "sessionId": 1,
  "parentId": 1,
  "schoolId": 1
}
```

### Get Students with Filters
```http
GET /api/students?classId=1&sessionId=1&status=active&page=1&limit=20
Authorization: Bearer <token>
```

## Class Management

### Create Class Master Assignment
```http
POST /api/class-masters
Authorization: Bearer <token>
Content-Type: application/json

{
  "schoolStaffId": 2,
  "schoolSectionId": 1,
  "schoolClassId": 1
}
```

### Assign Subject to Class and Teacher
```http
POST /api/class-subject-assigns
Authorization: Bearer <token>
Content-Type: application/json

{
  "schoolClassId": 1,
  "schoolSubjectId": 1,
  "schoolStaffId": 2
}
```

## Academic Management

### Create School Section
```http
POST /api/school-sections
Authorization: Bearer <token>
Content-Type: application/json

{
  "section_name": "Primary Section"
}
```

### Create School Class
```http
POST /api/school-classes
Authorization: Bearer <token>
Content-Type: application/json

{
  "class_name": "Grade 5A",
  "gradeListId": 1,
  "schoolSectionId": 1
}
```

### Create Subject
```http
POST /api/school-subjects
Authorization: Bearer <token>
Content-Type: application/json

{
  "subject_name": "Mathematics",
  "sectionsId": 1
}
```

### Create Academic Session
```http
POST /api/school-sessions
Authorization: Bearer <token>
Content-Type: application/json

{
  "session_name": "2024/2025",
  "status": "active"
}
```

### Create Academic Term
```http
POST /api/school-terms
Authorization: Bearer <token>
Content-Type: application/json

{
  "sessionId": 1,
  "term_name": "First Term",
  "status": "active",
  "payment_status": "pending"
}
```

## Parent Management

### Register Parent
```http
POST /api/parents
Authorization: Bearer <token>
Content-Type: application/json

{
  "full_name": "Robert Smith",
  "religion": "Christianity",
  "gender": "male",
  "relation": "Father",
  "address": "456 Oak Avenue",
  "state": "California",
  "local_gov": "Los Angeles",
  "phone_number": "+1987654321",
  "psn": "PSN123456"
}
```

## Role and Permission Management

### Create Role
```http
POST /api/roles
Authorization: Bearer <token>
Content-Type: application/json

{
  "role_name": "Vice Principal"
}
```

### Assign Permission to Role
```http
POST /api/role-permissions
Authorization: Bearer <token>
Content-Type: application/json

{
  "role_id": 2,
  "permissionId": 5
}
```

### Get Role Permissions
```http
GET /api/role-permissions/2
Authorization: Bearer <token>
```

## Grade Management

### Create Grade List
```http
POST /api/grade-lists
Authorization: Bearer <token>
Content-Type: application/json

{
  "grade_name": "High School Grading",
  "grade_type": "high_school"
}
```

### Create Grade System
```http
POST /api/grade-systems
Authorization: Bearer <token>
Content-Type: application/json

{
  "gradeListId": 1,
  "from_mark": 85,
  "to_mark": 100,
  "grade": "A",
  "remark": "Excellent"
}
```

## Common Query Parameters

Most GET endpoints support:
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10, max: 100)
- `search` - Search term
- `sortBy` - Field to sort by (default: 'createdAt')
- `sortOrder` - 'ASC' or 'DESC' (default: 'DESC')

## Error Responses

### Validation Error
```json
{
  "status": "error",
  "message": "Validation error",
  "details": [
    "\"email\" must be a valid email"
  ]
}
```

### Authentication Error
```json
{
  "status": "error",
  "message": "Access denied. No token provided."
}
```

### Authorization Error
```json
{
  "status": "error",
  "message": "Access denied. Insufficient permissions."
}
```

### Not Found Error
```json
{
  "status": "error",
  "message": "Student not found"
}
```

## Pagination Response Format

```json
{
  "status": "success",
  "data": {
    "students": [...],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 50,
      "itemsPerPage": 10
    }
  }
}
```