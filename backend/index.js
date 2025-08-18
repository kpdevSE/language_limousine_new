const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const connectDB = require("./config/db");

const app = express();

// Connect to database
connectDB();

// Security middleware
app.use(helmet());

// CORS configuration (supports multiple origins and Vercel previews)
const allowedOrigins = (
  process.env.CLIENT_URLS ||
  process.env.CLIENT_URL ||
  "http://language-limousine-new-p3to.vercel.app"
)
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const isOriginAllowed = (origin) => {
  if (!origin) return true; // non-browser or same-origin requests
  if (allowedOrigins.includes(origin)) return true;
  try {
    const { hostname } = new URL(origin);
    // Allow Vercel preview domains, e.g., *.vercel.app
    if (hostname && hostname.endsWith(".vercel.app")) return true;
  } catch (_) {}
  return false;
};

const corsOptions = {
  origin: (origin, callback) => {
    if (isOriginAllowed(origin)) return callback(null, true);
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: "Too many requests from this IP, please try again later.",
  },
});
app.use(limiter);

// Body parser middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Import routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const studentRoutes = require("./routes/students");
const schoolStudentRoutes = require("./routes/schoolStudents");
const assignmentRoutes = require("./routes/assignments");
const driverRoutes = require("./routes/driver");
const subdriverRoutes = require("./routes/subdriver");
const greeterRoutes = require("./routes/greeter");
const schoolRoutes = require("./routes/school");
const waitingTimeRoutes = require("./routes/waitingTime");
const absentFeedbackRoutes = require("./routes/absentFeedback");
const excelUploadRoutes = require("./routes/excelUpload");

// Routes (always under /api)
app.use(`/api/auth`, authRoutes);
app.use(`/api/users`, userRoutes);
app.use(`/api/students`, studentRoutes);
app.use(`/api/school-students`, schoolStudentRoutes);
app.use(`/api/assignments`, assignmentRoutes);
app.use(`/api/driver`, driverRoutes);
app.use(`/api/subdriver`, subdriverRoutes);
app.use(`/api/greeter`, greeterRoutes);
app.use(`/api/school`, schoolRoutes);
app.use(`/api/waiting-time`, waitingTimeRoutes);
app.use(`/api/absent-feedback`, absentFeedbackRoutes);
app.use(`/api/excel-upload`, excelUploadRoutes);

// Health check route
app.get(`/api/health`, (req, res) => {
  res.json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error("Global error handler:", error);

  res.status(error.status || 500).json({
    success: false,
    message: error.message || "Internal server error",
    error: process.env.NODE_ENV === "development" ? error.stack : undefined,
  });
});

const PORT = process.env.PORT || 5000;

// Export for Vercel serverless, otherwise listen locally
if (process.env.VERCEL) {
  module.exports = app;
} else {
  app.listen(PORT, () => {
    console.log(
      `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
    );
  });
}
