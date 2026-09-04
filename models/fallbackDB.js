const fs = require("fs");
const path = require("path");

const DB_PATH = path.join(__dirname, "../data/db.json");

function ensureDB() {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify({ users: [] }, null, 2), "utf8");
  }
}

function getData() {
  ensureDB();
  try {
    return JSON.parse(fs.readFileSync(DB_PATH, "utf8"));
  } catch (e) {
    return { users: [] };
  }
}

function saveData(data) {
  ensureDB();
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf8");
}

module.exports = {
  findUser: (query) => {
    const db = getData();
    return db.users.find(u => {
      if (query.email && u.email.toLowerCase() === query.email.toLowerCase()) return true;
      if (query.username && u.username.toLowerCase() === query.username.toLowerCase()) return true;
      if (query._id && u._id === query._id) return true;
      return false;
    });
  },
  createUser: (userData) => {
    const db = getData();
    const newUser = {
      _id: "user_" + Date.now(),
      ...userData,
      avatar: userData.username.charAt(0).toUpperCase(),
      bio: userData.bio || "Passionate gamer exploring the vast universe of video games.",
      favoriteGenre: userData.favoriteGenre || "Action / RPG",
      savedGames: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    db.users.push(newUser);
    saveData(db);
    return newUser;
  },
  updateUser: (id, updates) => {
    const db = getData();
    const idx = db.users.findIndex(u => u._id === id);
    if (idx === -1) return null;
    db.users[idx] = { ...db.users[idx], ...updates, updatedAt: new Date().toISOString() };
    saveData(db);
    return db.users[idx];
  }
};
