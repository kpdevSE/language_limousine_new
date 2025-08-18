const XLSX = require("xlsx");
const Student = require("../models/Student");
const {
  generateStudentNumberFromExcel,
} = require("../utils/studentNumberGenerator");

/**
 * Parse Excel file and extract student data
 */
const parseExcelFile = (filePath) => {
  try {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // Convert to JSON with header row
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    if (jsonData.length < 2) {
      throw new Error(
        "Excel file must contain at least a header row and one data row"
      );
    }

    const headers = jsonData[0];
    const dataRows = jsonData.slice(1);

    console.log("Found headers in Excel file:", headers);
    console.log("Number of data rows:", dataRows.length);

    // Clean up headers - remove null/undefined values and trim whitespace
    const cleanHeaders = headers.map((header) => {
      if (header === null || header === undefined) return "";
      return String(header).trim();
    });

    console.log("Clean headers:", cleanHeaders);

    // Check if we have valid headers
    const validHeaders = cleanHeaders.filter(
      (header) => header && header.length > 0
    );
    console.log("Valid headers count:", validHeaders.length);

    if (validHeaders.length === 0) {
      throw new Error(
        "No valid headers found in Excel file. Please ensure the first row contains column headers."
      );
    }

    // Map Excel columns to our schema fields
    const columnMapping = {
      "Trip #": "trip",
      "Actual Arrival Time / Departure Pick Up Time": "actualArrivalTime",
      "Actu Arriva Time": "actualArrivalTime", // Handle truncated header
      "Arr Time / Dep PU": "arrivalTime",
      "Arr Time Dep PU": "arrivalTime", // Handle truncated header
      "Flight #": "flight",
      "I or M / F": "mOrF",
      "Student Number": "studentNo",
      "Student Given Name": "studentGivenName",
      "Student Family Name": "studentFamilyName",
      "Student Fam Name": "studentFamilyName", // Handle truncated header
      "Host Given Name": "hostGivenName",
      "Host Give Name": "hostGivenName", // Handle truncated header
      "Host Family Name": "hostFamilyName",
      "Host Fami Name": "hostFamilyName", // Handle truncated header
      "Phone H=Home C=Cell B=Business": "phone",
      Address: "address",
      City: "city",
      "Special Instructions": "specialInstructions",
      "Study Permit Y or N": "studyPermit",
      School: "school",
      "Staff Member Assigned": "staffMemberAssigned",
      Client: "client",
    };

    const students = [];

    dataRows.forEach((row, index) => {
      if (row.length === 0 || row.every((cell) => !cell)) {
        return; // Skip empty rows
      }

      const studentData = {
        date: "", // Will be set from form data
        trip: "",
        actualArrivalTime: "",
        arrivalTime: "",
        departurePickupTime: "",
        flight: "",
        dOrI: "I", // Default to International
        mOrF: "",
        studentNo: "",
        studentGivenName: "",
        studentFamilyName: "",
        hostGivenName: "",
        hostFamilyName: "",
        phone: "",
        address: "",
        city: "",
        specialInstructions: "",
        studyPermit: "",
        school: "",
        staffMemberAssigned: "",
        client: "",
      };

      // Map Excel data to student fields
      cleanHeaders.forEach((header, colIndex) => {
        const mappedField = columnMapping[header];
        if (
          mappedField &&
          row[colIndex] !== undefined &&
          row[colIndex] !== null
        ) {
          const value = String(row[colIndex]).trim();

          // Handle special cases
          if (mappedField === "mOrF") {
            // Extract gender from combined field (I/M or F)
            if (value.includes("F")) {
              studentData.mOrF = "F";
            } else if (value.includes("M")) {
              studentData.mOrF = "M";
            }
          } else if (mappedField === "actualArrivalTime") {
            // Handle combined arrival/departure time
            const timeParts = value.split("/");
            if (timeParts.length >= 2) {
              studentData.actualArrivalTime = timeParts[0].trim();
              studentData.departurePickupTime = timeParts[1].trim();
            } else {
              studentData.actualArrivalTime = value;
            }
          } else if (mappedField === "arrivalTime") {
            // Handle combined arrival/departure time
            const timeParts = value.split("/");
            if (timeParts.length >= 2) {
              studentData.arrivalTime = timeParts[0].trim();
              studentData.departurePickupTime = timeParts[1].trim();
            } else {
              studentData.arrivalTime = value;
            }
          } else {
            studentData[mappedField] = value;
          }
        }
      });

      // Only add if we have essential data
      if (studentData.studentGivenName || studentData.studentFamilyName) {
        students.push({
          ...studentData,
          rowNumber: index + 2, // +2 because we start from row 2 (after header)
        });
      }
    });

    return students;
  } catch (error) {
    console.error("Error parsing Excel file:", error);
    throw new Error(`Failed to parse Excel file: ${error.message}`);
  }
};

/**
 * Upload Excel file and process student data
 */
const uploadExcelFile = async (req, res) => {
  try {
    console.log("Excel upload request received");
    console.log("Request body:", req.body);
    console.log("Request file:", req.file);
    console.log("Request headers:", req.headers);

    if (!req.file) {
      console.log("No file uploaded");
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const { date } = req.body;
    console.log("Form data - date:", date);

    if (!date) {
      console.log("Missing required fields - date:", !!date);
      return res.status(400).json({
        success: false,
        message: "Date is required",
      });
    }

    // Parse Excel file
    const studentsData = parseExcelFile(req.file.path);

    if (studentsData.length === 0) {
      // Get headers from the parsed file for error reporting
      let foundHeaders = [];
      try {
        const workbook = XLSX.readFile(req.file.path);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        const rawHeaders = jsonData[0] || [];
        foundHeaders = rawHeaders.map((header) => {
          if (header === null || header === undefined) return "";
          return String(header).trim();
        });
      } catch (error) {
        console.error("Error reading headers for error report:", error);
      }

      return res.status(400).json({
        success: false,
        message: "No valid student data found in Excel file",
        details:
          "Please ensure your Excel file has the correct headers and at least one data row with Student Given Name or Student Family Name",
        foundHeaders: foundHeaders,
        expectedHeaders: [
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
          "Client",
        ],
      });
    }

    const createdStudents = [];
    const errors = [];
    const createdBy = req.user._id;

    // Process each student
    for (const studentData of studentsData) {
      try {
        // Set common fields
        studentData.date = date;
        // Keep per-row school and client from Excel (allow mixed values)
        if (!studentData.school) {
          errors.push({
            row: studentData.rowNumber,
            message: "Missing School value in Excel row.",
          });
          continue;
        }
        if (!studentData.client) {
          errors.push({
            row: studentData.rowNumber,
            message: "Missing Client value in Excel row.",
          });
          continue;
        }
        studentData.createdBy = createdBy;

        // Generate student number if not provided
        if (!studentData.studentNo) {
          studentData.studentNo = await generateStudentNumberFromExcel(
            studentData,
            date
          );
        }

        // Normalize studyPermit to valid enum or remove if invalid/empty
        if (typeof studentData.studyPermit === "string") {
          const sp = studentData.studyPermit.trim().toUpperCase();
          if (sp === "Y" || sp === "N") {
            studentData.studyPermit = sp;
          } else {
            delete studentData.studyPermit;
          }
        }

        // Set default values for required fields
        if (!studentData.dOrI) studentData.dOrI = "I";
        if (!studentData.mOrF) studentData.mOrF = "M";
        if (!studentData.actualArrivalTime)
          studentData.actualArrivalTime = "00:00";
        if (!studentData.arrivalTime) studentData.arrivalTime = "00:00";
        if (!studentData.trip) studentData.trip = "1";

        // Check for duplicate student number (only when present)
        const existingStudent = studentData.studentNo
          ? await Student.findOne({
              studentNo: studentData.studentNo,
              date: studentData.date,
              isActive: true,
            })
          : null;

        if (existingStudent) {
          errors.push({
            row: studentData.rowNumber,
            message: `Student number ${studentData.studentNo} already exists for this date`,
          });
          continue;
        }

        // Create student
        const student = await Student.create(studentData);
        createdStudents.push({
          _id: student._id,
          studentNo: student.studentNo,
          studentGivenName: student.studentGivenName,
          studentFamilyName: student.studentFamilyName,
          row: studentData.rowNumber,
        });
      } catch (error) {
        console.error(
          `Error processing student at row ${studentData.rowNumber}:`,
          error
        );
        errors.push({
          row: studentData.rowNumber,
          message: error.message || "Failed to create student",
        });
      }
    }

    return res.status(200).json({
      success: true,
      data: {
        totalProcessed: studentsData.length,
        created: createdStudents.length,
        errorsCount: errors.length,
        createdStudents,
        errors,
      },
      message: `Successfully processed ${studentsData.length} students. Created: ${createdStudents.length}, Errors: ${errors.length}`,
    });
  } catch (error) {
    console.error("Excel upload error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
};

/**
 * Get upload template structure
 */
const getUploadTemplate = (req, res) => {
  try {
    const template = {
      headers: [
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
        "Client",
      ],
      sampleData: [
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
          Address: "6962 Fleming St",
          City: "Vancouver",
          "Special Instructions": "Departs @ 6:00 AM",
          "Study Permit Y or N": "Y",
          School: "ILSC",
          "Staff Member Assigned": "Jaskirat 1st Job",
          Client: "ILSC",
        },
      ],
    };

    return res.status(200).json({
      success: true,
      data: template,
    });
  } catch (error) {
    console.error("Get template error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  uploadExcelFile,
  getUploadTemplate,
};
