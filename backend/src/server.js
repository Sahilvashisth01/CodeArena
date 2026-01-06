import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { inngest, functions } from "./lib/inngest.js";
import dotenv from "dotenv";
import { ENV } from "./lib/env.js";
import { connectDB } from "./lib/db.js";
import cors from "cors";
import { serve } from "inngest/express";
import { clerkMiddleware } from "@clerk/express";
import chatRoutes from "./routes/chatRoutes.js";
import sessionRoutes from "./routes/sessionRoute.js";

dotenv.config();

const app = express();

// ===== FIX __dirname FOR ES MODULE =====
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ===== MIDDLEWARE =====
app.use(express.json());
app.use(
  cors({
    origin: ENV.CLIENT_URL,
    credentials: true,
  })
);

app.use(clerkMiddleware());

// ===== API ROUTES =====
app.use("/api/inngest", serve({ client: inngest, functions }));
app.use("/api/chat", chatRoutes);
app.use("/api/sessions", sessionRoutes);

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// ===== FRONTEND SERVING (PRODUCTION) =====
if (ENV.NODE_ENV === "production") {
  const frontendPath = path.join(__dirname, "../../frontend/dist");

  app.use(express.static(frontendPath));

  // SPA fallback (VERY IMPORTANT)
  app.get("*", (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
  });
}

// ===== START SERVER =====
const startServer = async () => {
  try {
    await connectDB();
    app.listen(ENV.PORT, () => {
      console.log(`Server running on port ${ENV.PORT}`);
    });
  } catch (err) {
    console.log("Failed to start server:", err);
  }
};

startServer();
