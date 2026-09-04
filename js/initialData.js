// ============================================================
//  GameWiki — Instant Fast Cache & Fallback Data
//  Renders in 0.05 seconds so users never wait on slow networks
// ============================================================

window.INITIAL_GAMES = {
  trending: [
    {
      id: 3498,
      name: "Grand Theft Auto V",
      background_image: "https://media.rawg.io/media/crop/600/400/games/20a/20aa03a10eef45239f526470c863e9f7.jpg",
      metacritic: 92,
      released: "2013-09-17",
      genres: [{ name: "Action" }, { name: "Adventure" }],
      platforms: [{ platform: { name: "PC" } }, { platform: { name: "PlayStation" } }, { platform: { name: "Xbox" } }]
    },
    {
      id: 3328,
      name: "The Witcher 3: Wild Hunt",
      background_image: "https://media.rawg.io/media/crop/600/400/games/618/618c2031a07046f8617acdf149a4b151.jpg",
      metacritic: 92,
      released: "2015-05-18",
      genres: [{ name: "Action" }, { name: "RPG" }],
      platforms: [{ platform: { name: "PC" } }, { platform: { name: "PlayStation" } }, { platform: { name: "Xbox" } }]
    },
    {
      id: 41494,
      name: "Cyberpunk 2077",
      background_image: "https://media.rawg.io/media/crop/600/400/games/26d/26d44377d5966a495b300421870222d7.jpg",
      metacritic: 86,
      released: "2020-12-10",
      genres: [{ name: "Action" }, { name: "RPG" }],
      platforms: [{ platform: { name: "PC" } }, { platform: { name: "PlayStation" } }, { platform: { name: "Xbox" } }]
    },
    {
      id: 326243,
      name: "Elden Ring",
      background_image: "https://media.rawg.io/media/crop/600/400/games/b29/b2960ad9f6d086785b3b2d1d5e43b609.jpg",
      metacritic: 96,
      released: "2022-02-25",
      genres: [{ name: "Action" }, { name: "RPG" }],
      platforms: [{ platform: { name: "PC" } }, { platform: { name: "PlayStation" } }, { platform: { name: "Xbox" } }]
    },
    {
      id: 28,
      name: "Red Dead Redemption 2",
      background_image: "https://media.rawg.io/media/crop/600/400/games/511/5118aff50f428796e3bb070c083369ab.jpg",
      metacritic: 97,
      released: "2018-10-26",
      genres: [{ name: "Action" }, { name: "Adventure" }],
      platforms: [{ platform: { name: "PC" } }, { platform: { name: "PlayStation" } }, { platform: { name: "Xbox" } }]
    },
    {
      id: 613,
      name: "Baldur's Gate 3",
      background_image: "https://media.rawg.io/media/crop/600/400/games/009/009e4e8497573627973a82014e304ffb.jpg",
      metacritic: 96,
      released: "2023-08-03",
      genres: [{ name: "RPG" }, { name: "Strategy" }],
      platforms: [{ platform: { name: "PC" } }, { platform: { name: "PlayStation" } }, { platform: { name: "Xbox" } }]
    }
  ],
  upcoming: [
    {
      id: 963875,
      name: "Grand Theft Auto VI",
      background_image: "https://media.rawg.io/media/crop/600/400/games/456/456dea5e1c7e3cd07060c14e96612001.jpg",
      metacritic: null,
      released: "2025-10-01",
      genres: [{ name: "Action" }, { name: "Adventure" }],
      platforms: [{ platform: { name: "PlayStation" } }, { platform: { name: "Xbox" } }]
    },
    {
      id: 654274,
      name: "Marvel's Wolverine",
      background_image: "https://media.rawg.io/media/crop/600/400/games/d82/d8236db0a673010b1a04f20aec89104b.jpg",
      metacritic: null,
      released: "2026-06-01",
      genres: [{ name: "Action" }, { name: "Adventure" }],
      platforms: [{ platform: { name: "PlayStation" } }]
    },
    {
      id: 891661,
      name: "Death Stranding 2: On The Beach",
      background_image: "https://media.rawg.io/media/crop/600/400/games/c4b/c4b0cab189e73432de3a250d8cf0452e.jpg",
      metacritic: null,
      released: "2025-11-15",
      genres: [{ name: "Action" }, { name: "Adventure" }],
      platforms: [{ platform: { name: "PlayStation" } }]
    },
    {
      id: 9767,
      name: "Hollow Knight: Silksong",
      background_image: "https://media.rawg.io/media/crop/600/400/games/7a2/7a2500ee8b230349545d7a030064f266.jpg",
      metacritic: null,
      released: "2025-12-31",
      genres: [{ name: "Action" }, { name: "Platformer" }],
      platforms: [{ platform: { name: "PC" } }, { platform: { name: "Nintendo" } }, { platform: { name: "Xbox" } }]
    },
    {
      id: 894562,
      name: "Judas",
      background_image: "https://media.rawg.io/media/crop/600/400/games/082/0823630076a35d855883842c57f0709d.jpg",
      metacritic: null,
      released: "2026-03-31",
      genres: [{ name: "Shooter" }, { name: "Action" }],
      platforms: [{ platform: { name: "PC" } }, { platform: { name: "PlayStation" } }, { platform: { name: "Xbox" } }]
    },
    {
      id: 963884,
      name: "Monster Hunter Wilds",
      background_image: "https://media.rawg.io/media/crop/600/400/games/b45/b45575571e224e9e087b3984fa1e2b50.jpg",
      metacritic: null,
      released: "2025-02-28",
      genres: [{ name: "Action" }, { name: "RPG" }],
      platforms: [{ platform: { name: "PC" } }, { platform: { name: "PlayStation" } }, { platform: { name: "Xbox" } }]
    }
  ],
  topRated: [
    {
      id: 4200,
      name: "Portal 2",
      background_image: "https://media.rawg.io/media/crop/600/400/games/328/3283614cb7d75d67257fc58339188811.jpg",
      metacritic: 95,
      released: "2011-04-18",
      genres: [{ name: "Puzzle" }, { name: "Shooter" }],
      platforms: [{ platform: { name: "PC" } }, { platform: { name: "PlayStation" } }, { platform: { name: "Xbox" } }]
    },
    {
      id: 5679,
      name: "The Elder Scrolls V: Skyrim",
      background_image: "https://media.rawg.io/media/crop/600/400/games/7cf/7cfc92f8b323766736b4e347170333ba.jpg",
      metacritic: 94,
      released: "2011-11-11",
      genres: [{ name: "RPG" }, { name: "Action" }],
      platforms: [{ platform: { name: "PC" } }, { platform: { name: "PlayStation" } }, { platform: { name: "Xbox" } }]
    },
    {
      id: 58617,
      name: "God of War (2018)",
      background_image: "https://media.rawg.io/media/crop/600/400/games/4be/4be6a6ad0364751a96229c56bf69be59.jpg",
      metacritic: 94,
      released: "2018-04-20",
      genres: [{ name: "Action" }, { name: "Adventure" }],
      platforms: [{ platform: { name: "PC" } }, { platform: { name: "PlayStation" } }]
    },
    {
      id: 12020,
      name: "Left 4 Dead 2",
      background_image: "https://media.rawg.io/media/crop/600/400/games/d58/d588947d4286e7b5e0e12e1bea7d9844.jpg",
      metacritic: 89,
      released: "2009-11-17",
      genres: [{ name: "Shooter" }, { name: "Action" }],
      platforms: [{ platform: { name: "PC" } }, { platform: { name: "Xbox" } }]
    },
    {
      id: 802,
      name: "Borderlands 2",
      background_image: "https://media.rawg.io/media/crop/600/400/games/49c/49c34a8e5744b47fae6aa233cd0e60af.jpg",
      metacritic: 89,
      released: "2012-09-18",
      genres: [{ name: "Shooter" }, { name: "RPG" }],
      platforms: [{ platform: { name: "PC" } }, { platform: { name: "PlayStation" } }, { platform: { name: "Xbox" } }]
    },
    {
      id: 4286,
      name: "BioShock Infinite",
      background_image: "https://media.rawg.io/media/crop/600/400/games/fc1/fc1307a27745037bd623d224bf0ede43.jpg",
      metacritic: 94,
      released: "2013-03-26",
      genres: [{ name: "Shooter" }, { name: "Action" }],
      platforms: [{ platform: { name: "PC" } }, { platform: { name: "PlayStation" } }, { platform: { name: "Xbox" } }]
    }
  ]
};
