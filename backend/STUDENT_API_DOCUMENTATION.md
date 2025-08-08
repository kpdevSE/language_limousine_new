# Student API Documentation

## Overview

The Student API provides comprehensive CRUD operations for managing student records in the Language Limousine system. All endpoints require admin authentication.

## Base URL

```
http://localhost:5000/api/students
```

## Authentication

All endpoints require a valid JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Data Models

### Student Schema

```javascript
{
  date: String (required),           // Date in format "MM/DD/YYYY"
  trip: String (required),           // Trip identifier
  actualArrivalTime: String (required), // Time in format "HH:MM:SS"
  arrivalTime: String (required),    // Arrival time
  flight: String (required),         // Flight information
  dOrI: String (required),           // "D" or "I" (Domestic/International)
  mOrF: String (required),           // "M" or "F" (Male/Female)
  studentNo: String (required),      // Student number (unique per date)
  studentGivenName: String (required), // Student's given name
  studentFamilyName: String (required), // Student's family name
  hostGivenName: String (required),  // Host's given name
  hostFamilyName: String (required), // Host's family name
  phone: String (required),          // Phone number
  address: String (required),        // Address
  city: String (required),           // City
  school: String (required),         // School name
  client: String (required),         // Client identifier
  createdBy: ObjectId (required),    // Reference to User who created
  isActive: Boolean (default: true), // Soft delete flag
  createdAt: Date,                   // Auto-generated
  updatedAt: Date                    // Auto-generated
}
```

## API Endpoints

### 1. Add New Student

**POST** `/students`

Add a new student record.

**Request Body:**

```json
{
  "date": "07/24/2025",
  "trip": "1",
  "actualArrivalTime": "03:00:00",
  "arrivalTime": "AM 695",
  "flight": "I",
  "dOrI": "D",
  "mOrF": "M",
  "studentNo": "STU001",
  "studentGivenName": "John",
  "studentFamilyName": "Doe",
  "hostGivenName": "Jane",
  "hostFamilyName": "Smith",
  "phone": "123-456-7890",
  "address": "123 Main St",
  "city": "Vancouver",
  "school": "UBC",
  "client": "client1"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Student added successfully",
  "data": {
    "student": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "date": "07/24/2025",
      "trip": "1",
      "actualArrivalTime": "03:00:00",
      "arrivalTime": "AM 695",
      "flight": "I",
      "dOrI": "D",
      "mOrF": "M",
      "studentNo": "STU001",
      "studentGivenName": "John",
      "studentFamilyName": "Doe",
      "hostGivenName": "Jane",
      "hostFamilyName": "Smith",
      "phone": "123-456-7890",
      "address": "123 Main St",
      "city": "Vancouver",
      "school": "UBC",
      "client": "client1",
      "isActive": true,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

### 2. Get All Students

**GET** `/students`

Retrieve all students with pagination and search.

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `search` (optional): Search term for trip, student number, arrival time, etc.
- `date` (optional): Filter by specific date
- `trip` (optional): Filter by specific trip

**Example Request:**

```
GET /students?page=1&limit=10&search=STU001
```

**Response:**

```json
{
  "success": true,
  "data": {
    "students": [
      {
        "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
        "date": "07/24/2025",
        "trip": "1",
        "actualArrivalTime": "03:00:00",
        "arrivalTime": "AM 695",
        "flight": "I",
        "dOrI": "D",
        "mOrF": "M",
        "studentNo": "STU001",
        "studentGivenName": "John",
        "studentFamilyName": "Doe",
        "hostGivenName": "Jane",
        "hostFamilyName": "Smith",
        "phone": "123-456-7890",
        "address": "123 Main St",
        "city": "Vancouver",
        "school": "UBC",
        "client": "client1",
        "isActive": true,
        "createdAt": "2024-01-15T10:30:00.000Z",
        "updatedAt": "2024-01-15T10:30:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalStudents": 50,
      "limit": 10
    }
  }
}
```

### 3. Get Student by ID

**GET** `/students/:studentId`

Retrieve a specific student by ID.

**Response:**

```json
{
  "success": true,
  "data": {
    "student": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "date": "07/24/2025",
      "trip": "1",
      "actualArrivalTime": "03:00:00",
      "arrivalTime": "AM 695",
      "flight": "I",
      "dOrI": "D",
      "mOrF": "M",
      "studentNo": "STU001",
      "studentGivenName": "John",
      "studentFamilyName": "Doe",
      "hostGivenName": "Jane",
      "hostFamilyName": "Smith",
      "phone": "123-456-7890",
      "address": "123 Main St",
      "city": "Vancouver",
      "school": "UBC",
      "client": "client1",
      "isActive": true,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

### 4. Update Student

**PUT** `/students/:studentId`

Update a specific student record.

**Request Body:**

```json
{
  "studentGivenName": "Jane",
  "studentFamilyName": "Johnson",
  "phone": "987-654-3210"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Student updated successfully",
  "data": {
    "student": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "date": "07/24/2025",
      "trip": "1",
      "actualArrivalTime": "03:00:00",
      "arrivalTime": "AM 695",
      "flight": "I",
      "dOrI": "D",
      "mOrF": "M",
      "studentNo": "STU001",
      "studentGivenName": "Jane",
      "studentFamilyName": "Johnson",
      "hostGivenName": "Jane",
      "hostFamilyName": "Smith",
      "phone": "987-654-3210",
      "address": "123 Main St",
      "city": "Vancouver",
      "school": "UBC",
      "client": "client1",
      "isActive": true,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T11:00:00.000Z"
    }
  }
}
```

### 5. Delete Student

**DELETE** `/students/:studentId`

Soft delete a student (sets isActive to false).

**Response:**

```json
{
  "success": true,
  "message": "Student deleted successfully"
}
```

### 6. Get Student Statistics

**GET** `/students/stats`

Get statistics about students.

**Response:**

```json
{
  "success": true,
  "data": {
    "stats": {
      "totalStudents": 150,
      "totalTrips": 25,
      "totalSchools": 10,
      "totalClients": 5
    },
    "last7Days": [
      {
        "_id": "07/24/2025",
        "count": 15
      },
      {
        "_id": "07/23/2025",
        "count": 12
      }
    ]
  }
}
```

### 7. Bulk Import Students

**POST** `/students/bulk-import`

Import multiple students at once.

**Request Body:**

```json
{
  "students": [
    {
      "date": "07/24/2025",
      "trip": "1",
      "actualArrivalTime": "03:00:00",
      "arrivalTime": "AM 695",
      "flight": "I",
      "dOrI": "D",
      "mOrF": "M",
      "studentNo": "STU001",
      "studentGivenName": "John",
      "studentFamilyName": "Doe",
      "hostGivenName": "Jane",
      "hostFamilyName": "Smith",
      "phone": "123-456-7890",
      "address": "123 Main St",
      "city": "Vancouver",
      "school": "UBC",
      "client": "client1"
    },
    {
      "date": "07/24/2025",
      "trip": "2",
      "actualArrivalTime": "05:00:00",
      "arrivalTime": "AM 696",
      "flight": "I",
      "dOrI": "D",
      "mOrF": "F",
      "studentNo": "STU002",
      "studentGivenName": "Jane",
      "studentFamilyName": "Smith",
      "hostGivenName": "Bob",
      "hostFamilyName": "Johnson",
      "phone": "987-654-3210",
      "address": "456 Oak Ave",
      "city": "Vancouver",
      "school": "SFU",
      "client": "client2"
    }
  ]
}
```

**Response:**

```json
{
  "success": true,
  "message": "Import completed. 2 students imported successfully.",
  "data": {
    "imported": 2,
    "errors": 0,
    "errorDetails": []
  }
}
```

## Error Responses

### Validation Error (400)

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "type": "field",
      "value": "X",
      "msg": "D or I must be either 'D' or 'I'",
      "path": "dOrI",
      "location": "body"
    }
  ]
}
```

### Not Found Error (404)

```json
{
  "success": false,
  "message": "Student not found"
}
```

### Unauthorized Error (401)

```json
{
  "success": false,
  "message": "Access token required. Please log in again."
}
```

### Forbidden Error (403)

```json
{
  "success": false,
  "message": "You don't have permission to perform this action."
}
```

### Internal Server Error (500)

```json
{
  "success": false,
  "message": "Internal server error"
}
```

## Validation Rules

### Required Fields

All fields in the student schema are required.

### Field Validations

- `dOrI`: Must be either "D" or "I"
- `mOrF`: Must be either "M" or "F"
- `studentNo`: Must be unique per date (combination of studentNo and date)
- `date`: Must be a valid date string
- `actualArrivalTime`: Must be a valid time string
- `arrivalTime`: Must be a valid time string

## Search Functionality

The search parameter searches across the following fields:

- `trip`
- `studentNo`
- `arrivalTime`
- `studentGivenName`
- `studentFamilyName`
- `flight`
- `school`

Search is case-insensitive and uses partial matching.

## Pagination

Pagination is handled through the `page` and `limit` query parameters:

- `page`: Page number (starts from 1)
- `limit`: Number of items per page (default: 10, max: 100)

## Testing

Use the provided test file `test-student-api.js` to test all endpoints:

```bash
# Install dependencies
npm install axios

# Set your admin token in the test file
# Run the tests
node test-student-api.js
```

## Frontend Integration

The frontend component `Add.jsx` has been updated to integrate with these API endpoints. Key features:

1. **Form Submission**: Sends POST request to `/students`
2. **Data Fetching**: Uses GET `/students` with pagination and search
3. **Delete Functionality**: Uses DELETE `/students/:id`
4. **Error Handling**: Displays validation and server errors
5. **Loading States**: Shows loading indicators during API calls
6. **Success Messages**: Displays success notifications
7. **Real-time Updates**: Refreshes data after successful operations

## Security Considerations

1. **Authentication**: All endpoints require valid admin JWT token
2. **Authorization**: Only admin users can access student management
3. **Input Validation**: Comprehensive validation on all inputs
4. **SQL Injection Protection**: Uses Mongoose ODM for database queries
5. **Rate Limiting**: Applied at the application level
6. **CORS**: Configured for frontend domain
