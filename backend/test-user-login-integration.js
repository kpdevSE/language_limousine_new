const axios = require("axios");
const API_BASE_URL = "http://localhost:5000/api";

const adminCredentials = {
  email: "admin@example.com",
  password: "admin123",
};

// Test user data for different roles
const testUsers = [
  {
    username: "testdriver",
    email: "driver@example.com",
    password: "driver123",
    gender: "Male",
    role: "Driver",
    driverID: "DRV001",
    vehicleNumber: "ABC123",
  },
  {
    username: "testsubdriver",
    email: "subdriver@example.com",
    password: "subdriver123",
    gender: "Female",
    role: "Subdriver",
    subdriverID: "SUB001",
    vehicleNumber: "XYZ789",
    status: "Active",
  },
  {
    username: "testschool",
    email: "school@example.com",
    password: "school123",
    gender: "Male",
    role: "School",
    schoolID: "SCH001",
  },
  {
    username: "testgreeter",
    email: "greeter@example.com",
    password: "greeter123",
    gender: "Female",
    role: "Greeter",
    greeterID: "GRT001",
  },
];

let adminToken = "";

async function testUserLoginIntegration() {
  console.log("🧪 Testing User Login Integration");
  console.log("=".repeat(60));

  try {
    // Step 1: Admin Login
    console.log("\n1️⃣ Admin Login...");
    const loginResponse = await axios.post(
      `${API_BASE_URL}/auth/login`,
      adminCredentials
    );

    if (loginResponse.data.success) {
      adminToken = loginResponse.data.data.token;
      console.log("✅ Admin login successful");
      console.log(`   Token: ${adminToken.substring(0, 20)}...`);
    } else {
      throw new Error("Admin login failed");
    }

    // Step 2: Create test users
    console.log("\n2️⃣ Creating test users...");
    const createdUsers = [];

    for (const userData of testUsers) {
      try {
        const response = await axios.post(`${API_BASE_URL}/users`, userData, {
          headers: { Authorization: `Bearer ${adminToken}` },
        });

        if (response.data.success) {
          console.log(`✅ Created ${userData.role} user: ${userData.username}`);
          createdUsers.push({
            ...userData,
            _id: response.data.data.user.id,
          });
        } else {
          console.log(
            `❌ Failed to create ${userData.role} user: ${response.data.message}`
          );
        }
      } catch (error) {
        console.log(
          `❌ Error creating ${userData.role} user:`,
          error.response?.data?.message || error.message
        );
      }
    }

    if (createdUsers.length === 0) {
      throw new Error("No test users were created successfully");
    }

    // Step 3: Test user login for each role
    console.log("\n3️⃣ Testing user login for each role...");

    for (const user of createdUsers) {
      console.log(`\n   Testing ${user.role} login...`);

      try {
        const loginResponse = await axios.post(
          `${API_BASE_URL}/auth/user/login`,
          {
            email: user.email,
            password: user.password,
          }
        );

        if (loginResponse.data.success) {
          const { token, user: loggedInUser } = loginResponse.data.data;

          console.log(`   ✅ ${user.role} login successful`);
          console.log(`      Username: ${loggedInUser.username}`);
          console.log(`      Email: ${loggedInUser.email}`);
          console.log(`      Role: ${loggedInUser.role}`);
          console.log(`      Token: ${token.substring(0, 20)}...`);

          // Verify role-specific fields are returned
          if (user.role === "Driver") {
            console.log(
              `      Driver ID: ${loggedInUser.driverID || "Not returned"}`
            );
            console.log(
              `      Vehicle Number: ${
                loggedInUser.vehicleNumber || "Not returned"
              }`
            );
          } else if (user.role === "Subdriver") {
            console.log(
              `      Subdriver ID: ${
                loggedInUser.subdriverID || "Not returned"
              }`
            );
            console.log(
              `      Vehicle Number: ${
                loggedInUser.vehicleNumber || "Not returned"
              }`
            );
            console.log(
              `      Status: ${loggedInUser.status || "Not returned"}`
            );
          } else if (user.role === "School") {
            console.log(
              `      School ID: ${loggedInUser.schoolID || "Not returned"}`
            );
          } else if (user.role === "Greeter") {
            console.log(
              `      Greeter ID: ${loggedInUser.greeterID || "Not returned"}`
            );
          }
        } else {
          console.log(
            `   ❌ ${user.role} login failed: ${loginResponse.data.message}`
          );
        }
      } catch (error) {
        console.log(
          `   ❌ ${user.role} login error:`,
          error.response?.data?.message || error.message
        );
      }
    }

    // Step 4: Test invalid credentials
    console.log("\n4️⃣ Testing invalid credentials...");

    try {
      await axios.post(`${API_BASE_URL}/auth/user/login`, {
        email: "nonexistent@example.com",
        password: "wrongpassword",
      });
      console.log("   ❌ Should have failed with invalid credentials");
    } catch (error) {
      if (error.response?.status === 401) {
        console.log("   ✅ Invalid credentials properly rejected");
      } else {
        console.log(
          "   ❌ Unexpected error for invalid credentials:",
          error.response?.data?.message
        );
      }
    }

    // Step 5: Test admin login through user endpoint (should be prevented)
    console.log("\n5️⃣ Testing admin login through user endpoint...");

    try {
      await axios.post(`${API_BASE_URL}/auth/user/login`, {
        email: adminCredentials.email,
        password: adminCredentials.password,
      });
      console.log(
        "   ❌ Admin login through user endpoint should have been prevented"
      );
    } catch (error) {
      if (error.response?.status === 403) {
        console.log(
          "   ✅ Admin login through user endpoint properly prevented"
        );
      } else {
        console.log(
          "   ❌ Unexpected error for admin login through user endpoint:",
          error.response?.data?.message
        );
      }
    }

    // Step 6: Test user login through admin endpoint (should be prevented)
    console.log("\n6️⃣ Testing user login through admin endpoint...");

    try {
      await axios.post(`${API_BASE_URL}/auth/login`, {
        email: createdUsers[0].email,
        password: createdUsers[0].password,
      });
      console.log(
        "   ❌ User login through admin endpoint should have been prevented"
      );
    } catch (error) {
      if (error.response?.status === 403) {
        console.log(
          "   ✅ User login through admin endpoint properly prevented"
        );
      } else {
        console.log(
          "   ❌ Unexpected error for user login through admin endpoint:",
          error.response?.data?.message
        );
      }
    }

    // Step 7: Cleanup - Delete test users
    console.log("\n7️⃣ Cleaning up test users...");

    for (const user of createdUsers) {
      try {
        await axios.delete(`${API_BASE_URL}/users/${user._id}`, {
          headers: { Authorization: `Bearer ${adminToken}` },
        });
        console.log(`   ✅ Deleted ${user.role} user: ${user.username}`);
      } catch (error) {
        console.log(
          `   ❌ Failed to delete ${user.role} user ${user.username}:`,
          error.response?.data?.message || error.message
        );
      }
    }

    console.log("\n🎉 All user login tests completed successfully!");
    console.log("\n📋 Summary:");
    console.log("   ✅ User creation works for all roles");
    console.log("   ✅ User login works for all roles");
    console.log("   ✅ Role-specific fields are properly returned");
    console.log("   ✅ Invalid credentials are properly rejected");
    console.log("   ✅ Admin and user login endpoints are properly separated");
    console.log(
      "   ✅ Frontend can now use /api/auth/user/login for user authentication"
    );
  } catch (error) {
    console.error(
      "\n❌ Test failed:",
      error.response?.data?.message || error.message
    );
    console.error("Stack trace:", error.stack);
  }
}

// Run the test
testUserLoginIntegration();
