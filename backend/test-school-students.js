const axios = require("axios");

const API_BASE_URL = "http://localhost:5000/api";

// Test credentials for school login
const schoolCredentials = {
  email: "schooltest@gmail.com",
  password: "school123",
};

async function testSchoolStudents() {
  try {
    console.log("🔍 Testing School Students Endpoint...\n");

    // Step 1: School Login
    console.log("1. School Login...");
    const loginResponse = await axios.post(
      `${API_BASE_URL}/auth/login`,
      schoolCredentials
    );

    if (!loginResponse.data.success) {
      console.log("❌ School login failed:", loginResponse.data.message);
      return;
    }

    const schoolToken = loginResponse.data.data.token;
    const schoolUsername = loginResponse.data.data.user.username;
    console.log("✅ School login successful");
    console.log(`   Username: ${schoolUsername}`);

    // Step 2: Test the school students API (all students)
    console.log("\n2. Testing school students API (all students)...");
    const allStudentsResponse = await axios.get(
      `${API_BASE_URL}/school-students/${schoolUsername}`,
      {
        headers: { Authorization: `Bearer ${schoolToken}` },
        params: {
          page: 1,
          limit: 10,
        },
      }
    );

    if (allStudentsResponse.data.success) {
      console.log("✅ School students API (all students) working correctly");
      const students = allStudentsResponse.data.data.students;
      const pagination = allStudentsResponse.data.data.pagination;

      console.log(`   Found ${students.length} students`);
      console.log(`   Total students: ${pagination.totalStudents}`);
      console.log(`   Total pages: ${pagination.totalPages}`);
      console.log(`   Current page: ${pagination.currentPage}`);

      if (students.length > 0) {
        console.log("\n📋 Sample student data:");
        console.log(
          `   Student 1: ${students[0].studentGivenName} ${students[0].studentFamilyName}`
        );
        console.log(`   Student No: ${students[0].studentNo}`);
        console.log(`   School: ${students[0].school}`);
        console.log(`   Date: ${students[0].date}`);
      }
    } else {
      console.log(
        "❌ School students API (all students) failed:",
        allStudentsResponse.data.message
      );
    }

    // Step 3: Test the school students API with date filter
    console.log("\n3. Testing school students API with date filter...");
    const studentsResponse = await axios.get(
      `${API_BASE_URL}/school-students/${schoolUsername}`,
      {
        headers: { Authorization: `Bearer ${schoolToken}` },
        params: {
          page: 1,
          limit: 10,
          date: "08/04/2025",
        },
      }
    );

    if (studentsResponse.data.success) {
      console.log("✅ School students API with date filter working correctly");
      const students = studentsResponse.data.data.students;
      const pagination = studentsResponse.data.data.pagination;

      console.log(`   Found ${students.length} students for date 08/04/2025`);
      console.log(
        `   Total students for this date: ${pagination.totalStudents}`
      );
      console.log(`   Total pages: ${pagination.totalPages}`);
      console.log(`   Current page: ${pagination.currentPage}`);

      if (students.length > 0) {
        console.log("\n📋 Sample student data for date:");
        console.log(
          `   Student 1: ${students[0].studentGivenName} ${students[0].studentFamilyName}`
        );
        console.log(`   Student No: ${students[0].studentNo}`);
        console.log(`   School: ${students[0].school}`);
        console.log(`   Date: ${students[0].date}`);
      }
    } else {
      console.log(
        "❌ School students API with date filter failed:",
        studentsResponse.data.message
      );
    }

    // Step 4: Test with search parameter
    console.log("\n4. Testing school students API with search...");
    const searchResponse = await axios.get(
      `${API_BASE_URL}/school-students/${schoolUsername}`,
      {
        headers: { Authorization: `Bearer ${schoolToken}` },
        params: {
          page: 1,
          limit: 10,
          search: "test",
        },
      }
    );

    if (searchResponse.data.success) {
      console.log("✅ School students search API working correctly");
      const searchResults = searchResponse.data.data.students;
      console.log(`   Search results: ${searchResults.length} students found`);
    } else {
      console.log(
        "❌ School students search API failed:",
        searchResponse.data.message
      );
    }

    console.log("\n✅ School students functionality test completed!");
  } catch (error) {
    console.error("❌ Test failed with error:", error.message);
    if (error.response) {
      console.error("Response data:", error.response.data);
    }
  }
}

// Run the test
testSchoolStudents();
