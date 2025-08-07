const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const {
  addUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUsersByRole,
  getUserStats,
} = require("../controllers/userController");
const { authenticateToken, requireAdmin } = require("../middleware/auth");

// Validation error handling middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array(),
    });
  }
  next();
};

// Validation middleware for adding users
const validateAddUser = [
  body("username")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters long"),
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please enter a valid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("gender")
    .isIn(["Male", "Female", "Other"])
    .withMessage("Gender must be Male, Female, or Other"),
  body("role")
    .isIn(["Greeter", "Driver", "Subdriver", "School"])
    .withMessage("Role must be Greeter, Driver, Subdriver, or School"),
  body("greeterID")
    .optional()
    .isString()
    .withMessage("GreeterID must be a string"),
  handleValidationErrors,
];

// Validation middleware for updating users
const validateUpdateUser = [
  body("username")
    .optional()
    .trim()
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters long"),
  body("email")
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage("Please enter a valid email"),
  body("gender")
    .optional()
    .isIn(["Male", "Female", "Other"])
    .withMessage("Gender must be Male, Female, or Other"),
  body("role")
    .optional()
    .isIn(["Greeter", "Driver", "Subdriver", "School"])
    .withMessage("Role must be Greeter, Driver, Subdriver, or School"),
  body("greeterID")
    .optional()
    .isString()
    .withMessage("GreeterID must be a string"),
  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be a boolean"),
  handleValidationErrors,
];

// All routes require admin authentication
router.use(authenticateToken, requireAdmin);

// Add new user
router.post("/", validateAddUser, addUser);

// Get all users (with pagination and search)
router.get("/", getAllUsers);

// Get user statistics
router.get("/stats", getUserStats);

// Get users by role
router.get("/role/:role", getUsersByRole);

// Get user by ID
router.get("/:userId", getUserById);

// Update user
router.put("/:userId", validateUpdateUser, updateUser);

// Delete user
router.delete("/:userId", deleteUser);

module.exports = router;
