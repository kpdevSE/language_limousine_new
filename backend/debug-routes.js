const express = require("express");
const app = express();

// Import routes
const studentRoutes = require("./routes/students");

// Add some debugging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Routes
app.use("/api/students", studentRoutes);

// Health check route
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use("*", (req, res) => {
  console.log(`404: ${req.method} ${req.path}`);
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

const PORT = 5001; // Use different port to avoid conflicts

app.listen(PORT, () => {
  console.log(`Debug server running on port ${PORT}`);
  console.log("Available routes:");
  console.log("- GET /api/health");
  console.log("- GET /api/students");
  console.log("- POST /api/students");
});
