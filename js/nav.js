// ============================================================
//  GameWiki — Shared Navigation (Mobile-First & Responsive)
// ============================================================

function renderNav(activePage = "") {
  const user = window.Auth ? window.Auth.getCurrentUser() : null;

  const authHTML = user
    ? `<div class="nav-user">
        <a href="profile.html" class="nav-profile-pill ${activePage === 'profile' ? 'active' : ''}" title="View My Profile">
          <div class="nav-avatar">${user.avatar || "👤"}</div>
          <span class="nav-username">${user.username}</span>
        </a>
        <a href="profile.html" class="btn btn-outline btn-sm ${activePage === 'profile' ? 'active' : ''}">👤 Profile</a>
        <button class="btn btn-outline btn-sm btn-logout" onclick="Auth.logout()">Logout</button>
      </div>`
    : `<div class="nav-auth">
        <a href="login.html" class="btn btn-outline btn-sm">Login</a>
        <a href="register.html" class="btn btn-primary btn-sm">Register</a>
      </div>`;

  const navHTML = `
    <nav class="navbar" id="navbar">
      <div class="nav-container">
        <a href="index.html" class="nav-logo">
          <span class="logo-icon">🎮</span>
          <span class="logo-text">Colon<span class="logo-accent">-Games</span></span>
        </a>
        <div class="nav-links">
          <a href="index.html" class="${activePage === 'home' ? 'active' : ''}">Home</a>
          <a href="index.html#trending" class="${activePage === 'trending' ? 'active' : ''}">Trending</a>
          <a href="index.html#upcoming" class="${activePage === 'upcoming' ? 'active' : ''}">Upcoming</a>
          <a href="about.html" class="${activePage === 'about' ? 'active' : ''}">About</a>
          ${user ? `<a href="profile.html" class="${activePage === 'profile' ? 'active' : ''}">My Profile</a>` : ''}
        </div>
        <div class="nav-search-mini" id="navSearchMini">
          <input type="text" placeholder="Search games..." id="navSearchInput" autocomplete="off" />
          <button id="navSearchBtn" aria-label="Search">🔍</button>
        </div>
        ${authHTML}
        <button class="hamburger" id="hamburger" aria-label="Toggle navigation menu">
          <span></span><span></span><span></span>
        </button>
      </div>
      <!-- Mobile Drawer Backdrop -->
      <div class="mobile-backdrop" id="mobileBackdrop"></div>
      <!-- Mobile Menu Drawer -->
      <div class="mobile-menu" id="mobileMenu">
        <div class="mobile-menu-header">
          ${user ? `
            <a href="profile.html" class="mobile-user-card">
              <div class="mobile-avatar">${user.avatar || "👤"}</div>
              <div class="mobile-user-info">
                <div class="mobile-user-name">${user.username}</div>
                <div class="mobile-user-role">View Profile →</div>
              </div>
            </a>
          ` : `
            <div class="mobile-auth-actions">
              <a href="login.html" class="btn btn-outline btn-sm" style="flex:1;justify-content:center;">Login</a>
              <a href="register.html" class="btn btn-primary btn-sm" style="flex:1;justify-content:center;">Register</a>
            </div>
          `}
        </div>

        <!-- Mobile Quick Search -->
        <div class="mobile-search-wrap">
          <input type="text" placeholder="Search games..." id="mobileSearchInput" autocomplete="off" />
          <button id="mobileSearchBtn">🔍</button>
        </div>

        <div class="mobile-nav-items">
          <a href="index.html" class="${activePage === 'home' ? 'active' : ''}">🏠 Home</a>
          <a href="index.html#trending" class="${activePage === 'trending' ? 'active' : ''}">🔥 Trending Games</a>
          <a href="index.html#upcoming" class="${activePage === 'upcoming' ? 'active' : ''}">🚀 Upcoming Games</a>
          <a href="about.html" class="${activePage === 'about' ? 'active' : ''}">ℹ️ About Colon-Games</a>
          ${user ? `
            <a href="profile.html" class="${activePage === 'profile' ? 'active' : ''}">👤 My Profile & Collection</a>
            <button class="mobile-logout-btn" onclick="Auth.logout()">🚪 Logout</button>
          ` : ''}
        </div>
      </div>
    </nav>`;

  document.body.insertAdjacentHTML("afterbegin", navHTML);

  // Scroll effect
  window.addEventListener("scroll", () => {
    const navbar = document.getElementById("navbar");
    if (navbar) {
      navbar.classList.toggle("scrolled", window.scrollY > 30);
    }
  });

  // Top Nav search
  const navInput = document.getElementById("navSearchInput");
  const navBtn = document.getElementById("navSearchBtn");
  function doNavSearch() {
    const q = navInput ? navInput.value.trim() : "";
    if (q) window.location.href = `game.html?search=${encodeURIComponent(q)}`;
  }
  if (navBtn && navInput) {
    navBtn.addEventListener("click", doNavSearch);
    navInput.addEventListener("keydown", e => { if (e.key === "Enter") doNavSearch(); });
  }

  // Mobile drawer search
  const mobInput = document.getElementById("mobileSearchInput");
  const mobBtn = document.getElementById("mobileSearchBtn");
  function doMobileSearch() {
    const q = mobInput ? mobInput.value.trim() : "";
    if (q) window.location.href = `game.html?search=${encodeURIComponent(q)}`;
  }
  if (mobBtn && mobInput) {
    mobBtn.addEventListener("click", doMobileSearch);
    mobInput.addEventListener("keydown", e => { if (e.key === "Enter") doMobileSearch(); });
  }

  // Hamburger & Backdrop toggle
  const hamburger = document.getElementById("hamburger");
  const mobileMenu = document.getElementById("mobileMenu");
  const backdrop = document.getElementById("mobileBackdrop");

  function closeMenu() {
    if (mobileMenu) mobileMenu.classList.remove("open");
    if (hamburger) hamburger.classList.remove("active");
    if (backdrop) backdrop.classList.remove("open");
    document.body.style.overflow = "";
  }

  function openMenu() {
    if (mobileMenu) mobileMenu.classList.add("open");
    if (hamburger) hamburger.classList.add("active");
    if (backdrop) backdrop.classList.add("open");
    document.body.style.overflow = "hidden"; // Prevent background scroll when menu open
  }

  if (hamburger) {
    hamburger.addEventListener("click", () => {
      if (mobileMenu.classList.contains("open")) {
        closeMenu();
      } else {
        openMenu();
      }
    });
  }

  if (backdrop) {
    backdrop.addEventListener("click", closeMenu);
  }

  // Close mobile menu when clicking any internal link
  if (mobileMenu) {
    mobileMenu.querySelectorAll("a").forEach(a => {
      a.addEventListener("click", closeMenu);
    });
  }
}

window.renderNav = renderNav;
