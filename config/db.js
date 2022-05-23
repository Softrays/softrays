const mongoose = require("mongoose");

// SETTING UP THE DATABASE
// "mongodb://localhost:27017/softraysDB"
// process.env.MONGODB_CONNECTION_STRING

// "mongodb+srv://admin:admin@softrays.ojrey.mongodb.net/softraysDB"

const db = async () => {
  await mongoose.connect(process.env.MONGODB_CONNECTION_STRING);
  try {
    console.log("Successfully connected to database");
  } catch (err) {
    console.log(err.message);
  }
};

db();
