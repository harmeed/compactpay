const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGODB_URL);
    console.log(`connected to db: ${connect.connection.host}`);

  } catch (error) {
    console.log({error: error, message:'db is disconnected'});
  }
};

module.exports = connectDB;
