const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const {
  uploadExcelFile,
  getUploadTemplate,
} = require("../controllers/excelUploadController");
const { authenticateToken } = require("../middleware/auth");

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, "../uploads");

    // Create uploads directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "excel-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  // Check file type
  const allowedTypes = [
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
    "application/vnd.ms-excel", // .xls
    "application/octet-stream", // Some systems send this for Excel files
  ];

  if (
    allowedTypes.includes(file.mimetype) ||
    file.originalname.endsWith(".xlsx") ||
    file.originalname.endsWith(".xls")
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only Excel files (.xlsx, .xls) are allowed"), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

// GET /api/excel-upload/template - Get upload template structure
router.get("/template", authenticateToken, getUploadTemplate);

// POST /api/excel-upload/students - Upload Excel file and process students
router.post(
  "/students",
  authenticateToken,
  upload.single("excelFile"),
  uploadExcelFile
);

// Test endpoint to check if the route is working
router.post("/test", authenticateToken, (req, res) => {
  console.log("Test endpoint hit");
  console.log("Request body:", req.body);
  console.log("Request file:", req.file);
  res.json({ success: true, message: "Test endpoint working" });
});

// Error handling middleware for multer
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "File size too large. Maximum size is 10MB.",
      });
    }
    return res.status(400).json({
      success: false,
      message: `File upload error: ${error.message}`,
    });
  }

  if (error.message.includes("Only Excel files")) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }

  next(error);
});

module.exports = router;
