const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Create a simple test server to debug the upload issue
const app = express();
const PORT = 5001;

// Configure multer for file uploads
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

// Test endpoint without authentication
app.post("/test-upload", upload.single("excelFile"), (req, res) => {
  console.log("=== TEST UPLOAD REQUEST ===");
  console.log("Headers:", req.headers);
  console.log("Body:", req.body);
  console.log("File:", req.file);
  console.log("===========================");

  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "No file uploaded",
    });
  }

  const { date, school, client } = req.body;

  if (!date || !school || !client) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields",
      received: { date, school, client },
    });
  }

  res.json({
    success: true,
    message: "Test upload successful",
    data: {
      file: req.file.originalname,
      date,
      school,
      client,
    },
  });
});

app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
  console.log(`Test endpoint: http://localhost:${PORT}/test-upload`);
});
