# Role-Based Access Control (RBAC) System

A robust Role-Based Access Control system built with Node.js, Express, and MongoDB. This system provides a flexible and secure way to manage user permissions and roles in web applications.

## Features

- **User Management**: Create, read, update, and delete user accounts
- **Role Management**: Pre-configured roles with different permission levels
  - Admin: Full system access
  - Moderator: Elevated access with user management capabilities
  - User: Basic access with limited permissions
- **Permission System**: Granular permission control based on resources and actions
- **JWT Authentication**: Secure token-based authentication
- **MongoDB Integration**: Scalable database solution for storing user, role, and permission data

## Tech Stack

- Node.js
- Express.js
- MongoDB with Mongoose
- JSON Web Tokens (JWT)
- bcryptjs for password hashing

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── db.js         # Database configuration
│   │   ├── jwt.js        # JWT utilities
│   │   └── seedData.js   # Default data seeding
│   ├── controllers/
│   │   ├── authController.js  # Authentication logic
│   │   └── userController.js  # User management logic
│   ├── middleware/
│   │   └── auth.js       # Authentication middleware
│   ├── models/
│   │   ├── Permission.js # Permission model
│   │   ├── Role.js      # Role model
│   │   └── User.js      # User model
│   ├── routes/
│   │   ├── authRoutes.js # Authentication routes
│   │   └── userRoutes.js # User management routes
│   ├── app.js           # Express app setup
│   └── server.js        # Server entry point
└── package.json
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a .env file in the root directory with the following variables:
   ```
   NODE_ENV=development
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```

4. Seed the database with initial data:
   ```bash
   node src/config/seedData.js
   ```

5. Start the server:
   ```bash
   npm start
   ```

## Default Roles and Permissions

### Roles

1. **Admin**
   - Full system access
   - All permissions granted

2. **Moderator**
   - Can read and update user information
   - Cannot delete users or manage roles

3. **User**
   - Basic read access to user information
   - No management permissions

### Permissions

- read_users: View user information
- create_users: Create new users
- update_users: Modify user information
- delete_users: Remove users from the system
- manage_user_roles: Assign and modify user roles

## Default Admin Account

The system comes with a default admin account:
- Username: admin
- Email: admin@example.com
- Password: admin123

**Important**: Change these credentials immediately in production.

## API Endpoints

### Authentication

- POST /api/auth/register - Register a new user
- POST /api/auth/login - User login
- GET /api/auth/profile - Get current user profile

### User Management

- GET /api/users - List all users (Admin only)
- GET /api/users/:id - Get specific user
- PUT /api/users/:id - Update user
- DELETE /api/users/:id - Delete user
- PUT /api/users/:id/roles - Update user roles

## Security Considerations

1. The system uses JWT for authentication
2. Passwords are hashed using bcrypt
3. Role-based middleware protects sensitive routes
4. MongoDB indexes ensure data integrity

## Testing

To test the RBAC system:

1. Use the default admin credentials to log in
2. Create new users with different roles
3. Test access to various endpoints based on roles
4. Verify permission restrictions are working as expected

## Production Deployment

Before deploying to production:

1. Change default admin credentials
2. Set secure JWT secret
3. Enable MongoDB authentication
4. Configure appropriate CORS settings
5. Set up proper error logging
6. Enable HTTPS
7. Implement rate limiting

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.
