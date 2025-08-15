const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");

// Debug script to test Excel upload
async function debugUpload() {
  console.log("🔍 Debugging Excel Upload Issue...\n");

  // Test 1: Check if server is running
  console.log("1. Testing server connection...");
  try {
    const healthResponse = await axios.get("http://localhost:5000/api/health");
    console.log("✅ Server is running:", healthResponse.data);
  } catch (error) {
    console.log("❌ Server is not running or not responding");
    console.log("Error:", error.message);
    return;
  }

  // Test 2: Check authentication
  console.log("\n2. Testing authentication...");
  try {
    // Try to get template without token
    const templateResponse = await axios.get(
      "http://localhost:5000/api/excel-upload/template"
    );
    console.log("❌ Authentication bypassed - this should not happen");
  } catch (error) {
    if (error.response?.status === 401) {
      console.log(
        "✅ Authentication is working - 401 Unauthorized as expected"
      );
    } else {
      console.log(
        "❌ Unexpected authentication error:",
        error.response?.status,
        error.response?.data
      );
    }
  }

  // Test 3: Test with invalid token
  console.log("\n3. Testing with invalid token...");
  try {
    const templateResponse = await axios.get(
      "http://localhost:5000/api/excel-upload/template",
      {
        headers: {
          Authorization: "Bearer invalid-token",
        },
      }
    );
    console.log("❌ Invalid token accepted - this should not happen");
  } catch (error) {
    if (error.response?.status === 401) {
      console.log("✅ Invalid token properly rejected");
    } else {
      console.log(
        "❌ Unexpected error with invalid token:",
        error.response?.status,
        error.response?.data
      );
    }
  }

  console.log("\n📋 Debug Summary:");
  console.log("- Check if you have a valid admin token");
  console.log("- Make sure you are logged in as admin");
  console.log("- Verify the token is being sent in the Authorization header");
  console.log("- Check browser console for any JavaScript errors");
  console.log("- Check server console for detailed error logs");

  console.log("\n🔧 Next Steps:");
  console.log("1. Login to the admin panel and get a fresh token");
  console.log(
    "2. Check the browser's Network tab to see the exact request being sent"
  );
  console.log("3. Look at the server console for detailed error messages");
  console.log("4. Try uploading a simple Excel file first");
}

// Run the debug
debugUpload().catch(console.error);
