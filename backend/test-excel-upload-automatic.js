const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");

// Test the automatic school and client extraction
function testExcelParsing() {
  console.log(
    "🧪 Testing Excel parsing with automatic school/client extraction...\n"
  );

  // Create a test Excel file
  const testData = [
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
    {
      "Trip #": "2",
      "Actual Arrival Time / Departure Pick Up Time": "3:00 AM / 7:00 AM",
      "Arr Time / Dep PU": "3:00 AM / 7:00 AM",
      "Flight #": "AS 6048",
      "I or M / F": "M",
      "Student Number": "VE158888",
      "Student Given Name": "John",
      "Student Family Name": "Doe",
      "Host Given Name": "Jane",
      "Host Family Name": "Smith",
      "Phone H=Home C=Cell B=Business": "7782510237",
      Address: "6963 Fleming St",
      City: "Vancouver",
      "Special Instructions": "Departs @ 7:00 AM",
      "Study Permit Y or N": "Y",
      School: "ILSC",
      "Staff Member Assigned": "Jaskirat 1st Job",
      Client: "ILSC",
    },
  ];

  // Create workbook and worksheet
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(testData);

  // Add the worksheet to the workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, "Students");

  // Create test file
  const testFilePath = path.join(__dirname, "test_automatic_extraction.xlsx");
  XLSX.writeFile(workbook, testFilePath);

  console.log("✅ Test Excel file created:", testFilePath);
  console.log("📋 Test data includes:");
  console.log("   - School: ILSC (should be automatically extracted)");
  console.log("   - Client: ILSC (should be automatically extracted)");
  console.log("   - 2 students with same school and client\n");

  // Test parsing the file
  try {
    const parsedData = parseExcelFile(testFilePath);
    console.log("🔍 Parsed data:");
    console.log(`   - Total students: ${parsedData.length}`);

    if (parsedData.length > 0) {
      const firstStudent = parsedData[0];
      console.log(`   - First student school: ${firstStudent.school}`);
      console.log(`   - First student client: ${firstStudent.client}`);

      // Check if all students have same school and client
      const allSameSchool = parsedData.every((s) => s.school === "ILSC");
      const allSameClient = parsedData.every((s) => s.client === "ILSC");

      console.log(`   - All same school: ${allSameSchool}`);
      console.log(`   - All same client: ${allSameClient}`);

      if (allSameSchool && allSameClient) {
        console.log(
          "\n✅ SUCCESS: School and Client are correctly extracted from Excel!"
        );
        console.log("   - No manual input required");
        console.log("   - All students have consistent school and client");
      } else {
        console.log("\n❌ ERROR: School or Client extraction failed!");
      }
    }

    // Clean up test file
    fs.unlinkSync(testFilePath);
    console.log("\n🧹 Test file cleaned up");
  } catch (error) {
    console.error("❌ Error testing Excel parsing:", error.message);
  }
}

// Simulate the parseExcelFile function from the controller
function parseExcelFile(filePath) {
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

    // Clean up headers
    const cleanHeaders = headers.map((header) => {
      if (header === null || header === undefined) return "";
      return String(header).trim();
    });

    // Map Excel columns to our schema fields
    const columnMapping = {
      "Trip #": "trip",
      "Actual Arrival Time / Departure Pick Up Time": "actualArrivalTime",
      "Arr Time / Dep PU": "arrivalTime",
      "Flight #": "flight",
      "I or M / F": "mOrF",
      "Student Number": "studentNo",
      "Student Given Name": "studentGivenName",
      "Student Family Name": "studentFamilyName",
      "Host Given Name": "hostGivenName",
      "Host Family Name": "hostFamilyName",
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
        date: "",
        trip: "",
        actualArrivalTime: "",
        arrivalTime: "",
        departurePickupTime: "",
        flight: "",
        dOrI: "I",
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
          studentData[mappedField] = value;
        }
      });

      // Only add if we have essential data
      if (studentData.studentGivenName || studentData.studentFamilyName) {
        students.push({
          ...studentData,
          rowNumber: index + 2,
        });
      }
    });

    return students;
  } catch (error) {
    console.error("Error parsing Excel file:", error);
    throw new Error(`Failed to parse Excel file: ${error.message}`);
  }
}

// Run the test
if (require.main === module) {
  testExcelParsing();
}

module.exports = { parseExcelFile };
