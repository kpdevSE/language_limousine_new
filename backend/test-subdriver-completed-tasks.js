const axios = require("axios");

const API_BASE_URL = "http://localhost:5000/api";

// Test data for subdriver login
const subdriverCredentials = {
  email: "subdriver@example.com",
  password: "subdriver123",
};

async function testSubdriverCompletedTasks() {
  try {
    console.log("🔍 Testing Subdriver Completed Tasks...\n");

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

    // Step 2: Get subdriver completed tasks
    console.log("\n2. Getting subdriver completed tasks...");
    const completedTasksResponse = await axios.get(
      `${API_BASE_URL}/subdriver/completed-tasks`,
      {
        headers: {
          Authorization: `Bearer ${subdriverToken}`,
        },
        params: {
          date: new Date().toISOString().split("T")[0],
        },
      }
    );

    if (completedTasksResponse.data.success) {
      console.log("✅ Completed tasks retrieved successfully");
      const completedTasks = completedTasksResponse.data.data.assignments;
      console.log(`Found ${completedTasks.length} completed tasks`);

      if (completedTasks.length > 0) {
        console.log("\n📋 Sample completed task:");
        const sampleTask = completedTasks[0];
        console.log("- Assignment ID:", sampleTask._id);
        console.log(
          "- Student:",
          sampleTask.studentId
            ? `${sampleTask.studentId.studentGivenName} ${sampleTask.studentId.studentFamilyName}`
            : "No student"
        );
        console.log("- Student No:", sampleTask.studentId?.studentNo || "N/A");
        console.log("- Flight:", sampleTask.studentId?.flight || "N/A");
        console.log(
          "- Arrival Time:",
          sampleTask.studentId?.arrivalTime || "N/A"
        );
        console.log("- Pickup Status:", sampleTask.pickupStatus);
        console.log("- Delivery Status:", sampleTask.deliveryStatus);
        console.log(
          "- Pickup Time:",
          sampleTask.pickupTime
            ? new Date(sampleTask.pickupTime).toLocaleString()
            : "N/A"
        );
        console.log(
          "- Delivery Time:",
          sampleTask.deliveryTime
            ? new Date(sampleTask.deliveryTime).toLocaleString()
            : "N/A"
        );
      } else {
        console.log("⚠️ No completed tasks found for today");
      }
    } else {
      console.log(
        "❌ Failed to get completed tasks:",
        completedTasksResponse.data.message
      );
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
      const stats = statsResponse.data.data;
      console.log("📊 Subdriver Stats:");
      console.log("- Total Assignments:", stats.totalAssignments);
      console.log("- Completed Pickups:", stats.completedPickups);
      console.log("- Completed Deliveries:", stats.completedDeliveries);
      console.log("- Pending Pickups:", stats.pendingPickups);
      console.log("- Pending Deliveries:", stats.pendingDeliveries);
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
testSubdriverCompletedTasks();
