const axios = require("axios");

const API_BASE_URL = "http://localhost:5000/api";

// Test credentials for admin login
const adminCredentials = {
  email: "admin@test.com",
  password: "admin123",
};

async function testAdminAssignments() {
  try {
    console.log("🔍 Testing Admin Assignments Endpoint...\n");

    // Step 1: Admin Login
    console.log("1. Admin Login...");
    const loginResponse = await axios.post(
      `${API_BASE_URL}/auth/login`,
      adminCredentials
    );

    if (!loginResponse.data.success) {
      console.log("❌ Admin login failed:", loginResponse.data.message);
      return;
    }

    const adminToken = loginResponse.data.data.token;
    console.log("✅ Admin login successful");

    // Step 2: Test getting all assignments
    console.log("\n2. Testing admin assignments API (all assignments)...");
    const allAssignmentsResponse = await axios.get(
      `${API_BASE_URL}/assignments`,
      {
        headers: { Authorization: `Bearer ${adminToken}` },
        params: {
          page: 1,
          limit: 10,
        },
      }
    );

    if (allAssignmentsResponse.data.success) {
      console.log("✅ Admin assignments API working correctly");
      const assignments = allAssignmentsResponse.data.data.assignments;
      const pagination = allAssignmentsResponse.data.data.pagination;

      console.log(`   Found ${assignments.length} assignments`);
      console.log(`   Total assignments: ${pagination.totalAssignments}`);
      console.log(`   Total pages: ${pagination.totalPages}`);

      if (assignments.length > 0) {
        console.log("\n📋 Sample assignment data:");
        console.log(`   Assignment ID: ${assignments[0]._id}`);
        console.log(
          `   Student: ${assignments[0].studentId?.studentGivenName} ${assignments[0].studentId?.studentFamilyName}`
        );
        console.log(`   Driver: ${assignments[0].driverId?.username || "N/A"}`);
        console.log(
          `   Subdriver: ${assignments[0].subdriverId?.username || "N/A"}`
        );
        console.log(`   Pickup Status: ${assignments[0].pickupStatus}`);
        console.log(`   Delivery Status: ${assignments[0].deliveryStatus}`);
        console.log(`   Assignment Date: ${assignments[0].assignmentDate}`);
      }
    } else {
      console.log(
        "❌ Admin assignments API failed:",
        allAssignmentsResponse.data.message
      );
    }

    // Step 3: Test filtering by driver ID
    if (
      allAssignmentsResponse.data.success &&
      allAssignmentsResponse.data.data.assignments.length > 0
    ) {
      const firstAssignment = allAssignmentsResponse.data.data.assignments[0];
      if (firstAssignment.driverId) {
        console.log("\n3. Testing admin assignments API with driver filter...");
        const driverFilterResponse = await axios.get(
          `${API_BASE_URL}/assignments`,
          {
            headers: { Authorization: `Bearer ${adminToken}` },
            params: {
              driverId: firstAssignment.driverId._id,
              page: 1,
              limit: 10,
            },
          }
        );

        if (driverFilterResponse.data.success) {
          console.log("✅ Driver filter working correctly");
          const filteredAssignments =
            driverFilterResponse.data.data.assignments;
          console.log(
            `   Found ${filteredAssignments.length} assignments for driver ${firstAssignment.driverId.username}`
          );
        } else {
          console.log(
            "❌ Driver filter failed:",
            driverFilterResponse.data.message
          );
        }
      }
    }

    // Step 4: Test filtering by date
    console.log("\n4. Testing admin assignments API with date filter...");
    const dateFilterResponse = await axios.get(`${API_BASE_URL}/assignments`, {
      headers: { Authorization: `Bearer ${adminToken}` },
      params: {
        date: "2025-08-14",
        page: 1,
        limit: 10,
      },
    });

    if (dateFilterResponse.data.success) {
      console.log("✅ Date filter working correctly");
      const dateFilteredAssignments = dateFilterResponse.data.data.assignments;
      console.log(
        `   Found ${dateFilteredAssignments.length} assignments for date 2025-08-14`
      );
    } else {
      console.log("❌ Date filter failed:", dateFilterResponse.data.message);
    }

    console.log("\n✅ Admin assignments functionality test completed!");
  } catch (error) {
    console.error("❌ Test failed with error:", error.message);
    if (error.response) {
      console.error("Response data:", error.response.data);
    }
  }
}

// Run the test
testAdminAssignments();
