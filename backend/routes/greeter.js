const express = require("express");
const router = express.Router();
const { authenticateToken, requireGreeter } = require("../middleware/auth");
const {
  getUnassignedStudents,
  getDriversAndSubdrivers,
  assignStudents,
  getAssignments,
  cancelAssignment,
} = require("../controllers/studentAssignmentController");

// Greeter routes (require greeter authentication)
router.use(authenticateToken, requireGreeter);

// Get unassigned students for greeter
router.get("/unassigned-students", getUnassignedStudents);

// Get available drivers and subdrivers for greeter
router.get("/drivers", getDriversAndSubdrivers);

// Assign students to driver/subdriver (greeter can do this)
router.post("/assignments", assignStudents);

// Get assignments (greeter can view all assignments)
router.get("/assignments", getAssignments);

// Cancel assignment (greeter can cancel assignments)
router.delete("/assignments/:id", cancelAssignment);

module.exports = router;
