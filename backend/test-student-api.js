const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

// Test data
const testStudent = {
  date: "07/24/2025",
  trip: "1",
  actualArrivalTime: "03:00:00",
  arrivalTime: "AM 695",
  flight: "I",
  dOrI: "D",
  mOrF: "M",
  studentNo: "TEST001",
  studentGivenName: "John",
  studentFamilyName: "Doe",
  hostGivenName: "Jane",
  hostFamilyName: "Smith",
  phone: "123-456-7890",
  address: "123 Main St",
  city: "Vancouver",
  school: "UBC",
  client: "client1"
};

// You'll need to get a valid admin token first
const ADMIN_TOKEN = 'YOUR_ADMIN_TOKEN_HERE'; // Replace with actual token

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${ADMIN_TOKEN}`
  }
});

async function testStudentAPI() {
  console.log('🧪 Testing Student API...\n');

  try {
    // Test 1: Add a new student
    console.log('1. Testing Add Student...');
    const addResponse = await apiClient.post('/students', testStudent);
    console.log('✅ Add Student Response:', addResponse.data);
    
    const studentId = addResponse.data.data.student._id;
    console.log('Student ID:', studentId);

    // Test 2: Get all students
    console.log('\n2. Testing Get All Students...');
    const getAllResponse = await apiClient.get('/students');
    console.log('✅ Get All Students Response:', getAllResponse.data);

    // Test 3: Get student by ID
    console.log('\n3. Testing Get Student by ID...');
    const getByIdResponse = await apiClient.get(`/students/${studentId}`);
    console.log('✅ Get Student by ID Response:', getByIdResponse.data);

    // Test 4: Update student
    console.log('\n4. Testing Update Student...');
    const updateData = {
      studentGivenName: "Jane",
      studentFamilyName: "Johnson"
    };
    const updateResponse = await apiClient.put(`/students/${studentId}`, updateData);
    console.log('✅ Update Student Response:', updateResponse.data);

    // Test 5: Get student statistics
    console.log('\n5. Testing Get Student Statistics...');
    const statsResponse = await apiClient.get('/students/stats');
    console.log('✅ Get Student Statistics Response:', statsResponse.data);

    // Test 6: Search students
    console.log('\n6. Testing Search Students...');
    const searchResponse = await apiClient.get('/students?search=TEST001');
    console.log('✅ Search Students Response:', searchResponse.data);

    // Test 7: Delete student
    console.log('\n7. Testing Delete Student...');
    const deleteResponse = await apiClient.delete(`/students/${studentId}`);
    console.log('✅ Delete Student Response:', deleteResponse.data);

    console.log('\n🎉 All tests completed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

// Test validation errors
async function testValidationErrors() {
  console.log('\n🧪 Testing Validation Errors...\n');

  try {
    // Test invalid dOrI
    console.log('1. Testing invalid dOrI...');
    const invalidStudent = { ...testStudent, dOrI: 'X' };
    await apiClient.post('/students', invalidStudent);
  } catch (error) {
    console.log('✅ Expected validation error for dOrI:', error.response.data.message);
  }

  try {
    // Test invalid mOrF
    console.log('\n2. Testing invalid mOrF...');
    const invalidStudent = { ...testStudent, mOrF: 'X' };
    await apiClient.post('/students', invalidStudent);
  } catch (error) {
    console.log('✅ Expected validation error for mOrF:', error.response.data.message);
  }

  try {
    // Test missing required fields
    console.log('\n3. Testing missing required fields...');
    const invalidStudent = { date: '07/24/2025' }; // Missing other required fields
    await apiClient.post('/students', invalidStudent);
  } catch (error) {
    console.log('✅ Expected validation error for missing fields:', error.response.data.message);
  }

  console.log('\n🎉 Validation tests completed!');
}

// Run tests
async function runTests() {
  console.log('🚀 Starting Student API Tests...\n');
  
  if (ADMIN_TOKEN === 'YOUR_ADMIN_TOKEN_HERE') {
    console.log('⚠️  Please set a valid ADMIN_TOKEN in the test file first!');
    console.log('   You can get a token by logging in as admin and checking the browser storage.');
    return;
  }

  await testStudentAPI();
  await testValidationErrors();
}

runTests();
