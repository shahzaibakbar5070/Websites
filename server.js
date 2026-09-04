require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/gamewiki";

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve the static frontend from the repository root.
app.use(express.static(__dirname));

// Reuse the same MongoDB connection across Vercel invocations when possible.
let isConnected = false;
const connectDB = async () => {
  if (isConnected || mongoose.connection.readyState === 1) return;

  if (!process.env.MONGO_URI) {
    console.warn("[Notice] MONGO_URI is not configured.");
    return;
  }

  try {
    const conn = await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 4000
    });
    isConnected = true;
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.warn(`[Notice] MongoDB connection note: ${err.message}`);
  }
};

// Only load optional route modules when they actually exist. This prevents the
// Vercel function from crashing if a route module is not present in a checkout.
const optionalRoutes = [
  ["/api/auth", "./routes/authRoutes"],
  ["/api/profile", "./routes/profileRoutes"]
];

for (const [prefix, routePath] of optionalRoutes) {
  try {
    app.use(prefix, require(routePath));
  } catch (err) {
    if (err.code === "MODULE_NOT_FOUND") {
      console.warn(`[Notice] Optional route module not found: ${routePath}`);
    } else {
      throw err;
    }
  }
}

app.get("/api/health", async (req, res) => {
  await connectDB();
  const dbState = mongoose.connection.readyState;
  const states = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting"
  };

  res.json({
    status: "ok",
    app: "Colon-Games API",
    database: states[dbState] || "unknown",
    timestamp: new Date().toISOString()
  });
});

app.use("/api", (req, res) => {
  res.status(404).json({
    success: false,
    message: "API endpoint not found"
  });
});

// Local development fallback for normal browser routes.
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Colon-Games Server running at http://localhost:${PORT}`);
  });
}

// Vercel uses the exported Express application as the serverless handler.
module.exports = app;
