// ============================================================
//  GameWiki — RAWG API Wrapper (High Speed Caching + Thumbnail Optimization)
// ============================================================

const API_KEY = "238618b7bb5c4b0fa895e472ac4f40a2";
const BASE_URL = "https://api.rawg.io/api";
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours cache

// Optimize RAWG images by requesting cropped 600x400 thumbnails instead of 4K original wallpapers
function optimizeImageUrl(url) {
  if (!url) return "https://via.placeholder.com/600x400/1a1a2e/00e5ff?text=No+Cover";
  if (url.includes("media.rawg.io/media/") && !url.includes("/crop/")) {
    return url.replace("media.rawg.io/media/", "media.rawg.io/media/crop/600/400/");
  }
  return url;
}

function buildURL(endpoint, params = {}) {
  const url = new URL(`${BASE_URL}/${endpoint}`);
  url.searchParams.set("key", API_KEY);
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, v);
  }
  return url.toString();
}

// Ultra-fast LocalStorage caching
async function apiFetch(url) {
  // Simple alphanumeric key
  const cacheKey = "gw_" + encodeURIComponent(url).replace(/[^a-zA-Z0-9]/g, "_").slice(-80);
  try {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      const { data, ts } = JSON.parse(cached);
      if (Date.now() - ts < CACHE_TTL) return data; // Instant cache hit (0ms)
    }

    const res = await fetch(url);
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    const data = await res.json();

    // Cache successful response
    try {
      localStorage.setItem(cacheKey, JSON.stringify({ data, ts: Date.now() }));
    } catch(e) {
      // Storage might be full, silently continue
    }
    return data;
  } catch (err) {
    console.warn("API fetch notice:", err);
    // If network fails, return cached even if expired
    try {
      const cached = localStorage.getItem(cacheKey);
      if (cached) return JSON.parse(cached).data;
    } catch(e) {}
    return null;
  }
}

async function searchGames(query, page = 1) {
  const url = buildURL("games", { search: query, page_size: 12, page, search_precise: true });
  return apiFetch(url);
}

async function getTrendingGames() {
  const today = new Date().toISOString().split("T")[0];
  const oneYearAgo = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
  const url = buildURL("games", { dates: `${oneYearAgo},${today}`, ordering: "-added", page_size: 6 });
  return apiFetch(url);
}

async function getUpcomingGames() {
  const today = new Date().toISOString().split("T")[0];
  const nextYear = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
  const url = buildURL("games", { dates: `${today},${nextYear}`, ordering: "-added", page_size: 6 });
  return apiFetch(url);
}

async function getTopRated() {
  const url = buildURL("games", { ordering: "-metacritic", metacritic: "88,100", page_size: 6 });
  return apiFetch(url);
}

async function getGameDetails(id) {
  return apiFetch(buildURL(`games/${id}`));
}

async function getGameScreenshots(id) {
  return apiFetch(buildURL(`games/${id}/screenshots`, { page_size: 6 }));
}

async function getSimilarGames(id) {
  return apiFetch(buildURL(`games/${id}/game-series`, { page_size: 6 }));
}

window.GameAPI = {
  optimizeImageUrl,
  searchGames,
  getTrendingGames,
  getUpcomingGames,
  getTopRated,
  getGameDetails,
  getGameScreenshots,
  getSimilarGames,
};
