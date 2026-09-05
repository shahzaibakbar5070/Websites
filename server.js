require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || "";

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve the static frontend from the repository root.
app.use(express.static(__dirname));

// Reuse the same MongoDB connection across Vercel invocations.
let connectionPromise = null;
const connectDB = async () => {
  if (!MONGO_URI) return false;
  if (mongoose.connection.readyState === 1) return true;

  if (!connectionPromise) {
    connectionPromise = mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 8000,
      maxPoolSize: 10
    }).then(() => {
      console.log(`MongoDB Connected: ${mongoose.connection.host}`);
      return true;
    }).catch((err) => {
      connectionPromise = null;
      console.error("MongoDB connection failed:", err.message);
      return false;
    });
  }

  return connectionPromise;
};

// Every API request gets a database connection before reaching auth/profile routes.
// If MONGO_URI is missing or the database is unreachable, fail clearly instead of
// pretending that a Vercel serverless filesystem is a persistent database.
app.use("/api", async (req, res, next) => {
  const connected = await connectDB();

  if (!MONGO_URI) {
    return res.status(503).json({
      success: false,
      message: "Backend database is not configured. Add MONGO_URI to Vercel Environment Variables."
    });
  }

  if (!connected) {
    return res.status(503).json({
      success: false,
      message: "Database connection failed. Check the MONGO_URI and MongoDB Atlas network access."
    });
  }

  next();
});

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
  res.json({
    status: "ok",
    app: "GameWiki API",
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
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
 app.listen(PORT, "0.0.0.0", () => {
    console.log(`GameWiki Server running on port ${PORT}`);
});
}

module.exports = app;
