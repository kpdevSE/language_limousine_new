const axios = require("axios");

const API_BASE_URL = "http://localhost:5000/api";

async function testAdminRegistration() {
  try {
    console.log("🔍 Testing Public Admin Registration...\n");

    // Test data for admin registration
    const adminData = {
      username: "testadmin",
      email: "testadmin@example.com",
      password: "testadmin123",
      firstName: "Test",
      lastName: "Admin",
      phone: "1234567890",
      gender: "Male",
      dateOfBirth: "1990-01-01",
      address: "123 Test Street",
      city: "Test City",
      state: "Test State",
      zipCode: "12345",
      country: "Test Country",
      companyName: "Test Company",
      position: "Test Position",
      department: "Test Department",
      employeeId: "EMP001",
      emergencyContact: {
        name: "Emergency Contact",
        relationship: "Spouse",
        phone: "0987654321",
        email: "emergency@example.com",
      },
    };

    console.log("📝 Testing admin registration with data:");
    console.log(JSON.stringify(adminData, null, 2));

    // Step 1: Test admin registration
    console.log("\n1️⃣ Testing admin registration...");
    const registrationResponse = await axios.post(
      `${API_BASE_URL}/users/register-admin`,
      adminData
    );

    if (registrationResponse.data.success) {
      console.log("✅ Admin registration successful!");
      console.log("Response:", registrationResponse.data.message);
      console.log("Admin data:", registrationResponse.data.data.admin);

      const newAdminId = registrationResponse.data.data.admin._id;

      // Step 2: Test that the admin is created with pending status
      console.log("\n2️⃣ Verifying admin was created with pending status...");
      const adminResponse = await axios.get(`${API_BASE_URL}/users/admins`);

      if (adminResponse.data.success) {
        const admins = adminResponse.data.data.admins;
        const newAdmin = admins.find((admin) => admin._id === newAdminId);

        if (newAdmin) {
          console.log("✅ New admin found in admins list");
          console.log("Admin status:", newAdmin.status);
          console.log("Admin isActive:", newAdmin.isActive);
        } else {
          console.log("❌ New admin not found in admins list");
        }
      } else {
        console.log("❌ Failed to fetch admins list");
      }

      // Step 3: Test duplicate registration (should fail)
      console.log("\n3️⃣ Testing duplicate registration (should fail)...");
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

      // Step 4: Test registration with missing required fields (should fail)
      console.log(
        "\n4️⃣ Testing registration with missing required fields (should fail)..."
      );
      const incompleteData = {
        username: "incompleteadmin",
        email: "incomplete@example.com",
        // Missing password, firstName, lastName, phone, gender, dateOfBirth
      };

      try {
        const incompleteResponse = await axios.post(
          `${API_BASE_URL}/users/register-admin`,
          incompleteData
        );
        console.log(
          "❌ Incomplete registration should have failed but succeeded"
        );
      } catch (error) {
        if (error.response && error.response.status === 400) {
          console.log("✅ Incomplete registration correctly failed");
          console.log("Error message:", error.response.data.message);
        } else {
          console.log(
            "❌ Unexpected error during incomplete registration test"
          );
          console.log("Error:", error.message);
        }
      }
    } else {
      console.log(
        "❌ Admin registration failed:",
        registrationResponse.data.message
      );
    }

    console.log("\n✅ Admin registration functionality test completed!");
  } catch (error) {
    console.error("❌ Test failed with error:", error.message);
    if (error.response) {
      console.error("Response status:", error.response.status);
      console.error("Response data:", error.response.data);
    }
  }
}

// Run the test
testAdminRegistration();
