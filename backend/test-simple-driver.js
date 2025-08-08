const axios = require("axios");

const BASE_URL = "http://localhost:5000/api";

// Test data
const testDriverCredentials = {
  email: "driver@test.com",
  password: "driver123",
};

async function testSimpleDriver() {
  try {
    console.log("🧪 Testing Simple Driver Access...\n");

    // Step 1: Login as driver
    console.log("1. Logging in as driver...");
    const loginResponse = await axios.post(`${BASE_URL}/auth/user/login`, testDriverCredentials);
    const driverToken = loginResponse.data.data.token;
    console.log("✅ Driver login successful\n");

    // Step 2: Test driver route
    console.log("2. Testing driver route...");
    const driverResponse = await axios.get(`${BASE_URL}/driver/my-assignments`, {
      headers: { Authorization: `Bearer ${driverToken}` }
    });
    console.log("✅ Driver route accessed successfully");
    console.log(`Found ${driverResponse.data.data.assignments.length} assignments\n`);

    console.log("🎉 Simple driver test completed successfully!");

  } catch (error) {
    console.error("❌ Test failed:", error.response?.data || error.message);
    console.error("Status:", error.response?.status);
    console.error("URL:", error.config?.url);
  }
}

// Run the test
testSimpleDriver();
