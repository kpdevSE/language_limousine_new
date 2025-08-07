const axios = require("axios");

const API_BASE_URL = "http://localhost:5000/api";
let adminToken = null;

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use((config) => {
  if (adminToken) {
    config.headers.Authorization = `Bearer ${adminToken}`;
  }
  return config;
});

// Test functions
async function testAdminLogin() {
  console.log("\n🔐 Testing Admin Login...");
  try {
    const response = await api.post("/auth/login", {
      email: "admin@example.com",
      password: "password123",
    });

    if (response.data.success) {
      adminToken = response.data.data.token;
      console.log("✅ Admin login successful");
      console.log(`👤 Admin: ${response.data.data.user.username}`);
      return true;
    }
  } catch (error) {
    console.error("❌ Admin login failed:", error.response?.data?.message || error.message);
    return false;
  }
}

async function testAddDriver() {
  console.log("\n🚗 Testing Add Driver...");
  try {
    const response = await api.post("/users", {
      username: "driver123",
      email: "driver@example.com",
      password: "password123",
      gender: "Male",
      role: "Driver",
    });

    if (response.data.success) {
      console.log("✅ Driver added successfully");
      console.log(`👤 Driver: ${response.data.data.user.username} (${response.data.data.user.role})`);
      return response.data.data.user.id;
    }
  } catch (error) {
    console.error("❌ Add driver failed:", error.response?.data?.message || error.message);
    return null;
  }
}

async function testAddGreeter() {
  console.log("\n👋 Testing Add Greeter...");
  try {
    const response = await api.post("/users", {
      username: "greeter123",
      email: "greeter@example.com",
      password: "password123",
      gender: "Female",
      role: "Greeter",
      greeterID: "GR001",
    });

    if (response.data.success) {
      console.log("✅ Greeter added successfully");
      console.log(`👤 Greeter: ${response.data.data.user.username} (${response.data.data.user.role})`);
      return response.data.data.user.id;
    }
  } catch (error) {
    console.error("❌ Add greeter failed:", error.response?.data?.message || error.message);
    return null;
  }
}

async function testAddSubdriver() {
  console.log("\n🚐 Testing Add Subdriver...");
  try {
    const response = await api.post("/users", {
      username: "subdriver123",
      email: "subdriver@example.com",
      password: "password123",
      gender: "Male",
      role: "Subdriver",
    });

    if (response.data.success) {
      console.log("✅ Subdriver added successfully");
      console.log(`👤 Subdriver: ${response.data.data.user.username} (${response.data.data.user.role})`);
      return response.data.data.user.id;
    }
  } catch (error) {
    console.error("❌ Add subdriver failed:", error.response?.data?.message || error.message);
    return null;
  }
}

async function testAddSchool() {
  console.log("\n🏫 Testing Add School...");
  try {
    const response = await api.post("/users", {
      username: "school123",
      email: "school@example.com",
      password: "password123",
      gender: "Other",
      role: "School",
    });

    if (response.data.success) {
      console.log("✅ School added successfully");
      console.log(`👤 School: ${response.data.data.user.username} (${response.data.data.user.role})`);
      return response.data.data.user.id;
    }
  } catch (error) {
    console.error("❌ Add school failed:", error.response?.data?.message || error.message);
    return null;
  }
}

async function testGetAllUsers() {
  console.log("\n📋 Testing Get All Users...");
  try {
    const response = await api.get("/users?page=1&limit=10");

    if (response.data.success) {
      console.log("✅ Get all users successful");
      console.log(`📊 Total users: ${response.data.data.pagination.totalUsers}`);
      console.log(`📄 Page ${response.data.data.pagination.currentPage} of ${response.data.data.pagination.totalPages}`);
      
      response.data.data.users.forEach((user) => {
        console.log(`  - ${user.username} (${user.role}) - ${user.email}`);
      });
    }
  } catch (error) {
    console.error("❌ Get all users failed:", error.response?.data?.message || error.message);
  }
}

async function testGetUsersByRole() {
  console.log("\n🎯 Testing Get Users by Role (Driver)...");
  try {
    const response = await api.get("/users/role/Driver?page=1&limit=5");

    if (response.data.success) {
      console.log("✅ Get users by role successful");
      console.log(`📊 Total drivers: ${response.data.data.pagination.totalUsers}`);
      
      response.data.data.users.forEach((user) => {
        console.log(`  - ${user.username} - ${user.email}`);
      });
    }
  } catch (error) {
    console.error("❌ Get users by role failed:", error.response?.data?.message || error.message);
  }
}

async function testGetUserStats() {
  console.log("\n📈 Testing Get User Statistics...");
  try {
    const response = await api.get("/users/stats");

    if (response.data.success) {
      console.log("✅ Get user stats successful");
      console.log("📊 User Statistics:");
      
      Object.entries(response.data.data.stats).forEach(([role, stats]) => {
        console.log(`  ${role}: ${stats.total} total (${stats.active} active, ${stats.inactive} inactive)`);
      });
      
      console.log(`\n📈 Overall: ${response.data.data.total.users} total users (${response.data.data.total.active} active, ${response.data.data.total.inactive} inactive)`);
    }
  } catch (error) {
    console.error("❌ Get user stats failed:", error.response?.data?.message || error.message);
  }
}

async function testUpdateUser(userId) {
  if (!userId) return;
  
  console.log("\n✏️ Testing Update User...");
  try {
    const response = await api.put(`/users/${userId}`, {
      username: "updateddriver",
      isActive: true,
    });

    if (response.data.success) {
      console.log("✅ User updated successfully");
      console.log(`👤 Updated user: ${response.data.data.user.username}`);
    }
  } catch (error) {
    console.error("❌ Update user failed:", error.response?.data?.message || error.message);
  }
}

async function testGetUserById(userId) {
  if (!userId) return;
  
  console.log("\n🔍 Testing Get User by ID...");
  try {
    const response = await api.get(`/users/${userId}`);

    if (response.data.success) {
      console.log("✅ Get user by ID successful");
      console.log(`👤 User: ${response.data.data.user.username} (${response.data.data.user.role})`);
      console.log(`📧 Email: ${response.data.data.user.email}`);
      console.log(`👥 Gender: ${response.data.data.user.gender}`);
      console.log(`✅ Active: ${response.data.data.user.isActive}`);
    }
  } catch (error) {
    console.error("❌ Get user by ID failed:", error.response?.data?.message || error.message);
  }
}

async function testUserLogin() {
  console.log("\n🔐 Testing User Login (Driver)...");
  try {
    const response = await api.post("/auth/user/login", {
      email: "driver@example.com",
      password: "password123",
    });

    if (response.data.success) {
      console.log("✅ User login successful");
      console.log(`👤 User: ${response.data.data.user.username} (${response.data.data.user.role})`);
      console.log(`🔑 Token received: ${response.data.data.token ? "Yes" : "No"}`);
    }
  } catch (error) {
    console.error("❌ User login failed:", error.response?.data?.message || error.message);
  }
}

async function testDeleteUser(userId) {
  if (!userId) return;
  
  console.log("\n🗑️ Testing Delete User...");
  try {
    const response = await api.delete(`/users/${userId}`);

    if (response.data.success) {
      console.log("✅ User deleted successfully");
    }
  } catch (error) {
    console.error("❌ Delete user failed:", error.response?.data?.message || error.message);
  }
}

// Main test function
async function runTests() {
  console.log("🚀 Starting User Management API Tests...\n");

  // Test admin login first
  const loginSuccess = await testAdminLogin();
  if (!loginSuccess) {
    console.log("❌ Cannot proceed without admin login");
    return;
  }

  // Test adding users
  const driverId = await testAddDriver();
  const greeterId = await testAddGreeter();
  const subdriverId = await testAddSubdriver();
  const schoolId = await testAddSchool();

  // Test getting users
  await testGetAllUsers();
  await testGetUsersByRole();
  await testGetUserStats();

  // Test updating user
  await testUpdateUser(driverId);

  // Test getting user by ID
  await testGetUserById(driverId);

  // Test user login
  await testUserLogin();

  // Test deleting user (optional - uncomment to test)
  // await testDeleteUser(driverId);

  console.log("\n🎉 User Management API Tests Completed!");
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = {
  runTests,
  testAdminLogin,
  testAddDriver,
  testAddGreeter,
  testAddSubdriver,
  testAddSchool,
  testGetAllUsers,
  testGetUsersByRole,
  testGetUserStats,
  testUpdateUser,
  testGetUserById,
  testUserLogin,
  testDeleteUser,
};
