/**
 * FILE: favorites.js
 * Handles favorites features and logic within the application.
 */

import {CreateCard, CreateFavoriteCard} from './cards.js';
import {FAVORITES_KEY, filledStarSVG, outlinedStarSVG, state} from './constants.js';
import {addCardToPinnedsContainers, addPinned, isLinkPinned, loadPinneds, populatePinnedsContainers, removeCardFromPinnedsContainers, removePinned, savePinneds} from './pinned.js';

// ==============================
// Favorites Functionality
// ==============================

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
    const wasPinned = isLinkPinned(link);
    state.favoriteStatuses[link.uniqueKey] = false;
    removePinned(link)
    saveFavorites();
    if (wasPinned) {
        populatePinnedsContainers();
    }
    if (typeof populateTopFavorites === 'function') {
        populateTopFavorites();
    }
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

        star.classList.add('animate-fill');
        // Remove the animation class after animation completes
        star.addEventListener('animationend', () => {
            star.classList.remove('animate-fill');
        }, {once: true});
    } else {
        star.innerHTML = outlinedStarSVG;
        star.classList.remove('favorited');

        star.classList.add('animate-unfill');
        // Remove the animation class after animation completes
        star.addEventListener('animationend', () => {
            star.classList.remove('animate-unfill');
        }, {once: true});
    }
}

/**
 * Populate favorites containers based on current favorite statuses.
 */
export function populateFavoritesContainers() {
    const favoriteContainers = [
        document.getElementById('all-favorites-container'),
        document.getElementById('favorite-links-nav-container'),
    ];
    // Load maxFavoritesDisplay from localStorage
    const maxFavoritesDisplay = localStorage.getItem('maxFavoritesDisplay');
    let numToDisplay = maxFavoritesDisplay ? parseInt(maxFavoritesDisplay, 10) : 4;
    if (maxFavoritesDisplay == 0) {
        numToDisplay = Infinity;
    }

    favoriteContainers.forEach(container => {
        if (container) {
            const currentCards = container.querySelectorAll('.card, .favorite-card');
            const favoritedLinks = state.linksData.filter(link => isLinkFavorited(link));
            container.innerHTML = '';
            if (favoritedLinks.length === 0) {
                const noFavorites = document.createElement('p');
                noFavorites.textContent = 'No favorite links yet.';
                container.appendChild(noFavorites);
            } else {
                favoritedLinks.slice(0, numToDisplay).forEach(link => {
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
    if (typeof populateTopFavorites === 'function') {
        populateTopFavorites();
    }
}

/**
 * Add a card to all favorites containers.
 * @param {HTMLElement} card - The card element to add.
 */
export function addCardToFavoritesContainers(card) {
    const favoriteContainers = [
        document.getElementById('all-favorites-container'),
        document.getElementById('favorite-links-nav-container'),
    ];
    // Load maxFavoritesDisplay from localStorage
    const maxFavoritesDisplay = localStorage.getItem('maxFavoritesDisplay');
    let numToDisplay = maxFavoritesDisplay ? parseInt(maxFavoritesDisplay, 10) : 4;
    if (maxFavoritesDisplay == 0) {
        numToDisplay = Infinity;
    }
    favoriteContainers.forEach(container => {
        if (container) {

            // Remove "No pinned links yet." if present
            const noFavorites = container.querySelector('p');
            if (noFavorites && noFavorites.textContent === 'No favorite links yet.') {
                container.removeChild(noFavorites);
            }
            // Check if the card is already present to avoid duplicates
            // Check if the card is already present to avoid duplicates
            if (!container.querySelector(
                    `[data-unique-key="${card.dataset.uniqueKey}"]`)) {
                const currentCards = container.querySelectorAll('.card, .favorite-card');
                if (currentCards.length < numToDisplay) {
                    const link =
                        state.linksData.find(l => l.uniqueKey === card.dataset.uniqueKey);
                    let newCard;
                    if (container.id === 'all-favorites-container') {
                        newCard = CreateFavoriteCard(link);
                    } else {
                        newCard = CreateCard(link);
                    }
                    container.appendChild(newCard);
                }
            }
        }
    });
    if (typeof populateTopFavorites === 'function') {
        populateTopFavorites();
    }
}

/**
 * Remove a card from all favorites containers.
 * @param {HTMLElement} card - The card element to remove.
 */
export function removeCardFromFavoritesContainers(card) {
    const favoriteContainers = [
        document.getElementById('all-favorites-container'),
        document.getElementById('favorite-links-nav-container'),
    ];
    favoriteContainers.forEach(container => {
        if (container) {

            const cardToRemove =
                container.querySelector(`[data-unique-key="${card.dataset.uniqueKey}"]`);
            if (cardToRemove) {
                cardToRemove.remove();
            }
            // If no favorites left, show "No pinned links yet."
            if (container.querySelectorAll('.card, .favorite-card').length === 0) {
                const noFavorites = document.createElement('p');
                noFavorites.textContent = 'No favorite links yet.';
                container.appendChild(noFavorites);
            }
        }
    });
    if (typeof populateTopFavorites === 'function') {
        populateTopFavorites();
    }
}