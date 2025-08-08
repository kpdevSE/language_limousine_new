const mongoose = require("mongoose");
require("dotenv").config();

// Connect to database
mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost:27017/language_limousine"
);

const StudentAssignment = require("./models/StudentAssignment");
const User = require("./models/User");

async function checkSubdriverAssignments() {
  try {
    console.log("🔍 Checking subdriver assignments...\n");

    // First, find subdrivers
    const subdrivers = await User.find({ role: "Subdriver", isActive: true });
    console.log(`Found ${subdrivers.length} active subdrivers`);

    if (subdrivers.length > 0) {
      console.log("\n👥 Subdrivers:");
      subdrivers.forEach((subdriver, index) => {
        console.log(
          `${index + 1}. ${subdriver.username} (${subdriver.email}) - ID: ${
            subdriver._id
          }`
        );
      });

      // Check assignments for each subdriver
      for (const subdriver of subdrivers) {
        console.log(
          `\n📋 Checking assignments for subdriver: ${subdriver.username}`
        );

        const assignments = await StudentAssignment.find({
          subdriverId: subdriver._id,
          isActive: true,
        }).populate(
          "studentId",
          "studentGivenName studentFamilyName studentNo school"
        );

        console.log(
          `Found ${assignments.length} assignments for this subdriver`
        );

        if (assignments.length > 0) {
          console.log("Sample assignments:");
          assignments.slice(0, 3).forEach((assignment, index) => {
            console.log(`\nAssignment ${index + 1}:`);
            console.log("- Assignment ID:", assignment._id);
            console.log(
              "- Student:",
              assignment.studentId
                ? `${assignment.studentId.studentGivenName} ${assignment.studentId.studentFamilyName}`
                : "No student"
            );
            console.log(
              "- Student No:",
              assignment.studentId?.studentNo || "N/A"
            );
            console.log("- School:", assignment.studentId?.school || "N/A");
            console.log("- Pickup Status:", assignment.pickupStatus);
            console.log("- Delivery Status:", assignment.deliveryStatus);
            console.log("- Assignment Date:", assignment.assignmentDate);
          });
        }
      }
    } else {
      console.log("❌ No subdrivers found in the database");
    }

    // Check all assignments with subdriverId
    const allSubdriverAssignments = await StudentAssignment.find({
      subdriverId: { $exists: true, $ne: null },
      isActive: true,
    }).populate(
      "studentId",
      "studentGivenName studentFamilyName studentNo school"
    );

    console.log(
      `\n📊 Total assignments with subdriverId: ${allSubdriverAssignments.length}`
    );

    if (allSubdriverAssignments.length > 0) {
      console.log("\n📋 Sample assignments with subdriverId:");
      allSubdriverAssignments.slice(0, 5).forEach((assignment, index) => {
        console.log(`\nAssignment ${index + 1}:`);
        console.log("- Assignment ID:", assignment._id);
        console.log("- Subdriver ID:", assignment.subdriverId);
        console.log(
          "- Student:",
          assignment.studentId
            ? `${assignment.studentId.studentGivenName} ${assignment.studentId.studentFamilyName}`
            : "No student"
        );
        console.log("- Student No:", assignment.studentId?.studentNo || "N/A");
        console.log("- School:", assignment.studentId?.school || "N/A");
        console.log("- Assignment Date:", assignment.assignmentDate);
      });
    }
  } catch (error) {
    console.error("❌ Error checking subdriver assignments:", error);
  } finally {
    mongoose.connection.close();
  }
}

checkSubdriverAssignments();
