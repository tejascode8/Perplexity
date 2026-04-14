import mongoose from "mongoose";

const connectDB = async () => {
  console.log("MONGO_URI:", process.env.MONGO_URI);
  const conn = await mongoose.connect(process.env.MONGO_URI);
  console.log(`MongoDB connected: ${conn.connection.host}`);
};

export default connectDB;
