/**
 * FILE: pinneds.js
 * Handles pinneds features and logic within the application.
 */

import {CreateCard} from './cards.js';
import {PINNED_KEY, state} from './constants.js';

// ==============================
// Pinneds Functionality
// ==============================

// ==============================
// Pinneds Handling
// ==============================
/**
 * Load pinned statuses from localStorage and initialize pinneds.
 */
export function loadPinneds() {
    const storedPinned = localStorage.getItem(PINNED_KEY);
    if (storedPinned) {
        try {
            const storedPinnedsObj = JSON.parse(storedPinned);
            state.pinnedStatuses = {...state.pinnedStatuses, ...storedPinnedsObj};
        } catch (e) {
            console.error('Failed to parse pinned links from localStorage.', e);
        }
    }
    // Initialize state.pinnedStatuses based on state.linksData if needed
    state.linksData.forEach(link => {
        if (state.pinnedStatuses[link.uniqueKey] === undefined) {
            state.pinnedStatuses[link.uniqueKey] = link.pinned || false;
        }
    });
    savePinneds();
}

/**
 * Save current pinned statuses to localStorage.
 */
export function savePinneds() {
    localStorage.setItem(PINNED_KEY, JSON.stringify(state.pinnedStatuses));
}

/**
 * Check if a link is pinnedd.
 * @param {Object} link - The link object.
 * @returns {boolean} - Pinned status.
 */
export function isLinkPinnedd(link) {
    return state.pinnedStatuses[link.uniqueKey] || false;
}

/**
 * Add a link to pinneds.
 * @param {Object} link - The link object.
 */
export function addPinned(link) {
    state.pinnedStatuses[link.uniqueKey] = true;
    savePinneds();
}

/**
 * Remove a link from pinneds.
 * @param {Object} link - The link object.
 */
export function removePinned(link) {
    state.pinnedStatuses[link.uniqueKey] = false;
    savePinneds();
}

/**
 * Populate pinneds containers based on current pinned statuses.
 */
export function populatePinnedsContainers() {
    const pinnedContainers = [document.getElementById('hero-pinned-container')];
    pinnedContainers.forEach(container => {
        if (container) {
            container.innerHTML = '';
            const pinneddLinks = state.linksData.filter(link => isLinkPinned(link));
            if (pinneddLinks.length === 0) {
                const noPinneds = document.createElement('p');
                noPinneds.textContent = 'No pinned links yet.';
                container.appendChild(noPinneds);
            } else {
                pinneddLinks.slice(0, 4).forEach(link => {
                    let card;
                    card = CreateCard(link);
                    container.appendChild(card);
                });
            }
        }
    });
}

/**
 * Add a card to all pinneds containers.
 * @param {HTMLElement} card - The card element to add.
 */
export function addCardToPinnedsContainers(card) {
    const pinnedContainers = [document.getElementById('hero-pinned-container')];
    pinnedContainers.forEach(container => {
        if (container) {

            // Remove "No pinned links yet." if present
            const noPinneds = container.querySelector('p');
            if (noPinneds && noPinneds.textContent === 'No pinned links yet.') {
                container.removeChild(noPinneds);
            }
            // Check if the card is already present to avoid duplicates
            if (!container.querySelector(
                    `[data-unique-key="${card.dataset.uniqueKey}"]`)) {
                const link =
                    state.linksData.find(l => l.uniqueKey === card.dataset.uniqueKey);
                let newCard;
                newCard = CreateCard(link);
                container.appendChild(newCard);
            }
        }
    });
}

/**
 * Remove a card from all pinneds containers.
 * @param {HTMLElement} card - The card element to remove.
 */
export function removeCardFromPinnedsContainers(card) {
    const pinnedContainers = [document.getElementById('hero-pinned-container')];
    pinnedContainers.forEach(container => {
        if (container) {

            const scrollDistanceFromBottom = document.documentElement.scrollHeight -
                                             window.scrollY - window.innerHeight;

            const cardToRemove =
                container.querySelector(`[data-unique-key="${card.dataset.uniqueKey}"]`);
            if (cardToRemove) {
                cardToRemove.remove();
            }
            // If no pinneds left, show "No pinned links yet."
            if (container.querySelectorAll('.card, .pinned-card').length === 0) {
                const noPinneds = document.createElement('p');
                noPinneds.textContent = 'No pinned links yet.';
                container.appendChild(noPinneds);
            }

            const newScrollDistanceFromBottom = document.documentElement.scrollHeight -
                                                window.scrollY - window.innerHeight;

            const scrollDifference =
                newScrollDistanceFromBottom - scrollDistanceFromBottom;

            document.documentElement.style.scrollBehavior = 'auto';
            window.scrollBy(0, scrollDifference);
            document.documentElement.style.scrollBehavior = 'smooth';
        }
    });
}