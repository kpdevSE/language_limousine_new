const axios = require("axios");

const BASE_URL = "http://localhost:5000/api";

// Test data
const testAdminCredentials = {
  email: "admin@test.com",
  password: "admin123",
};

const testDriverCredentials = {
  email: "driver@test.com",
  password: "driver123",
};

let adminToken = "";
let driverToken = "";

async function testCompleteDriverFlow() {
  try {
    console.log("🧪 Testing Complete Driver Flow...\n");

    // Step 1: Login as admin
    console.log("1. Logging in as admin...");
    const adminLoginResponse = await axios.post(`${BASE_URL}/auth/login`, testAdminCredentials);
    adminToken = adminLoginResponse.data.data.token;
    console.log("✅ Admin login successful\n");

    // Step 2: Get unassigned students
    console.log("2. Fetching unassigned students...");
    const unassignedResponse = await axios.get(`${BASE_URL}/assignments/unassigned-students`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.log(`✅ Found ${unassignedResponse.data.data.students.length} unassigned students\n`);

    // Step 3: Get drivers
    console.log("3. Fetching drivers...");
    const driversResponse = await axios.get(`${BASE_URL}/assignments/drivers`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.log(`✅ Found ${driversResponse.data.data.drivers.length} drivers\n`);

    // Step 4: Assign students to driver (if we have students and drivers)
    if (unassignedResponse.data.data.students.length > 0 && driversResponse.data.data.drivers.length > 0) {
      console.log("4. Assigning students to driver...");
      const studentToAssign = unassignedResponse.data.data.students[0];
      const driverToUse = driversResponse.data.data.drivers[0];
      
      const assignmentData = {
        studentIds: [studentToAssign._id],
        driverId: driverToUse._id,
        subdriverId: null,
        notes: "Test assignment for driver functionality"
      };

      const assignmentResponse = await axios.post(`${BASE_URL}/assignments`, assignmentData, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      console.log("✅ Students assigned to driver successfully\n");
    } else {
      console.log("⚠️  Skipping assignment - no students or drivers available\n");
    }

    // Step 5: Login as driver
    console.log("5. Logging in as driver...");
    const driverLoginResponse = await axios.post(`${BASE_URL}/auth/user/login`, testDriverCredentials);
    driverToken = driverLoginResponse.data.data.token;
    console.log("✅ Driver login successful\n");

    // Step 6: Get driver's assignments
    console.log("6. Fetching driver's assignments...");
    const driverAssignmentsResponse = await axios.get(`${BASE_URL}/driver/my-assignments`, {
      headers: { Authorization: `Bearer ${driverToken}` },
      params: {
        date: new Date().toISOString().split('T')[0]
      }
    });
    console.log(`✅ Found ${driverAssignmentsResponse.data.data.assignments.length} assignments for driver\n`);

    // Step 7: Test pickup status update (if assignments exist)
    if (driverAssignmentsResponse.data.data.assignments.length > 0) {
      console.log("7. Testing pickup status update...");
      const firstAssignment = driverAssignmentsResponse.data.data.assignments[0];
      const newPickupStatus = firstAssignment.pickupStatus === "Completed" ? "Pending" : "Completed";
      
      const pickupResponse = await axios.put(
        `${BASE_URL}/driver/update-pickup/${firstAssignment._id}`,
        { pickupStatus: newPickupStatus },
        { headers: { Authorization: `Bearer ${driverToken}` } }
      );
      console.log(`✅ Pickup status updated to ${newPickupStatus}\n`);

      // Step 8: Test delivery status update
      console.log("8. Testing delivery status update...");
      const newDeliveryStatus = firstAssignment.deliveryStatus === "Completed" ? "Pending" : "Completed";
      
      const deliveryResponse = await axios.put(
        `${BASE_URL}/driver/update-delivery/${firstAssignment._id}`,
        { deliveryStatus: newDeliveryStatus },
        { headers: { Authorization: `Bearer ${driverToken}` } }
      );
      console.log(`✅ Delivery status updated to ${newDeliveryStatus}\n`);

      // Step 9: Verify the updates
      console.log("9. Verifying updates...");
      const verifyResponse = await axios.get(`${BASE_URL}/driver/my-assignments`, {
        headers: { Authorization: `Bearer ${driverToken}` },
        params: {
          date: new Date().toISOString().split('T')[0]
        }
      });
      
      const updatedAssignment = verifyResponse.data.data.assignments.find(
        a => a._id === firstAssignment._id
      );
      
      if (updatedAssignment) {
        console.log(`✅ Assignment pickup status: ${updatedAssignment.pickupStatus}`);
        console.log(`✅ Assignment delivery status: ${updatedAssignment.deliveryStatus}`);
      }
    } else {
      console.log("⚠️  No assignments found for testing status updates");
    }

    console.log("🎉 Complete driver flow test completed successfully!");

  } catch (error) {
    console.error("❌ Test failed:", error.response?.data || error.message);
  }
}

// Run the test
testCompleteDriverFlow();
