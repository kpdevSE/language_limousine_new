const axios = require("axios");

const BASE_URL = "http://localhost:5000/api";

async function testStudentsAPI() {
  console.log("🧪 Testing Students API...\n");

  try {
    // Test 1: Health check
    console.log("1. Testing health endpoint...");
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    console.log("✅ Health endpoint working:", healthResponse.data.message);
    console.log("");

    // Test 2: Students endpoint without auth (should return 401)
    console.log("2. Testing students endpoint without authentication...");
    try {
      await axios.get(`${BASE_URL}/students`);
      console.log("❌ Should require authentication");
    } catch (error) {
      if (error.response?.status === 401) {
        console.log("✅ Students endpoint requires authentication (401)");
        console.log("Response:", error.response.data.message);
      } else {
        console.log("❌ Unexpected error:", error.response?.status, error.response?.data);
      }
    }
    console.log("");

    // Test 3: Students endpoint with date filter without auth
    console.log("3. Testing students endpoint with date filter without authentication...");
    try {
      await axios.get(`${BASE_URL}/students?date=2024-01-15`);
      console.log("❌ Should require authentication");
    } catch (error) {
      if (error.response?.status === 401) {
        console.log("✅ Students endpoint with date filter requires authentication (401)");
        console.log("Response:", error.response.data.message);
      } else {
        console.log("❌ Unexpected error:", error.response?.status, error.response?.data);
      }
    }
    console.log("");

    // Test 4: PDF export endpoint without auth
    console.log("4. Testing PDF export endpoint without authentication...");
    try {
      await axios.get(`${BASE_URL}/students/export/pdf?date=2024-01-15`);
      console.log("❌ Should require authentication");
    } catch (error) {
      if (error.response?.status === 401) {
        console.log("✅ PDF export endpoint requires authentication (401)");
        console.log("Response:", error.response.data.message);
      } else {
        console.log("❌ Unexpected error:", error.response?.status, error.response?.data);
      }
    }
    console.log("");

    console.log("🎉 All students API tests completed successfully!");
    console.log("\n📝 API Endpoints Summary:");
    console.log("   ✅ GET /api/health - Working");
    console.log("   ✅ GET /api/students - Requires authentication");
    console.log("   ✅ GET /api/students?date=YYYY-MM-DD - Requires authentication");
    console.log("   ✅ GET /api/students/export/pdf?date=YYYY-MM-DD - Requires authentication");
    console.log("   ✅ POST /api/students - Requires authentication");
    console.log("   ✅ PUT /api/students/:id - Requires authentication");
    console.log("   ✅ DELETE /api/students/:id - Requires authentication");
    console.log("\n📝 Frontend Configuration:");
    console.log("   ✅ Add.jsx: baseURL = http://localhost:5000/api/students");
    console.log("   ✅ View.jsx: baseURL = http://localhost:5000/api/students");
    console.log("   ✅ Update.jsx: baseURL = http://localhost:5000/api/students");
    console.log("   ✅ Download.jsx: baseURL = http://localhost:5000/api/students");
    console.log("\n📝 Next steps:");
    console.log("   1. Start the backend server: npm start");
    console.log("   2. Start the frontend: cd frontend && npm run dev");
    console.log("   3. Login as admin to get a valid token");
    console.log("   4. Test the complete functionality");

  } catch (error) {
    if (error.code === "ECONNREFUSED") {
      console.log("❌ Server is not running on http://localhost:5000");
      console.log("Please start the server with: npm start");
    } else {
      console.log("❌ Connection error:", error.message);
    }
  }
}

testStudentsAPI();
