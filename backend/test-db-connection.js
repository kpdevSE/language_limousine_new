const mongoose = require("mongoose");
require("dotenv").config();

const testConnection = async () => {
  try {
    console.log("Testing MongoDB connection...");
    console.log(
      "MongoDB URI:",
      process.env.MONGODB_URI || "mongodb://localhost:27017/language-limousine"
    );

    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000, // 10 seconds
      socketTimeoutMS: 15000, // 15 seconds
    };

    const conn = await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/language-limousine",
      options
    );

    console.log("✅ MongoDB Connected successfully!");
    console.log(`Host: ${conn.connection.host}`);
    console.log(`Database: ${conn.connection.name}`);
    console.log(`Ready State: ${conn.connection.readyState}`);

    // Test a simple query
    const User = require("./models/User");
    const userCount = await User.countDocuments();
    console.log(`📊 Total users in database: ${userCount}`);

    await mongoose.connection.close();
    console.log("✅ Connection closed successfully");
    process.exit(0);
  } catch (error) {
    console.error("❌ MongoDB Connection failed:");
    console.error("Error message:", error.message);
    console.error("Error code:", error.code);
    console.error("Full error:", error);

    if (error.message.includes("ECONNREFUSED")) {
      console.log("\n🔧 Troubleshooting tips:");
      console.log("1. Make sure MongoDB is running on your system");
      console.log("2. Check if MongoDB is running on the default port 27017");
      console.log("3. Try starting MongoDB with: mongod");
      console.log("4. Or install MongoDB if not installed");
    }

    if (error.message.includes("timeout")) {
      console.log("\n🔧 Timeout troubleshooting:");
      console.log("1. Check your network connection");
      console.log("2. Verify MongoDB is accessible");
      console.log("3. Check firewall settings");
    }

    process.exit(1);
  }
};

testConnection();
