const { exec } = require("child_process");
const os = require("os");

const checkMongoDBStatus = () => {
  console.log("🔍 Checking MongoDB status...");
  console.log("Platform:", os.platform());

  // Check if MongoDB process is running
  const command =
    os.platform() === "win32"
      ? 'tasklist /FI "IMAGENAME eq mongod.exe"'
      : "ps aux | grep mongod | grep -v grep";

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.log("❌ MongoDB process not found or error occurred");
      console.log("Error:", error.message);
    } else if (stdout.includes("mongod") || stdout.includes("MongoDB")) {
      console.log("✅ MongoDB process is running");
      console.log("Process info:", stdout.trim());
    } else {
      console.log("❌ MongoDB process not found");
    }

    // Check if MongoDB port is accessible
    const netstat = require("net");
    const server = netstat.createServer();

    server.listen(27017, "localhost", () => {
      console.log("✅ Port 27017 is accessible");
      server.close();
    });

    server.on("error", (err) => {
      if (err.code === "EADDRINUSE") {
        console.log("✅ Port 27017 is in use (likely MongoDB)");
      } else {
        console.log("❌ Port 27017 is not accessible");
        console.log("Error:", err.message);
      }
    });
  });
};

checkMongoDBStatus();
