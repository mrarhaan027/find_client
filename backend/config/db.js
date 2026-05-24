const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGO_URI || process.env.MONGODB_URI;
  if (!uri) {
    console.error("❌ ERROR: Database connection string is missing! Please set MONGO_URI or MONGODB_URI in your environment variables.");
    process.exit(1);
  }

  const conn = await mongoose.connect(uri, {
    family: 4, // Force IPv4 to fix DNS resolution issues
    serverSelectionTimeoutMS: 10000
  });
  console.log(`MongoDB Connected: ${conn.connection.host}`);
};




module.exports = connectDB;
