const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../models/User");
const fallbackDB = require("../models/fallbackDB");
const { protect } = require("../middleware/authMiddleware");

const isMongoLive = () => mongoose.connection.readyState === 1;

// @route   PUT /api/profile
router.put("/", protect, async (req, res) => {
  try {
    const { username, bio, favoriteGenre } = req.body;
    let user = null;

    if (isMongoLive()) {
      user = await User.findById(req.user._id);
    } else {
      user = fallbackDB.findUser({ _id: req.user._id });
    }

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    let updates = {};

    if (username && username.trim() !== user.username) {
      const trimmedName = username.trim();
      let existingUser = null;
      if (isMongoLive()) {
        existingUser = await User.findOne({
          username: { $regex: new RegExp(`^${trimmedName}$`, "i") },
          _id: { $ne: user._id }
        });
      } else {
        existingUser = fallbackDB.findUser({ username: trimmedName });
        if (existingUser && existingUser._id === user._id) existingUser = null;
      }

      if (existingUser) {
        return res.status(400).json({ success: false, message: "Username is already taken." });
      }

      updates.username = trimmedName;
      updates.avatar = trimmedName.charAt(0).toUpperCase();
    }

    if (bio !== undefined) updates.bio = bio.trim();
    if (favoriteGenre !== undefined) updates.favoriteGenre = favoriteGenre.trim();

    let updatedUser = null;
    if (isMongoLive()) {
      Object.assign(user, updates);
      updatedUser = await user.save();
    } else {
      updatedUser = fallbackDB.updateUser(user._id, updates);
    }

    return res.json({
      success: true,
      message: "Profile updated successfully!",
      user: {
        id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        avatar: updatedUser.avatar,
        bio: updatedUser.bio,
        favoriteGenre: updatedUser.favoriteGenre,
        joined: updatedUser.createdAt,
        savedGamesCount: updatedUser.savedGames ? updatedUser.savedGames.length : 0
      }
    });
  } catch (err) {
    console.error("Update profile error:", err);
    return res.status(500).json({ success: false, message: err.message || "Failed to update profile." });
  }
});

// @route   GET /api/profile/favorites
router.get("/favorites", protect, async (req, res) => {
  try {
    let user = null;
    if (isMongoLive()) {
      user = await User.findById(req.user._id);
    } else {
      user = fallbackDB.findUser({ _id: req.user._id });
    }

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }
    return res.json({
      success: true,
      favorites: user.savedGames || []
    });
  } catch (err) {
    console.error("Get favorites error:", err);
    return res.status(500).json({ success: false, message: "Failed to load saved games." });
  }
});

// @route   POST /api/profile/favorites
router.post("/favorites", protect, async (req, res) => {
  try {
    const { id, name, background_image, metacritic, released, genres } = req.body;

    if (!id || !name) {
      return res.status(400).json({ success: false, message: "Game ID and name are required." });
    }

    let user = null;
    if (isMongoLive()) {
      user = await User.findById(req.user._id);
    } else {
      user = fallbackDB.findUser({ _id: req.user._id });
    }

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    const savedList = user.savedGames || [];
    const existingIndex = savedList.findIndex(g => g.id === Number(id));

    let favorited = false;
    if (existingIndex > -1) {
      savedList.splice(existingIndex, 1);
      favorited = false;
    } else {
      savedList.unshift({
        id: Number(id),
        name,
        background_image: background_image || "",
        metacritic: metacritic || null,
        released: released || "TBA",
        genres: Array.isArray(genres) ? genres.map(g => (g && g.name) ? g.name : String(g)) : []
      });
      favorited = true;
    }

    if (isMongoLive()) {
      user.savedGames = savedList;
      await user.save();
    } else {
      fallbackDB.updateUser(user._id, { savedGames: savedList });
    }

    return res.json({
      success: true,
      favorited,
      count: savedList.length,
      message: favorited ? "Game saved to your profile!" : "Game removed from your profile."
    });
  } catch (err) {
    console.error("Toggle favorite error:", err);
    return res.status(500).json({ success: false, message: "Failed to update saved games." });
  }
});

module.exports = router;
