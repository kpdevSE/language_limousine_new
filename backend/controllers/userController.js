const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || "your-secret-key", {
    expiresIn: "7d",
  });
};

// Add new user (Admin only)
const addUser = async (req, res) => {
  try {
    const { username, email, password, gender, role, greeterID } = req.body;

    // Validation
    if (!username || !email || !password || !gender || !role) {
      return res.status(400).json({
        success: false,
        message: "Username, email, password, gender, and role are required",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email or username already exists",
      });
    }

    // Validate role
    const validRoles = ["Greeter", "Driver", "Subdriver", "School"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid role. Must be one of: Greeter, Driver, Subdriver, School",
      });
    }

    // Validate gender
    const validGenders = ["Male", "Female", "Other"];
    if (!validGenders.includes(gender)) {
      return res.status(400).json({
        success: false,
        message: "Invalid gender. Must be one of: Male, Female, Other",
      });
    }

    // Validate greeterID if role is Greeter
    if (role === "Greeter" && !greeterID) {
      return res.status(400).json({
        success: false,
        message: "GreeterID is required for Greeter role",
      });
    }

    // Check if greeterID already exists for Greeter role
    if (role === "Greeter" && greeterID) {
      const existingGreeter = await User.findOne({ greeterID });
      if (existingGreeter) {
        return res.status(400).json({
          success: false,
          message: "GreeterID already exists",
        });
      }
    }

    // Create new user
    const newUser = new User({
      username,
      email,
      password,
      gender,
      role,
      greeterID: role === "Greeter" ? greeterID : undefined,
      createdBy: req.user._id, // Admin who created the user
    });

    await newUser.save();

    // Return success response (without token for admin-created users)
    res.status(201).json({
      success: true,
      message: `${role} user added successfully`,
      data: {
        user: {
          id: newUser._id,
          username: newUser.username,
          email: newUser.email,
          role: newUser.role,
          gender: newUser.gender,
          greeterID: newUser.greeterID,
          isActive: newUser.isActive,
          createdAt: newUser.createdAt,
        },
      },
    });
  } catch (error) {
    console.error("Add user error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Get all users (Admin only)
const getAllUsers = async (req, res) => {
  try {
    const { role, page = 1, limit = 10, search } = req.query;

    // Build query
    const query = {};

    // Filter by role if provided
    if (role && ["Greeter", "Driver", "Subdriver", "School"].includes(role)) {
      query.role = role;
    }

    // Search functionality
    if (search) {
      query.$or = [
        { username: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { greeterID: { $regex: search, $options: "i" } },
      ];
    }

    // Pagination
    const skip = (page - 1) * limit;

    // Get users with pagination
    const users = await User.find(query)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate("createdBy", "username email");

    // Get total count
    const totalUsers = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        users,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalUsers / limit),
          totalUsers,
          limit: parseInt(limit),
        },
      },
    });
  } catch (error) {
    console.error("Get all users error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Get user by ID (Admin only)
const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId)
      .select("-password")
      .populate("createdBy", "username email");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        user,
      },
    });
  } catch (error) {
    console.error("Get user by ID error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Update user (Admin only)
const updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { username, email, gender, role, greeterID, isActive } = req.body;

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Build updates object
    const updates = {};
    if (username) updates.username = username;
    if (email) updates.email = email;
    if (gender) updates.gender = gender;
    if (role) updates.role = role;
    if (greeterID !== undefined) updates.greeterID = greeterID;
    if (isActive !== undefined) updates.isActive = isActive;

    // Validate role if being updated
    if (role && !["Greeter", "Driver", "Subdriver", "School"].includes(role)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid role. Must be one of: Greeter, Driver, Subdriver, School",
      });
    }

    // Validate gender if being updated
    if (gender && !["Male", "Female", "Other"].includes(gender)) {
      return res.status(400).json({
        success: false,
        message: "Invalid gender. Must be one of: Male, Female, Other",
      });
    }

    // Check for duplicate email/username if being updated
    if (email || username) {
      const existingUser = await User.findOne({
        $or: [
          { email: email || user.email },
          { username: username || user.username },
        ],
        _id: { $ne: userId },
      });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "User with this email or username already exists",
        });
      }
    }

    // Check for duplicate greeterID if being updated
    if (greeterID && greeterID !== user.greeterID) {
      const existingGreeter = await User.findOne({ greeterID });
      if (existingGreeter) {
        return res.status(400).json({
          success: false,
          message: "GreeterID already exists",
        });
      }
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true, runValidators: true }
    )
      .select("-password")
      .populate("createdBy", "username email");

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: {
        user: updatedUser,
      },
    });
  } catch (error) {
    console.error("Update user error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Delete user (Admin only)
const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Prevent admin from deleting themselves
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot delete your own account",
      });
    }

    // Delete user
    await User.findByIdAndDelete(userId);

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Get users by role (Admin only)
const getUsersByRole = async (req, res) => {
  try {
    const { role } = req.params;
    const { page = 1, limit = 10, search } = req.query;

    // Validate role
    const validRoles = ["Greeter", "Driver", "Subdriver", "School"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid role. Must be one of: Greeter, Driver, Subdriver, School",
      });
    }

    // Build query
    const query = { role };

    // Search functionality
    if (search) {
      query.$or = [
        { username: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { greeterID: { $regex: search, $options: "i" } },
      ];
    }

    // Pagination
    const skip = (page - 1) * limit;

    // Get users with pagination
    const users = await User.find(query)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate("createdBy", "username email");

    // Get total count
    const totalUsers = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        users,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalUsers / limit),
          totalUsers,
          limit: parseInt(limit),
        },
      },
    });
  } catch (error) {
    console.error("Get users by role error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Get user statistics (Admin only)
const getUserStats = async (req, res) => {
  try {
    const stats = await User.aggregate([
      {
        $group: {
          _id: "$role",
          count: { $sum: 1 },
          activeCount: {
            $sum: { $cond: ["$isActive", 1, 0] },
          },
        },
      },
    ]);

    // Format stats
    const formattedStats = {};
    stats.forEach((stat) => {
      formattedStats[stat._id] = {
        total: stat.count,
        active: stat.activeCount,
        inactive: stat.count - stat.activeCount,
      };
    });

    // Get total users
    const totalUsers = await User.countDocuments();
    const totalActiveUsers = await User.countDocuments({ isActive: true });

    res.status(200).json({
      success: true,
      data: {
        stats: formattedStats,
        total: {
          users: totalUsers,
          active: totalActiveUsers,
          inactive: totalUsers - totalActiveUsers,
        },
      },
    });
  } catch (error) {
    console.error("Get user stats error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

module.exports = {
  addUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUsersByRole,
  getUserStats,
};
