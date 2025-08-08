const axios = require("axios");

const API_BASE_URL = "http://localhost:5000/api";

// Admin credentials
const adminCredentials = {
  email: "admin@example.com",
  password: "admin123",
};

async function getAdminToken() {
  try {
    console.log("🔐 Getting admin token...");
    console.log("📧 Email:", adminCredentials.email);
    
    const response = await axios.post(`${API_BASE_URL}/auth/login`, adminCredentials);
    
    if (response.data.success) {
      const token = response.data.data.token;
      console.log("✅ Admin login successful!");
      console.log("🎫 Token:", token.substring(0, 20) + "...");
      console.log("📋 Full token:", token);
      return token;
    } else {
      console.log("❌ Admin login failed:", response.data.message);
      return null;
    }
  } catch (error) {
    console.error("❌ Error getting admin token:", error.response?.data?.message || error.message);
    return null;
  }
}

// Export the function so it can be used in other files
module.exports = { getAdminToken, adminCredentials };

// If run directly, get the token
if (require.main === module) {
  getAdminToken();
}
