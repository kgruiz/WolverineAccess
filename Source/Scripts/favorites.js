// Import from constants.js
// Import from animation.js
import {animateEllipticalArc} from './animation.js';
// Import from auth.js
import {initializeSignInMenu, signIn, signOut} from './auth.js';
// Import from cards.js
import {CreateCard, CreateFavoriteCard} from './cards.js';
import {FAVORITES_KEY, filledStarSVG, footballSVG, optionsIconSVG, outlinedStarSVG, state} from './constants.js';
// Import from effects.js
import {initializeButtonEffects, initializeCardHoverEffects, initializeFavoritesIconHoverEffects, initializeHoverMenus, initializeNavIconsHoverEffects, initializeSwitchToggleEffects, setupHoverMenu, setupSignInHover} from './effects.js';
// Import from error.js
import {displayErrorMessage, displayLogMessage, displayWarningMessage, InitializeMessages} from './error.js';
// Import from favorites.js
// Import from globalListeners.js
import {InitializeGlobalListeners} from './globalListeners.js';
// Import from preference.js
import {InitializePreferencesMenu, InitializePreferencesToggle, openPreferencesMenu} from './preference.js';
// Import from search.js
import {SetupSearchSuggestions} from './search.js';

// ==============================
// Favorites Handling
// ==============================
/**
 * Load favorite statuses from localStorage and initialize favorites.
 */
export function loadFavorites() {
    const storedFavorites = localStorage.getItem(FAVORITES_KEY);
    if (storedFavorites) {
        try {
            const storedFavoritesObj = JSON.parse(storedFavorites);
            state.favoriteStatuses = {...state.favoriteStatuses, ...storedFavoritesObj};
        } catch (e) {
            console.error('Failed to parse favorite links from localStorage.', e);
        }
    }
    // Initialize state.favoriteStatuses based on state.linksData if needed
    state.linksData.forEach(link => {
        if (state.favoriteStatuses[link.uniqueKey] === undefined) {
            state.favoriteStatuses[link.uniqueKey] = link.favorite || false;
        }
    });
    saveFavorites();
}

/**
 * Save current favorite statuses to localStorage.
 */
export function saveFavorites() {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(state.favoriteStatuses));
}

/**
 * Check if a link is favorited.
 * @param {Object} link - The link object.
 * @returns {boolean} - Favorite status.
 */
export function isLinkFavorited(link) {
    return state.favoriteStatuses[link.uniqueKey] || false;
}

/**
 * Add a link to favorites.
 * @param {Object} link - The link object.
 */
export function addFavorite(link) {
    state.favoriteStatuses[link.uniqueKey] = true;
    saveFavorites();
}

/**
 * Remove a link from favorites.
 * @param {Object} link - The link object.
 */
export function removeFavorite(link) {
    state.favoriteStatuses[link.uniqueKey] = false;
    saveFavorites();
}

/**
 * Update the star icon's appearance based on favorite status.
 * @param {HTMLElement} star - The star element.
 * @param {Object} link - The link object.
 */
export function updateStarAppearance(star, link) {
    if (isLinkFavorited(link)) {
        star.innerHTML = filledStarSVG;
        star.classList.add('favorited');
    } else {
        star.innerHTML = outlinedStarSVG;
        star.classList.remove('favorited');
    }
}

/**
 * Populate favorites containers based on current favorite statuses.
 */
export function populateFavoritesContainers() {
    const favoriteContainers = [
        document.getElementById('all-favorites-container'),
        document.getElementById('favorite-links-nav-container'),
        document.getElementById('hero-pinned-container')
    ];
    favoriteContainers.forEach(container => {
        if (container) {
            container.innerHTML = '';
            const favoritedLinks = state.linksData.filter(link => isLinkFavorited(link));
            if (favoritedLinks.length === 0) {
                const noFavorites = document.createElement('p');
                noFavorites.textContent = 'No pinned links yet.';
                container.appendChild(noFavorites);
            } else {
                favoritedLinks.slice(0, 4).forEach(link => {
                    let card;
                    if (container.id === 'all-favorites-container') {
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
