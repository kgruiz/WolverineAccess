/**
 * FILE: globalListeners.js
 * Sets up global event listeners for the application.
 */

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
import {addFavorite, isLinkFavorited, loadFavorites, populateFavoritesContainers, removeFavorite, saveFavorites, updateStarAppearance} from './favorites.js';
// Import from globalListeners.js
// Import from preference.js
import {InitializePreferencesMenu, InitializePreferencesToggle, openPreferencesMenu} from './preference.js';
// Import from search.js
import {SetupSearchSuggestions} from './search.js';

// ==============================
// Global Event Handlers
// ==============================

// ==============================
// Event Listeners
// ==============================

export function InitializeGlobalListeners() {

    window.addEventListener('scroll', () => {
        const backToTopButton = document.querySelector('.back-to-top');
        const homeButton = document.querySelector('.home-button');
        if (window.scrollY > 200) {
            backToTopButton.style.display = 'block';
            homeButton.style.display = 'block';
        } else {
            backToTopButton.style.display = 'none';
            homeButton.style.display = 'none';
        }
    });
    document.querySelector('.back-to-top')?.addEventListener('click', () => {
        window.scrollTo({top: 0, behavior: 'smooth'});
    });
    document.querySelector('.home-button')?.addEventListener('click', () => {
        if (window.location.pathname.endsWith('index.html')) {
            window.scrollTo({top: 0, behavior: 'smooth'});
        } else {
            window.location.href = 'index.html';
        }
    });
}