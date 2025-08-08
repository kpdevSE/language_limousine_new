const axios = require("axios");

const API_BASE_URL = "http://localhost:5000/api";

// Test data for driver login
const driverCredentials = {
  email: "driver@example.com",
  password: "driver123",
};

async function testDriverProfileUpdate() {
  try {
    console.log("🚀 Testing Driver Profile Update...\n");

    // Step 1: Driver Login
    console.log("1. Driver Login...");
    const loginResponse = await axios.post(
      `${API_BASE_URL}/auth/user/login`,
      driverCredentials
    );

    if (!loginResponse.data.success) {
      console.log("❌ Driver login failed:", loginResponse.data.message);
      return;
    }

    const driverToken = loginResponse.data.data.token;
    console.log("✅ Driver login successful");
    console.log("Driver Token:", driverToken.substring(0, 20) + "...");

    // Step 2: Get current profile
    console.log("\n2. Getting current profile...");
    const getProfileResponse = await axios.get(
      `${API_BASE_URL}/driver/profile`,
      {
        headers: {
          Authorization: `Bearer ${driverToken}`,
        },
      }
    );

    if (getProfileResponse.data.success) {
      console.log("✅ Current profile retrieved");
      console.log(
        "Current status:",
        getProfileResponse.data.data.driver.status
      );
    } else {
      console.log("❌ Failed to get profile:", getProfileResponse.data.message);
      return;
    }

    // Step 3: Update profile with new status
    console.log("\n3. Updating profile with 'On Duty' status...");
    const updateData = {
      status: "On Duty",
      vehicleNumber: "ABC123",
    };

    const updateResponse = await axios.put(
      `${API_BASE_URL}/driver/profile`,
      updateData,
      {
        headers: {
          Authorization: `Bearer ${driverToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (updateResponse.data.success) {
      console.log("✅ Profile updated successfully");
      console.log("Updated driver:", updateResponse.data.data.driver);
    } else {
      console.log("❌ Profile update failed:", updateResponse.data.message);
      if (updateResponse.data.errors) {
        console.log("Validation errors:", updateResponse.data.errors);
      }
    }

    // Step 4: Verify the update
    console.log("\n4. Verifying the update...");
    const verifyResponse = await axios.get(`${API_BASE_URL}/driver/profile`, {
      headers: {
        Authorization: `Bearer ${driverToken}`,
      },
    });

    if (verifyResponse.data.success) {
      console.log("✅ Profile verification successful");
      console.log("Updated status:", verifyResponse.data.data.driver.status);
      if (verifyResponse.data.data.driver.status === "On Duty") {
        console.log("✅ Status successfully updated to 'On Duty'");
      } else {
        console.log("❌ Status not updated correctly");
      }
    } else {
      console.log("❌ Failed to verify profile:", verifyResponse.data.message);
    }
  } catch (error) {
    console.error("❌ Test failed with error:", error.message);
    if (error.response) {
      console.error("Response data:", error.response.data);
    }
  }
}

// Run the test
testDriverProfileUpdate();
