const axios = require("axios");

async function testServerConnection() {
  try {
    console.log("Testing server connection...");

    // Test health endpoint
    const healthResponse = await axios.get("http://localhost:5000/api/health");
    console.log("✅ Health endpoint working:", healthResponse.data);

    // Test students endpoint (this should return 401 without auth token)
    try {
      const studentsResponse = await axios.get(
        "http://localhost:5000/api/students"
      );
      console.log("❌ Students endpoint should require authentication");
    } catch (error) {
      if (error.response?.status === 401) {
        console.log(
          "✅ Students endpoint is accessible (requires authentication)"
        );
      } else {
        console.log(
          "❌ Students endpoint error:",
          error.response?.status,
          error.response?.data
        );
      }
    }
  } catch (error) {
    if (error.code === "ECONNREFUSED") {
      console.log("❌ Server is not running on http://localhost:5000");
      console.log("Please start the server with: npm start");
    } else {
      console.log("❌ Connection error:", error.message);
    }
  }
}

testServerConnection();
