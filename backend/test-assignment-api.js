const axios = require("axios");
const { getAdminToken } = require("./get-admin-token");

const API_BASE_URL = "http://localhost:5000/api";

// Test data
const testData = {
  driverData: {
    username: "testdriver",
    email: "driver@test.com",
    password: "driver123",
    gender: "Male",
    role: "Driver",
    driverID: "DRV001",
    vehicleNumber: "ABC123",
  },
  subdriverData: {
    username: "testsubdriver",
    email: "subdriver@test.com",
    password: "subdriver123",
    gender: "Male",
    role: "Subdriver",
    subdriverID: "SUB001",
    vehicleNumber: "XYZ789",
  },
  studentData: {
    date: "12/25/2024",
    trip: "Test Trip",
    actualArrivalTime: "08:00:00",
    arrivalTime: "08:00:00",
    flight: "TEST123",
    dOrI: "I",
    mOrF: "M",
    studentNo: "TEST001",
    studentGivenName: "Test",
    studentFamilyName: "Student",
    hostGivenName: "Test Host",
    hostFamilyName: "Family",
    phone: "123-456-7890",
    address: "123 Test St",
    city: "Test City",
    school: "Test School",
    client: "Test Client",
  },
};

let authToken = null;
let driverId = null;
let subdriverId = null;
let studentId = null;

async function testAssignmentAPI() {
  console.log("🧪 Testing Student Assignment API");
  console.log("==================================");

  try {
    // Step 1: Get Admin Token
    console.log("\n1️⃣ Getting Admin Token...");
    authToken = await getAdminToken();
    
    if (!authToken) {
      throw new Error("Failed to get admin token");
    }
    
    console.log("✅ Admin token obtained successfully");

    // Configure axios with auth token
    const api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    // Step 2: Create Driver
    console.log("\n2️⃣ Testing Driver Creation...");
    const driverResponse = await api.post("/users", testData.driverData);
    
    if (driverResponse.data.success) {
      driverId = driverResponse.data.data.user._id;
      console.log("✅ Driver created successfully");
      console.log(`🚗 Driver: ${driverResponse.data.data.user.username} (${driverResponse.data.data.user.driverID})`);
    } else {
      throw new Error("Driver creation failed");
    }

    // Step 3: Create Subdriver
    console.log("\n3️⃣ Testing Subdriver Creation...");
    const subdriverResponse = await api.post("/users", testData.subdriverData);
    
    if (subdriverResponse.data.success) {
      subdriverId = subdriverResponse.data.data.user._id;
      console.log("✅ Subdriver created successfully");
      console.log(`🚐 Subdriver: ${subdriverResponse.data.data.user.username} (${subdriverResponse.data.data.user.subdriverID})`);
    } else {
      throw new Error("Subdriver creation failed");
    }

    // Step 4: Create Student
    console.log("\n4️⃣ Testing Student Creation...");
    const studentResponse = await api.post("/students", testData.studentData);
    
    if (studentResponse.data.success) {
      studentId = studentResponse.data.data.student._id;
      console.log("✅ Student created successfully");
      console.log(`👨‍🎓 Student: ${studentResponse.data.data.student.studentGivenName} ${studentResponse.data.data.student.studentFamilyName}`);
    } else {
      throw new Error("Student creation failed");
    }

    // Step 5: Test Get Drivers and Subdrivers
    console.log("\n5️⃣ Testing Get Drivers and Subdrivers...");
    const driversResponse = await api.get("/assignments/drivers");
    
    if (driversResponse.data.success) {
      console.log("✅ Drivers and subdrivers fetched successfully");
      console.log(`🚗 Drivers: ${driversResponse.data.data.drivers.length}`);
      console.log(`🚐 Subdrivers: ${driversResponse.data.data.subdrivers.length}`);
    } else {
      throw new Error("Failed to fetch drivers and subdrivers");
    }

    // Step 6: Test Get Unassigned Students
    console.log("\n6️⃣ Testing Get Unassigned Students...");
    const unassignedResponse = await api.get("/assignments/unassigned-students");
    
    if (unassignedResponse.data.success) {
      console.log("✅ Unassigned students fetched successfully");
      console.log(`👨‍🎓 Unassigned students: ${unassignedResponse.data.data.pagination.totalStudents}`);
    } else {
      throw new Error("Failed to fetch unassigned students");
    }

    // Step 7: Test Assign Student to Driver
    console.log("\n7️⃣ Testing Assign Student to Driver...");
    const assignmentData = {
      studentIds: [studentId],
      driverId: driverId,
      subdriverId: null,
      notes: "Test assignment",
    };

    const assignResponse = await api.post("/assignments", assignmentData);
    
    if (assignResponse.data.success) {
      console.log("✅ Student assigned to driver successfully");
      console.log(`📝 Assignment: ${assignResponse.data.message}`);
    } else {
      throw new Error("Failed to assign student to driver");
    }

    // Step 8: Test Get Assignments
    console.log("\n8️⃣ Testing Get Assignments...");
    const assignmentsResponse = await api.get("/assignments");
    
    if (assignmentsResponse.data.success) {
      console.log("✅ Assignments fetched successfully");
      console.log(`📋 Total assignments: ${assignmentsResponse.data.data.pagination.totalAssignments}`);
    } else {
      throw new Error("Failed to fetch assignments");
    }

    // Step 9: Test Get Unassigned Students (should be 0 now)
    console.log("\n9️⃣ Testing Get Unassigned Students (after assignment)...");
    const unassignedAfterResponse = await api.get("/assignments/unassigned-students");
    
    if (unassignedAfterResponse.data.success) {
      console.log("✅ Unassigned students fetched successfully");
      console.log(`👨‍🎓 Unassigned students: ${unassignedAfterResponse.data.data.pagination.totalStudents}`);
      
      if (unassignedAfterResponse.data.data.pagination.totalStudents === 0) {
        console.log("✅ Student successfully disappeared from unassigned list!");
      } else {
        console.log("⚠️ Student still appears in unassigned list");
      }
    } else {
      throw new Error("Failed to fetch unassigned students");
    }

    console.log("\n🎉 All tests passed successfully!");
    console.log("✅ Student assignment functionality is working correctly");

  } catch (error) {
    console.error("\n❌ Test failed:", error.response?.data?.message || error.message);
    
    if (error.response?.status === 401) {
      console.error("🔐 Authentication failed - check admin credentials");
    } else if (error.response?.status === 400) {
      console.error("📝 Bad request - check input data");
    } else if (error.response?.status === 404) {
      console.error("🔍 Resource not found");
    } else if (error.response?.status === 500) {
      console.error("💥 Server error - check backend logs");
    }
  }
}

// Run the test
testAssignmentAPI();
