// script.js

// ===========================================================
// Global Variables
// ===========================================================
let linksData = [];
let sortByRating = true;

const FAVORITES_KEY = 'favoriteLinks';
let favoriteStatuses = {};

let signedIn = false;
let userName = "";
let userEmail = "";

// ===========================================================
// Favorites Handling
// ===========================================================
function loadFavorites() {
  linksData.forEach(link => {
    if (favoriteStatuses[link.uniqueKey] === undefined) {
      favoriteStatuses[link.uniqueKey] = link.favorite || false;
    }
  });

  const storedFavorites = localStorage.getItem(FAVORITES_KEY);
  if (storedFavorites) {
    try {
      const storedFavoritesObj = JSON.parse(storedFavorites);
      favoriteStatuses = { ...favoriteStatuses, ...storedFavoritesObj };
    } catch (e) {
      console.error("Failed to parse favorite links from localStorage.", e);
    }
  }

  saveFavorites();
}

function saveFavorites() {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favoriteStatuses));
}

function isLinkFavorited(link) {
  return favoriteStatuses[link.uniqueKey] || false;
}

function addFavorite(link) {
  favoriteStatuses[link.uniqueKey] = true;
  saveFavorites();
}

function removeFavorite(link) {
  favoriteStatuses[link.uniqueKey] = false;
  saveFavorites();
}

// ===========================================================
// Reflect Favorites Updates Everywhere
// ===========================================================
function renderFavoritesInContainer(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = "";
  const favoritedLinks = linksData.filter(link => isLinkFavorited(link));

  if (favoritedLinks.length === 0) {
    const noFavorites = document.createElement("p");
    noFavorites.textContent = "No favorite links yet.";
    container.appendChild(noFavorites);
  } else {
    favoritedLinks.slice(0, 4).forEach(link => {
      const card = CreateCard(link);
      container.appendChild(card);
    });
  }
}

function updateAllFavoritesViews() {
  // Update favorites nav bar container
  renderFavoritesInContainer("favorite-links-container");
  // Update hero favorites container
  renderFavoritesInContainer("hero-favorites-container");
}

// After toggling favorites, we must also update the star icons
// in all displayed cards across the entire page.
function updateAllCardStars() {
  const allCards = document.querySelectorAll(".card");
  allCards.forEach(card => {
    const uniqueKey = card.dataset.uniqueKey;
    const link = linksData.find(l => l.uniqueKey === uniqueKey);
    if (!link) return;
    const star = card.querySelector(".favorite-star");
    if (!star) return;

    if (isLinkFavorited(link)) {
      star.textContent = "star";
      star.classList.add("favorited");
      card.classList.add("favorited-card");
    } else {
      star.textContent = "star_border";
      star.classList.remove("favorited");
      card.classList.remove("favorited-card");
    }
  });
}

// Call this after any favorite toggle
function refreshUIAfterFavoriteChange() {
  updateAllFavoritesViews();
  updateAllCardStars();
}

// ===========================================================
// Event Listeners for Scroll
// ===========================================================
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

// ===========================================================
// Fetch and Initialize Data
// ===========================================================
fetch("JSON Files/tasks.json")
  .then(response => {
    if (!response.ok) {
      console.error("Failed to load tasks.json. Make sure it exists at JSON Files/tasks.json.");
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

// ===========================================================
// Initialize Page
// ===========================================================
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
  updateAllFavoritesViews();
  updateAllCardStars(); // Ensure all cards reflect current favorite state

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
      updateAllCardStars();
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
}

// ===========================================================
// Create Card
// ===========================================================
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
  star.className = "material-icons favorite-star";
  if (isLinkFavorited(link)) {
    star.textContent = "star";
    star.classList.add("favorited");
    card.classList.add("favorited-card");
  } else {
    star.textContent = "star_border";
  }
  card.appendChild(star);

  star.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isLinkFavorited(link)) {
      removeFavorite(link);
    } else {
      addFavorite(link);
    }

    refreshUIAfterFavoriteChange();
  });

  return card;
}

// ===========================================================
// Setup Search Suggestions
// ===========================================================
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

// ===========================================================
// Sign In Menu Initialization
// ===========================================================
function initializeSignInMenu() {
  const signInMenu = document.getElementById("sign-in-menu");
  const signInMenuToggle = document.getElementById("sign-in-menu-toggle");
  const signInName = document.getElementById("sign-in-name");
  const signInEmail = document.getElementById("sign-in-email");
  const signInProfilePic = document.getElementById("sign-in-profile-pic");
  const signInItems = document.getElementById("sign-in-items");
  const signInSeparator = document.getElementById("sign-in-separator"); // Added ID to <hr />

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
}

// Sign in and Sign out stubs
function signIn() {
  signedIn = true;
  userName = "Kaden";
  userEmail = "kgruiz@umich.edu";
  initializeSignInMenu();
}

function signOut() {
  signedIn = false;
  userName = "";
  userEmail = "";
  initializeSignInMenu();
}


// ===========================================================
// Hover / Click Menu Logic
// ===========================================================
function initializeHoverMenus() {
  setupHoverMenu("group-selector", "group-selector-menu");
  setupHoverMenu("favorites-icon", "favorites-menu");
  setupHoverMenu("notifications-icon", "notifications-menu");
  setupHoverMenu("sign-in-container", "sign-in-menu");
}

function setupHoverMenu(containerId, menuId) {
  const container = document.getElementById(containerId);
  const menu = document.getElementById(menuId);

  let clickedOpen = false;

  if (!container || !menu) return;

  container.addEventListener("mouseover", () => {
    if (!clickedOpen) {
      menu.style.display = "flex";
    }
  });

  container.addEventListener("mouseout", () => {
    if (!clickedOpen) {
      menu.style.display = "none";
    }
  });

  // container.addEventListener("mouseout", () => {
  //   setTimeout(() => {
  //     if (!clickedOpen && !container.matches(':hover') && !menu.matches(':hover')) {
  //       menu.style.display = "none";
  //     }
  //   }, 200); // Adjust the delay as needed
  // });

  container.addEventListener("click", (e) => {
    e.preventDefault();
    clickedOpen = !clickedOpen;
    menu.style.display = clickedOpen ? "flex" : "none";
  });

  document.addEventListener("click", (event) => {
    if (clickedOpen && !container.contains(event.target)) {
      clickedOpen = false;
      menu.style.display = "none";
    }
  });
}

// ===========================================================
// Load and Render Tasks (Optional)
// ===========================================================
function LoadTasks() {
  fetch("tasks.json")
    .then(response => response.json())
    .then(data => {
      tasks = data;
      RenderTasks();
    })
    .catch(() => console.error("Failed to load tasks.json for tasks"));
}

function RenderTasks() {
  const container = document.getElementById("all-links-full-container");
  if (!container || tasks.length === 0) return;

  container.innerHTML = "";

  if (sortByRating) {
    tasks.sort((a, b) => b.rating - a.rating);
  } else {
    tasks.sort((a, b) => a.title.localeCompare(b.title));
  }

  tasks.forEach(task => {
    const card = document.createElement("a");
    card.className = "card";
    card.href = task.href;
    card.dataset.uniqueKey = task.uniqueKey;
    if (task.openInNewWindow) {
      card.target = "_blank";
      card.rel = "noopener";
    }

    const header = document.createElement("h2");
    header.textContent = task.title;
    card.appendChild(header);

    const description = document.createElement("p");
    description.textContent = task.description;
    card.appendChild(description);

    const rating = document.createElement("p");
    rating.textContent = `Rating: ${task.rating}`;
    card.appendChild(rating);

    container.appendChild(card);
  });
}

const sortTypeSelector = document.getElementById("toggle");
if (sortTypeSelector) {
  sortTypeSelector.addEventListener("change", function () {
    sortByRating = !sortByRating;
    RenderTasks();
  });
}

document.addEventListener("DOMContentLoaded", function () {
  LoadTasks();
});


// ===========================================================
// Modal Functionality
// ===========================================================

// Get modal element
const preferencesMenu = document.getElementById("preferences-menu");

// Get close button
const preferencesMenuCloseButton = document.getElementById("preferences-menu-close-button");

// Function to open modal
function openPreferencesMenu() {
  preferencesMenu.style.display = "block";
}

// Function to close modal
function closePreferencesMenu() {
  preferencesMenu.style.display = "none";
}

// Event listeners
preferencesMenuCloseButton.addEventListener("click", closePreferencesMenu);

// Close modal when clicking outside the modal content
window.addEventListener("click", function (event) {
  if (event.target == preferencesMenu) {
    closePreferencesMenu();
  }
});

// Close modal when pressing the Esc key
window.addEventListener("keydown", function (event) {
  if (event.key === "Escape" && preferencesMenu.style.display === "block") {
    closePreferencesMenu();
  }
});

// Get references to DOM elements
const toggleFavoritesCheckbox = document.getElementById("toggleFavoritesCheckbox");
const heroFavoritesBox = document.querySelector(".hero-favorites-box");

// Load saved preference from localStorage or default to true
const savedPreference = localStorage.getItem("showFavorites");
const showFavorites = savedPreference !== null ? JSON.parse(savedPreference) : true;

// Apply the preference
toggleFavoritesCheckbox.checked = showFavorites;
heroFavoritesBox.style.display = showFavorites ? "block" : "none";

// Add event listener for checkbox state change
toggleFavoritesCheckbox.addEventListener("change", () => {
  const showFavorites = toggleFavoritesCheckbox.checked;
  heroFavoritesBox.style.display = showFavorites ? "block" : "none";

  // Save the updated preference to localStorage
  localStorage.setItem("showFavorites", JSON.stringify(showFavorites));
});