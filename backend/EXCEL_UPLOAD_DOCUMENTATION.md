# Excel Upload Feature Documentation

## Overview

The Excel Upload feature allows administrators to bulk import student data from Excel files (.xlsx, .xls) into the Language Limousine system. This feature supports auto-generated student numbers and handles all the fields from the provided Excel sheet structure.

## Features

- **Bulk Import**: Upload multiple students at once from Excel files
- **Auto-Generated Student Numbers**: Automatically generate unique student numbers if not provided
- **Field Mapping**: Maps Excel columns to database fields
- **Validation**: Comprehensive validation for file type, size, and data integrity
- **Error Handling**: Detailed error reporting for failed imports
- **Template Download**: Download CSV template for proper data formatting

## API Endpoints

### 1. Get Upload Template

**GET** `/api/excel-upload/template`

Returns the expected Excel structure and sample data.

**Headers:**

```
Authorization: Bearer <admin-token>
```

**Response:**

```json
{
  "success": true,
  "data": {
    "headers": [
      "Trip #",
      "Actual Arrival Time / Departure Pick Up Time",
      "Arr Time / Dep PU",
      "Flight #",
      "I or M / F",
      "Student Number",
      "Student Given Name",
      "Student Family Name",
      "Host Given Name",
      "Host Family Name",
      "Phone H=Home C=Cell B=Business",
      "Address",
      "City",
      "Special Instructions",
      "Study Permit Y or N",
      "School",
      "Staff Member Assigned",
      "Client"
    ],
    "sampleData": [
      {
        "Trip #": "1",
        "Actual Arrival Time / Departure Pick Up Time": "2:00 AM / 6:00 AM",
        "Arr Time / Dep PU": "2:00 AM / 6:00 AM",
        "Flight #": "AS 6047",
        "I or M / F": "F",
        "Student Number": "VE158887",
        "Student Given Name": "Mariana",
        "Student Family Name": "Palmieri Panazzolo",
        "Host Given Name": "Angelica",
        "Host Family Name": "Lim",
        "Phone H=Home C=Cell B=Business": "7782510236",
        "Address": "6962 Fleming St",
        "City": "Vancouver",
        "Special Instructions": "Departs @ 6:00 AM",
        "Study Permit Y or N": "Y",
        "School": "ILSC",
        "Staff Member Assigned": "Jaskirat 1st Job",
        "Client": "ILSC"
      }
    ]
  }
}
```

### 2. Upload Excel File

**POST** `/api/excel-upload/students`

Upload and process Excel file containing student data.

**Headers:**

```
Authorization: Bearer <admin-token>
Content-Type: multipart/form-data
```

**Form Data:**

- `excelFile`: Excel file (.xlsx, .xls)
- `date`: Date in MM/DD/YYYY format
- `school`: School name
- `client`: Client name

**Response:**

```json
{
  "success": true,
  "data": {
    "totalProcessed": 18,
    "created": 16,
    "errors": 2,
    "createdStudents": [
      {
        "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
        "studentNo": "20250724-001",
        "studentGivenName": "Mariana",
        "studentFamilyName": "Palmieri Panazzolo",
        "row": 2
      }
    ],
    "errors": [
      {
        "row": 5,
        "message": "Student number VE158887 already exists for this date"
      }
    ]
  },
  "message": "Successfully processed 18 students. Created: 16, Errors: 2"
}
```

## Excel File Structure

### Required Headers

The Excel file must contain the following headers in the first row:

1. **Trip #** - Trip identifier
2. **Actual Arrival Time / Departure Pick Up Time** - Combined arrival and departure times
3. **Arr Time / Dep PU** - Alternative arrival/departure time format
4. **Flight #** - Flight information
5. **I or M / F** - Gender indicator (I/M or F)
6. **Student Number** - Student identifier (optional, will be auto-generated if empty)
7. **Student Given Name** - Student's first name
8. **Student Family Name** - Student's last name
9. **Host Given Name** - Host's first name
10. **Host Family Name** - Host's last name
11. **Phone H=Home C=Cell B=Business** - Contact information
12. **Address** - Student's address
13. **City** - City name
14. **Special Instructions** - Additional instructions
15. **Study Permit Y or N** - Study permit status
16. **School** - School name
17. **Staff Member Assigned** - Assigned staff member
18. **Client** - Client identifier

### Data Format Examples

| Trip # | Actual Arrival Time / Departure Pick Up Time | Flight # | I or M / F | Student Number | Student Given Name | Student Family Name |
| ------ | -------------------------------------------- | -------- | ---------- | -------------- | ------------------ | ------------------- |
| 1      | 2:00 AM / 6:00 AM                            | AS 6047  | F          | VE158887       | Mariana            | Palmieri Panazzolo  |
| 2      | 4:15 AM / 8:15 AM                            | AM 695   | F          | 704047         | Judith             | Marcondes Armando   |

## Field Mapping

The system maps Excel columns to database fields as follows:

| Excel Column                                 | Database Field                         | Type   | Required | Notes                   |
| -------------------------------------------- | -------------------------------------- | ------ | -------- | ----------------------- |
| Trip #                                       | trip                                   | String | Yes      | Trip identifier         |
| Actual Arrival Time / Departure Pick Up Time | actualArrivalTime, departurePickupTime | String | Yes      | Split into two fields   |
| Arr Time / Dep PU                            | arrivalTime, departurePickupTime       | String | Yes      | Split into two fields   |
| Flight #                                     | flight                                 | String | Yes      | Flight information      |
| I or M / F                                   | mOrF                                   | String | Yes      | Extracts M or F         |
| Student Number                               | studentNo                              | String | No       | Auto-generated if empty |
| Student Given Name                           | studentGivenName                       | String | Yes      | Student's first name    |
| Student Family Name                          | studentFamilyName                      | String | Yes      | Student's last name     |
| Host Given Name                              | hostGivenName                          | String | Yes      | Host's first name       |
| Host Family Name                             | hostFamilyName                         | String | Yes      | Host's last name        |
| Phone H=Home C=Cell B=Business               | phone                                  | String | Yes      | Contact information     |
| Address                                      | address                                | String | Yes      | Student's address       |
| City                                         | city                                   | String | Yes      | City name               |
| Special Instructions                         | specialInstructions                    | String | No       | Additional instructions |
| Study Permit Y or N                          | studyPermit                            | String | No       | Y or N                  |
| School                                       | school                                 | String | Yes      | School name             |
| Staff Member Assigned                        | staffMemberAssigned                    | String | No       | Assigned staff          |
| Client                                       | client                                 | String | Yes      | Client identifier       |

## Auto-Generated Student Numbers

If the Student Number field is empty in the Excel file, the system will automatically generate a unique student number with the format:

```
YYYYMMDD-XXX
```

Where:

- `YYYYMMDD` is the date in YYYYMMDD format
- `XXX` is a sequential number starting from 001

Example: `20250724-001`, `20250724-002`, etc.

## Validation Rules

### File Validation

- **File Type**: Only .xlsx and .xls files are accepted
- **File Size**: Maximum 10MB
- **Structure**: Must contain header row and at least one data row

### Data Validation

- **Required Fields**: date, trip, actualArrivalTime, arrivalTime, flight, dOrI, mOrF, studentGivenName, studentFamilyName, hostGivenName, hostFamilyName, phone, address, city, school, client
- **Enum Values**:
  - dOrI: "D" or "I"
  - mOrF: "M" or "F"
  - studyPermit: "Y" or "N"
- **Duplicate Check**: Student numbers must be unique per date
- **Date Format**: MM/DD/YYYY

## Error Handling

The system provides detailed error reporting:

### Common Errors

1. **File Type Error**: "Only Excel files (.xlsx, .xls) are allowed"
2. **File Size Error**: "File size too large. Maximum size is 10MB."
3. **Missing Required Fields**: "Date, school, and client are required"
4. **No Data Found**: "No valid student data found in Excel file"
5. **Duplicate Student**: "Student number already exists for this date"
6. **Invalid Data**: "Invalid value for field"

### Error Response Format

```json
{
  "success": false,
  "message": "Error description",
  "data": {
    "errors": [
      {
        "row": 5,
        "message": "Student number VE158887 already exists for this date"
      }
    ]
  }
}
```

## Frontend Integration

### Upload Component Features

- **File Selection**: Drag and drop or browse for Excel files
- **Form Validation**: Real-time validation of required fields
- **Progress Tracking**: Upload progress indicator
- **Result Display**: Detailed success and error reporting
- **Template Download**: Download CSV template for proper formatting

### Usage Instructions

1. Navigate to `/admin/students/upload`
2. Download the template using the "Download Template" button
3. Fill in the template with student data
4. Select date, school, and client from the form
5. Choose the Excel file
6. Click "Upload Students"
7. Review the results

## Testing

### Manual Testing

1. Start the backend server: `npm run dev`
2. Login as admin and get the authentication token
3. Create an Excel file with sample data
4. Test the upload functionality through the frontend
5. Verify the imported data in the database

### Automated Testing

Run the test file: `node test-excel-upload.js`

## Security Considerations

1. **Authentication**: All endpoints require admin authentication
2. **File Validation**: Strict file type and size validation
3. **Input Sanitization**: All input data is sanitized and validated
4. **Error Handling**: No sensitive information is exposed in error messages
5. **Rate Limiting**: Upload endpoints are rate-limited to prevent abuse

## Performance Considerations

1. **Batch Processing**: Students are processed in batches for better performance
2. **Memory Management**: Large files are processed in chunks
3. **Database Optimization**: Bulk insert operations for better performance
4. **Error Recovery**: Partial success handling - valid records are saved even if some fail

## Troubleshooting

### Common Issues

1. **File Not Uploading**

   - Check file type (.xlsx or .xls)
   - Verify file size (max 10MB)
   - Ensure proper authentication

2. **Data Not Importing**

   - Verify Excel structure matches template
   - Check required fields are filled
   - Review error messages in response

3. **Auto-Generated Numbers Not Working**

   - Ensure Student Number column is empty for auto-generation
   - Check date format is MM/DD/YYYY
   - Verify no duplicate student numbers exist

4. **Validation Errors**
   - Check enum values (D/I, M/F, Y/N)
   - Verify required fields are present
   - Ensure proper data types

### Debug Mode

Enable debug logging by setting `NODE_ENV=development` in the environment variables.

## Future Enhancements

1. **Excel Template Generation**: Generate actual Excel files instead of CSV
2. **Bulk Update**: Support for updating existing students
3. **Data Preview**: Show preview of data before import
4. **Scheduled Imports**: Support for scheduled file processing
5. **Advanced Validation**: Custom validation rules per school/client
6. **Import History**: Track and manage import history
7. **Rollback Feature**: Ability to undo imports
