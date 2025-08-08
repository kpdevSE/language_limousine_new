const axios = require("axios");

async function testStudentsEndpoint() {
  try {
    console.log("Testing students endpoint...");
    
    // Test the test route first
    try {
      const testResponse = await axios.get("http://localhost:5000/api/students/test");
      console.log("✅ Test route working:", testResponse.data);
    } catch (error) {
      if (error.response?.status === 404) {
        console.log("❌ Test route not found (404)");
      } else {
        console.log("❌ Test route error:", error.response?.status, error.response?.data);
      }
    }
    
    // Test without authentication (should return 401)
    try {
      const response = await axios.get("http://localhost:5000/api/students");
      console.log("✅ Students endpoint working:", response.data);
    } catch (error) {
      if (error.response?.status === 401) {
        console.log("✅ Students endpoint is working (requires authentication)");
        console.log("Response:", error.response.data);
      } else if (error.response?.status === 404) {
        console.log("❌ Students endpoint not found (404)");
        console.log("This means the route is not properly registered");
      } else {
        console.log("❌ Unexpected error:", error.response?.status, error.response?.data);
      }
    }
    
  } catch (error) {
    if (error.code === "ECONNREFUSED") {
      console.log("❌ Server is not running on http://localhost:5000");
    } else {
      console.log("❌ Connection error:", error.message);
    }
  }
}

testStudentsEndpoint();
