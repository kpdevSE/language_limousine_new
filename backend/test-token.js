const axios = require("axios");

// Replace this with your actual token from the browser
const TEST_TOKEN = "your-token-here"; // Replace with your actual token

async function testToken() {
  console.log("🔑 Testing Authentication Token...\n");

  if (TEST_TOKEN === "your-token-here") {
    console.log(
      "❌ Please replace TEST_TOKEN with your actual token from the browser"
    );
    console.log("\n📋 How to get your token:");
    console.log("1. Open browser Developer Tools (F12)");
    console.log("2. Go to Application/Storage tab");
    console.log("3. Look in sessionStorage or localStorage for:");
    console.log("   - admin_token");
    console.log("   - authToken");
    console.log("4. Copy the token value and replace it in this file");
    return;
  }

  try {
    console.log("Testing token validity...");
    const response = await axios.get(
      "http://localhost:5000/api/excel-upload/template",
      {
        headers: {
          Authorization: `Bearer ${TEST_TOKEN}`,
        },
      }
    );

    if (response.data.success) {
      console.log("✅ Token is valid!");
      console.log("Response:", response.data);
    } else {
      console.log("❌ Token test failed:", response.data);
    }
  } catch (error) {
    if (error.response?.status === 401) {
      console.log("❌ Token is invalid or expired");
      console.log("Error:", error.response.data);
    } else {
      console.log("❌ Unexpected error:", error.message);
    }
  }
}

testToken().catch(console.error);
