/**
 * FILE: app.js
 * Initializes and orchestrates application functionality.
 */

// ==============================
// Application Entry Point
// ==============================

import {InitializeAnimation} from './animation.js';
import {initializeSignInMenu} from './auth.js';
import {CreateCard, CreateFavoriteCard} from './cards.js';
import {state} from './constants.js';
import {initializeButtonEffects, initializeCardHoverEffects, initializeFavoritesIconHoverEffects, initializeHoverMenus, initializeNavIconsHoverEffects, initializeSwitchToggleEffects} from './effects.js';
import {InitializeMessages,} from './error.js';
import {isLinkFavorited, loadFavorites, populateFavoritesContainers} from './favorites.js';
import {InitializeGlobalListeners} from './globalListeners.js';
import {addCardToPinnedsContainers, addPinned, isLinkPinnedd, loadPinneds, populatePinnedsContainers, removeCardFromPinnedsContainers, removePinned, savePinneds} from './pinned.js';
import {initializeFavoritesNumSpinner, InitializePreferencesMenu, InitializePreferencesToggle} from './preference.js';
import {RenderClassSchedule} from './schedule.js'
import {SetupSearchSuggestions} from './search.js';


document.addEventListener('DOMContentLoaded', () => {
    // ==============================
    // Data Fetching and Initialization
    // ==============================
    /**
     * Fetch tasks data and initialize the page.
     */
    fetch('../../Assets/JSON Files/tasks.json')
        .then((response) => {
            if (!response.ok) {
                // Attempt to extract error details from the response body
                return response.text().then((text) => {
                    let errorDetails = text;
                    try {
                        // Try parsing as JSON for structured error messages
                        const json = JSON.parse(text);
                        errorDetails = JSON.stringify(json, null, 2);
                    } catch (e) {
                        // If not JSON, keep the plain text
                    }

                    // Construct a detailed error message as a plain string
                    const detailedErrorMessage =
                        `Failed to load tasks.json.\n` +
                        `Status: ${response.status} ${response.statusText}\n` +
                        `Details:\n${errorDetails}`;

                    // Log the detailed error to the console
                    console.error(detailedErrorMessage);

                    // Display the detailed error message on the page
                    displayErrorMessage(detailedErrorMessage);

                    // Reject the promise to skip the next `.then()`
                    return Promise.reject(new Error('Failed to load tasks.json'));
                });
            }
            // If response is OK, parse it as JSON
            return response.json();
        })
        .then((data) => {
            // Successfully fetched and parsed data
            state.linksData = data;
            initializePage();
        })
        .catch((error) => {
            // Handle network errors or rejected promises from above
            const detailedErrorMessage =
                `Error fetching tasks.json.\n` +
                `Message: ${error.message}\n` +
                `Stack:\n${error.stack || 'No stack trace available.'}`;

            // Log the detailed error to the console
            console.error(detailedErrorMessage);

            // Display the detailed error message on the page
            displayErrorMessage(detailedErrorMessage);

            // Initialize the page even if fetching fails, adjust as needed
            initializePage();
        });


    /**
     * Initialize the page with fetched data and user information.
     */
    function initializePage() {
        // For demonstration, set state.signedIn to true and user info
        state.signedIn = true;
        state.userName = 'Kaden';
        state.userEmail = 'kgruiz@umich.edu';
        loadFavorites();
        loadPinneds();
        // Populate Most Popular
        const mostPopularContainer = document.getElementById('most-popular-container');
        if (mostPopularContainer && state.linksData.length > 0) {
            const sortedByRank =
                [...state.linksData].sort((a, b) => b.currentRating - a.currentRating);
            const top4 = sortedByRank.slice(0, 4);
            top4.forEach((link) => {
                const card = CreateCard(link);
                mostPopularContainer.append(card);
            });
        }
        // Populate Top Favorites
        const topFavoritesContainer = document.getElementById('favorites-container');
        if (topFavoritesContainer && state.linksData.length > 0) {
            function populateTopFavorites() {
                topFavoritesContainer.innerHTML = '';
                const favoritedLinks =
                    state.linksData.filter(link => isLinkFavorited(link));
                const sortedByRank =
                    [...favoritedLinks].sort((a, b) => b.currentRating - a.currentRating);
                // Load maxFavoritesDisplay from localStorage
                const maxFavoritesDisplay = localStorage.getItem('maxFavoritesDisplay');
                let numToDisplay =
                    maxFavoritesDisplay ? parseInt(maxFavoritesDisplay, 10) : 4;
                if (maxFavoritesDisplay == 0) {
                    numToDisplay = Infinity;
                }
                const topFavorites = sortedByRank.slice(0, numToDisplay);

                topFavorites.forEach((link) => {
                    const card = CreateCard(link);
                    topFavoritesContainer.append(card);
                });
            }
            window.populateTopFavorites = populateTopFavorites;
            populateTopFavorites();
        }
        // Populate All Links on Index
        const allLinksContainer = document.getElementById('all-links-container');
        if (allLinksContainer && state.linksData.length > 0) {
            const sortedByRank =
                [...state.linksData].sort((a, b) => b.currentRating - a.currentRating);
            const top10 = sortedByRank.slice(0, 10);
            const next30 = sortedByRank.slice(10, 40);
            top10.forEach((link) => {
                const card = CreateCard(link);
                card.classList.add('initial-cards');
                allLinksContainer.append(card);
            });
            next30.forEach((link) => {
                const card = CreateCard(link);
                card.classList.add('additional-cards', 'hidden');
                allLinksContainer.append(card);
            });
        }
        // Initialize Favorites in Hero and Nav
        populateFavoritesContainers();
        // Initialize Pinned Links
        populatePinnedsContainers();
        // All Links Full Page
        const allLinksFullContainer = document.getElementById('all-links-full-container');
        if (allLinksFullContainer) {
            let sortType = 'rank';
            let searchTerm = '';
            const urlParams = new URLSearchParams(window.location.search);
            if (urlParams.has('q')) {
                searchTerm = urlParams.get('q').toLowerCase();
            }

            function RenderAllLinksFull() {
                allLinksFullContainer.innerHTML = '';
                let linksToShow = [...state.linksData];
                if (sortType === 'rank') {
                    linksToShow.sort((a, b) => b.currentRating - a.currentRating);
                } else if (sortType === 'alphabetical') {
                    linksToShow.sort((a, b) => a.title.localeCompare(b.title));
                }
                if (searchTerm.trim() !== '') {
                    linksToShow = linksToShow.filter(
                        (link) =>
                            (link.title &&
                             link.title.toLowerCase().includes(searchTerm)) ||
                            (link.applicationName &&
                             link.applicationName.toLowerCase().includes(searchTerm)));
                }
                if (linksToShow.length === 0) {
                    const noResults = document.createElement('p');
                    noResults.textContent = 'No results found.';
                    allLinksFullContainer.appendChild(noResults);
                } else {
                    linksToShow.forEach((link) => {
                        const card = CreateCard(link);
                        allLinksFullContainer.append(card);
                    });
                }
                // No need to call updateAllCardStars
                initializeCardHoverEffects();  // Re-initialize hover effects
            }

            const fullSearchInput = document.getElementById('fullSearchInput');
            if (fullSearchInput) {
                fullSearchInput.value = searchTerm;
                fullSearchInput.addEventListener('input', () => {
                    searchTerm = fullSearchInput.value.toLowerCase();
                    RenderAllLinksFull();
                });
            }
            const sortTypeToggle = document.getElementById('sort-type-toggle');
            if (sortTypeToggle) {
                sortTypeToggle.addEventListener('change', () => {
                    sortType = sortTypeToggle.checked ? 'alphabetical' : 'rank';
                    RenderAllLinksFull();
                });
            }
            RenderAllLinksFull();
            const showMoreButton = document.getElementById('show-more');
            const showLessButton = document.getElementById('show-less');
            const showAllButton = document.getElementById('show-all');
            showMoreButton?.addEventListener('click', () => {
                const additionalCards = document.querySelectorAll('.additional-cards');
                additionalCards.forEach((card) => {
                    card.classList.remove('hidden');
                });
                showMoreButton.classList.add('hidden');
                showLessButton.classList.remove('hidden');
                showAllButton.classList.remove('hidden');
            });
            showLessButton?.addEventListener('click', () => {
                const additionalCards = document.querySelectorAll('.additional-cards');
                additionalCards.forEach((card) => {
                    card.classList.add('hidden');
                });
                showMoreButton.classList.remove('hidden');
                showLessButton.classList.add('hidden');
                showAllButton.classList.add('hidden');
            });
            initializeSignInMenu();
            initializeHoverMenus();
            initializeButtonEffects();
            initializeCardHoverEffects();
            initializeNavIconsHoverEffects();
            initializeFavoritesIconHoverEffects();
        }
        // Favorites Manager Page
        const favoritesManagerContainer =
            document.getElementById('all-favorites-container');
        if (favoritesManagerContainer) {
            let sortType = 'rank';
            let searchTerm = '';

            const fullSearchInputFavorites =
                document.getElementById('fullSearchInputFavorites');
            if (fullSearchInputFavorites) {
                fullSearchInputFavorites.addEventListener('input', () => {
                    searchTerm = fullSearchInputFavorites.value.toLowerCase();
                    RenderFavorites();
                });
            }

            const toggleFavorites =
                document.querySelector('.sort-type-selector-favorites');
            if (toggleFavorites) {
                toggleFavorites.addEventListener('change', () => {
                    sortType = toggleFavorites.checked ? 'alphabetical' : 'rank';
                    RenderFavorites();
                });
            }

            function RenderFavorites() {
                favoritesManagerContainer.innerHTML = '';
                let favoritedLinks =
                    state.linksData.filter((link) => isLinkFavorited(link));

                if (sortType === 'rank') {
                    favoritedLinks.sort((a, b) => b.currentRating - a.currentRating);
                } else if (sortType === 'alphabetical') {
                    favoritedLinks.sort((a, b) => a.title.localeCompare(b.title));
                }

                if (searchTerm.trim() !== '') {
                    favoritedLinks = favoritedLinks.filter(
                        (link) =>
                            (link.title &&
                             link.title.toLowerCase().includes(searchTerm)) ||
                            (link.applicationName &&
                             link.applicationName.toLowerCase().includes(searchTerm)));
                }

                if (favoritedLinks.length === 0) {
                    const noFavorites = document.createElement('p');
                    noFavorites.textContent = 'No pinned links yet.';
                    favoritesManagerContainer.appendChild(noFavorites);
                } else {
                    favoritedLinks.forEach((link) => {
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
        const headerInput = document.getElementById('headerSearchInput');
        const headerSuggestions = document.getElementById('headerSearchSuggestions');
        const heroInput = document.getElementById('heroSearchInput');
        const heroSuggestions = document.getElementById('heroSearchSuggestions');
        if (headerInput && headerSuggestions) {
            SetupSearchSuggestions(headerInput, headerSuggestions);
        }
        if (heroInput && heroSuggestions) {
            SetupSearchSuggestions(heroInput, heroSuggestions);
        }
        // Show More/Less
        const showMoreButton = document.getElementById('show-more');
        const showLessButton = document.getElementById('show-less');
        const showAllButton = document.getElementById('show-all');
        showMoreButton?.addEventListener('click', () => {
            const additionalCards = document.querySelectorAll('.additional-cards');
            additionalCards.forEach((card) => {
                card.classList.remove('hidden');
            });
            showMoreButton.classList.add('hidden');
            showLessButton.classList.remove('hidden');
            showAllButton.classList.remove('hidden');
        });
        showLessButton?.addEventListener('click', () => {
            const additionalCards = document.querySelectorAll('.additional-cards');
            additionalCards.forEach((card) => {
                card.classList.add('hidden');
            });
            showMoreButton.classList.remove('hidden');
            showLessButton.classList.add('hidden');
            showAllButton.classList.add('hidden');
        });

        const heroLogo = document.getElementById('hero-logo');

        initializeSignInMenu();
        initializeHoverMenus();
        initializeButtonEffects();
        initializeCardHoverEffects();
        initializeNavIconsHoverEffects();
        initializeFavoritesIconHoverEffects();
        initializeSwitchToggleEffects();
        InitializeMessages();
        InitializeGlobalListeners();
        InitializePreferencesToggle();
        InitializePreferencesMenu();
        initializeFavoritesNumSpinner();

        if (window.location.pathname.includes('index.html')) {
            InitializeAnimation(heroLogo);
        }

        if (window.location.pathname.includes('class-schedule.html')) {

            const initialRadio =
                document.querySelector('input[name="schedule-view"]:checked');
            const initialViewType = initialRadio ? initialRadio.value : 'list';

            RenderClassSchedule('kgruiz', initialViewType);

            const scheduleViewRadios =
                document.querySelectorAll('input[name="schedule-view"]');

            scheduleViewRadios.forEach(radio => {
                radio.addEventListener('change', () => {
                    const selectedRadio =
                        document.querySelector('input[name="schedule-view"]:checked');
                    const viewType = selectedRadio ? selectedRadio.value : 'list';

                    RenderClassSchedule('kgruiz', viewType);
                });
            });
        }
    }
});
