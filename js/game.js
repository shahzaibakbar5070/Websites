// ============================================================
//  GameWiki — Game Detail / Search Results (RAWG API Optimized)
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

  const rating = game.metacritic || null;
  const ratingClass = rating >= 80 ? "good" : rating >= 60 ? "ok" : "bad";
  const genres = (game.genres || []).slice(0, 2).map(g => `<span class="tag">${g.name}</span>`).join("");
  return `
    <div class="game-card" onclick="window.location.href='game.html?id=${game.id}'" tabindex="0" role="button">
      <div class="card-img-wrap">
        <img src="${img}" alt="${game.name}" loading="lazy"
             onerror="this.src='https://via.placeholder.com/600x400/1a1a2e/00e5ff?text=No+Cover'" />
        ${rating ? `<div class="rating-badge ${ratingClass}">${rating}</div>` : ""}
      </div>
      <div class="card-body">
        <h3 class="card-title">${game.name}</h3>
        <div class="card-meta">
          <span class="card-year">${game.released ? game.released.split("-")[0] : "TBA"}</span>
        </div>
        <div class="card-tags">${genres}</div>
      </div>
    </div>`;
}

// ---- Game Detail ----
async function renderGameDetail(id) {
  document.getElementById("gameContent").classList.remove("hidden");
  document.getElementById("searchResults").classList.add("hidden");

  // Show placeholder skeleton while loading
  document.getElementById("gameInfo").innerHTML = `
    <div class="detail-cover skeleton-box" style="aspect-ratio:3/4;min-height:300px;"></div>
    <div class="detail-meta">
      <div class="skeleton-line w80" style="height:32px;"></div>
      <div class="skeleton-line w50" style="margin:16px 0;"></div>
      <div class="skeleton-line w80"></div>
    </div>`;

  const [game, shots] = await Promise.all([
    window.GameAPI.getGameDetails(id),
    window.GameAPI.getGameScreenshots(id),
  ]);

  if (!game) {
    document.getElementById("gameContent").innerHTML = `<div class="error-msg">Game not found. Please try another game or check your connection.</div>`;
    return;
  }

  const hero = document.getElementById("gameHero");
  const coverImg = window.GameAPI.optimizeImageUrl(game.background_image);
  hero.style.backgroundImage = `url(${game.background_image || coverImg})`;

  const rating = game.metacritic;
  const ratingClass = rating >= 80 ? "good" : rating >= 60 ? "ok" : "bad";
  const platforms = (game.platforms || []).map(p => `<span class="platform-chip">${getPlatformIcon(p.platform.name)} ${p.platform.name}</span>`).join("");
  const genres = (game.genres || []).map(g => `<span class="tag">${g.name}</span>`).join("");
  const tags = (game.tags || []).slice(0, 8).map(t => `<span class="tag tag-sm">${t.name}</span>`).join("");
  const devs = (game.developers || []).map(d => d.name).join(", ") || "Unknown";
  const pubs = (game.publishers || []).map(p => p.name).join(", ") || "Unknown";
  const isSaved = window.Auth ? window.Auth.isFavorite(game.id) : false;
  const saveBtnText = isSaved ? "❤️ Saved in Profile" : "🤍 Save to Profile";
  const saveBtnClass = isSaved ? "btn-primary" : "btn-outline";

  document.getElementById("gameInfo").innerHTML = `
    <div class="detail-cover">
      <img src="${coverImg}" alt="${game.name}" />
    </div>
    <div class="detail-meta">
      <h1 class="detail-title">${game.name}</h1>
      <div class="detail-scores">
        ${rating ? `<div class="score-box ${ratingClass}"><span class="score-label">Metacritic</span><span class="score-val">${rating}</span></div>` : ""}
        ${game.rating ? `<div class="score-box"><span class="score-label">RAWG</span><span class="score-val">${game.rating.toFixed(1)} ⭐</span></div>` : ""}
        ${game.ratings_count ? `<div class="score-box"><span class="score-label">Votes</span><span class="score-val">${game.ratings_count.toLocaleString()}</span></div>` : ""}
      </div>
      <div class="detail-info-grid">
        <div><span class="info-label">Released</span><span class="info-val">${game.released || "TBA"}</span></div>
        <div><span class="info-label">Developer</span><span class="info-val">${devs}</span></div>
        <div><span class="info-label">Publisher</span><span class="info-val">${pubs}</span></div>
        <div><span class="info-label">Avg Playtime</span><span class="info-val">${game.playtime ? game.playtime + " hrs" : "N/A"}</span></div>
        <div><span class="info-label">Website</span><span class="info-val">${game.website ? `<a href="${game.website}" target="_blank" rel="noopener">Official Site ↗</a>` : "N/A"}</span></div>
      </div>
      <div class="detail-platforms">${platforms}</div>
      <div class="detail-genres">${genres}</div>
      <div style="margin-top: 22px; display:flex; gap:12px; flex-wrap:wrap;">
        <button id="saveGameBtn" class="btn ${saveBtnClass}" onclick="handleFavoriteToggle()">${saveBtnText}</button>
        ${game.website ? `<a href="${game.website}" target="_blank" rel="noopener" class="btn btn-outline">Official Site ↗</a>` : ""}
      </div>
    </div>`;

  window._currentLoadedGame = game;

  const desc = game.description_raw || game.description || "No description available.";
  document.getElementById("gameDescription").innerHTML = `
    <h2>About</h2>
    <p>${desc.substring(0, 1200)}${desc.length > 1200 ? "..." : ""}</p>
    <div class="game-tags"><strong>Tags:</strong> ${tags || "None"}</div>`;

  const screenshotEl = document.getElementById("gameScreenshots");
  if (shots && shots.results && shots.results.length > 0) {
    screenshotEl.innerHTML = `
      <h2>Screenshots</h2>
      <div class="screenshots-grid">
        ${shots.results.map(s => {
          const thumb = window.GameAPI.optimizeImageUrl(s.image);
          return `<img src="${thumb}" alt="Screenshot" loading="lazy" onclick="openLightbox('${s.image}')" />`;
        }).join("")}
      </div>`;
  } else {
    screenshotEl.innerHTML = "";
  }

  // Load similar games asynchronously
  window.GameAPI.getSimilarGames(id).then(similar => {
    const similarEl = document.getElementById("gameSimilar");
    if (similar && similar.results && similar.results.length > 0) {
      similarEl.innerHTML = `<h2>Game Series</h2><div class="games-grid">${similar.results.map(gameCard).join("")}</div>`;
    }
  });

  document.title = `${game.name} — Colon-Games`;
}

// ---- Search Results ----
async function renderSearchResults(query) {
  document.getElementById("gameContent").classList.add("hidden");
  document.getElementById("searchResults").classList.remove("hidden");
  document.getElementById("searchHeading").textContent = `Search results for "${query}"`;
  document.getElementById("searchGrid").innerHTML = `<div class="loading-spinner"></div>`;

  const data = await window.GameAPI.searchGames(query);
  if (!data || !data.results || data.results.length === 0) {
    document.getElementById("searchGrid").innerHTML = `<div class="no-results">No games found for "${query}".</div>`;
    return;
  }
  document.getElementById("searchGrid").innerHTML = data.results.map(gameCard).join("");
}

// ---- Lightbox ----
function openLightbox(src) {
  const lb = document.createElement("div");
  lb.className = "lightbox";
  lb.innerHTML = `<div class="lightbox-bg"></div><img src="${src}" alt="Screenshot" /><button class="lightbox-close" onclick="this.parentElement.remove()">✕</button>`;
  lb.querySelector(".lightbox-bg").addEventListener("click", () => lb.remove());
  document.body.appendChild(lb);
}
window.openLightbox = openLightbox;

// ---- Init ----
async function initGame() {
  renderNav();
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const search = params.get("search");

  if (id) {
    await renderGameDetail(id);
  } else if (search) {
    await renderSearchResults(decodeURIComponent(search));
  } else {
    document.getElementById("gameContent").innerHTML = `<div class="error-msg">No game selected. <a href="index.html">Go back home</a></div>`;
  }
}

window.handleFavoriteToggle = function() {
  if (!window.Auth || !window.Auth.isLoggedIn()) {
    alert("Please log in or register to save games to your profile!");
    window.location.href = "login.html";
    return;
  }
  const currentGame = window._currentLoadedGame;
  if (!currentGame) return;
  const res = window.Auth.toggleFavorite(currentGame);
  const btn = document.getElementById("saveGameBtn");
  if (btn && res.success) {
    if (res.favorited) {
      btn.textContent = "❤️ Saved in Profile";
      btn.className = "btn btn-primary";
    } else {
      btn.textContent = "🤍 Save to Profile";
      btn.className = "btn btn-outline";
    }
  }
};

document.addEventListener("DOMContentLoaded", initGame);
