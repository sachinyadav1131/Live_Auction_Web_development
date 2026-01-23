import mongoose from "mongoose";
// Remove dotenv import and config here

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "MERN_AUCTION_PLATFORM" // Optional: Specify your DB name here explicitly
    });
    console.log("MongoDB connected");
  } catch (err) {
    console.error("Connection failed:", err.message);
    process.exit(1);
  }
};

export default connectDB;