const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");

// Test configuration
const TEST_TOKEN = "your-token-here"; // Replace with your actual token

async function testUploadEndpoint() {
  console.log("🧪 Testing Upload Endpoint...\n");

  if (TEST_TOKEN === "your-token-here") {
    console.log("❌ Please replace TEST_TOKEN with your actual token");
    return;
  }

  // Test 1: Test with missing file
  console.log("1. Testing with missing file...");
  try {
    const formData = new FormData();
    formData.append("date", "07/24/2025");
    formData.append("school", "ILSC");
    formData.append("client", "ILSC");

    const response = await axios.post(
      "http://localhost:5000/api/excel-upload/students",
      formData,
      {
        headers: {
          Authorization: `Bearer ${TEST_TOKEN}`,
          ...formData.getHeaders(),
        },
      }
    );
    console.log("❌ Should have failed with missing file");
  } catch (error) {
    if (
      error.response?.status === 400 &&
      error.response?.data?.message?.includes("No file uploaded")
    ) {
      console.log("✅ Correctly rejected missing file");
    } else {
      console.log(
        "❌ Unexpected error:",
        error.response?.status,
        error.response?.data
      );
    }
  }

  // Test 2: Test with missing form fields
  console.log("\n2. Testing with missing form fields...");
  try {
    const formData = new FormData();
    // Create a dummy file
    const dummyFile = Buffer.from("dummy content");
    formData.append("excelFile", dummyFile, { filename: "test.xlsx" });
    // Don't append date, school, or client

    const response = await axios.post(
      "http://localhost:5000/api/excel-upload/students",
      formData,
      {
        headers: {
          Authorization: `Bearer ${TEST_TOKEN}`,
          ...formData.getHeaders(),
        },
      }
    );
    console.log("❌ Should have failed with missing fields");
  } catch (error) {
    if (
      error.response?.status === 400 &&
      error.response?.data?.message?.includes("required")
    ) {
      console.log("✅ Correctly rejected missing form fields");
    } else {
      console.log(
        "❌ Unexpected error:",
        error.response?.status,
        error.response?.data
      );
    }
  }

  // Test 3: Test with valid data (but invalid Excel file)
  console.log("\n3. Testing with valid form data but invalid Excel file...");
  try {
    const formData = new FormData();
    const dummyFile = Buffer.from("This is not an Excel file");
    formData.append("excelFile", dummyFile, { filename: "test.xlsx" });
    formData.append("date", "07/24/2025");
    formData.append("school", "ILSC");
    formData.append("client", "ILSC");

    const response = await axios.post(
      "http://localhost:5000/api/excel-upload/students",
      formData,
      {
        headers: {
          Authorization: `Bearer ${TEST_TOKEN}`,
          ...formData.getHeaders(),
        },
      }
    );
    console.log("❌ Should have failed with invalid Excel file");
  } catch (error) {
    if (error.response?.status === 400 || error.response?.status === 500) {
      console.log("✅ Correctly rejected invalid Excel file");
      console.log(
        "Error:",
        error.response?.data?.message || "Excel parsing error"
      );
    } else {
      console.log(
        "❌ Unexpected error:",
        error.response?.status,
        error.response?.data
      );
    }
  }

  console.log("\n📋 Test Summary:");
  console.log("- If all tests passed, the endpoint is working correctly");
  console.log("- The issue is likely with your specific request data");
  console.log(
    "- Check the browser Network tab for the exact request being sent"
  );
}

testUploadEndpoint().catch(console.error);
