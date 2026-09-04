// ============================================================
//  GameWiki — Home Page Logic (Instant Render + Background Sync)
// ============================================================

function getPlatformIcon(name) {
  const n = (name || "").toLowerCase();
  if (n.includes("playstation") || n.includes("ps")) return "🎮";
  if (n.includes("xbox")) return "🟢";
  if (n.includes("pc") || n.includes("windows")) return "🖥️";
  if (n.includes("nintendo") || n.includes("switch")) return "🔴";
  if (n.includes("mobile") || n.includes("android") || n.includes("ios")) return "📱";
  return "🕹️";
}

function gameCard(game) {
  const rawImg = game.background_image || "";
  const img = window.GameAPI && window.GameAPI.optimizeImageUrl 
    ? window.GameAPI.optimizeImageUrl(rawImg) 
    : (rawImg || "https://via.placeholder.com/600x400/1a1a2e/00e5ff?text=No+Cover");

  const rating = game.metacritic || (game.rating ? Math.round(game.rating * 10) : null);
  const ratingClass = rating >= 80 ? "good" : rating >= 60 ? "ok" : "bad";
  const genres = (game.genres || []).slice(0, 2).map(g => `<span class="tag">${g.name}</span>`).join("");
  const platforms = (game.platforms || []).slice(0, 3).map(p => getPlatformIcon(p.platform ? p.platform.name : p.name)).join(" ");

  return `
    <div class="game-card" onclick="window.location.href='game.html?id=${game.id}'" tabindex="0" role="button" aria-label="${game.name}">
      <div class="card-img-wrap">
        <img src="${img}" alt="${game.name}" loading="lazy"
             onerror="this.src='https://via.placeholder.com/600x400/1a1a2e/00e5ff?text=No+Cover'" />
        ${rating ? `<div class="rating-badge ${ratingClass}">${rating}</div>` : ""}
      </div>
      <div class="card-body">
        <h3 class="card-title">${game.name}</h3>
        <div class="card-meta">
          <span class="card-platforms">${platforms}</span>
          <span class="card-year">${game.released ? game.released.split("-")[0] : "TBA"}</span>
        </div>
        <div class="card-tags">${genres}</div>
      </div>
    </div>`;
}

function renderSection(containerId, gamesList) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const list = gamesList && gamesList.results ? gamesList.results : gamesList;
  if (!list || list.length === 0) return;
  container.innerHTML = list.map(gameCard).join("");
}

// Search autocomplete
let searchTimeout = null;
function initHeroSearch() {
  const input = document.getElementById("heroSearch");
  const btn = document.getElementById("heroSearchBtn");
  const dropdown = document.getElementById("searchDropdown");
  if (!input) return;

  input.addEventListener("input", () => {
    clearTimeout(searchTimeout);
    const q = input.value.trim();
    if (q.length < 2) { dropdown.innerHTML = ""; dropdown.classList.remove("open"); return; }
    dropdown.innerHTML = `<div class="dropdown-loading">Searching...</div>`;
    dropdown.classList.add("open");

    searchTimeout = setTimeout(async () => {
      const data = await window.GameAPI.searchGames(q);
      if (!data || !data.results || data.results.length === 0) {
        dropdown.innerHTML = `<div class="dropdown-empty">No results for "${q}"</div>`;
        return;
      }
      dropdown.innerHTML = data.results.slice(0, 6).map(g => {
        const thumb = window.GameAPI.optimizeImageUrl(g.background_image);
        return `
        <div class="dropdown-item" onclick="window.location.href='game.html?id=${g.id}'">
          <img src="${thumb}" alt="${g.name}" onerror="this.src='https://via.placeholder.com/60x40/1a1a2e/00e5ff?text=?'" />
          <div class="dropdown-info">
            <div class="dropdown-name">${g.name}</div>
            <div class="dropdown-year">${g.released ? g.released.split("-")[0] : "TBA"} ${g.metacritic ? `• <span class="dropdown-score">${g.metacritic}</span>` : ""}</div>
          </div>
        </div>`;
      }).join("") +
      `<div class="dropdown-all" onclick="window.location.href='game.html?search=${encodeURIComponent(q)}'">See all results for "${q}" →</div>`;
    }, 300);
  });

  function doSearch() {
    const q = input.value.trim();
    if (q) window.location.href = `game.html?search=${encodeURIComponent(q)}`;
  }
  btn.addEventListener("click", doSearch);
  input.addEventListener("keydown", e => { if (e.key === "Enter") doSearch(); });
  document.addEventListener("click", e => {
    if (!e.target.closest(".hero-search-wrap")) dropdown.classList.remove("open");
  });
}

function initHome() {
  renderNav("home");
  initHeroSearch();

  // 1. INSTANT RENDER (0.05 seconds) using initial fast data cache
  if (window.INITIAL_GAMES) {
    renderSection("trendingGrid", window.INITIAL_GAMES.trending);
    renderSection("upcomingGrid", window.INITIAL_GAMES.upcoming);
    renderSection("topRatedGrid", window.INITIAL_GAMES.topRated);
  }

  // 2. Refresh live data in background without blocking or showing spinners
  window.GameAPI.getTrendingGames().then(data => {
    if (data && data.results && data.results.length > 0) renderSection("trendingGrid", data);
  });

  // Stagger slightly so browser network isn't clogged
  setTimeout(() => {
    window.GameAPI.getUpcomingGames().then(data => {
      if (data && data.results && data.results.length > 0) renderSection("upcomingGrid", data);
    });
  }, 300);

  setTimeout(() => {
    window.GameAPI.getTopRated().then(data => {
      if (data && data.results && data.results.length > 0) renderSection("topRatedGrid", data);
    });
  }, 600);
}

document.addEventListener("DOMContentLoaded", initHome);
