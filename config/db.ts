import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1/chatapp");
    console.log(`MongoDB Connected`);
  } catch (error:any) {
    console.error(error.message);
    process.exit(1);
  }
};
