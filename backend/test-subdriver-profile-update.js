const axios = require("axios");

const API_BASE_URL = "http://localhost:5000/api";

// Test data for subdriver login
const subdriverCredentials = {
  email: "subdriver@example.com",
  password: "subdriver123",
};

async function testSubdriverProfileUpdate() {
  try {
    console.log("🚀 Testing Subdriver Profile Update...\n");

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

    // Step 2: Get current profile
    console.log("\n2. Getting current profile...");
    const getProfileResponse = await axios.get(
      `${API_BASE_URL}/subdriver/profile`,
      {
        headers: {
          Authorization: `Bearer ${subdriverToken}`,
        },
      }
    );

    if (getProfileResponse.data.success) {
      console.log("✅ Current profile retrieved");
      console.log(
        "Current status:",
        getProfileResponse.data.data.subdriver.status
      );
    } else {
      console.log("❌ Failed to get profile:", getProfileResponse.data.message);
      return;
    }

    // Step 3: Update profile with new status
    console.log("\n3. Updating profile with 'Active' status...");
    const updateData = {
      status: "Active",
      vehicleNumber: "SUB123",
    };

    const updateResponse = await axios.put(
      `${API_BASE_URL}/subdriver/profile`,
      updateData,
      {
        headers: {
          Authorization: `Bearer ${subdriverToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (updateResponse.data.success) {
      console.log("✅ Profile updated successfully");
      console.log("Updated subdriver:", updateResponse.data.data.subdriver);
    } else {
      console.log("❌ Profile update failed:", updateResponse.data.message);
      if (updateResponse.data.errors) {
        console.log("Validation errors:", updateResponse.data.errors);
      }
    }

    // Step 4: Verify the update
    console.log("\n4. Verifying the update...");
    const verifyResponse = await axios.get(
      `${API_BASE_URL}/subdriver/profile`,
      {
        headers: {
          Authorization: `Bearer ${subdriverToken}`,
        },
      }
    );

    if (verifyResponse.data.success) {
      console.log("✅ Profile verification successful");
      console.log("Updated status:", verifyResponse.data.data.subdriver.status);
      if (verifyResponse.data.data.subdriver.status === "Active") {
        console.log("✅ Status successfully updated to 'Active'");
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
testSubdriverProfileUpdate();
