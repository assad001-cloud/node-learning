// Drops the database
require("dotenv").config();
const mongoose = require("mongoose");

async function drop() {
  try {
    const uri = process.env.MONGO_URI;
    console.log("[Drop] Connecting to:", uri);

    await mongoose.connect(uri);

    await mongoose.connection.dropDatabase();
    console.log("[Drop] Database dropped successfully.");

    process.exit(0);
  } catch (err) {
    console.error("[Drop] Error:", err.message);
    process.exit(1);
  }
}

drop();
