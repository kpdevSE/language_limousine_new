# User Management API Documentation

## Overview
This API provides comprehensive user management functionality for admins to add, view, update, and delete users (Drivers, Subdrivers, Greeters, Schools) in the system.

## Base URL
```
http://localhost:5000/api
```

## Authentication
All user management endpoints require admin authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

## User Management Endpoints

### 1. Add New User
**POST** `/users`

Add a new user to the system (Admin only).

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "username": "driver123",
  "email": "driver@example.com",
  "password": "password123",
  "gender": "Male",
  "role": "Driver",
  "greeterID": "GR001" // Optional, required only for Greeter role
}
```

**Response:**
```json
{
  "success": true,
  "message": "Driver user added successfully",
  "data": {
    "user": {
      "id": "user_id",
      "username": "driver123",
      "email": "driver@example.com",
      "role": "Driver",
      "gender": "Male",
      "greeterID": null,
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

### 2. Get All Users
**GET** `/users`

Get all users with pagination and search functionality.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `role` (optional): Filter by role (Greeter, Driver, Subdriver, School)
- `search` (optional): Search by username, email, or greeterID

**Example:**
```
GET /api/users?page=1&limit=10&role=Driver&search=driver
```

**Response:**
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "user_id",
        "username": "driver123",
        "email": "driver@example.com",
        "role": "Driver",
        "gender": "Male",
        "greeterID": null,
        "isActive": true,
        "createdAt": "2024-01-01T00:00:00.000Z",
        "createdBy": {
          "id": "admin_id",
          "username": "admin",
          "email": "admin@example.com"
        }
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalUsers": 50,
      "limit": 10
    }
  }
}
```

### 3. Get Users by Role
**GET** `/users/role/:role`

Get users filtered by specific role.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Path Parameters:**
- `role`: User role (Greeter, Driver, Subdriver, School)

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `search` (optional): Search by username, email, or greeterID

**Example:**
```
GET /api/users/role/Driver?page=1&limit=5
```

**Response:**
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "user_id",
        "username": "driver123",
        "email": "driver@example.com",
        "role": "Driver",
        "gender": "Male",
        "isActive": true,
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 2,
      "totalUsers": 15,
      "limit": 5
    }
  }
}
```

### 4. Get User by ID
**GET** `/users/:userId`

Get a specific user by their ID.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Path Parameters:**
- `userId`: User ID

**Example:**
```
GET /api/users/507f1f77bcf86cd799439011
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "username": "driver123",
      "email": "driver@example.com",
      "role": "Driver",
      "gender": "Male",
      "greeterID": null,
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "createdBy": {
        "id": "admin_id",
        "username": "admin",
        "email": "admin@example.com"
      }
    }
  }
}
```

### 5. Update User
**PUT** `/users/:userId`

Update an existing user.

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Path Parameters:**
- `userId`: User ID

**Request Body:**
```json
{
  "username": "updateddriver",
  "email": "updateddriver@example.com",
  "gender": "Female",
  "role": "Driver",
  "isActive": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "user": {
      "id": "user_id",
      "username": "updateddriver",
      "email": "updateddriver@example.com",
      "role": "Driver",
      "gender": "Female",
      "isActive": true,
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

### 6. Delete User
**DELETE** `/users/:userId`

Delete a user from the system.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Path Parameters:**
- `userId`: User ID

**Example:**
```
DELETE /api/users/507f1f77bcf86cd799439011
```

**Response:**
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

### 7. Get User Statistics
**GET** `/users/stats`

Get user statistics and counts.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Example:**
```
GET /api/users/stats
```

**Response:**
```json
{
  "success": true,
  "data": {
    "stats": {
      "Driver": {
        "total": 25,
        "active": 23,
        "inactive": 2
      },
      "Greeter": {
        "total": 10,
        "active": 9,
        "inactive": 1
      },
      "Subdriver": {
        "total": 15,
        "active": 14,
        "inactive": 1
      },
      "School": {
        "total": 5,
        "active": 5,
        "inactive": 0
      }
    },
    "total": {
      "users": 55,
      "active": 51,
      "inactive": 4
    }
  }
}
```

## User Login Endpoints

### 1. Admin Login
**POST** `/auth/login`

Login for admin users only.

**Request Body:**
```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```

### 2. General User Login
**POST** `/auth/user/login`

Login for all user types (Driver, Subdriver, Greeter, School).

**Request Body:**
```json
{
  "email": "driver@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "user_id",
      "username": "driver123",
      "email": "driver@example.com",
      "role": "Driver",
      "gender": "Male",
      "greeterID": null,
      "isActive": true,
      "lastLogin": "2024-01-01T00:00:00.000Z"
    },
    "token": "jwt_token_here"
  }
}
```

## User Roles and Requirements

### 1. Driver
- **Required fields**: username, email, password, gender
- **Optional fields**: greeterID
- **Role**: "Driver"

### 2. Subdriver
- **Required fields**: username, email, password, gender
- **Optional fields**: greeterID
- **Role**: "Subdriver"

### 3. Greeter
- **Required fields**: username, email, password, gender, greeterID
- **Role**: "Greeter"
- **Note**: greeterID must be unique

### 4. School
- **Required fields**: username, email, password, gender
- **Optional fields**: greeterID
- **Role**: "School"

## Validation Rules

### Username
- Minimum 3 characters
- Must be unique
- Alphanumeric and underscores allowed

### Email
- Must be valid email format
- Must be unique
- Automatically normalized

### Password
- Minimum 6 characters
- Automatically hashed with bcrypt

### Gender
- Must be one of: "Male", "Female", "Other"

### Role
- Must be one of: "Greeter", "Driver", "Subdriver", "School"

### GreeterID
- Required only for Greeter role
- Must be unique
- String format

## Error Responses

### Validation Error
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "type": "field",
      "value": "",
      "msg": "Username must be at least 3 characters long",
      "path": "username",
      "location": "body"
    }
  ]
}
```

### Authentication Error
```json
{
  "success": false,
  "message": "Access denied. Admin privileges required"
}
```

### User Not Found
```json
{
  "success": false,
  "message": "User not found"
}
```

### Duplicate User
```json
{
  "success": false,
  "message": "User with this email or username already exists"
}
```

## Security Features

- ✅ JWT token authentication
- ✅ Admin-only access for user management
- ✅ Password hashing with bcrypt
- ✅ Input validation and sanitization
- ✅ Role-based access control
- ✅ User activity tracking (lastLogin)
- ✅ User status management (active/inactive)

## Testing Examples

### Add a Driver
```bash
curl -X POST http://localhost:5000/api/users \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "driver123",
    "email": "driver@example.com",
    "password": "password123",
    "gender": "Male",
    "role": "Driver"
  }'
```

### Add a Greeter
```bash
curl -X POST http://localhost:5000/api/users \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "greeter123",
    "email": "greeter@example.com",
    "password": "password123",
    "gender": "Female",
    "role": "Greeter",
    "greeterID": "GR001"
  }'
```

### Get All Drivers
```bash
curl -X GET "http://localhost:5000/api/users?role=Driver&page=1&limit=10" \
  -H "Authorization: Bearer <admin_token>"
```

### Update User
```bash
curl -X PUT http://localhost:5000/api/users/<user_id> \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "updateddriver",
    "isActive": true
  }'
```

### Delete User
```bash
curl -X DELETE http://localhost:5000/api/users/<user_id> \
  -H "Authorization: Bearer <admin_token>"
```
