// script.js
// ==============================
// Global Variables
// ==============================
let linksData = [];
let sortByRating = true;
const FAVORITES_KEY = 'favoriteLinks';
let favoriteStatuses = {};
let signedIn = false;
let userName = "";
let userEmail = "";
// ==============================
// SVG Icons for Favorites
// ==============================
const filledStarSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
viewBox="0 0 24 24"><path fill="#FFCB05" d="M12 17.27L18.18 21L16.54 14.14
L22 9.24L14.81 8.63L12 2L9.19
8.63L2 9.24L7.45 14.14L5.82 21
L12 17.27Z"/></svg>`;
const outlinedStarSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
viewBox="0 0 24 24"><path fill="currentColor" d="M22 9.24L14.81 8.63L12 2L9.19
8.63L2 9.24L7.45 14.14L5.82 21L12
17.27L18.18 21L16.54 14.14L22
9.24ZM12 15.4L8.24 17.67L9.23
13.39L5.9 10.63L10.29 10.13L12
6.1L13.71 10.13L18.1 10.63L14.77
13.39L15.77 17.67L12 15.4Z"/></svg>`;
const optionsIconSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
viewBox="0 0 24 24"><path fill="#555" d="M12 16a2 2 0 110 4 2 2 0 010-4zm0-6a2 2 0 110 4 2 2 0 010-4zm0-6a2 2 0 110 4 2 2 0 010-4z"/></svg>`;
const footballSVG =
  `<svg width="800px" height="800px" viewBox="0 0 72 72" id="emoji" version="1.1" xmlns="http://www.w3.org/2000/svg">
  <g id="line-supplement">
    <line x1="36" x2="36" y1="4.2" y2="67.7" fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2"/>
    <line x1="38.9" x2="33.1" y1="35.9" y2="35.9" fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2"/>
    <line x1="38.9" x2="33.1" y1="30.9" y2="30.9" fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2"/>
    <line x1="38.9" x2="33.1" y1="40.9" y2="40.9" fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2"/>
    <line x1="25.6" x2="46.5" y1="58.6" y2="58.6" fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2"/>
    <line x1="23.6" x2="48.4" y1="16" y2="16" fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2"/>
  </g>
  <g id="color">
    <path fill="#A57939" d="M35.9,4c-11,6.4-18.3,18.3-18.3,31.9S25,61.5,36,67.9h0.1C47,61.5,54.4,49.6,54.4,36 C54.4,22.3,47,10.4,35.9,4"/>
    <path fill="#6A462F" d="M41.7,8.1c5.8,7.9,9.2,18.8,7.4,29.1C47,48.9,39.6,58.4,29.9,63.5c1.9,1.7,3.9,3.2,6.1,4.5h0.1 c11-6.4,18.3-18.3,18.3-31.9C54.4,25.3,49.1,14.9,41.7,8.1z"/>
    <line x1="36" x2="36" y1="4.2" y2="67.7" fill="none" stroke="#FFFFFF" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2"/>
    <line x1="38.9" x2="33.1" y1="35.9" y2="35.9" fill="none" stroke="#FFFFFF" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2"/>
    <line x1="38.9" x2="33.1" y1="30.9" y2="30.9" fill="none" stroke="#FFFFFF" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2"/>
    <line x1="38.9" x2="33.1" y1="40.9" y2="40.9" fill="none" stroke="#FFFFFF" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2"/>
    <line x1="25.6" x2="46.5" y1="58.6" y2="58.6" fill="none" stroke="#FFFFFF" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2"/>
    <line x1="23.6" x2="48.4" y1="16" y2="16" fill="none" stroke="#FFFFFF" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2"/>
  </g>
  <g id="hair"/>
  <g id="skin"/>
  <g id="skin-shadow"/>
  <g id="line">
    <path fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2" d="M35.9,4c-11,6.4-18.3,18.3-18.3,31.9S25,61.5,36,67.9h0.1C47,61.5,54.4,49.6,54.4,36C54.4,22.3,47,10.4,35.9,4"/>
  </g>
</svg>`

// ==============================
// Favorites Handling
// ==============================
/**
 * Load favorite statuses from localStorage and initialize favorites.
 */
function loadFavorites() {
  const storedFavorites = localStorage.getItem(FAVORITES_KEY);
  if (storedFavorites) {
    try {
      const storedFavoritesObj = JSON.parse(storedFavorites);
      favoriteStatuses = { ...favoriteStatuses, ...storedFavoritesObj };
    } catch (e) {
      console.error("Failed to parse favorite links from localStorage.", e);
    }
  }
  // Initialize favoriteStatuses based on linksData if needed
  linksData.forEach(link => {
    if (favoriteStatuses[link.uniqueKey] === undefined) {
      favoriteStatuses[link.uniqueKey] = link.favorite || false;
    }
  });
  saveFavorites();
}
/**
 * Save current favorite statuses to localStorage.
 */
function saveFavorites() {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favoriteStatuses));
}
/**
 * Check if a link is favorited.
 * @param {Object} link - The link object.
 * @returns {boolean} - Favorite status.
 */
function isLinkFavorited(link) {
  return favoriteStatuses[link.uniqueKey] || false;
}
/**
 * Add a link to favorites.
 * @param {Object} link - The link object.
 */
function addFavorite(link) {
  favoriteStatuses[link.uniqueKey] = true;
  saveFavorites();
}
/**
 * Remove a link from favorites.
 * @param {Object} link - The link object.
 */
function removeFavorite(link) {
  favoriteStatuses[link.uniqueKey] = false;
  saveFavorites();
}
// ==============================
// UI Rendering Functions
// ==============================
/**
 * Create a card element for a given link.
 * @param {Object} link - The link object.
 * @returns {HTMLElement} - The card element.
 */
function CreateCard(link) {
  const card = document.createElement("a");
  card.className = "card";
  card.href = link.href;
  card.dataset.uniqueKey = link.uniqueKey;
  if (link.openInNewWindow) {
    card.target = "_blank";
    card.rel = "noopener";
  }
  const header = document.createElement("h3");
  header.textContent = link.title;
  card.appendChild(header);
  const subHeader = document.createElement("p");
  subHeader.className = "sub-header";
  subHeader.textContent = link.applicationName;
  card.appendChild(subHeader);
  const img = document.createElement("img");
  img.src = link.image;
  img.alt = link.alt;
  card.appendChild(img);
  const star = document.createElement("span");
  star.className = "favorite-star";
  if (isLinkFavorited(link)) {
    // Set filled star icon
    star.innerHTML = filledStarSVG;
    star.classList.add("favorited");
    card.classList.add("favorited-card");
  } else {
    // Set the outlined star icon
    star.innerHTML = outlinedStarSVG;
  }
  card.appendChild(star);
  // Add hover effect for the star
  star.addEventListener("mouseover", () => {
    star.style.transform = "scale(1.2)";
    star.style.color = "#FFCB05"; // Optional: Apply a color highlight
  });
  star.addEventListener("mouseout", () => {
    if (!isLinkFavorited(link)) {
      star.style.color = ""; // Reset to default color
    }
    star.style.transform = "scale(1)";
  });
  // Click event for favoriting
  star.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent card click
    if (isLinkFavorited(link)) {
      // Remove from favorites
      removeFavorite(link);
      star.classList.remove("favorited");
      card.classList.remove("favorited-card");
      // Set to outlined star
      star.innerHTML = outlinedStarSVG;
      // Trigger unfill animation
      star.classList.add("animate-unfill");
      // Remove the animation class after animation completes
      star.addEventListener("animationend", () => {
        star.classList.remove("animate-unfill");
      }, { once: true });
      // Remove card from favorites containers
      removeCardFromFavoritesContainers(card);
    } else {
      // Add to favorites
      addFavorite(link);
      star.classList.add("favorited");
      card.classList.add("favorited-card");
      // Set to filled star
      star.innerHTML = filledStarSVG;
      // Trigger fill animation
      star.classList.add("animate-fill");
      // Remove the animation class after animation completes
      star.addEventListener("animationend", () => {
        star.classList.remove("animate-fill");
      }, { once: true });
      // Add card to favorites containers
      addCardToFavoritesContainers(card);
    }
    // Update the star icon appearance
    updateStarAppearance(star, link);
    // Re-render favorites if necessary
    if (typeof RenderFavorites === 'function') {
      RenderFavorites();
    }
  });
  // Add hover effects to the card
  card.addEventListener("mouseover", () => {
    card.style.transform = "translateY(-5px)";
    const favoriteStar = card.querySelector(".favorite-star");
    if (favoriteStar) {
      favoriteStar.style.display = "block";
    }
  });
  card.addEventListener("mouseout", () => {
    card.style.transform = "translateY(0px)";
    const favoriteStar = card.querySelector(".favorite-star");
    if (favoriteStar && !isLinkFavorited(link)) {
      favoriteStar.style.display = "none";
    }
  });
  return card;
}
/**
 * Create a favorite card element for a given link.
 * @param {Object} link - The link object.
 * @returns {HTMLElement} - The favorite card element.
 */
function CreateFavoriteCard(link) {
  const card = document.createElement("a");
  card.className = "favorite-card";
  card.href = link.href;
  card.dataset.uniqueKey = link.uniqueKey;
  if (link.openInNewWindow) {
    card.target = "_blank";
    card.rel = "noopener";
  }

  const header = document.createElement("h3");
  header.textContent = link.title;
  card.appendChild(header);
  const subHeader = document.createElement("p");
  subHeader.className = "sub-header";
  subHeader.textContent = link.applicationName;
  card.appendChild(subHeader);
  const img = document.createElement("img");
  img.src = link.image;
  img.alt = link.alt;
  card.appendChild(img);

  card.style.transition = "transform 0.3s ease";

  // Add the options icon (three dots)
  const optionsIcon = document.createElement("span");
  optionsIcon.className = "options-icon";
  optionsIcon.innerHTML = optionsIconSVG;
  card.appendChild(optionsIcon);
  optionsIcon.style.display = "none";

  // Create the options menu
  const optionsMenu = document.createElement("div");
  optionsMenu.className = "options-menu";
  const removeFavoriteOption = document.createElement("div");
  removeFavoriteOption.className = "options-menu-item";
  removeFavoriteOption.textContent = "Remove Favorite";
  optionsMenu.appendChild(removeFavoriteOption);

  // Add the options menu to the card
  card.appendChild(optionsMenu);

  // Event listener for optionsIcon click to toggle the menu
  optionsIcon.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent card click
    optionsMenu.classList.toggle("active");
  });

  // Event listener for removeFavoriteOption click
  removeFavoriteOption.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent card click

    // Remove from favorites
    removeFavorite(link);

    // Update the card UI
    card.remove();

    // Remove card from other favorites containers
    removeCardFromFavoritesContainers(card);

    // Re-render the favorites if necessary
    RenderFavorites();
  });

  // Close options menu when clicking outside
  document.addEventListener("click", (event) => {
    if (!optionsMenu.contains(event.target) && event.target !== optionsIcon) {
      optionsMenu.classList.remove("active");
    }
  });

  // Prevent menu from closing when clicking inside
  optionsMenu.addEventListener("click", (e) => {
    e.stopPropagation();
  });

  // Add hover effects to the card
  card.addEventListener("mouseover", () => {
    optionsIcon.style.display = "block";
    card.style.transform = "translateY(-5px)";
  });
  card.addEventListener("mouseout", () => {
    optionsIcon.style.display = "none";
    card.style.transform = "translateY(0px)";
  });

  card.addEventListener("mouseleave", () => {
    optionsIcon.style.display = "none";
    optionsMenu.classList.remove("active");
    card.style.transform = "translateY(0px)";
  });


  return card;
}
/**
 * Add a card to all favorites containers.
 * @param {HTMLElement} card - The card element to add.
 */
function addCardToFavoritesContainers(card) {
  const favoriteContainers = [
    document.getElementById("all-favorites-container"),
    document.getElementById("favorite-links-nav-container"),
    document.getElementById("hero-pinned-container")
  ];
  favoriteContainers.forEach(container => {
    if (container) {
      // Remove "No pinned links yet." if present
      const noFavorites = container.querySelector("p");
      if (noFavorites && noFavorites.textContent === "No pinned links yet.") {
        container.removeChild(noFavorites);
      }
      // Check if the card is already present to avoid duplicates
      if (!container.querySelector(`[data-unique-key="${card.dataset.uniqueKey}"]`)) {
        const link = linksData.find(l => l.uniqueKey === card.dataset.uniqueKey);
        let newCard;
        if (container.id === "all-favorites-container") {
          newCard = CreateFavoriteCard(link);
        } else {
          newCard = CreateCard(link);
        }
        container.appendChild(newCard);
      }
    }
  });
}
/**
 * Remove a card from all favorites containers.
 * @param {HTMLElement} card - The card element to remove.
 */
function removeCardFromFavoritesContainers(card) {
  const favoriteContainers = [
    document.getElementById("all-favorites-container"),
    document.getElementById("favorite-links-nav-container"),
    document.getElementById("hero-pinned-container")
  ];
  favoriteContainers.forEach(container => {
    if (container) {
      const cardToRemove = container.querySelector(`[data-unique-key="${card.dataset.uniqueKey}"]`);
      if (cardToRemove) {
        cardToRemove.remove();
      }
      // If no favorites left, show "No pinned links yet."
      if (container.querySelectorAll(".card, .favorite-card").length === 0) {
        const noFavorites = document.createElement("p");
        noFavorites.textContent = "No pinned links yet.";
        container.appendChild(noFavorites);
      }
    }
  });
}
/**
 * Update the star icon's appearance based on favorite status.
 * @param {HTMLElement} star - The star element.
 * @param {Object} link - The link object.
 */
function updateStarAppearance(star, link) {
  if (isLinkFavorited(link)) {
    star.innerHTML = filledStarSVG;
    star.classList.add("favorited");
  } else {
    star.innerHTML = outlinedStarSVG;
    star.classList.remove("favorited");
  }
}
/**
 * Populate favorites containers based on current favorite statuses.
 */
function populateFavoritesContainers() {
  const favoriteContainers = [
    document.getElementById("all-favorites-container"),
    document.getElementById("favorite-links-nav-container"),
    document.getElementById("hero-pinned-container")
  ];
  favoriteContainers.forEach(container => {
    if (container) {
      container.innerHTML = "";
      const favoritedLinks = linksData.filter(link => isLinkFavorited(link));
      if (favoritedLinks.length === 0) {
        const noFavorites = document.createElement("p");
        noFavorites.textContent = "No pinned links yet.";
        container.appendChild(noFavorites);
      } else {
        favoritedLinks.slice(0, 4).forEach(link => {
          let card;
          if (container.id === "all-favorites-container") {
            card = CreateFavoriteCard(link);
          } else {
            card = CreateCard(link);
          }
          container.appendChild(card);
        });
      }
    }
  });
}
// ==============================
// Event Listeners
// ==============================
window.addEventListener("scroll", () => {
  const backToTopButton = document.querySelector(".back-to-top");
  const homeButton = document.querySelector(".home-button");
  if (window.scrollY > 200) {
    backToTopButton.style.display = "block";
    homeButton.style.display = "block";
  } else {
    backToTopButton.style.display = "none";
    homeButton.style.display = "none";
  }
});
document.querySelector(".back-to-top")?.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});
document.querySelector(".home-button")?.addEventListener("click", () => {
  window.location.href = "index.html";
});
// ==============================
// Data Fetching and Initialization
// ==============================
/**
 * Fetch tasks data and initialize the page.
 */
fetch("../Assets/JSON Files/tasks.json")
  .then(response => {
    if (!response.ok) {
      console.error("Failed to load tasks.json. Make sure it exists at ../Assets/JSON Files/tasks.json.");
      return [];
    }
    return response.json();
  })
  .then(data => {
    linksData = data;
    initializePage();
  })
  .catch(() => {
    console.error("Error fetching tasks.json.");
    initializePage();
  });
/**
 * Initialize the page with fetched data and user information.
 */
function initializePage() {
  // For demonstration, set signedIn to true and user info
  signedIn = true;
  userName = "Kaden";
  userEmail = "kgruiz@umich.edu";
  loadFavorites();
  // Populate Most Popular
  const mostPopularContainer = document.getElementById("most-popular-container");
  if (mostPopularContainer && linksData.length > 0) {
    const sortedByRank = [...linksData].sort((a, b) => b.currentRating - a.currentRating);
    const top4 = sortedByRank.slice(0, 4);
    top4.forEach(link => {
      const card = CreateCard(link);
      mostPopularContainer.append(card);
    });
  }
  // Populate All Links on Index
  const allLinksContainer = document.getElementById("all-links-container");
  if (allLinksContainer && linksData.length > 0) {
    const sortedByRank = [...linksData].sort((a, b) => b.currentRating - a.currentRating);
    const top10 = sortedByRank.slice(0, 10);
    const next30 = sortedByRank.slice(10, 40);
    top10.forEach(link => {
      const card = CreateCard(link);
      card.classList.add("initial-cards");
      allLinksContainer.append(card);
    });
    next30.forEach(link => {
      const card = CreateCard(link);
      card.classList.add("additional-cards", "hidden");
      allLinksContainer.append(card);
    });
  }
  // Initialize Favorites in Hero and Nav
  populateFavoritesContainers();
  // All Links Full Page
  const allLinksFullContainer = document.getElementById("all-links-full-container");
  if (allLinksFullContainer) {
    let sortType = "rank";
    let searchTerm = "";
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has("q")) {
      searchTerm = urlParams.get("q").toLowerCase();
    }
    function RenderAllLinksFull() {
      allLinksFullContainer.innerHTML = "";
      let linksToShow = [...linksData];
      if (sortType === "rank") {
        linksToShow.sort((a, b) => b.currentRating - a.currentRating);
      } else if (sortType === "alphabetical") {
        linksToShow.sort((a, b) => a.title.localeCompare(b.title));
      }
      if (searchTerm.trim() !== "") {
        linksToShow = linksToShow.filter(link =>
        ((link.title && link.title.toLowerCase().includes(searchTerm)) ||
          (link.applicationName && link.applicationName.toLowerCase().includes(searchTerm)))
        );
      }
      if (linksToShow.length === 0) {
        const noResults = document.createElement("p");
        noResults.textContent = "No results found.";
        allLinksFullContainer.appendChild(noResults);
      } else {
        linksToShow.forEach(link => {
          const card = CreateCard(link);
          allLinksFullContainer.append(card);
        });
      }
      // No need to call updateAllCardStars
      initializeCardHoverEffects(); // Re-initialize hover effects
    }
    const fullSearchInput = document.getElementById("fullSearchInput");
    if (fullSearchInput) {
      fullSearchInput.value = searchTerm;
      fullSearchInput.addEventListener("input", () => {
        searchTerm = fullSearchInput.value.toLowerCase();
        RenderAllLinksFull();
      });
    }
    const toggle = document.getElementById("toggle");
    if (toggle) {
      toggle.addEventListener("change", () => {
        sortType = toggle.checked ? "alphabetical" : "rank";
        RenderAllLinksFull();
      });
    }
    RenderAllLinksFull();
    const showMoreButton = document.getElementById("show-more");
    const showLessButton = document.getElementById("show-less");
    const showAllButton = document.getElementById("show-all");
    showMoreButton?.addEventListener("click", () => {
      const additionalCards = document.querySelectorAll(".additional-cards");
      additionalCards.forEach(card => {
        card.classList.remove("hidden");
      });
      showMoreButton.classList.add("hidden");
      showLessButton.classList.remove("hidden");
      showAllButton.classList.remove("hidden");
    });
    showLessButton?.addEventListener("click", () => {
      const additionalCards = document.querySelectorAll(".additional-cards");
      additionalCards.forEach(card => {
        card.classList.add("hidden");
      });
      showMoreButton.classList.remove("hidden");
      showLessButton.classList.add("hidden");
      showAllButton.classList.add("hidden");
    });
    initializeSignInMenu();
    initializeHoverMenus();
    initializeButtonEffects();
    initializeCardHoverEffects();
    initializeNavIconsHoverEffects();
    initializeFavoritesIconHoverEffects();
  }
  // Favorites Manager Page
  const favoritesManagerContainer = document.getElementById("all-favorites-container");
  if (favoritesManagerContainer) {
    let sortType = "rank";
    let searchTerm = "";

    const fullSearchInputFavorites = document.getElementById("fullSearchInputFavorites");
    if (fullSearchInputFavorites) {
      fullSearchInputFavorites.addEventListener("input", () => {
        searchTerm = fullSearchInputFavorites.value.toLowerCase();
        RenderFavorites();
      });
    }

    const toggleFavorites = document.querySelector(".sort-type-selector-favorites");
    if (toggleFavorites) {
      toggleFavorites.addEventListener("change", () => {
        sortType = toggleFavorites.checked ? "alphabetical" : "rank";
        RenderFavorites();
      });
    }

    function RenderFavorites() {
      favoritesManagerContainer.innerHTML = "";
      let favoritedLinks = linksData.filter(link => isLinkFavorited(link));

      if (sortType === "rank") {
        favoritedLinks.sort((a, b) => b.currentRating - a.currentRating);
      } else if (sortType === "alphabetical") {
        favoritedLinks.sort((a, b) => a.title.localeCompare(b.title));
      }

      if (searchTerm.trim() !== "") {
        favoritedLinks = favoritedLinks.filter(link =>
          (link.title && link.title.toLowerCase().includes(searchTerm)) ||
          (link.applicationName && link.applicationName.toLowerCase().includes(searchTerm))
        );
      }

      if (favoritedLinks.length === 0) {
        const noFavorites = document.createElement("p");
        noFavorites.textContent = "No pinned links yet.";
        favoritesManagerContainer.appendChild(noFavorites);
      } else {
        favoritedLinks.forEach(link => {
          const card = CreateFavoriteCard(link);
          favoritesManagerContainer.appendChild(card);
        });
      }
    }

    RenderFavorites();
    initializeSignInMenu();
    initializeHoverMenus();
    initializeButtonEffects();
    initializeCardHoverEffects();
    initializeNavIconsHoverEffects();
    initializeFavoritesIconHoverEffects();
  }
  // Setup Search Suggestions
  const headerInput = document.getElementById("headerSearchInput");
  const headerSuggestions = document.getElementById("headerSearchSuggestions");
  const heroInput = document.getElementById("heroSearchInput");
  const heroSuggestions = document.getElementById("heroSearchSuggestions");
  if (headerInput && headerSuggestions) {
    SetupSearchSuggestions(headerInput, headerSuggestions);
  }
  if (heroInput && heroSuggestions) {
    SetupSearchSuggestions(heroInput, heroSuggestions);
  }
  // Show More/Less
  const showMoreButton = document.getElementById("show-more");
  const showLessButton = document.getElementById("show-less");
  const showAllButton = document.getElementById("show-all");
  showMoreButton?.addEventListener("click", () => {
    const additionalCards = document.querySelectorAll(".additional-cards");
    additionalCards.forEach(card => {
      card.classList.remove("hidden");
    });
    showMoreButton.classList.add("hidden");
    showLessButton.classList.remove("hidden");
    showAllButton.classList.remove("hidden");
  });
  showLessButton?.addEventListener("click", () => {
    const additionalCards = document.querySelectorAll(".additional-cards");
    additionalCards.forEach(card => {
      card.classList.add("hidden");
    });
    showMoreButton.classList.remove("hidden");
    showLessButton.classList.add("hidden");
    showAllButton.classList.add("hidden");
  });
  initializeSignInMenu();
  initializeHoverMenus();
  initializeButtonEffects();
  initializeCardHoverEffects();
  initializeNavIconsHoverEffects();
  initializeFavoritesIconHoverEffects();
}
// ==============================
// Search Suggestions Setup
// ==============================
/**
 * Setup search suggestions for an input element.
 * @param {HTMLElement} inputElement - The search input element.
 * @param {HTMLElement} suggestionsContainer - The container for suggestions.
 */
function SetupSearchSuggestions(inputElement, suggestionsContainer) {
  let currentIndex = -1;
  let suggestionItems = [];
  inputElement.addEventListener("input", onInput);
  inputElement.addEventListener("keydown", onKeyDown);
  document.addEventListener("click", onDocumentClick);
  const formElement = inputElement.closest("form");
  const searchButton = formElement?.querySelector("button");
  searchButton?.addEventListener("click", onSearchButtonClick);
  function onInput() {
    const query = inputElement.value.trim().toLowerCase();
    if (!query) {
      hideSuggestions();
      return;
    }
    const filtered = linksData.filter(link =>
      (link.title && link.title.toLowerCase().includes(query)) ||
      (link.applicationName && link.applicationName.toLowerCase().includes(query))
    );
    buildSuggestions(query, filtered.slice(0, 5));
  }
  function buildSuggestions(query, results) {
    suggestionsContainer.innerHTML = "";
    currentIndex = -1;
    suggestionItems = [];
    const topItem = document.createElement("div");
    topItem.className = "search-suggestion-item";
    topItem.textContent = `Search for "${inputElement.value.trim()}"`;
    topItem.addEventListener("click", () => {
      goToSearchPage(inputElement.value.trim());
    });
    suggestionsContainer.appendChild(topItem);
    suggestionItems.push({ element: topItem, isSearchOption: true, link: null });
    results.forEach(link => {
      const item = document.createElement("div");
      item.className = "search-suggestion-item";
      item.textContent = link.title;
      item.addEventListener("click", () => {
        window.location.href = link.href;
      });
      suggestionsContainer.appendChild(item);
      suggestionItems.push({ element: item, isSearchOption: false, link: link.href });
    });
    suggestionsContainer.classList.add("active");
    if (suggestionItems.length > 0) {
      currentIndex = 0;
      highlightCurrentItem();
    }
  }
  function hideSuggestions() {
    suggestionsContainer.innerHTML = "";
    suggestionsContainer.classList.remove("active");
    currentIndex = -1;
    suggestionItems = [];
  }
  function onKeyDown(e) {
    if (!suggestionsContainer.classList.contains("active")) return;
    const maxIndex = suggestionItems.length - 1;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      currentIndex = (currentIndex + 1) > maxIndex ? 0 : currentIndex + 1;
      highlightCurrentItem();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      currentIndex = (currentIndex - 1) < 0 ? maxIndex : currentIndex - 1;
      highlightCurrentItem();
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (currentIndex === -1 || suggestionItems[currentIndex].isSearchOption) {
        goToSearchPage(inputElement.value.trim());
      } else {
        window.location.href = suggestionItems[currentIndex].link;
      }
    } else if (e.key === "Escape") {
      hideSuggestions();
    }
  }
  function highlightCurrentItem() {
    suggestionItems.forEach((item, index) => {
      if (index === currentIndex) {
        item.element.classList.add("highlighted");
      } else {
        item.element.classList.remove("highlighted");
      }
    });
  }
  function onDocumentClick(e) {
    if (!suggestionsContainer.contains(e.target) && e.target !== inputElement) {
      hideSuggestions();
    }
  }
  function goToSearchPage(query) {
    if (!query) return;
    window.location.href = `all-links-full.html?q=${encodeURIComponent(query)}`;
  }
  function onSearchButtonClick() {
    if (currentIndex === -1 || suggestionItems[currentIndex]?.isSearchOption === true) {
      goToSearchPage(inputElement.value.trim());
    } else {
      window.location.href = suggestionItems[currentIndex].link;
    }
  }
}
// ==============================
// Sign-In Menu Initialization
// ==============================
/**
 * Initialize the sign-in menu based on user authentication status.
 */
function initializeSignInMenu() {
  const signInMenu = document.getElementById("sign-in-menu");
  const signInMenuToggle = document.getElementById("sign-in-menu-toggle");
  const signInName = document.getElementById("sign-in-name");
  const signInEmail = document.getElementById("sign-in-email");
  const signInProfilePic = document.getElementById("sign-in-profile-pic");
  const signInItems = document.getElementById("sign-in-items");
  const signInSeparator = document.getElementById("sign-in-separator"); // Ensure your <hr /> has this ID
  if (signedIn) {
    const initials = userName.split(' ').map(n => n[0].toUpperCase()).join('');
    signInProfilePic.textContent = initials;
    signInProfilePic.style.display = 'block';
    signInName.textContent = userName;
    signInName.style.display = 'block';
    signInEmail.textContent = userEmail;
    signInEmail.style.display = 'block';
    signInSeparator.style.display = 'block';
    // Update sign-in button
    signInMenuToggle.innerHTML = `
      <div class="sign-in-profile-pic-button">${initials}</div>
      <span class="user-name">${userName}</span>
      `;
    signInItems.innerHTML = `
      <button class="sign-in-menu-item" onclick="signOut()">Sign out</button>
      <button class="sign-in-menu-item" onclick="openPreferencesMenu()">Preferences</button>
      <button class="sign-in-menu-item" onclick="window.location.href='https://its.umich.edu/computing/web-mobile/new-wolverine-access/contact-form'">Send Feedback</button>
      `;
  } else {
    signInProfilePic.textContent = '';
    signInProfilePic.style.display = 'none';
    signInName.textContent = '';
    signInName.style.display = 'none';
    signInEmail.textContent = '';
    signInEmail.style.display = 'none';
    signInSeparator.style.display = 'none';
    // Update sign-in button
    signInMenuToggle.innerHTML = `
      <span class="material-icons">account_circle</span>
      Sign In
      `;
    signInItems.innerHTML = `
      <button class="sign-in-menu-item" onclick="signIn()">Sign in</button>
      <button class="sign-in-menu-item" onclick="openPreferencesMenu()">Preferences</button>
      <button class="sign-in-menu-item" onclick="window.location.href='https://its.umich.edu/computing/web-mobile/new-wolverine-access/contact-form'">Send Feedback</button>
      `;
  }
  // Add hover effect to sign-in menu items
  const signInMenuItems = document.querySelectorAll(".sign-in-menu-item");
  signInMenuItems.forEach(item => {
    item.addEventListener("mouseover", () => {
      item.style.backgroundColor = "#f0f0f0";
    });
    item.addEventListener("mouseout", () => {
      item.style.backgroundColor = "transparent";
    });
  });
}
/**
 * Sign in the user.
 */
function signIn() {
  signedIn = true;
  userName = "Kaden";
  userEmail = "kgruiz@umich.edu";
  initializeSignInMenu();
}
/**
 * Sign out the user.
 */
function signOut() {
  signedIn = false;
  userName = "";
  userEmail = "";
  initializeSignInMenu();
}
// ==============================
// Hover/Click Menu Logic
// ==============================
/**
 * Initialize hover menus for various UI components.
 */
function initializeHoverMenus() {
  setupHoverMenu("group-selector", "group-selector-menu");
  setupHoverMenu("favorites-icon", "favorites-menu");
  setupHoverMenu("notifications-icon", "notifications-menu");
  setupSignInHover("sign-in-container", "sign-in-menu", "sign-in-menu-toggle");
}
/**
 * Setup hover menu for a specific container and menu.
 * @param {string} containerId - The ID of the container element.
 * @param {string} menuId - The ID of the menu element.
 */
function setupHoverMenu(containerId, menuId) {
  const container = document.getElementById(containerId);
  const menu = document.getElementById(menuId);
  let clickedOpen = false;
  if (!container || !menu) return;
  container.addEventListener("mouseover", () => {
    if (!clickedOpen) {
      menu.classList.add("active");
    }
  });
  container.addEventListener("mouseout", () => {
    if (!clickedOpen) {
      if (menu.classList.contains("active")) {
        menu.classList.remove("active");
      }
    }
  });
  container.addEventListener("click", (e) => {
    e.preventDefault();
    clickedOpen = !clickedOpen;
    menu.classList.add("active");
  });
  document.addEventListener("click", (event) => {
    if (clickedOpen && !container.contains(event.target) && !menu.contains(event.target)) {
      clickedOpen = false;
      if (menu.classList.contains("active")) {
        menu.classList.remove("active");
      }
    }
  });
}
function setupSignInHover(containerId, menuId, menuToggle) {
  const container = document.getElementById(containerId);
  const menu = document.getElementById(menuId);
  const toggle = document.getElementById(menuToggle);
  let clickedOpen = false;
  if (!container || !menu || !toggle) return;
  container.addEventListener("mouseover", () => {
    if (!clickedOpen) {
      menu.classList.add("active");
    }
  });
  container.addEventListener("mouseout", () => {
    if (!clickedOpen) {
      if (menu.classList.contains("active")) {
        menu.classList.remove("active");
      }
    }
  });
  toggle.addEventListener("click", (e) => {
    e.preventDefault();
    if (!signedIn) {
      signIn()
    }
    clickedOpen = !clickedOpen;
    menu.classList.add("active");
  });
  container.addEventListener("click", (e) => {
    e.preventDefault();
    clickedOpen = !clickedOpen;
    menu.classList.add("active");
  });
  document.addEventListener("click", (event) => {
    if (clickedOpen && !container.contains(event.target) && !menu.contains(event.target)) {
      clickedOpen = false;
      if (menu.classList.contains("active")) {
        menu.classList.remove("active");
      }
    }
  });
}
// ==============================
// Button Hover and Click Effects
// ==============================
/**
 * Initialize hover and click effects for buttons.
 */
function initializeButtonEffects() {
  const buttons = document.querySelectorAll("button");
  buttons.forEach(button => {
    button.addEventListener("mouseover", () => {
      button.style.filter = "brightness(90%)";
    });
    button.addEventListener("mouseout", () => {
      button.style.filter = "brightness(100%)";
    });
    button.addEventListener("mousedown", () => {
      button.style.transform = "scale(0.96)";
    });
    button.addEventListener("mouseup", () => {
      button.style.transform = "scale(1)";
    });
    button.addEventListener("mouseleave", () => {
      button.style.transform = "scale(1)";
    });
  });
}
// ==============================
// Card Hover Effects
// ==============================
/**
 * Initialize hover effects for cards.
 */
function initializeCardHoverEffects() {
  const cards = document.querySelectorAll(".card, .it-services-card, .favorite-card");
  cards.forEach(card => {
    card.style.transition = "transform 0.3s ease";
    card.addEventListener("mouseover", () => {
      card.style.transform = "translateY(-5px)";
      const favoriteStar = card.querySelector(".favorite-star");
      if (favoriteStar) {
        favoriteStar.style.display = "block";
      }
    });
    card.addEventListener("mouseout", () => {
      card.style.transform = "translateY(0px)";
      const favoriteStar = card.querySelector(".favorite-star");
      if (favoriteStar && !card.classList.contains("favorited-card")) {
        favoriteStar.style.display = "none";
      }
    });
  });
}
// ==============================
// Navigation Icons Hover Effects
// ==============================
/**
 * Initialize hover effects for navigation icons.
 */
function initializeNavIconsHoverEffects() {
  const navIconLinks = document.querySelectorAll(".nav-icons a");
  navIconLinks.forEach(link => {
    link.addEventListener("mouseover", () => {
      link.style.color = "#FFCB05";
    });
    link.addEventListener("mouseout", () => {
      link.style.color = "";
    });
  });
}
// ==============================
// Favorites and Other Icons Hover Effects
// ==============================
/**
 * Initialize hover effects for favorites and other icons.
 */
function initializeFavoritesIconHoverEffects() {
  const iconSelectors = [
    { selector: ".group-selector a", scale: 1.05 },
    { selector: ".favorites-icon a", scale: 1.15 },
    { selector: ".notifications-icon a", scale: 1.15 },
    { selector: ".home-icon", scale: 1.15 },
    { selector: ".all-links-icon", scale: 1.12 }
  ];
  iconSelectors.forEach(iconInfo => {
    const icons = document.querySelectorAll(iconInfo.selector);
    icons.forEach(icon => {
      icon.style.transition = "transform 0.3s ease, box-shadow 0.3s ease";
      icon.addEventListener("mouseover", () => {
        icon.style.transform = `scale(${iconInfo.scale})`;
        icon.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)";
      });
      icon.addEventListener("mouseout", () => {
        icon.style.transform = "scale(1)";
        icon.style.boxShadow = "none";
      });
    });
  });
}
// ==============================
// Switch and Toggle Effects
// ==============================
/**
 * Initialize switch and toggle effects.
 */
function initializeSwitchToggleEffects() {
  const switches = document.querySelectorAll(".switch input");
  switches.forEach(switchInput => {
    const slider = switchInput.nextElementSibling;
    switchInput.addEventListener("change", () => {
      if (switchInput.checked) {
        slider.style.backgroundColor = "#FFCB05";
        slider.querySelector("::before").style.transform = "translateX(26px)";
      } else {
        slider.style.backgroundColor = "#ccc";
        slider.querySelector("::before").style.transform = "translateX(0)";
      }
    });
  });
}
// ==============================
// Modal Functionality
// ==============================
// Get modal elements
const preferencesMenu = document.getElementById("preferences-menu");
const preferencesMenuCloseButton = document.getElementById("preferences-menu-close-button");
/**
 * Open the preferences modal.
 */
function openPreferencesMenu() {
  preferencesMenu.style.display = "block";
  preferencesMenu.style.opacity = 0;
  let opacity = 0;
  const fadeIn = setInterval(() => {
    opacity += 0.05;
    preferencesMenu.style.opacity = opacity;
    if (opacity >= 1) {
      clearInterval(fadeIn);
    }
  }, 10);
  // Slide in animation
  const content = preferencesMenu.querySelector(".preferences-menu-content");
  content.style.transform = "translateY(-50px)";
  let translateY = -50;
  const slideIn = setInterval(() => {
    translateY += 2;
    content.style.transform = `translateY(${translateY}px)`;
    if (translateY >= 0) {
      content.style.transform = "translateY(0)";
      clearInterval(slideIn);
    }
  }, 10);
}
/**
 * Close the preferences modal.
 */
function closePreferencesMenu() {
  // Fade out animation
  let opacity = 1;
  const fadeOut = setInterval(() => {
    opacity -= 0.05;
    preferencesMenu.style.opacity = opacity;
    if (opacity <= 0) {
      preferencesMenu.style.display = "none";
      clearInterval(fadeOut);
    }
  }, 10);
}
// Event listeners for modal functionality
preferencesMenuCloseButton.addEventListener("click", closePreferencesMenu);
window.addEventListener("click", function (event) {
  if (event.target == preferencesMenu) {
    closePreferencesMenu();
  }
});
window.addEventListener("keydown", function (event) {
  if (event.key === "Escape" && preferencesMenu.style.display === "block") {
    closePreferencesMenu();
  }
});
// ==============================
// Favorites Preference Toggle
// ==============================
// Get references to DOM elements for favorites toggle
const toggleFavoritesCheckbox = document.getElementById("toggleFavoritesCheckbox");
const heroPinnedBox = document.querySelector(".hero-pinned-box");
// Load and apply saved favorites preference
const savedPreference = localStorage.getItem("showFavorites");
const showFavorites = savedPreference !== null ? JSON.parse(savedPreference) : true;
toggleFavoritesCheckbox.checked = showFavorites;
if (heroPinnedBox) {
  heroPinnedBox.style.display = showFavorites ? "block" : "none";
}
// Event listener for favorites preference change
toggleFavoritesCheckbox.addEventListener("change", () => {
  const showFavorites = toggleFavoritesCheckbox.checked;
  if (heroPinnedBox) {
    heroPinnedBox.style.display = showFavorites ? "block" : "none";
  }
  // Save the updated preference to localStorage
  localStorage.setItem("showFavorites", JSON.stringify(showFavorites));
});


function animateEllipticalArc(svgString, elementSelector, startX, startY, endX, endY) {
  // Create a temporary span to hold the SVG
  const tempSpan = document.createElement("span");
  tempSpan.innerHTML = svgString;
  document.body.appendChild(tempSpan);

  const svg = tempSpan.querySelector("svg");
  if (!svg) {
    console.error("Invalid SVG string provided.");
    tempSpan.remove();
    return;
  }

  const svgElement = svg.querySelector(elementSelector);

  if (!svgElement) {
    console.error("Specified element not found in the SVG.");
    tempSpan.remove();
    return;
  }

  // Parameters for the elliptical arc
  const centerX = (startX + endX) / 2; // Midpoint as center X
  const centerY = Math.min(startY, endY) - 100; // Offset above midpoint
  const radiusX = Math.abs(endX - startX) / 2; // Half the width
  const radiusY = 100; // Fixed vertical radius
  const duration = 3000; // Duration in milliseconds

  let startTime;

  // Function to fade the SVG in
  function fadeIn() {
    svg.style.opacity = 0;
    svg.style.transition = "opacity 1s";
    svg.style.opacity = 1;
  }

  // Function to fade the SVG out
  function fadeOut() {
    svg.style.transition = "opacity 1s";
    svg.style.opacity = 0;
  }

  // Function to animate the arc
  function animate(timestamp) {
    if (!startTime) startTime = timestamp;
    const elapsed = timestamp - startTime;

    const progress = Math.min(elapsed / duration, 1); // Ensure it stops at 100%

    // Calculate the angle in radians (0 to π for a half-circle)
    const angle = Math.PI * progress;

    // Update the element's position based on the elliptical arc formula
    const x = centerX + radiusX * Math.cos(angle);
    const y = centerY + radiusY * Math.sin(angle); // Elliptical path

    if (svgElement.tagName === "circle" || svgElement.tagName === "ellipse") {
      svgElement.setAttribute("cx", x);
      svgElement.setAttribute("cy", y);
    } else if (svgElement.tagName === "rect" || svgElement.tagName === "image") {
      svgElement.setAttribute("x", x);
      svgElement.setAttribute("y", y);
    } else {
      console.warn("Element type not explicitly handled. Adjust manually if necessary.");
    }

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      // Start fading out after arc animation completes
      setTimeout(() => {
        fadeOut();
        setTimeout(() => {
          tempSpan.remove(); // Clean up the temporary span after fading out
        }, 1000);
      }, 500);
    }
  }

  // Start the animation sequence: Fade in, then animate arc
  fadeIn();
  setTimeout(() => {
    requestAnimationFrame(animate);
  }, 1000);
}


heroLogo = document.getElementById("hero-logo");

if (heroLogo) {

  heroLogo.addEventListener("click", () => {

    let startX = heroLogo.getBoundingClientRect().right + 20;
    let startY = heroLogo.getBoundingClientRect().bottom - 20;
    let endX = heroLogo.getBoundingClientRect().left - 20;
    let endY = heroLogo.getBoundingClientRect().top + 20;

    animateEllipticalArc(footballSVG, startX, startY, endX, endY);

    setTimeout(() => {
      ball.remove();
    }, 4000);

  });
}

/**
 * Display an error message on the page.
 * @param {string} message - The error message to display.
 */
function displayErrorMessage(message) {
  const errorContainer = document.getElementById("error-container");
  if (errorContainer) {
    errorContainer.textContent = message;
    errorContainer.style.display = "block";
  } else {
    const newErrorContainer = document.createElement("div");
    newErrorContainer.id = "error-container";
    newErrorContainer.style.position = "fixed";
    newErrorContainer.style.bottom = "-100px";
    newErrorContainer.style.left = "0";
    newErrorContainer.style.width = "100%";
    newErrorContainer.style.backgroundColor = "#f44336";
    newErrorContainer.style.color = "#fff";
    newErrorContainer.style.padding = "1rem";
    newErrorContainer.style.textAlign = "center";
    newErrorContainer.style.zIndex = "10000";
    newErrorContainer.style.transition = "bottom 0.5s ease";
    newErrorContainer.textContent = message;

    const closeButton = document.createElement("span");
    closeButton.textContent = "x";
    closeButton.style.position = "absolute";
    closeButton.style.top = "50%";
    closeButton.style.right = "10px";
    closeButton.style.transform = "translateY(-50%)";
    closeButton.style.cursor = "pointer";
    closeButton.addEventListener("click", () => {
      newErrorContainer.style.bottom = "-100px";
      setTimeout(() => {
        newErrorContainer.remove();
      }, 500);
    });

    newErrorContainer.appendChild(closeButton);
    document.body.appendChild(newErrorContainer);

    setTimeout(() => {
      newErrorContainer.style.bottom = "0";
    }, 10);

    // Remove the container after 5 seconds
    setTimeout(() => {
      newErrorContainer.style.bottom = "-100px";
      setTimeout(() => {
        newErrorContainer.remove();
      }, 500);
    }, 5000);
  }
}

// Override console.error to display error messages on the page
const originalConsoleError = console.error;
console.error = function (...args) {
  originalConsoleError.apply(console, args);
  displayErrorMessage(args.join(" "));
};

// Override window.onerror to display uncaught errors on the page
window.onerror = function (message, source, lineno, colno, error) {
  displayErrorMessage(`${message} at ${source}:${lineno}:${colno}`);
  return true; // Prevent the default browser error handling
};

/**
 * Display a log message on the page.
 * @param {string} message - The log message to display.
 */
function displayLogMessage(message) {
  const logContainer = document.getElementById("log-container");
  if (logContainer) {
    logContainer.textContent = message;
    logContainer.style.display = "block";
  } else {
    const newLogContainer = document.createElement("div");
    newLogContainer.id = "log-container";
    newLogContainer.style.position = "fixed";
    newLogContainer.style.bottom = "-100px";
    newLogContainer.style.left = "0";
    newLogContainer.style.width = "100%";
    newLogContainer.style.backgroundColor = "#4caf50";
    newLogContainer.style.color = "#fff";
    newLogContainer.style.padding = "1rem";
    newLogContainer.style.textAlign = "center";
    newLogContainer.style.zIndex = "10000";
    newLogContainer.style.transition = "bottom 0.5s ease";
    newLogContainer.textContent = message;

    const closeButton = document.createElement("span");
    closeButton.textContent = "x";
    closeButton.style.position = "absolute";
    closeButton.style.top = "50%";
    closeButton.style.right = "10px";
    closeButton.style.transform = "translateY(-50%)";
    closeButton.style.cursor = "pointer";
    closeButton.addEventListener("click", () => {
      newLogContainer.style.bottom = "-100px";
      setTimeout(() => {
        newLogContainer.remove();
      }, 500);
    });

    newLogContainer.appendChild(closeButton);
    document.body.appendChild(newLogContainer);

    setTimeout(() => {
      newLogContainer.style.bottom = "0";
    }, 10);

    // Remove the container after 5 seconds
    setTimeout(() => {
      newLogContainer.style.bottom = "-100px";
      setTimeout(() => {
        newLogContainer.remove();
      }, 500);
    }, 5000);
  }
}

/**
 * Display a warning message on the page.
 * @param {string} message - The warning message to display.
 */
function displayWarningMessage(message) {
  const warningContainer = document.getElementById("warning-container");
  if (warningContainer) {
    warningContainer.textContent = message;
    warningContainer.style.display = "block";
  } else {
    const newWarningContainer = document.createElement("div");
    newWarningContainer.id = "warning-container";
    newWarningContainer.style.position = "fixed";
    newWarningContainer.style.bottom = "-100px";
    newWarningContainer.style.left = "0";
    newWarningContainer.style.width = "100%";
    newWarningContainer.style.backgroundColor = "#ff9800";
    newWarningContainer.style.color = "#fff";
    newWarningContainer.style.padding = "1rem";
    newWarningContainer.style.textAlign = "center";
    newWarningContainer.style.zIndex = "10000";
    newWarningContainer.style.transition = "bottom 0.5s ease";
    newWarningContainer.textContent = message;

    const closeButton = document.createElement("span");
    closeButton.textContent = "x";
    closeButton.style.position = "absolute";
    closeButton.style.top = "50%";
    closeButton.style.right = "10px";
    closeButton.style.transform = "translateY(-50%)";
    closeButton.style.cursor = "pointer";
    closeButton.addEventListener("click", () => {
      newWarningContainer.style.bottom = "-100px";
      setTimeout(() => {
        newWarningContainer.remove();
      }, 500);
    });

    newWarningContainer.appendChild(closeButton);
    document.body.appendChild(newWarningContainer);

    setTimeout(() => {
      newWarningContainer.style.bottom = "0";
    }, 10);

    // Remove the container after 5 seconds
    setTimeout(() => {
      newWarningContainer.style.bottom = "-100px";
      setTimeout(() => {
        newWarningContainer.remove();
      }, 500);
    }, 5000);
  }
}

// Override console.log to display log messages on the page
const originalConsoleLog = console.log;
console.log = function (...args) {
  originalConsoleLog.apply(console, args);
  displayLogMessage(args.join(" "));
};

// Override console.warn to display warning messages on the page
const originalConsoleWarn = console.warn;
console.warn = function (...args) {
  originalConsoleWarn.apply(console, args);
  displayWarningMessage(args.join(" "));
};