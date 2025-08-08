const axios = require("axios");

const BASE_URL = "http://localhost:5000/api";

// Test data
const testAdminCredentials = {
  email: "admin@test.com",
  password: "admin123",
};

let adminToken = "";

async function testAssignmentFlow() {
  try {
    console.log("🧪 Testing Assignment Integration...\n");

    // Step 1: Login as admin
    console.log("1. Logging in as admin...");
    const loginResponse = await axios.post(
      `${BASE_URL}/auth/login`,
      testAdminCredentials
    );
    adminToken = loginResponse.data.data.token;
    console.log("✅ Admin login successful\n");

    // Step 2: Get unassigned students
    console.log("2. Fetching unassigned students...");
    const unassignedResponse = await axios.get(
      `${BASE_URL}/assignments/unassigned-students`,
      {
        headers: { Authorization: `Bearer ${adminToken}` },
      }
    );
    console.log(
      `✅ Found ${unassignedResponse.data.data.students.length} unassigned students\n`
    );

    // Step 3: Get drivers and subdrivers
    console.log("3. Fetching drivers and subdrivers...");
    const driversResponse = await axios.get(`${BASE_URL}/assignments/drivers`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    console.log(
      `✅ Found ${driversResponse.data.data.drivers.length} drivers and ${driversResponse.data.data.subdrivers.length} subdrivers\n`
    );

    // Step 4: Test assignment (if we have students and drivers)
    if (
      unassignedResponse.data.data.students.length > 0 &&
      (driversResponse.data.data.drivers.length > 0 ||
        driversResponse.data.data.subdrivers.length > 0)
    ) {
      console.log("4. Testing student assignment...");
      const studentToAssign = unassignedResponse.data.data.students[0];
      const driverToUse =
        driversResponse.data.data.drivers[0] ||
        driversResponse.data.data.subdrivers[0];

      // Determine if it's a driver or subdriver
      const isDriver = driversResponse.data.data.drivers.some(
        (d) => d._id === driverToUse._id
      );
      const isSubdriver = driversResponse.data.data.subdrivers.some(
        (s) => s._id === driverToUse._id
      );

      const assignmentData = {
        studentIds: [studentToAssign._id],
        driverId: isDriver ? driverToUse._id : null,
        subdriverId: isSubdriver ? driverToUse._id : null,
        notes: "Test assignment",
      };

      const assignmentResponse = await axios.post(
        `${BASE_URL}/assignments`,
        assignmentData,
        {
          headers: { Authorization: `Bearer ${adminToken}` },
        }
      );
      console.log("✅ Student assignment successful\n");

      // Step 5: Verify student is no longer in unassigned list
      console.log("5. Verifying student is removed from unassigned list...");
      const verifyResponse = await axios.get(
        `${BASE_URL}/assignments/unassigned-students`,
        {
          headers: { Authorization: `Bearer ${adminToken}` },
        }
      );

      const isStillUnassigned = verifyResponse.data.data.students.some(
        (student) => student._id === studentToAssign._id
      );

      if (!isStillUnassigned) {
        console.log("✅ Student successfully removed from unassigned list\n");
      } else {
        console.log("❌ Student still appears in unassigned list\n");
      }
    } else {
      console.log(
        "⚠️  Skipping assignment test - no students or drivers available\n"
      );
    }

    console.log("🎉 Assignment integration test completed successfully!");
  } catch (error) {
    console.error("❌ Test failed:", error.response?.data || error.message);
  }
}

// Run the test
testAssignmentFlow();
