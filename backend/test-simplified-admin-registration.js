const axios = require("axios");

const API_BASE_URL = "http://localhost:5000/api";

async function testSimplifiedAdminRegistration() {
  console.log("🧪 Testing Simplified Admin Registration...\n");

  try {
    // Test data for simplified admin registration
    const adminData = {
      username: "testadmin" + Date.now(),
      email: "testadmin" + Date.now() + "@example.com",
      password: "password123",
    };

    console.log("1️⃣ Testing simplified admin registration...");
    console.log("Registration data:", adminData);

    const registrationResponse = await axios.post(
      `${API_BASE_URL}/users/register-admin`,
      adminData
    );

    if (registrationResponse.data.success) {
      console.log("✅ Admin registration successful!");
      console.log("Response:", registrationResponse.data.message);
      console.log("Admin data:", registrationResponse.data.data.admin);

      const newAdminId = registrationResponse.data.data.admin._id;

      // Step 2: Test that the admin is created with active status
      console.log("\n2️⃣ Verifying admin was created with active status...");
      const adminResponse = await axios.get(`${API_BASE_URL}/users/admins`);

      if (adminResponse.data.success) {
        const admins = adminResponse.data.data.admins;
        const newAdmin = admins.find((admin) => admin._id === newAdminId);

        if (newAdmin) {
          console.log("✅ New admin found in admins list");
          console.log("Admin status:", newAdmin.status);
          console.log("Admin isActive:", newAdmin.isActive);

          if (newAdmin.isActive && newAdmin.status === "Active") {
            console.log(
              "✅ Admin is created as active and can log in immediately"
            );
          } else {
            console.log("❌ Admin is not active or status is not Active");
          }
        } else {
          console.log("❌ New admin not found in admins list");
        }
      } else {
        console.log("❌ Failed to fetch admins list");
      }

      // Step 3: Test login with the new admin account
      console.log("\n3️⃣ Testing login with new admin account...");
      try {
        const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
          email: adminData.email,
          password: adminData.password,
        });

        if (loginResponse.data.success) {
          console.log("✅ Admin login successful!");
          console.log("Login response:", loginResponse.data.message);
          console.log("Token received:", !!loginResponse.data.data.token);
        } else {
          console.log("❌ Admin login failed");
          console.log("Login response:", loginResponse.data);
        }
      } catch (loginError) {
        console.log("❌ Admin login failed with error");
        console.log("Error:", loginError.response?.data || loginError.message);
      }

      // Step 4: Test duplicate registration (should fail)
      console.log("\n4️⃣ Testing duplicate registration (should fail)...");
      try {
        const duplicateResponse = await axios.post(
          `${API_BASE_URL}/users/register-admin`,
          adminData
        );
        console.log(
          "❌ Duplicate registration should have failed but succeeded"
        );
      } catch (error) {
        if (error.response && error.response.status === 400) {
          console.log("✅ Duplicate registration correctly failed");
          console.log("Error message:", error.response.data.message);
        } else {
          console.log("❌ Unexpected error during duplicate registration test");
          console.log("Error:", error.message);
        }
      }

      // Step 5: Test registration with missing required fields (should fail)
      console.log(
        "\n5️⃣ Testing registration with missing fields (should fail)..."
      );

      // Test missing username
      try {
        const missingUsernameResponse = await axios.post(
          `${API_BASE_URL}/users/register-admin`,
          {
            email: "test@example.com",
            password: "password123",
          }
        );
        console.log("❌ Missing username should have failed but succeeded");
      } catch (error) {
        if (error.response && error.response.status === 400) {
          console.log("✅ Missing username correctly failed");
          console.log("Error message:", error.response.data.message);
        } else {
          console.log("❌ Unexpected error for missing username");
          console.log("Error:", error.message);
        }
      }

      // Test missing email
      try {
        const missingEmailResponse = await axios.post(
          `${API_BASE_URL}/users/register-admin`,
          {
            username: "testuser",
            password: "password123",
          }
        );
        console.log("❌ Missing email should have failed but succeeded");
      } catch (error) {
        if (error.response && error.response.status === 400) {
          console.log("✅ Missing email correctly failed");
          console.log("Error message:", error.response.data.message);
        } else {
          console.log("❌ Unexpected error for missing email");
          console.log("Error:", error.message);
        }
      }

      // Test missing password
      try {
        const missingPasswordResponse = await axios.post(
          `${API_BASE_URL}/users/register-admin`,
          {
            username: "testuser",
            email: "test@example.com",
          }
        );
        console.log("❌ Missing password should have failed but succeeded");
      } catch (error) {
        if (error.response && error.response.status === 400) {
          console.log("✅ Missing password correctly failed");
          console.log("Error message:", error.response.data.message);
        } else {
          console.log("❌ Unexpected error for missing password");
          console.log("Error:", error.message);
        }
      }
    } else {
      console.log("❌ Admin registration failed");
      console.log("Response:", registrationResponse.data);
    }
  } catch (error) {
    console.error("❌ Test failed with error:", error.message);
    if (error.response) {
      console.error("Response data:", error.response.data);
    }
  }
}

// Run the test
testSimplifiedAdminRegistration();
