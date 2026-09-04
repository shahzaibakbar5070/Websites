const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../models/User");
const fallbackDB = require("../models/fallbackDB");

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "gamewiki_super_secure_jwt_secret_key_2026"
      );

      // Check MongoDB or fallback
      if (mongoose.connection.readyState === 1) {
        req.user = await User.findById(decoded.id).select("-password");
      } else {
        const u = fallbackDB.findUser({ _id: decoded.id });
        if (u) {
          const { password, ...safeUser } = u;
          req.user = safeUser;
        }
      }

      if (!req.user) {
        return res.status(401).json({ success: false, message: "User account not found." });
      }

      next();
    } catch (err) {
      console.error("Auth middleware error:", err.message);
      return res.status(401).json({ success: false, message: "Not authorized, token invalid or expired." });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: "Not authorized, no token provided." });
  }
};

module.exports = { protect };
