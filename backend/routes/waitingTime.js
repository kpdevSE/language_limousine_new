const express = require("express");
const router = express.Router();
const { authenticateToken, requireGreeter } = require("../middleware/auth");
const {
  getWaitingTimes,
  updateWaitingTime,
  updateWaitingTimeById,
  deleteWaitingTime,
  getWaitingTimeStats,
} = require("../controllers/waitingTimeController");

// Greeter routes (require greeter authentication)
router.use(authenticateToken, requireGreeter);

// Get waiting times for a specific date
router.get("/", getWaitingTimes);

// Get waiting time statistics
router.get("/stats", getWaitingTimeStats);

// Create or update waiting time
router.post("/", updateWaitingTime);

// Update specific waiting time by ID
router.put("/:id", updateWaitingTimeById);

// Delete waiting time (soft delete)
router.delete("/:id", deleteWaitingTime);

module.exports = router;
