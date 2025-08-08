const mongoose = require("mongoose");
require("dotenv").config();

// Connect to database
mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost:27017/language_limousine"
);

const Student = require("./models/Student");

async function checkStudentsWithSchool() {
  try {
    console.log("🔍 Checking students with school data...\n");

    // Get all students
    const allStudents = await Student.find({ isActive: true }).limit(10);
    console.log(
      `Found ${allStudents.length} active students (showing first 10)`
    );

    if (allStudents.length > 0) {
      console.log("\n📚 Sample students:");
      allStudents.forEach((student, index) => {
        console.log(`\nStudent ${index + 1}:`);
        console.log("- ID:", student._id);
        console.log(
          "- Name:",
          student.studentGivenName,
          student.studentFamilyName
        );
        console.log("- Student No:", student.studentNo);
        console.log("- School:", student.school);
        console.log("- All fields:", Object.keys(student.toObject()));
      });
    }

    // Check specifically for students with school data
    const studentsWithSchool = await Student.find({
      isActive: true,
      school: { $exists: true, $ne: null, $ne: "" },
    }).limit(5);

    console.log(`\n📖 Students with school data: ${studentsWithSchool.length}`);
    if (studentsWithSchool.length > 0) {
      console.log("Sample students with school:");
      studentsWithSchool.forEach((student, index) => {
        console.log(
          `${index + 1}. ${student.studentGivenName} ${
            student.studentFamilyName
          } - School: ${student.school}`
        );
      });
    }

    // Check for students without school data
    const studentsWithoutSchool = await Student.find({
      isActive: true,
      $or: [{ school: { $exists: false } }, { school: null }, { school: "" }],
    }).limit(5);

    console.log(
      `\n❌ Students without school data: ${studentsWithoutSchool.length}`
    );
    if (studentsWithoutSchool.length > 0) {
      console.log("Sample students without school:");
      studentsWithoutSchool.forEach((student, index) => {
        console.log(
          `${index + 1}. ${student.studentGivenName} ${
            student.studentFamilyName
          } - School: "${student.school}"`
        );
      });
    }
  } catch (error) {
    console.error("❌ Error checking students:", error);
  } finally {
    mongoose.connection.close();
  }
}

checkStudentsWithSchool();
