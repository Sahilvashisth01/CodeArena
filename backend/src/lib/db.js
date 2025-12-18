import mongoose from "mongoose";
import { ENV } from "./env.js";

export const connectDB = async () => {
  if (!ENV.DB_URL) {
    console.log("Database URL missing");
    process.exit(1);
  }

  try {
    await mongoose.connect(ENV.DB_URL);
    console.log("Database connected");
  } catch (err) {
    console.log("Database connection failed");
    process.exit(1);
  }
};
