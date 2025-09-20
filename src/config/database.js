const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(" MongoDB connected successfully");
  } catch (error) {
    console.error(" MongoDB connection error:", error.message);
    process.exit(1); // stop the server if DB connection fails
  }
};

// Graceful shutdown handling
process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log(" MongoDB connection closed due to app termination");
  process.exit(0);
});

module.exports = connectDB;
