const StudentAssignment = require("../models/StudentAssignment");
const Student = require("../models/Student");
const User = require("../models/User");

// POST /api/assignments - Assign students to driver/subdriver
const assignStudents = async (req, res) => {
  try {
    const { studentIds, driverId, subdriverId, notes } = req.body;

    // Validate input
    if (!studentIds || !Array.isArray(studentIds) || studentIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Student IDs array is required and must not be empty",
      });
    }

    if (!driverId && !subdriverId) {
      return res.status(400).json({
        success: false,
        message: "Either driverId or subdriverId must be provided",
      });
    }

    if (driverId && subdriverId) {
      return res.status(400).json({
        success: false,
        message: "Cannot assign to both driver and subdriver simultaneously",
      });
    }

    // Validate driver/subdriver exists and has correct role
    let assignedTo = null;
    if (driverId) {
      assignedTo = await User.findOne({
        _id: driverId,
        role: "Driver",
        isActive: true,
      });
      if (!assignedTo) {
        return res.status(404).json({
          success: false,
          message: "Driver not found or inactive",
        });
      }
    } else if (subdriverId) {
      assignedTo = await User.findOne({
        _id: subdriverId,
        role: "Subdriver",
        isActive: true,
      });
      if (!assignedTo) {
        return res.status(404).json({
          success: false,
          message: "Subdriver not found or inactive",
        });
      }
    }

    // Validate all students exist and are not already assigned
    const students = await Student.find({
      _id: { $in: studentIds },
      isActive: true,
    });

    if (students.length !== studentIds.length) {
      return res.status(404).json({
        success: false,
        message: "One or more students not found",
      });
    }

    // Check for existing assignments
    const existingAssignments = await StudentAssignment.find({
      studentId: { $in: studentIds },
      isActive: true,
    });

    if (existingAssignments.length > 0) {
      const assignedStudentIds = existingAssignments.map((a) =>
        a.studentId.toString()
      );
      return res.status(400).json({
        success: false,
        message: `Students already assigned: ${assignedStudentIds.join(", ")}`,
      });
    }

    // Create assignments
    const assignments = studentIds.map((studentId) => ({
      studentId,
      driverId: driverId || null,
      subdriverId: subdriverId || null,
      assignedBy: req.user._id,
      notes: notes || "",
    }));

    const createdAssignments = await StudentAssignment.insertMany(assignments);

    // Populate the created assignments with student and driver/subdriver details
    const populatedAssignments = await StudentAssignment.find({
      _id: { $in: createdAssignments.map((a) => a._id) },
    })
      .populate(
        "studentId",
        "studentNo studentGivenName studentFamilyName arrivalTime flight"
      )
      .populate("driverId", "username driverID vehicleNumber")
      .populate("subdriverId", "username subdriverID vehicleNumber")
      .populate("assignedBy", "username");

    return res.status(201).json({
      success: true,
      message: `${studentIds.length} student(s) assigned successfully`,
      data: { assignments: populatedAssignments },
    });
  } catch (err) {
    console.error("assignStudents error", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// GET /api/assignments - Get all assignments with filters
const getAssignments = async (req, res) => {
  try {
    const page = parseInt(req.query.page || "1", 10);
    const limit = parseInt(req.query.limit || "10", 10);
    const driverId = req.query.driverId;
    const subdriverId = req.query.subdriverId;
    const status = req.query.status;
    const date = req.query.date;

    const query = { isActive: true };

    if (driverId) query.driverId = driverId;
    if (subdriverId) query.subdriverId = subdriverId;
    if (status) query.status = status;
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      query.assignmentDate = { $gte: startDate, $lt: endDate };
    }

    const skip = (page - 1) * limit;
    const [assignments, total] = await Promise.all([
      StudentAssignment.find(query)
        .populate(
          "studentId",
          "studentNo studentGivenName studentFamilyName arrivalTime flight"
        )
        .populate("driverId", "username driverID vehicleNumber")
        .populate("subdriverId", "username subdriverID vehicleNumber")
        .populate("assignedBy", "username")
        .sort({ assignmentDate: -1 })
        .skip(skip)
        .limit(limit),
      StudentAssignment.countDocuments(query),
    ]);

    return res.json({
      success: true,
      data: {
        assignments,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalAssignments: total,
          limit,
        },
      },
    });
  } catch (err) {
    console.error("getAssignments error", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// GET /api/assignments/unassigned-students - Get students not yet assigned
const getUnassignedStudents = async (req, res) => {
  try {
    const page = parseInt(req.query.page || "1", 10);
    const limit = parseInt(req.query.limit || "10", 10);
    const search = req.query.search || "";
    const date = req.query.date;

    // Get all assigned student IDs
    const assignedStudentIds = await StudentAssignment.find({
      isActive: true,
    }).distinct("studentId");

    // Build query for unassigned students
    const query = {
      _id: { $nin: assignedStudentIds },
      isActive: true,
    };

    if (date) {
      query.date = date;
    }

    if (search) {
      query.$or = [
        { studentNo: { $regex: search, $options: "i" } },
        { studentGivenName: { $regex: search, $options: "i" } },
        { studentFamilyName: { $regex: search, $options: "i" } },
        { flight: { $regex: search, $options: "i" } },
        { hostGivenName: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;
    const [students, total] = await Promise.all([
      Student.find(query).sort({ arrivalTime: 1 }).skip(skip).limit(limit),
      Student.countDocuments(query),
    ]);

    return res.json({
      success: true,
      data: {
        students,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalStudents: total,
          limit,
        },
      },
    });
  } catch (err) {
    console.error("getUnassignedStudents error", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// GET /api/assignments/drivers - Get all drivers and subdrivers
const getDriversAndSubdrivers = async (req, res) => {
  try {
    const [drivers, subdrivers] = await Promise.all([
      User.find({ role: "Driver", isActive: true })
        .select("username driverID vehicleNumber")
        .sort({ username: 1 }),
      User.find({ role: "Subdriver", isActive: true })
        .select("username subdriverID vehicleNumber status")
        .sort({ username: 1 }),
    ]);

    return res.json({
      success: true,
      data: {
        drivers,
        subdrivers,
      },
    });
  } catch (err) {
    console.error("getDriversAndSubdrivers error", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// PUT /api/assignments/:assignmentId - Update assignment status
const updateAssignment = async (req, res) => {
  try {
    const { status, notes } = req.body;
    const assignmentId = req.params.assignmentId;

    const assignment = await StudentAssignment.findOne({
      _id: assignmentId,
      isActive: true,
    });

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "Assignment not found",
      });
    }

    if (status && !["Assigned", "Completed", "Cancelled"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Must be Assigned, Completed, or Cancelled",
      });
    }

    if (status) assignment.status = status;
    if (notes !== undefined) assignment.notes = notes;

    await assignment.save();

    const populatedAssignment = await StudentAssignment.findById(assignmentId)
      .populate(
        "studentId",
        "studentNo studentGivenName studentFamilyName arrivalTime flight"
      )
      .populate("driverId", "username driverID vehicleNumber")
      .populate("subdriverId", "username subdriverID vehicleNumber")
      .populate("assignedBy", "username");

    return res.json({
      success: true,
      message: "Assignment updated successfully",
      data: { assignment: populatedAssignment },
    });
  } catch (err) {
    console.error("updateAssignment error", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// DELETE /api/assignments/:assignmentId - Cancel assignment (soft delete)
const cancelAssignment = async (req, res) => {
  try {
    const assignmentId = req.params.assignmentId;

    const assignment = await StudentAssignment.findOne({
      _id: assignmentId,
      isActive: true,
    });

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "Assignment not found",
      });
    }

    assignment.isActive = false;
    assignment.status = "Cancelled";
    await assignment.save();

    return res.json({
      success: true,
      message: "Assignment cancelled successfully",
    });
  } catch (err) {
    console.error("cancelAssignment error", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// GET /api/assignments/driver/my-assignments - Get assignments for logged-in driver
const getDriverAssignments = async (req, res) => {
  try {
    const driverId = req.user._id;
    const page = parseInt(req.query.page || "1", 10);
    const limit = parseInt(req.query.limit || "10", 10);
    const date = req.query.date || new Date().toISOString().split("T")[0]; // Today by default

    // Build date filter
    const startDate = new Date(date);
    const endDate = new Date(date);
    endDate.setDate(endDate.getDate() + 1);

    const query = {
      $or: [{ driverId: driverId }, { subdriverId: driverId }],
      isActive: true,
      assignmentDate: { $gte: startDate, $lt: endDate },
    };

    const skip = (page - 1) * limit;
    const [assignments, total] = await Promise.all([
      StudentAssignment.find(query)
        .populate(
          "studentId",
          "studentNo studentGivenName studentFamilyName arrivalTime flight dOrI hostGivenName phone"
        )
        .populate("driverId", "username driverID vehicleNumber")
        .populate("subdriverId", "username subdriverID vehicleNumber")
        .sort({ assignmentDate: -1 })
        .skip(skip)
        .limit(limit),
      StudentAssignment.countDocuments(query),
    ]);

    return res.json({
      success: true,
      data: {
        assignments,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalAssignments: total,
          limit,
        },
      },
    });
  } catch (err) {
    console.error("getDriverAssignments error", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// GET /api/driver/completed-tasks - Get completed assignments for logged-in driver
const getDriverCompletedTasks = async (req, res) => {
  try {
    const driverId = req.user._id;
    const page = parseInt(req.query.page || "1", 10);
    const limit = parseInt(req.query.limit || "10", 10);
    const date = req.query.date || new Date().toISOString().split("T")[0]; // Today by default

    // Build date filter
    const startDate = new Date(date);
    const endDate = new Date(date);
    endDate.setDate(endDate.getDate() + 1);

    const query = {
      $or: [{ driverId: driverId }, { subdriverId: driverId }],
      isActive: true,
      assignmentDate: { $gte: startDate, $lt: endDate },
      $or: [{ pickupStatus: "Completed" }, { deliveryStatus: "Completed" }],
    };

    const skip = (page - 1) * limit;
    const [assignments, total] = await Promise.all([
      StudentAssignment.find(query)
        .populate(
          "studentId",
          "studentNo studentGivenName studentFamilyName arrivalTime flight dOrI hostGivenName phone"
        )
        .populate("driverId", "username driverID vehicleNumber")
        .populate("subdriverId", "username subdriverID vehicleNumber")
        .sort({ assignmentDate: -1 })
        .skip(skip)
        .limit(limit),
      StudentAssignment.countDocuments(query),
    ]);

    return res.json({
      success: true,
      data: {
        assignments,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalAssignments: total,
          limit,
        },
      },
    });
  } catch (err) {
    console.error("getDriverCompletedTasks error", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// PUT /api/assignments/driver/update-pickup - Update pickup status
const updatePickupStatus = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const { pickupStatus } = req.body;
    const driverId = req.user._id;

    if (!["Pending", "Completed"].includes(pickupStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid pickup status. Must be Pending or Completed",
      });
    }

    const assignment = await StudentAssignment.findOne({
      _id: assignmentId,
      $or: [{ driverId: driverId }, { subdriverId: driverId }],
      isActive: true,
    });

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message:
          "Assignment not found or you don't have permission to update it",
      });
    }

    assignment.pickupStatus = pickupStatus;
    if (pickupStatus === "Completed") {
      assignment.pickupTime = new Date();
    }
    await assignment.save();

    const populatedAssignment = await StudentAssignment.findById(assignmentId)
      .populate(
        "studentId",
        "studentNo studentGivenName studentFamilyName arrivalTime flight"
      )
      .populate("driverId", "username driverID vehicleNumber")
      .populate("subdriverId", "username subdriverID vehicleNumber");

    return res.json({
      success: true,
      message: "Pickup status updated successfully",
      data: { assignment: populatedAssignment },
    });
  } catch (err) {
    console.error("updatePickupStatus error", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// PUT /api/assignments/driver/update-delivery - Update delivery status
const updateDeliveryStatus = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const { deliveryStatus } = req.body;
    const driverId = req.user._id;

    if (!["Pending", "Completed"].includes(deliveryStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid delivery status. Must be Pending or Completed",
      });
    }

    const assignment = await StudentAssignment.findOne({
      _id: assignmentId,
      $or: [{ driverId: driverId }, { subdriverId: driverId }],
      isActive: true,
    });

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message:
          "Assignment not found or you don't have permission to update it",
      });
    }

    assignment.deliveryStatus = deliveryStatus;
    if (deliveryStatus === "Completed") {
      assignment.deliveryTime = new Date();
    }
    await assignment.save();

    const populatedAssignment = await StudentAssignment.findById(assignmentId)
      .populate(
        "studentId",
        "studentNo studentGivenName studentFamilyName arrivalTime flight"
      )
      .populate("driverId", "username driverID vehicleNumber")
      .populate("subdriverId", "username subdriverID vehicleNumber");

    return res.json({
      success: true,
      message: "Delivery status updated successfully",
      data: { assignment: populatedAssignment },
    });
  } catch (err) {
    console.error("updateDeliveryStatus error", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  assignStudents,
  getAssignments,
  getUnassignedStudents,
  getDriversAndSubdrivers,
  updateAssignment,
  cancelAssignment,
  getDriverAssignments,
  getDriverCompletedTasks,
  updatePickupStatus,
  updateDeliveryStatus,
};
