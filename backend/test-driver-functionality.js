const axios = require("axios");

const BASE_URL = "http://localhost:5000/api";

// Test data
const testDriverCredentials = {
  email: "driver@test.com",
  password: "driver123",
};

let driverToken = "";

async function testDriverFunctionality() {
  try {
    console.log("🧪 Testing Driver Functionality...\n");

    // Step 1: Login as driver
    console.log("1. Logging in as driver...");
    const loginResponse = await axios.post(
      `${BASE_URL}/auth/login`,
      testDriverCredentials
    );
    driverToken = loginResponse.data.data.token;
    console.log("✅ Driver login successful\n");

    // Step 2: Get driver's assignments for today
    console.log("2. Fetching driver's assignments for today...");
    const assignmentsResponse = await axios.get(
      `${BASE_URL}/assignments/driver/my-assignments`,
      {
        headers: { Authorization: `Bearer ${driverToken}` },
        params: {
          date: new Date().toISOString().split("T")[0],
        },
      }
    );
    console.log(
      `✅ Found ${assignmentsResponse.data.data.assignments.length} assignments for today\n`
    );

    // Step 3: Test pickup status update (if assignments exist)
    if (assignmentsResponse.data.data.assignments.length > 0) {
      console.log("3. Testing pickup status update...");
      const firstAssignment = assignmentsResponse.data.data.assignments[0];
      const newPickupStatus =
        firstAssignment.pickupStatus === "Completed" ? "Pending" : "Completed";

      const pickupResponse = await axios.put(
        `${BASE_URL}/assignments/driver/update-pickup/${firstAssignment._id}`,
        { pickupStatus: newPickupStatus },
        { headers: { Authorization: `Bearer ${driverToken}` } }
      );
      console.log(`✅ Pickup status updated to ${newPickupStatus}\n`);

      // Step 4: Test delivery status update
      console.log("4. Testing delivery status update...");
      const newDeliveryStatus =
        firstAssignment.deliveryStatus === "Completed"
          ? "Pending"
          : "Completed";

      const deliveryResponse = await axios.put(
        `${BASE_URL}/assignments/driver/update-delivery/${firstAssignment._id}`,
        { deliveryStatus: newDeliveryStatus },
        { headers: { Authorization: `Bearer ${driverToken}` } }
      );
      console.log(`✅ Delivery status updated to ${newDeliveryStatus}\n`);

      // Step 5: Verify the updates
      console.log("5. Verifying updates...");
      const verifyResponse = await axios.get(
        `${BASE_URL}/assignments/driver/my-assignments`,
        {
          headers: { Authorization: `Bearer ${driverToken}` },
          params: {
            date: new Date().toISOString().split("T")[0],
          },
        }
      );

      const updatedAssignment = verifyResponse.data.data.assignments.find(
        (a) => a._id === firstAssignment._id
      );

      if (updatedAssignment) {
        console.log(
          `✅ Assignment pickup status: ${updatedAssignment.pickupStatus}`
        );
        console.log(
          `✅ Assignment delivery status: ${updatedAssignment.deliveryStatus}`
        );
      }
    } else {
      console.log("⚠️  No assignments found for testing status updates");
    }

    console.log("🎉 Driver functionality test completed successfully!");
  } catch (error) {
    console.error("❌ Test failed:", error.response?.data || error.message);
  }
}

// Run the test
testDriverFunctionality();
