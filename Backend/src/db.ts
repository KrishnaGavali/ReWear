import mongoose from "mongoose";

const connectToDatabase = async () => {
  try {
    const connection = await mongoose.connect("mongodb://127.0.0.1:27017/", {
      dbName: "rewear",
    });
    console.log("Connected to MongoDB successfully");
    return connection;
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1); // Exit process with failure
  }
};

export default connectToDatabase;
