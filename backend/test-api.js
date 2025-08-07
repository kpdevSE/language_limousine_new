const axios = require("axios");

const BASE_URL = "http://localhost:5000/api/auth";

// Test data
const testAdmin = {
  username: "testadmin",
  email: "testadmin@example.com",
  password: "password123",
  gender: "Male",
  role: "Admin",
};

const testLogin = {
  email: "testadmin@example.com",
  password: "password123",
};

async function testAdminRegistration() {
  try {
    console.log("Testing admin registration...");
    const response = await axios.post(`${BASE_URL}/register`, testAdmin);
    console.log("✅ Admin registration successful:", response.data);
    return response.data.data.token;
  } catch (error) {
    console.error(
      "❌ Admin registration failed:",
      error.response?.data || error.message
    );
    return null;
  }
}

async function testAdminLogin() {
  try {
    console.log("Testing admin login...");
    const response = await axios.post(`${BASE_URL}/login`, testLogin);
    console.log("✅ Admin login successful:", response.data);
    return response.data.data.token;
  } catch (error) {
    console.error(
      "❌ Admin login failed:",
      error.response?.data || error.message
    );
    return null;
  }
}

async function testGetProfile(token) {
  try {
    console.log("Testing get profile...");
    const response = await axios.get(`${BASE_URL}/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("✅ Get profile successful:", response.data);
  } catch (error) {
    console.error(
      "❌ Get profile failed:",
      error.response?.data || error.message
    );
  }
}

async function testUpdateProfile(token) {
  try {
    console.log("Testing update profile...");
    const updateData = {
      username: "updatedadmin",
      email: "updatedadmin@example.com",
    };
    const response = await axios.put(`${BASE_URL}/profile`, updateData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("✅ Update profile successful:", response.data);
  } catch (error) {
    console.error(
      "❌ Update profile failed:",
      error.response?.data || error.message
    );
  }
}

async function runTests() {
  console.log("🚀 Starting API tests...\n");

  // Test registration
  const token = await testAdminRegistration();

  if (token) {
    console.log("\n---\n");

    // Test login
    const loginToken = await testAdminLogin();

    console.log("\n---\n");

    // Test get profile
    await testGetProfile(token);

    console.log("\n---\n");

    // Test update profile
    await testUpdateProfile(token);
  }

  console.log("\n🏁 Tests completed!");
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = {
  testAdminRegistration,
  testAdminLogin,
  testGetProfile,
  testUpdateProfile,
};
