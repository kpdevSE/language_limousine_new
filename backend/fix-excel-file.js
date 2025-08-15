const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");

// Function to fix Excel file headers
function fixExcelFile(inputFilePath, outputFilePath) {
  try {
    console.log("🔧 Fixing Excel file headers...\n");

    // Read the original file
    const workbook = XLSX.readFile(inputFilePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // Convert to JSON to see the data
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    console.log("📊 Original data structure:");
    console.log("Number of rows:", jsonData.length);
    console.log("First row (headers):", jsonData[0]);
    console.log("Second row (sample data):", jsonData[1]);

    // Define the correct headers
    const correctHeaders = [
      "Trip #",
      "Actu Arriva Time",
      "Arr Time Dep PU",
      "Flight #",
      "I or M / F",
      "Student Number",
      "Student Given Name",
      "Student Fam Name",
      "Host Give Name",
      "Host Fami Name",
      "Phone H=Home C=Cell B=Business",
      "Address",
      "City",
      "Special Instructions",
      "Study Permit Y or N",
      "School",
      "Staff Member Assigned",
      "Client",
    ];

    // Create new data with correct headers
    const fixedData = [correctHeaders];

    // Add data rows (skip the first row if it was headers)
    for (let i = 1; i < jsonData.length; i++) {
      const row = jsonData[i];
      if (row && row.length > 0 && !row.every((cell) => !cell)) {
        // Ensure the row has the right number of columns
        const fixedRow = [];
        for (let j = 0; j < correctHeaders.length; j++) {
          fixedRow[j] = row[j] || "";
        }
        fixedData.push(fixedRow);
      }
    }

    console.log("\n📋 Fixed data structure:");
    console.log("Number of rows:", fixedData.length);
    console.log("Headers:", fixedData[0]);
    console.log("Sample data row:", fixedData[1]);

    // Create new workbook
    const newWorkbook = XLSX.utils.book_new();
    const newWorksheet = XLSX.utils.aoa_to_sheet(fixedData);
    XLSX.utils.book_append_sheet(newWorkbook, newWorksheet, "Students");

    // Write the fixed file
    XLSX.writeFile(newWorkbook, outputFilePath);

    console.log("\n✅ Excel file fixed successfully!");
    console.log(`📁 Fixed file saved as: ${outputFilePath}`);
    console.log("\n📝 What was fixed:");
    console.log("- Added proper headers in the first row");
    console.log("- Ensured all columns are present");
    console.log("- Removed empty rows");
    console.log("- Fixed data alignment");

    return outputFilePath;
  } catch (error) {
    console.error("❌ Error fixing Excel file:", error);
    throw error;
  }
}

// Function to create a sample Excel file for testing
function createSampleExcelFile() {
  const headers = [
    "Trip #",
    "Actu Arriva Time",
    "Arr Time Dep PU",
    "Flight #",
    "I or M / F",
    "Student Number",
    "Student Given Name",
    "Student Fam Name",
    "Host Give Name",
    "Host Fami Name",
    "Phone H=Home C=Cell B=Business",
    "Address",
    "City",
    "Special Instructions",
    "Study Permit Y or N",
    "School",
    "Staff Member Assigned",
    "Client",
  ];

  const sampleData = [
    [
      "1",
      "2:00 AM / 6:00 AM",
      "2:00 AM / 6:00 AM",
      "AS 6047",
      "F",
      "VE158887",
      "Mariana",
      "Palmieri Panazzolo",
      "Angelica",
      "Lim",
      "7782510236",
      "6962 Fleming St",
      "Vancouver",
      "Departs @ 6:00 AM",
      "Y",
      "ILSC",
      "Jaskirat 1st Job",
      "ILSC",
    ],
    [
      "2",
      "4:15 AM / 8:15 AM",
      "4:15 AM / 8:15 AM",
      "AM 695",
      "M",
      "704047",
      "Judith",
      "Armando",
      "Milagros",
      "Jahqys",
      "604-524-8990",
      "2525 West Mall",
      "Vancouver",
      "Departure at 8:15 AM",
      "N",
      "ILSC",
      "Muh 1st Job",
      "ILSC",
    ],
  ];

  const allData = [headers, ...sampleData];

  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.aoa_to_sheet(allData);
  XLSX.utils.book_append_sheet(workbook, worksheet, "Students");

  const filePath = path.join(__dirname, "sample_students.xlsx");
  XLSX.writeFile(workbook, filePath);

  console.log("✅ Sample Excel file created!");
  console.log(`📁 File: ${filePath}`);

  return filePath;
}

// Main execution
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log("📋 Excel File Fixer Tool\n");
    console.log("Usage:");
    console.log("  node fix-excel-file.js <input-file> [output-file]");
    console.log("  node fix-excel-file.js --sample");
    console.log("\nExamples:");
    console.log("  node fix-excel-file.js myfile.xlsx");
    console.log("  node fix-excel-file.js myfile.xlsx fixed-file.xlsx");
    console.log("  node fix-excel-file.js --sample");

    // Create a sample file by default
    console.log("\n🎯 Creating a sample Excel file for testing...");
    createSampleExcelFile();
  } else if (args[0] === "--sample") {
    createSampleExcelFile();
  } else {
    const inputFile = args[0];
    const outputFile = args[1] || inputFile.replace(".xlsx", "_fixed.xlsx");

    if (!fs.existsSync(inputFile)) {
      console.error(`❌ Input file not found: ${inputFile}`);
      process.exit(1);
    }

    fixExcelFile(inputFile, outputFile);
  }
}

module.exports = { fixExcelFile, createSampleExcelFile };
