const mongoose = require("mongoose");

const savedGameSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  background_image: { type: String, default: "" },
  metacritic: { type: Number, default: null },
  released: { type: String, default: "TBA" },
  genres: [{ type: String }],
  addedAt: { type: Date, default: Date.now }
});

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      minlength: [3, "Username must be at least 3 characters"]
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"]
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"]
    },
    avatar: {
      type: String,
      default: function () {
        return this.username ? this.username.charAt(0).toUpperCase() : "👤";
      }
    },
    bio: {
      type: String,
      default: "Passionate gamer exploring the vast universe of video games."
    },
    favoriteGenre: {
      type: String,
      default: "Action / RPG"
    },
    savedGames: [savedGameSchema]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("User", userSchema);
