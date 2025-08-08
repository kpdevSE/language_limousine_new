const axios = require("axios");

const BASE_URL = "http://localhost:5000/api";

// Test data
const testDriverCredentials = {
  email: "driver@test.com",
  password: "driver123",
};

let driverToken = "";

async function testDriverProfile() {
  try {
    console.log("🧪 Testing Driver Profile Functionality...\n");

    // Step 1: Login as driver
    console.log("1. Logging in as driver...");
    const loginResponse = await axios.post(
      `${BASE_URL}/auth/user/login`,
      testDriverCredentials
    );
    driverToken = loginResponse.data.data.token;
    console.log("✅ Driver login successful\n");

    // Step 2: Get driver profile
    console.log("2. Fetching driver profile...");
    const profileResponse = await axios.get(`${BASE_URL}/driver/profile`, {
      headers: { Authorization: `Bearer ${driverToken}` },
    });
    console.log("✅ Driver profile fetched successfully");
    console.log("Profile data:", profileResponse.data.data.driver);
    console.log("");

    // Step 3: Update driver profile
    console.log("3. Updating driver profile...");
    const updateData = {
      username: "Updated Driver",
      email: "driver@test.com",
      gender: "Male",
      password: "••••••••••••", // Keep password unchanged
      driverID: "D001",
      vehicleNumber: "ABC-123",
      status: "Available",
    };

    const updateResponse = await axios.put(
      `${BASE_URL}/driver/profile`,
      updateData,
      {
        headers: { Authorization: `Bearer ${driverToken}` },
      }
    );
    console.log("✅ Driver profile updated successfully");
    console.log("Updated profile:", updateResponse.data.data.driver);
    console.log("");

    // Step 4: Get driver stats
    console.log("4. Fetching driver stats...");
    const statsResponse = await axios.get(`${BASE_URL}/driver/stats`, {
      headers: { Authorization: `Bearer ${driverToken}` },
      params: {
        date: new Date().toISOString().split("T")[0],
      },
    });
    console.log("✅ Driver stats fetched successfully");
    console.log("Stats:", statsResponse.data.data.stats);
    console.log("");

    // Step 5: Verify profile was updated
    console.log("5. Verifying profile update...");
    const verifyResponse = await axios.get(`${BASE_URL}/driver/profile`, {
      headers: { Authorization: `Bearer ${driverToken}` },
    });
    console.log("✅ Profile verification successful");
    console.log("Current profile:", verifyResponse.data.data.driver);
    console.log("");

    console.log("🎉 Driver profile functionality test completed successfully!");
  } catch (error) {
    console.error("❌ Test failed:", error.response?.data || error.message);
    console.error("Status:", error.response?.status);
    console.error("URL:", error.config?.url);
  }
}

// Run the test
testDriverProfile();
