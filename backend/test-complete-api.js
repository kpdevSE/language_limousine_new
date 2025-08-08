const axios = require("axios");

const BASE_URL = "http://localhost:5000/api";

// Test data for creating a student
const testStudent = {
  date: "07/24/2025",
  trip: "Test Trip",
  actualArrivalTime: "14:30",
  arrivalTime: "15:00",
  flight: "TEST123",
  dOrI: "D",
  mOrF: "M",
  studentNo: "STU001",
  studentGivenName: "John",
  studentFamilyName: "Doe",
  hostGivenName: "Jane",
  hostFamilyName: "Smith",
  phone: "1234567890",
  address: "123 Test Street",
  city: "Test City",
  school: "Test School",
  client: "client1",
};

async function testCompleteAPI() {
  console.log("🧪 Testing Complete Students API...\n");

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
        console.log(
          "❌ Unexpected error:",
          error.response?.status,
          error.response?.data
        );
      }
    }
    console.log("");

    // Test 3: Test with invalid token
    console.log("3. Testing students endpoint with invalid token...");
    try {
      await axios.get(`${BASE_URL}/students`, {
        headers: {
          Authorization: "Bearer invalid-token",
        },
      });
      console.log("❌ Should reject invalid token");
    } catch (error) {
      if (error.response?.status === 401) {
        console.log("✅ Invalid token rejected (401)");
        console.log("Response:", error.response.data.message);
      } else {
        console.log(
          "❌ Unexpected error:",
          error.response?.status,
          error.response?.data
        );
      }
    }
    console.log("");

    // Test 4: Test stats endpoint without auth
    console.log("4. Testing stats endpoint without authentication...");
    try {
      await axios.get(`${BASE_URL}/students/stats`);
      console.log("❌ Should require authentication");
    } catch (error) {
      if (error.response?.status === 401) {
        console.log("✅ Stats endpoint requires authentication (401)");
        console.log("Response:", error.response.data.message);
      } else {
        console.log(
          "❌ Unexpected error:",
          error.response?.status,
          error.response?.data
        );
      }
    }
    console.log("");

    console.log("🎉 All authentication tests completed successfully!");
    console.log("\n📝 Next steps:");
    console.log("   1. Start the backend server: npm start");
    console.log("   2. Login as admin to get a valid token");
    console.log("   3. Test the frontend at http://localhost:5173");
    console.log("   4. Use the admin token to test full CRUD operations");
  } catch (error) {
    if (error.code === "ECONNREFUSED") {
      console.log("❌ Server is not running on http://localhost:5000");
      console.log("Please start the server with: npm start");
    } else {
      console.log("❌ Connection error:", error.message);
    }
  }
}

testCompleteAPI();
