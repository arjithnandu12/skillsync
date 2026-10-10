const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri =
      process.env.CONNECTION_STRING ||
      process.env.MONGODB_URI ||
      "mongodb://127.0.0.1:27017/skills-compatibility";
    const connect = await mongoose.connect(uri);

    console.log(
      `Database connected successfully: ${connect.connection.host}/${connect.connection.name}`
    );
  } catch (err) {
    console.error("Database connection failed:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
