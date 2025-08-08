const axios = require("axios");

const API_BASE_URL = "http://localhost:5000/api";

// Test data for subdriver login
const subdriverCredentials = {
  email: "subdriver@example.com",
  password: "subdriver123",
};

async function testSubdriverAssignments() {
  try {
    console.log("🚀 Testing Subdriver Assignments...\n");

    // Step 1: Subdriver Login
    console.log("1. Subdriver Login...");
    const loginResponse = await axios.post(
      `${API_BASE_URL}/auth/user/login`,
      subdriverCredentials
    );

    if (!loginResponse.data.success) {
      console.log("❌ Subdriver login failed:", loginResponse.data.message);
      return;
    }

    const subdriverToken = loginResponse.data.data.token;
    console.log("✅ Subdriver login successful");
    console.log("Subdriver Token:", subdriverToken.substring(0, 20) + "...");

    // Step 2: Get subdriver assignments
    console.log("\n2. Getting subdriver assignments...");
    const assignmentsResponse = await axios.get(
      `${API_BASE_URL}/subdriver/my-assignments`,
      {
        headers: {
          Authorization: `Bearer ${subdriverToken}`,
        },
        params: {
          date: new Date().toISOString().split("T")[0],
        },
      }
    );

    if (assignmentsResponse.data.success) {
      console.log("✅ Assignments retrieved successfully");
      const assignments = assignmentsResponse.data.data.assignments;
      console.log(`Found ${assignments.length} assignments`);

      if (assignments.length > 0) {
        console.log("\nSample assignment data:");
        const sampleAssignment = assignments[0];
        console.log("Assignment ID:", sampleAssignment._id);
        console.log("Student ID:", sampleAssignment.studentId?._id);
        console.log(
          "Student Name:",
          sampleAssignment.studentId?.studentGivenName,
          sampleAssignment.studentId?.studentFamilyName
        );
        console.log("Student No:", sampleAssignment.studentId?.studentNo);
        console.log("School:", sampleAssignment.studentId?.school);
        console.log("Pickup Status:", sampleAssignment.pickupStatus);
        console.log("Delivery Status:", sampleAssignment.deliveryStatus);
      }
    } else {
      console.log(
        "❌ Failed to get assignments:",
        assignmentsResponse.data.message
      );
      return;
    }

    // Step 3: Get subdriver stats
    console.log("\n3. Getting subdriver stats...");
    const statsResponse = await axios.get(`${API_BASE_URL}/subdriver/stats`, {
      headers: {
        Authorization: `Bearer ${subdriverToken}`,
      },
      params: {
        date: new Date().toISOString().split("T")[0],
      },
    });

    if (statsResponse.data.success) {
      console.log("✅ Stats retrieved successfully");
      console.log("Stats:", statsResponse.data.data.stats);
    } else {
      console.log("❌ Failed to get stats:", statsResponse.data.message);
    }
  } catch (error) {
    console.error("❌ Test failed with error:", error.message);
    if (error.response) {
      console.error("Response data:", error.response.data);
    }
  }
}

// Run the test
testSubdriverAssignments();
