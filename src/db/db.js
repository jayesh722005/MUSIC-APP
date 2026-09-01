const mongoose = require('mongoose');
const dns = require('dns');

try {
  dns.setServers(["1.1.1.1", "8.8.8.8"]);
} catch (e) {
  // DNS override fallback
}

let cachedConnection = null;

async function connectDB() {
  if (cachedConnection && mongoose.connection.readyState >= 1) {
    return cachedConnection;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    cachedConnection = conn;
    console.log("database connected ...");
    return conn;
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
}

module.exports = connectDB;