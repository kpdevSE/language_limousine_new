const axios = require("axios");

const BASE_URL = "http://localhost:5000/api";

async function testServerRoutes() {
  try {
    console.log("🧪 Testing Server Routes...\n");

    // Test health endpoint
    console.log("1. Testing health endpoint...");
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    console.log("✅ Health endpoint working:", healthResponse.data.message);

    // Test auth endpoint
    console.log("\n2. Testing auth endpoint...");
    const authResponse = await axios.post(`${BASE_URL}/auth/user/login`, {
      email: "driver@test.com",
      password: "driver123",
    });
    console.log("✅ Auth endpoint working");

    // Test driver endpoint (should fail without token)
    console.log("\n3. Testing driver endpoint without token...");
    try {
      await axios.get(`${BASE_URL}/driver/my-assignments`);
    } catch (error) {
      if (error.response?.status === 401) {
        console.log("✅ Driver endpoint exists (401 as expected)");
      } else {
        console.log("❌ Driver endpoint issue:", error.response?.status);
      }
    }

    console.log("\n🎉 Server routes test completed!");
  } catch (error) {
    console.error("❌ Test failed:", error.response?.data || error.message);
    console.error("Status:", error.response?.status);
  }
}

testServerRoutes();
