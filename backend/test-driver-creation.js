const axios = require("axios");

const API_BASE_URL = "http://localhost:5000/api";

// Test data for admin login
const adminCredentials = {
  email: "admin@example.com",
  password: "admin123",
};

// Test data for driver creation
const driverData = {
  username: "testdriver",
  email: "driver@example.com",
  password: "driver123",
  gender: "Male",
  role: "Driver",
  driverID: "DRV001",
  vehicleNumber: "ABC123",
};

let adminToken = "";

async function testDriverCreation() {
  try {
    console.log("🚀 Testing Driver Creation Process...\n");

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

    // Step 2: Create Driver
    console.log("\n2. Creating Driver...");
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

    // Step 3: Get All Users to verify driver is in database
    console.log("\n3. Getting All Users...");
    const getUsersResponse = await axios.get(
      `${API_BASE_URL}/users?role=Driver`,
      {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      }
    );

    if (getUsersResponse.data.success) {
      console.log("✅ Users retrieved successfully");
      const drivers = getUsersResponse.data.data.users;
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
      } else {
        console.log("❌ Test driver not found in database");
      }
    } else {
      console.log("❌ Failed to get users:", getUsersResponse.data.message);
    }

    // Step 4: Test Driver Login
    console.log("\n4. Testing Driver Login...");
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
testDriverCreation();
