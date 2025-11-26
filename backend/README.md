# School Management System Backend API

A comprehensive, secure, and scalable backend API for School Management System built with Node.js, Express, and MySQL using Sequelize ORM.

## Features

- **Authentication & Authorization**: JWT-based authentication with role-based access control
- **User Management**: Staff registration, login, profile management
- **Student Management**: Student registration, enrollment, and tracking
- **Academic Management**: Classes, subjects, grade systems, and academic sessions
- **Role-Based Permissions**: Granular permission system for different user roles
- **Data Relationships**: Comprehensive relationships between all entities
- **Security**: Password hashing, rate limiting, CORS, and high-performance input validation
- **API Standards**: RESTful APIs with consistent response format and pagination

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL
- **ORM**: Sequelize
- **Authentication**: JWT (jsonwebtoken)
- **Validation**: fastest-validator (high-performance validation)
- **Security**: bcryptjs, helmet, cors, express-rate-limit
- **Environment**: dotenv

## Project Structure

```
school-management-backend/
├── config/
│   ├── database.js          # Database configuration
│   └── config.js           # Sequelize CLI configuration
├── controllers/            # Business logic controllers
│   ├── index.js            # Controller exports
│   ├── baseController.js   # Base CRUD controller
│   ├── authController.js   # Authentication logic
│   ├── schoolStaffController.js
│   ├── schoolStudentController.js
│   └── ... (other controllers)
├── middleware/
│   ├── auth.js             # Authentication & authorization
│   ├── validation.js       # Input validation schemas
│   └── errorHandler.js     # Global error handling
├── models/                 # Sequelize models
│   ├── index.js
│   ├── SchoolStaff.js
│   ├── SchoolStudent.js
│   ├── Role.js
│   ├── Permission.js
│   └── ... (other models)
├── routes/                 # API route definitions
│   ├── auth.js
│   ├── schoolStaffs.js
│   ├── schoolStudents.js
│   └── ... (other routes)
├── seeders/               # Database seeders
│   ├── 001-default-permissions.js
│   ├── 002-default-roles.js
│   └── ... (other seeders)
├── utils/
│   └── routeGenerator.js  # Utility for generating CRUD routes
├── server.js              # Main application entry point
├── package.json
└── README.md
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MySQL (v5.7 or higher)
- npm or yarn

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd school-management-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   NODE_ENV=development
   PORT=3000
   
   # Database Configuration
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=school_management
   DB_USER=root
   DB_PASSWORD=your_password
   
   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-here
   JWT_EXPIRES_IN=24h
   ```

4. **Database Setup**
   ```bash
   # Create database
   mysql -u root -p -e "CREATE DATABASE school_management;"
   
   # Run migrations (if you have them)
   npm run migrate
   
   # Run seeders for default data
   npm run seed
   ```

5. **Start the server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## API Documentation

### Base URL
```
http://localhost:3000/api
```

### Authentication

All protected routes require a Bearer token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

### Standard Response Format

```json
{
  "status": "success|error",
  "message": "Response message",
  "data": {} // Response data (for success responses)
}
```

### Core Endpoints

#### Authentication
- `POST /api/auth/login` - Staff login
- `PUT /api/auth/change-password` - Change password
- `GET /api/auth/profile` - Get current user profile

#### Staff Management
- `POST /api/staff/register` - Register new staff
- `GET /api/staff` - Get all staff (with pagination)
- `GET /api/staff/:id` - Get staff by ID
- `PUT /api/staff/:id` - Update staff
- `DELETE /api/staff/:id` - Delete staff (soft delete)

#### Student Management
- `POST /api/students/register` - Register new student
- `GET /api/students` - Get all students (with filters)
- `GET /api/students/:id` - Get student by ID
- `PUT /api/students/:id` - Update student
- `DELETE /api/students/:id` - Delete student

#### Class Management
- `GET /api/class-masters` - Get all class assignments
- `POST /api/class-masters` - Create class assignment
- `PUT /api/class-masters/:id` - Update class assignment
- `DELETE /api/class-masters/:id` - Delete class assignment

#### Subject Management
- `GET /api/school-subjects` - Get all subjects
- `POST /api/school-subjects` - Create subject
- `PUT /api/school-subjects/:id` - Update subject
- `DELETE /api/school-subjects/:id` - Delete subject

#### Grade Management
- `GET /api/grade-lists` - Get all grade lists
- `GET /api/grade-systems` - Get grade systems
- `POST /api/grade-systems` - Create grade system

#### Role & Permission Management
- `GET /api/roles` - Get all roles
- `POST /api/roles` - Create role
- `GET /api/permissions` - Get all permissions
- `POST /api/role-permissions` - Assign permission to role
- `GET /api/role-permissions/:role_id` - Get role permissions

### Query Parameters

Most GET endpoints support these query parameters:
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10, max: 100)
- `search` - Search term
- `sortBy` - Field to sort by
- `sortOrder` - ASC or DESC

Example:
```
GET /api/students?page=1&limit=20&search=john&sortBy=createdAt&sortOrder=DESC
```

## Default Users & Roles

After running seeders, you'll have:

### Default Admin User
- **Email**: admin@school.com
- **Password**: admin123
- **Role**: Super Admin
- **Permissions**: All system permissions

### Default Roles
1. **Super Admin** - Full system access
2. **School Admin** - School-level administration
3. **Principal** - School management
4. **Teacher** - Basic teaching functions
5. **Class Teacher** - Class-specific management
6. **Subject Teacher** - Subject-specific teaching

## Security Features

- **Password Hashing**: bcryptjs with salt rounds
- **JWT Authentication**: Secure token-based authentication
- **Rate Limiting**: Prevents API abuse
- **Input Validation**: Joi schema validation
- **CORS Protection**: Configurable cross-origin requests
- **Helmet**: Security headers
- **Role-Based Access**: Granular permission system

## Database Schema

The system includes these main entities:
- **school_staffs** - Staff/teacher information
- **school_students** - Student information
- **school_classes** - Class definitions
- **school_subjects** - Subject definitions
- **school_sections** - School sections/departments
- **school_sessions** - Academic sessions
- **school_terms** - Academic terms
- **parents** - Parent/guardian information
- **roles** - User roles
- **permissions** - System permissions
- **role_permissions** - Role-permission assignments
- **class_masters** - Class-teacher assignments
- **class_subject_assigns** - Subject-teacher-class assignments
- **grade_lists** - Grading systems
- **grade_systems** - Grade scales

## Error Handling

The API includes comprehensive error handling:
- **Validation Errors**: 400 Bad Request
- **Authentication Errors**: 401 Unauthorized
- **Authorization Errors**: 403 Forbidden
- **Not Found Errors**: 404 Not Found
- **Server Errors**: 500 Internal Server Error

## Development

### Running in Development Mode
```bash
npm run dev
```

### Database Operations
```bash
# Run migrations
npm run migrate

# Run seeders
npm run seed

# Reset database (careful!)
npx sequelize-cli db:drop
npx sequelize-cli db:create
npm run migrate
npm run seed
```

## Production Deployment

1. Set `NODE_ENV=production`
2. Use a process manager like PM2
3. Set up proper database credentials
4. Configure reverse proxy (nginx)
5. Set up SSL certificates
6. Configure proper logging

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please contact the development team or create an issue in the repository.