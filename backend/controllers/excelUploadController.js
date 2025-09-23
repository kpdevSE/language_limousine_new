const XLSX = require("xlsx");
const Student = require("../models/Student");
const {
  generateStudentNumberFromExcel,
} = require("../utils/studentNumberGenerator");

/**
 * Parse Excel file and extract student data
 */
const parseExcelFile = (buffer) => {
  try {
    const workbook = XLSX.read(buffer, { type: "buffer" });
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
      // Common variant seen in sheets
      "Actual Arrival Time": "actualArrivalTime",
      "Arr Time / Dep PU": "arrivalTime",
      // Short variants
      "Arr Time": "arrivalTime",
      "Flight #": "flight",
      // This column is gender (Male/Female); map correctly
      "I or M / F": "mOrF",
      "I/ D": "dOrI",
      "I/D": "dOrI",
      "Student Number": "studentNo",
      "Student Given Name": "studentGivenName",
      "Student Giver": "studentGivenName", // truncated header in some files
      "Student Family Name": "studentFamilyName",
      "Student Fam Name": "studentFamilyName", // Handle truncated header
      "Student Fam": "studentFamilyName",
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
      "Staff Member As": "staffMemberAssigned",
      Client: "client",
    };

    const students = [];
    let excelOrderCounter = 1; // Start from 1 for sequential numbering

    // Helper: convert Excel numeric time (fraction of a day) to HH:MM
    const toTimeString = (input) => {
      if (input === null || input === undefined) return "";
      if (typeof input === "string") {
        const s = input.trim();
        if (s.length === 0) return "";
        // If it already looks like a time (has ":"), accept as-is
        if (s.includes(":")) return s;
        // Try parse numeric string
        const num = parseFloat(s);
        if (!isNaN(num)) input = num;
        else return s;
      }
      if (typeof input === "number" && isFinite(input)) {
        // Excel time is a fraction of a 24-hour day
        let totalMinutes = Math.round(input * 24 * 60);
        totalMinutes = ((totalMinutes % (24 * 60)) + 24 * 60) % (24 * 60);
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        const pad = (n) => (n < 10 ? `0${n}` : `${n}`);
        return `${pad(hours)}:${pad(minutes)}`;
      }
      return String(input).trim();
    };

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
          const rawValue = row[colIndex];
          const value =
            typeof rawValue === "number" ? rawValue : String(rawValue).trim();

          // Handle special cases
          if (mappedField === "mOrF") {
            // Extract gender from combined field (I/M or F)
            const v = String(value).toUpperCase();
            if (v.includes("F")) {
              studentData.mOrF = "F";
            } else if (v.includes("M")) {
              studentData.mOrF = "M";
            }
          } else if (mappedField === "dOrI") {
            // Normalize Domestic/International codes
            const v = String(value).toUpperCase();
            if (v === "D" || v === "I") {
              studentData.dOrI = v;
            } else if (v.includes("D")) {
              studentData.dOrI = "D";
            } else if (v.includes("I")) {
              studentData.dOrI = "I";
            }
          } else if (mappedField === "actualArrivalTime") {
            // Handle combined arrival/departure time
            const timeParts = String(value).split("/");
            if (timeParts.length >= 2) {
              studentData.actualArrivalTime = toTimeString(timeParts[0]);
              studentData.departurePickupTime = toTimeString(timeParts[1]);
            } else {
              studentData.actualArrivalTime = toTimeString(value);
            }
          } else if (mappedField === "arrivalTime") {
            // Handle combined arrival/departure time
            const timeParts = String(value).split("/");
            if (timeParts.length >= 2) {
              studentData.arrivalTime = toTimeString(timeParts[0]);
              studentData.departurePickupTime = toTimeString(timeParts[1]);
            } else {
              studentData.arrivalTime = toTimeString(value);
            }
          } else {
            studentData[mappedField] =
              typeof value === "number" ? String(value) : value;
          }
        }
      });

      // Only add if we have essential data
      if (studentData.studentGivenName || studentData.studentFamilyName) {
        students.push({
          ...studentData,
          excelOrder: excelOrderCounter, // Assign sequential number
          rowNumber: index + 2, // +2 because we start from row 2 (after header)
        });
        excelOrderCounter++; // Increment counter for next student
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

    // Normalize incoming date to YYYY-MM-DD (accepts MM/DD/YYYY)
    const normalizedDate = /^\d{2}\/\d{2}\/\d{4}$/.test(date)
      ? (() => {
          const [m, d, y] = date.split("/");
          return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
        })()
      : date;

    // Read the uploaded file buffer
    const buffer = req.file.buffer;

    // Parse Excel file
    const studentsData = parseExcelFile(buffer);

    if (studentsData.length === 0) {
      // Get headers from the parsed file for error reporting
      let foundHeaders = [];
      try {
        const workbook = XLSX.read(buffer, { type: "buffer" });
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
    const updatedStudents = [];
    const errors = [];
    const createdBy = req.user._id;

    // Process each student
    for (const studentData of studentsData) {
      try {
        // Set common fields
        studentData.date = normalizedDate;
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
            studentData.date
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
        // Normalize dOrI: accept common variants like 't' (treated as 'I')
        if (studentData.dOrI) {
          const dio = String(studentData.dOrI).toUpperCase();
          if (dio !== "D" && dio !== "I") {
            // Heuristics: sometimes 't' appears for International; coerce to I
            if (dio === "T") studentData.dOrI = "I";
            else studentData.dOrI = "I"; // default to International
          } else {
            studentData.dOrI = dio;
          }
        } else {
          studentData.dOrI = "I";
        }
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
          // Update existing record but PRESERVE previous dOrI (do not overwrite)
          const updates = { ...studentData };
          delete updates.dOrI;
          delete updates.studentNo; // never change student number on update
          delete updates.createdBy; // don't change audit fields
          // Keep date fixed
          delete updates.date;

          const updated = await Student.findByIdAndUpdate(
            existingStudent._id,
            { $set: updates },
            { new: true, runValidators: true }
          );

          updatedStudents.push({
            _id: updated._id,
            studentNo: updated.studentNo,
            studentGivenName: updated.studentGivenName,
            studentFamilyName: updated.studentFamilyName,
            row: studentData.rowNumber,
          });
        } else {
          // Create student
          const student = await Student.create(studentData);
          createdStudents.push({
            _id: student._id,
            studentNo: student.studentNo,
            studentGivenName: student.studentGivenName,
            studentFamilyName: student.studentFamilyName,
            row: studentData.rowNumber,
          });
        }
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
        updated: updatedStudents.length,
        errorsCount: errors.length,
        createdStudents,
        updatedStudents,
        errors,
      },
      message: `Successfully processed ${studentsData.length} students. Created: ${createdStudents.length}, Updated: ${updatedStudents.length}, Errors: ${errors.length}`,
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
