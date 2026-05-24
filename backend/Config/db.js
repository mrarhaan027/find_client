const mongoose = require('mongoose');

const connectDB = async () => {
  const conn = await mongoose.connect(process.env.MONGO_URI, {
    family: 4, // Force IPv4 to fix DNS resolution issues
    serverSelectionTimeoutMS: 10000
  });
  console.log(`MongoDB Connected: ${conn.connection.host}`);
};




module.exports = connectDB;
