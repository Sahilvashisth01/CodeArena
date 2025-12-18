import mongoose from "mongoose";
import { ENV } from "./env.js";

export const connectDB = async () => {
  if (!ENV.DB_URL) {
    console.log("DB_URL is not defined in environment variables");
    process.exit(1);
  }

  try {
    await mongoose.connect(ENV.DB_URL);
    console.log("Database connected successfully");
  } catch (err) {
    console.log("Error connecting to database:", err);
    process.exit(1); //0 means success , 1 means failure
  }
};
