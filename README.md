# 🎮 Colon-Games

> A modern, full-featured Video Game Encyclopedia with Node.js, Express, MongoDB, and RAWG Game API integration.

![Colon-Games](favicon.svg)

---

## ✨ Features

- 🔍 **Live Game Search**: Instant game lookup across 500,000+ titles with cover art autocomplete.
- 🔥 **Trending & Upcoming Sections**: Real-time trending, upcoming releases, and top-rated games.
- 👤 **User Authentication & Profiles**: Secure registration & login powered by `bcryptjs` and `JWT`.
- ❤️ **Saved Game Collections**: Bookmark games to your personal MongoDB collection.
- 📱 **Mobile-First Responsive GUI**: 2-column Netflix/Steam mobile layout with slide-out drawer.
- ⚡ **Optimized Performance**: 24-hour browser caching + CDN thumbnail resizing.

---

## 🚀 Quick Start (Local)

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure environment variables** in `.env`:
   ```env
   PORT=3000
   MONGO_URI=mongodb://127.0.0.1:27017/colongames
   JWT_SECRET=your_jwt_secret_key
   ```

3. **Start the server**:
   ```bash
   npm start
   ```

4. **Open in browser**:
   `http://localhost:3000`

---

## 🌐 Deploy to Cloud (Free)

1. Push this repository to **GitHub**.
2. Connect to **[Render.com](https://render.com)** as a **Web Service**.
3. Set Build Command to `npm install` and Start Command to `node server.js`.
4. Deploy!

