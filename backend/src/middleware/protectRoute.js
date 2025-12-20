import { requireAuth } from "@clerk/express";
import User from "../models/User.js";

export const protectRoute = [
  // Middleware to ensure the user is authenticated via Clerk
  requireAuth(),
  async (req, res, next) => {
    try {
      const clerkId = req.auth().userId;
      if (!clerkId) {
        return res.status(401).json({ msg: "Unauthorized -invalid token" });
      }
      // Find the user in the database using the Clerk ID
      const user = await User.findOne({ clerkId });
      if (!user) {
        return res.status(401).json({ msg: "Unauthorized: User not found" });
      }
      // Attach the user to the request object for downstream use
      req.user = user;
      next();
    } catch (error) {
      console.error("Error in protectRoute middleware:", error);
      res.status(500).json({ msg: "Internal Server Error" });
    }
  },
];
