const mongoose = require("mongoose");
const Student = require("./models/Student");
const { uploadExcelFile } = require("./controllers/excelUploadController");

// Mock request and response objects for testing
const mockReq = {
  file: {
    buffer: Buffer.from("mock excel data"), // This would be actual Excel file buffer
  },
  body: {
    date: "2024-01-15",
  },
  user: {
    _id: new mongoose.Types.ObjectId(),
  },
};

const mockRes = {
  status: (code) => ({
    json: (data) => {
      console.log(`Status ${code}:`, JSON.stringify(data, null, 2));
      return mockRes;
    },
  }),
};

async function testExcelOrder() {
  try {
    console.log("Testing Excel Order Functionality...\n");

    // Test 1: Check if Student model has excelOrder field
    console.log("1. Checking Student model schema...");
    const studentSchema = Student.schema.obj;
    if (studentSchema.excelOrder) {
      console.log("✅ excelOrder field found in Student model");
      console.log("   Type:", studentSchema.excelOrder.type);
      console.log("   Required:", studentSchema.excelOrder.required);
      console.log("   Min:", studentSchema.excelOrder.min);
    } else {
      console.log("❌ excelOrder field not found in Student model");
    }

    // Test 2: Check if excelOrder index exists
    console.log("\n2. Checking database indexes...");
    const indexes = await Student.collection.indexes();
    const excelOrderIndex = indexes.find(
      (index) => index.key && index.key.excelOrder === 1
    );

    if (excelOrderIndex) {
      console.log("✅ excelOrder index found:", excelOrderIndex);
    } else {
      console.log("❌ excelOrder index not found");
    }

    // Test 3: Check existing students for excelOrder field
    console.log("\n3. Checking existing students...");
    const existingStudents = await Student.find({}).limit(5);
    if (existingStudents.length > 0) {
      console.log(`Found ${existingStudents.length} existing students`);
      existingStudents.forEach((student, index) => {
        console.log(`   Student ${index + 1}:`, {
          name: `${student.studentGivenName} ${student.studentFamilyName}`,
          excelOrder: student.excelOrder || "NOT SET",
          date: student.date,
        });
      });
    } else {
      console.log("No existing students found");
    }

    console.log("\n✅ Excel Order functionality test completed!");
  } catch (error) {
    console.error("❌ Test failed:", error.message);
  }
}

// Run the test if this file is executed directly
if (require.main === module) {
  // Connect to database first
  const db = require("./config/db");
  db.connect()
    .then(() => {
      console.log("Connected to database");
      return testExcelOrder();
    })
    .then(() => {
      console.log("Test completed");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Test failed:", error);
      process.exit(1);
    });
}

module.exports = { testExcelOrder };
