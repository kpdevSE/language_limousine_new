const axios = require("axios");

const API_BASE_URL = "http://localhost:5000/api";

// Test credentials for admin login
const adminCredentials = {
  email: "admin@test.com",
  password: "admin123",
};

async function testAdminManagement() {
  try {
    console.log("🔍 Testing Admin Management Functionality...\n");

    // Step 1: Admin Login
    console.log("1. Admin Login...");
    const loginResponse = await axios.post(
      `${API_BASE_URL}/auth/login`,
      adminCredentials
    );

    if (!loginResponse.data.success) {
      console.log("❌ Admin login failed:", loginResponse.data.message);
      return;
    }

    const adminToken = loginResponse.data.data.token;
    console.log("✅ Admin login successful");

    // Step 2: Test getting all admins
    console.log("\n2. Testing get all admins...");
    try {
      const adminsResponse = await axios.get(`${API_BASE_URL}/users/admins`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });

      if (adminsResponse.data.success) {
        console.log("✅ Get all admins working correctly");
        const admins = adminsResponse.data.data.admins;
        console.log(`   Found ${admins.length} admin users`);

        if (admins.length > 0) {
          console.log("\n📋 Sample admin data:");
          console.log(`   Username: ${admins[0].username}`);
          console.log(`   Email: ${admins[0].email}`);
          console.log(`   Role: ${admins[0].role}`);
          console.log(
            `   Status: ${admins[0].isActive ? "Active" : "Inactive"}`
          );
        }
      } else {
        console.log("❌ Get all admins failed:", adminsResponse.data.message);
      }
    } catch (error) {
      console.log(
        "❌ Get all admins error:",
        error.response?.data?.message || error.message
      );
    }

    // Step 3: Test adding a new admin
    console.log("\n3. Testing add new admin...");
    try {
      const newAdminData = {
        username: "testadmin",
        email: "testadmin@example.com",
        password: "testpass123",
      };

      const addAdminResponse = await axios.post(
        `${API_BASE_URL}/users/admins`,
        newAdminData,
        {
          headers: { Authorization: `Bearer ${adminToken}` },
        }
      );

      if (addAdminResponse.data.success) {
        console.log("✅ Add new admin working correctly");
        console.log(
          `   Created admin: ${addAdminResponse.data.data.admin.username}`
        );

        // Store the new admin ID for cleanup
        const newAdminId = addAdminResponse.data.data.admin._id;

        // Step 4: Test updating the admin
        console.log("\n4. Testing update admin...");
        try {
          const updateData = {
            username: "updatedtestadmin",
            email: "updatedtestadmin@example.com",
          };

          const updateResponse = await axios.put(
            `${API_BASE_URL}/users/${newAdminId}`,
            updateData,
            {
              headers: { Authorization: `Bearer ${adminToken}` },
            }
          );

          if (updateResponse.data.success) {
            console.log("✅ Update admin working correctly");
            console.log(
              `   Updated admin: ${updateResponse.data.data.user.username}`
            );
          } else {
            console.log("❌ Update admin failed:", updateResponse.data.message);
          }
        } catch (error) {
          console.log(
            "❌ Update admin error:",
            error.response?.data?.message || error.message
          );
        }

        // Step 5: Test deleting the admin
        console.log("\n5. Testing delete admin...");
        try {
          const deleteResponse = await axios.delete(
            `${API_BASE_URL}/users/${newAdminId}`,
            {
              headers: { Authorization: `Bearer ${adminToken}` },
            }
          );

          if (deleteResponse.data.success) {
            console.log("✅ Delete admin working correctly");
            console.log("   Admin deleted successfully");
          } else {
            console.log("❌ Delete admin failed:", deleteResponse.data.message);
          }
        } catch (error) {
          console.log(
            "❌ Delete admin error:",
            error.response?.data?.message || error.message
          );
        }
      } else {
        console.log("❌ Add new admin failed:", addAdminResponse.data.message);
      }
    } catch (error) {
      console.log(
        "❌ Add new admin error:",
        error.response?.data?.message || error.message
      );
    }

    console.log("\n✅ Admin management functionality test completed!");
  } catch (error) {
    console.error("❌ Test failed with error:", error.message);
    if (error.response) {
      console.error("Response data:", error.response.data);
    }
  }
}

// Run the test
testAdminManagement();
