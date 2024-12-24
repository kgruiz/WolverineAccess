/**
 * FILE: favorites.js
 * Manages all functionality related to handling favorite links within the application.
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
 * Loads favorite link status from localStorage and initializes the application's favorite
 * state. This ensures that any previously favorited links are properly reflected in the
 * UI and data model.
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
    // If a link's status is not found in localStorage, default to its existing property
    // or false.
    state.linksData.forEach(link => {
        if (state.favoriteStatuses[link.uniqueKey] === undefined) {
            state.favoriteStatuses[link.uniqueKey] = link.favorite || false;
        }
    });
    saveFavorites();
}

/**
 * Saves the current favorite status for all links to localStorage.
 * This function should be called whenever any change is made to the favorite status.
 */
export function saveFavorites() {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(state.favoriteStatuses));
}

/**
 * Returns true if the provided link is currently marked as a favorite.
 * @param {Object} link - The link object to check.
 * @returns {boolean} - Indicates whether the link is favorited.
 */
export function isLinkFavorited(link) {
    return state.favoriteStatuses[link.uniqueKey] || false;
}

/**
 * Marks a link as a favorite and saves the updated status to localStorage.
 * @param {Object} link - The link object to be favorited.
 */
export function addFavorite(link) {
    state.favoriteStatuses[link.uniqueKey] = true;
    saveFavorites();
}

/**
 * Removes a link from the favorites list. If the link was pinned, it is also removed from
 * pinned status.
 * @param {Object} link - The link object to be removed from favorites.
 */
export function removeFavorite(link) {
    const wasPinned = isLinkPinned(link);
    state.favoriteStatuses[link.uniqueKey] = false;
    removePinned(link);
    saveFavorites();
    if (wasPinned) {
        populatePinnedsContainers();
    }
    if (typeof populateTopFavorites === 'function') {
        populateTopFavorites();
    }
}

/**
 * Updates a star icon based on whether the associated link is currently favorited.
 * This includes handling animations and setting the correct SVG.
 * @param {HTMLElement} star - The star element to update.
 * @param {Object} link - The link object used to determine favorite status.
 */
export function updateStarAppearance(star, link) {
    if (isLinkFavorited(link)) {
        star.innerHTML = filledStarSVG;
        star.classList.add('favorited');

        star.classList.add('animate-fill');
        // Remove the animation class after completion.
        star.addEventListener('animationend', () => {
            star.classList.remove('animate-fill');
        }, {once: true});
    } else {
        star.innerHTML = outlinedStarSVG;
        star.classList.remove('favorited');

        star.classList.add('animate-unfill');
        // Remove the animation class after completion.
        star.addEventListener('animationend', () => {
            star.classList.remove('animate-unfill');
        }, {once: true});
    }
}

/**
 * Populates all containers designated for favorite links using the current favorite
 * statuses. This function handles both a main favorites area and a navigation container,
 * if present.
 */
export function populateFavoritesContainers() {
    const favoriteContainers = [
        document.getElementById('all-favorites-container'),
        document.getElementById('favorite-links-nav-container'),
    ];
    // Retrieve user-configured maximum favorite display size from localStorage.
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
                        card = CreateFavoriteCard(link);
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
 * Adds the provided card element to all containers designated for favorite links.
 * Ensures no duplicate cards are added and respects the maximum display limit if set.
 * @param {HTMLElement} card - The card element to be added to favorites containers.
 */
export function addCardToFavoritesContainers(card) {
    const favoriteContainers = [
        document.getElementById('all-favorites-container'),
        document.getElementById('favorite-links-nav-container'),
    ];
    const maxFavoritesDisplay = localStorage.getItem('maxFavoritesDisplay');
    let numToDisplay = maxFavoritesDisplay ? parseInt(maxFavoritesDisplay, 10) : 4;
    if (maxFavoritesDisplay == 0) {
        numToDisplay = Infinity;
    }
    favoriteContainers.forEach(container => {
        if (container) {
            // Remove the placeholder text if it is present.
            const noFavorites = container.querySelector('p');
            if (noFavorites && noFavorites.textContent === 'No favorite links yet.') {
                container.removeChild(noFavorites);
            }
            // Check if the card is already in the container to avoid duplicates.
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
                        newCard = CreateFavoriteCard(link);
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
 * Removes the provided card element from all favorites containers.
 * Restores the placeholder text if no favorites remain in a particular container.
 * @param {HTMLElement} card - The card element to be removed from favorites containers.
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
            // If there are no cards left, display a placeholder message.
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
