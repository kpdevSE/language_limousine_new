const axios = require("axios");

const API_BASE_URL = "http://localhost:5000/api";

// Test data for subdriver login
const subdriverCredentials = {
  email: "subdriver@example.com",
  password: "subdriver123",
};

async function debugSubdriverData() {
  try {
    console.log("🔍 Debugging Subdriver Data...\n");

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
        console.log("\n📋 Sample assignment data structure:");
        const sampleAssignment = assignments[0];
        console.log("Assignment ID:", sampleAssignment._id);
        console.log("Student ID object:", sampleAssignment.studentId);

        if (sampleAssignment.studentId) {
          console.log("\n📚 Student details:");
          console.log("- Student ID:", sampleAssignment.studentId._id);
          console.log(
            "- Student Name:",
            sampleAssignment.studentId.studentGivenName,
            sampleAssignment.studentId.studentFamilyName
          );
          console.log("- Student No:", sampleAssignment.studentId.studentNo);
          console.log("- School:", sampleAssignment.studentId.school);
          console.log(
            "- All student fields:",
            Object.keys(sampleAssignment.studentId)
          );
        } else {
          console.log("❌ No student data found in assignment");
        }

        console.log(
          "\n📊 All assignment fields:",
          Object.keys(sampleAssignment)
        );
      } else {
        console.log("⚠️ No assignments found for today");
      }
    } else {
      console.log(
        "❌ Failed to get assignments:",
        assignmentsResponse.data.message
      );
    }
  } catch (error) {
    console.error("❌ Debug failed with error:", error.message);
    if (error.response) {
      console.error("Response data:", error.response.data);
    }
  }
}

// Run the debug
debugSubdriverData();
