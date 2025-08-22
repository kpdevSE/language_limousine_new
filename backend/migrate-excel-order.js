const mongoose = require("mongoose");
const Student = require("./models/Student");

async function migrateExcelOrder() {
  try {
    console.log("Starting Excel Order Migration...\n");

    // Get all students grouped by date
    const studentsByDate = await Student.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: "$date", students: { $push: "$$ROOT" } } },
      { $sort: { _id: 1 } }, // Sort by date
    ]);

    console.log(`Found ${studentsByDate.length} dates with students`);

    let totalUpdated = 0;

    for (const dateGroup of studentsByDate) {
      const { _id: date, students } = dateGroup;
      console.log(`\nProcessing date: ${date} (${students.length} students)`);

      // Sort students by creation time to maintain some order
      students.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

      // Update each student with sequential excelOrder
      for (let i = 0; i < students.length; i++) {
        const student = students[i];
        const excelOrder = i + 1;

        if (student.excelOrder !== excelOrder) {
          await Student.findByIdAndUpdate(student._id, { excelOrder });
          console.log(
            `   Updated ${student.studentGivenName} ${student.studentFamilyName}: excelOrder = ${excelOrder}`
          );
          totalUpdated++;
        } else {
          console.log(
            `   Skipped ${student.studentGivenName} ${student.studentFamilyName}: already has excelOrder = ${excelOrder}`
          );
        }
      }
    }

    console.log(`\n✅ Migration completed!`);
    console.log(`Total students updated: ${totalUpdated}`);

    // Verify the migration
    console.log("\nVerifying migration...");
    const studentsWithoutOrder = await Student.countDocuments({
      isActive: true,
      $or: [{ excelOrder: { $exists: false } }, { excelOrder: null }],
    });

    if (studentsWithoutOrder === 0) {
      console.log("✅ All active students now have excelOrder values");
    } else {
      console.log(
        `❌ ${studentsWithoutOrder} students still missing excelOrder values`
      );
    }
  } catch (error) {
    console.error("❌ Migration failed:", error.message);
    throw error;
  }
}

// Run the migration if this file is executed directly
if (require.main === module) {
  // Connect to database first
  const db = require("./config/db");
  db.connect()
    .then(() => {
      console.log("Connected to database");
      return migrateExcelOrder();
    })
    .then(() => {
      console.log("Migration completed successfully");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Migration failed:", error);
      process.exit(1);
    });
}

module.exports = { migrateExcelOrder };
