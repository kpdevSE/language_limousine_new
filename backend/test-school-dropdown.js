const axios = require("axios");

const API_BASE_URL = "http://localhost:5000/api";

// Test credentials for admin login
const adminCredentials = {
  email: "admin@test.com",
  password: "admin123",
};

async function testSchoolDropdown() {
  try {
    console.log("🔍 Testing School Dropdown Functionality...\n");

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

    // Step 2: Create a test school
    console.log("\n2. Creating a test school...");
    const schoolData = {
      username: "TestSchool",
      email: "testschool@example.com",
      password: "school123",
      gender: "Other",
      schoolID: "SCH001",
      role: "School",
    };

    const createSchoolResponse = await axios.post(
      `${API_BASE_URL}/users`,
      schoolData,
      {
        headers: { Authorization: `Bearer ${adminToken}` },
      }
    );

    if (createSchoolResponse.data.success) {
      console.log("✅ Test school created successfully");
      console.log(`   Username: ${schoolData.username}`);
      console.log(`   School ID: ${schoolData.schoolID}`);
    } else {
      console.log(
        "❌ Failed to create test school:",
        createSchoolResponse.data.message
      );
      return;
    }

    // Step 3: Test the school dropdown API
    console.log("\n3. Testing school dropdown API...");
    const dropdownResponse = await axios.get(
      `${API_BASE_URL}/users/schools/dropdown`,
      {
        headers: { Authorization: `Bearer ${adminToken}` },
      }
    );

    if (dropdownResponse.data.success) {
      console.log("✅ School dropdown API working correctly");
      const schools = dropdownResponse.data.data.schools;
      console.log(`   Found ${schools.length} schools in dropdown`);

      if (schools.length > 0) {
        console.log("\n📋 Sample schools in dropdown:");
        schools.slice(0, 3).forEach((school, index) => {
          console.log(
            `   ${index + 1}. Value: "${school.value}", Label: "${
              school.label
            }"`
          );
        });
      }

      // Check if our test school is in the dropdown
      const testSchool = schools.find((s) => s.value === schoolData.username);
      if (testSchool) {
        console.log(`✅ Test school found in dropdown: "${testSchool.label}"`);
      } else {
        console.log("❌ Test school not found in dropdown");
      }
    } else {
      console.log(
        "❌ School dropdown API failed:",
        dropdownResponse.data.message
      );
    }

    // Step 4: Test adding a student with school dropdown
    console.log("\n4. Testing student creation with school dropdown...");
    const studentData = {
      date: "07/24/2025",
      trip: "1",
      actualArrivalTime: "03:00:00",
      arrivalTime: "AM 695",
      flight: "I",
      dOrI: "D",
      mOrF: "M",
      studentNo: "STU001",
      studentGivenName: "John",
      studentFamilyName: "Doe",
      hostGivenName: "Jane",
      hostFamilyName: "Smith",
      phone: "123-456-7890",
      address: "123 Main St",
      city: "Vancouver",
      school: schoolData.username, // Using the school username from dropdown
      client: "client1",
    };

    const createStudentResponse = await axios.post(
      `${API_BASE_URL}/students`,
      studentData,
      {
        headers: { Authorization: `Bearer ${adminToken}` },
      }
    );

    if (createStudentResponse.data.success) {
      console.log("✅ Student created successfully with school from dropdown");
      console.log(
        `   Student: ${studentData.studentGivenName} ${studentData.studentFamilyName}`
      );
      console.log(`   School: ${studentData.school}`);
    } else {
      console.log(
        "❌ Failed to create student:",
        createStudentResponse.data.message
      );
    }

    console.log("\n✅ School dropdown functionality test completed!");
  } catch (error) {
    console.error("❌ Test failed with error:", error.message);
    if (error.response) {
      console.error("Response data:", error.response.data);
    }
  }
}

// Run the test
testSchoolDropdown();
