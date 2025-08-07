const axios = require("axios");

const API_BASE_URL = "http://localhost:5000/api";

// Test data for admin login
const adminCredentials = {
  email: "admin@example.com",
  password: "admin123",
};

// Test data for driver creation (matching frontend field names)
const driverData = {
  username: "frontenddriver",
  email: "frontenddriver@example.com",
  password: "driver123",
  gender: "Male",
  role: "Driver",
  driverID: "FRONTEND001",
  vehicleNumber: "XYZ789", // This should now match the backend field name
};

let adminToken = "";

async function testFrontendIntegration() {
  try {
    console.log(
      "🚀 Testing Frontend-Backend Integration for Driver Creation...\n"
    );

    // Step 1: Admin Login
    console.log("1. Admin Login...");
    const loginResponse = await axios.post(
      `${API_BASE_URL}/auth/login`,
      adminCredentials
    );

    if (loginResponse.data.success) {
      adminToken = loginResponse.data.data.token;
      console.log("✅ Admin login successful");
      console.log("Admin Token:", adminToken.substring(0, 20) + "...");
    } else {
      console.log("❌ Admin login failed:", loginResponse.data.message);
      return;
    }

    // Step 2: Create Driver with Frontend Field Names
    console.log("\n2. Creating Driver with Frontend Field Names...");
    console.log("Driver Data:", driverData);

    const createDriverResponse = await axios.post(
      `${API_BASE_URL}/users`,
      driverData,
      {
        headers: {
          Authorization: `Bearer ${adminToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (createDriverResponse.data.success) {
      console.log("✅ Driver created successfully");
      console.log("Created Driver:", createDriverResponse.data.data.user);

      // Verify that driverID and vehicleNumber are present
      const createdDriver = createDriverResponse.data.data.user;
      if (createdDriver.driverID && createdDriver.vehicleNumber) {
        console.log("✅ DriverID and Vehicle Number saved correctly");
        console.log("DriverID:", createdDriver.driverID);
        console.log("Vehicle Number:", createdDriver.vehicleNumber);
      } else {
        console.log("❌ DriverID or Vehicle Number missing from response");
        console.log("DriverID:", createdDriver.driverID);
        console.log("Vehicle Number:", createdDriver.vehicleNumber);
      }
    } else {
      console.log(
        "❌ Driver creation failed:",
        createDriverResponse.data.message
      );
      if (createDriverResponse.data.errors) {
        console.log("Validation errors:", createDriverResponse.data.errors);
      }
    }

    // Step 3: Get Drivers by Role to verify data is saved
    console.log("\n3. Getting Drivers by Role...");
    const getDriversResponse = await axios.get(
      `${API_BASE_URL}/users/role/Driver`,
      {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      }
    );

    if (getDriversResponse.data.success) {
      console.log("✅ Drivers retrieved successfully");
      const drivers = getDriversResponse.data.data.users;
      console.log(`Found ${drivers.length} driver(s)`);

      const testDriver = drivers.find(
        (driver) => driver.email === driverData.email
      );
      if (testDriver) {
        console.log("✅ Test driver found in database");
        console.log("Driver in DB:", {
          id: testDriver._id,
          username: testDriver.username,
          email: testDriver.email,
          role: testDriver.role,
          driverID: testDriver.driverID,
          vehicleNumber: testDriver.vehicleNumber,
        });

        // Verify field names match
        if (testDriver.vehicleNumber === driverData.vehicleNumber) {
          console.log(
            "✅ Vehicle Number field name matches between frontend and backend"
          );
        } else {
          console.log("❌ Vehicle Number field name mismatch");
        }
      } else {
        console.log("❌ Test driver not found in database");
      }
    } else {
      console.log("❌ Failed to get drivers:", getDriversResponse.data.message);
    }

    // Step 4: Test Search Functionality
    console.log("\n4. Testing Search Functionality...");
    const searchResponse = await axios.get(
      `${API_BASE_URL}/users/role/Driver?search=${driverData.driverID}`,
      {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      }
    );

    if (searchResponse.data.success) {
      console.log("✅ Search functionality works");
      const searchResults = searchResponse.data.data.users;
      console.log(
        `Found ${searchResults.length} driver(s) matching search term "${driverData.driverID}"`
      );

      if (searchResults.length > 0) {
        console.log("✅ Driver found via search by driverID");
      } else {
        console.log("❌ Driver not found via search by driverID");
      }
    } else {
      console.log("❌ Search failed:", searchResponse.data.message);
    }

    // Step 5: Test Driver Login
    console.log("\n5. Testing Driver Login...");
    const driverLoginResponse = await axios.post(
      `${API_BASE_URL}/auth/user/login`,
      {
        email: driverData.email,
        password: driverData.password,
      }
    );

    if (driverLoginResponse.data.success) {
      console.log("✅ Driver login successful");
      console.log(
        "Driver Token:",
        driverLoginResponse.data.data.token.substring(0, 20) + "..."
      );
      console.log("Driver Data:", driverLoginResponse.data.data.user);
    } else {
      console.log("❌ Driver login failed:", driverLoginResponse.data.message);
    }
  } catch (error) {
    console.error("❌ Test failed with error:", error.message);
    if (error.response) {
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
    }
  }
}

// Run the test
testFrontendIntegration();
