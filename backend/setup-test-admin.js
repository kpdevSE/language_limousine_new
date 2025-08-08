const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const Student = require("./models/Student");
require("dotenv").config();

const connectDB = require("./config/db");

async function setupTestData() {
  try {
    console.log("🔧 Setting up test data...\n");

    // Connect to database
    await connectDB();

    // Create test admin user
    console.log("1. Creating test admin user...");
    const adminPassword = await bcrypt.hash("admin123", 12);

    const adminUser = await User.findOneAndUpdate(
      { email: "admin@test.com" },
      {
        username: "TestAdmin",
        email: "admin@test.com",
        password: adminPassword,
        role: "Admin",
        isActive: true,
        firstName: "Test",
        lastName: "Admin",
        gender: "Male",
      },
      { upsert: true, new: true }
    );
    console.log("✅ Test admin user created/updated\n");

    // Create test driver
    console.log("2. Creating test driver...");
    const driverPassword = await bcrypt.hash("driver123", 12);

    const driverUser = await User.findOneAndUpdate(
      { email: "driver@test.com" },
      {
        username: "TestDriver",
        email: "driver@test.com",
        password: driverPassword,
        role: "Driver",
        isActive: true,
        firstName: "Test",
        lastName: "Driver",
        gender: "Male",
        driverID: "DR001",
        vehicleNumber: "ABC123",
      },
      { upsert: true, new: true }
    );
    console.log("✅ Test driver created/updated\n");

    // Create test subdriver
    console.log("3. Creating test subdriver...");
    const subdriverPassword = await bcrypt.hash("subdriver123", 12);

    const subdriverUser = await User.findOneAndUpdate(
      { email: "subdriver@test.com" },
      {
        username: "TestSubDriver",
        email: "subdriver@test.com",
        password: subdriverPassword,
        role: "Subdriver",
        isActive: true,
        firstName: "Test",
        lastName: "SubDriver",
        gender: "Male",
        subdriverID: "SD001",
        vehicleNumber: "XYZ789",
      },
      { upsert: true, new: true }
    );
    console.log("✅ Test subdriver created/updated\n");

    // Create test students
    console.log("4. Creating test students...");
    const testStudents = [
      {
        studentNo: "ST001",
        studentGivenName: "John",
        studentFamilyName: "Doe",
        arrivalTime: "10:00",
        flight: "AA123",
        dOrI: "I",
        hostGivenName: "Jane",
        hostFamilyName: "Smith",
        phone: "+1234567890",
        isActive: true,
      },
      {
        studentNo: "ST002",
        studentGivenName: "Alice",
        studentFamilyName: "Johnson",
        arrivalTime: "11:30",
        flight: "BA456",
        dOrI: "D",
        hostGivenName: "Bob",
        hostFamilyName: "Wilson",
        phone: "+1234567891",
        isActive: true,
      },
      {
        studentNo: "ST003",
        studentGivenName: "Charlie",
        studentFamilyName: "Brown",
        arrivalTime: "14:15",
        flight: "UA789",
        dOrI: "I",
        hostGivenName: "Diana",
        hostFamilyName: "Davis",
        phone: "+1234567892",
        isActive: true,
      },
    ];

    for (const studentData of testStudents) {
      await Student.findOneAndUpdate(
        { studentNo: studentData.studentNo },
        studentData,
        { upsert: true, new: true }
      );
    }
    console.log("✅ Test students created/updated\n");

    console.log("🎉 Test data setup completed successfully!");
    console.log("\n📋 Test Credentials:");
    console.log("Admin: admin@test.com / admin123");
    console.log("Driver: driver@test.com / driver123");
    console.log("Subdriver: subdriver@test.com / subdriver123");

    process.exit(0);
  } catch (error) {
    console.error("❌ Setup failed:", error);
    process.exit(1);
  }
}

setupTestData();
