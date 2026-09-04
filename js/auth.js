// ============================================================
// GameWiki — Node.js & MongoDB Auth Client
// ============================================================

// Same-origin API in production and localhost in local development.
const API_BASE = "";
const TOKEN_KEY = "gamewiki_jwt_token";
const USER_KEY = "gamewiki_user_session";
const FAVS_CACHE_KEY = "gamewiki_favs_cache";

function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

function setSession(token, user) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
}

function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(FAVS_CACHE_KEY);
}

function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY) || "null");
  } catch (e) {
    return null;
  }
}

function isLoggedIn() {
  return getToken() !== null && getCurrentUser() !== null;
}

async function authFetch(url, options = {}) {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  try {
    const res = await fetch(`${API_BASE}${url}`, { ...options, headers });
    const contentType = res.headers.get("content-type") || "";
    const data = contentType.includes("application/json")
      ? await res.json()
      : { success: false, message: await res.text() };

    return { ok: res.ok, status: res.status, data };
  } catch (err) {
    console.error(`API request failed [${url}]:`, err);
    return {
      ok: false,
      status: 0,
      data: {
        success: false,
        message: "Could not connect to the GameWiki backend."
      }
    };
  }
}

async function register(username, email, password) {
  const res = await authFetch("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({ username, email, password })
  });

  if (res.ok && res.data.success) {
    // Registration returns a JWT and user object; save both so the new account
    // is immediately logged in instead of requiring a second login.
    setSession(res.data.token, res.data.user);
    fetchFavorites();
    return { success: true, user: res.data.user, message: res.data.message };
  }

  return { success: false, message: res.data.message || "Registration failed." };
}

async function login(email, password) {
  const res = await authFetch("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password })
  });

  if (res.ok && res.data.success) {
    setSession(res.data.token, res.data.user);
    fetchFavorites();
    return { success: true, user: res.data.user, message: res.data.message };
  }

  return { success: false, message: res.data.message || "Login failed." };
}

async function logout() {
  try {
    await authFetch("/api/auth/logout", { method: "POST" });
  } catch (e) {}
  clearSession();
  window.location.href = "index.html";
}

async function updateProfile({ username, bio, favoriteGenre }) {
  const res = await authFetch("/api/profile", {
    method: "PUT",
    body: JSON.stringify({ username, bio, favoriteGenre })
  });

  if (res.ok && res.data.success) {
    const currentUser = getCurrentUser() || {};
    const updated = { ...currentUser, ...res.data.user };
    setSession(null, updated);
    return { success: true, user: updated, message: res.data.message };
  }

  return { success: false, message: res.data.message || "Failed to update profile." };
}

async function fetchFavorites() {
  if (!isLoggedIn()) return [];
  const res = await authFetch("/api/profile/favorites");
  if (res.ok && res.data.success) {
    const favs = res.data.favorites || [];
    localStorage.setItem(FAVS_CACHE_KEY, JSON.stringify(favs));
    return favs;
  }
  return getFavorites();
}

function getFavorites() {
  try {
    return JSON.parse(localStorage.getItem(FAVS_CACHE_KEY) || "[]");
  } catch (e) {
    return [];
  }
}

async function toggleFavorite(game) {
  if (!isLoggedIn()) {
    return { success: false, message: "Please log in to save games to your profile." };
  }

  const res = await authFetch("/api/profile/favorites", {
    method: "POST",
    body: JSON.stringify({
      id: game.id,
      name: game.name || game.title,
      background_image: game.background_image || game.thumbnail || "",
      metacritic: game.metacritic || null,
      released: game.released || game.release_date || "TBA",
      genres: game.genres || []
    })
  });

  if (res.ok && res.data.success) {
    let localFavs = getFavorites();
    if (res.data.favorited) {
      localFavs.unshift({
        id: game.id,
        name: game.name || game.title,
        background_image: game.background_image || "",
        metacritic: game.metacritic || null,
        released: game.released || "TBA"
      });
    } else {
      localFavs = localFavs.filter(g => g.id != game.id);
    }
    localStorage.setItem(FAVS_CACHE_KEY, JSON.stringify(localFavs));
    return { success: true, favorited: res.data.favorited, count: res.data.count };
  }

  return { success: false, message: res.data.message || "Failed to update saved games." };
}

function isFavorite(gameId) {
  return getFavorites().some(g => g.id == gameId);
}

if (isLoggedIn()) {
  authFetch("/api/auth/me").then(res => {
    if (res.ok && res.data.success) {
      setSession(null, res.data.user);
    } else if (res.status === 401) {
      clearSession();
    }
  });
}

window.Auth = {
  register,
  login,
  logout,
  getCurrentUser,
  isLoggedIn,
  updateProfile,
  getFavorites,
  fetchFavorites,
  toggleFavorite,
  isFavorite
};
