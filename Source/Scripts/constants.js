/**
 * FILE: constants.js
 * Defines shared constants and application-wide state.
 */

// Import from animation.js
import {animateEllipticalArc} from './animation.js';
// Import from auth.js
import {initializeSignInMenu, signIn, signOut} from './auth.js';
// Import from cards.js
import {CreateCard, CreateFavoriteCard} from './cards.js';
// Import from effects.js
import {initializeButtonEffects, initializeCardHoverEffects, initializeFavoritesIconHoverEffects, initializeHoverMenus, initializeNavIconsHoverEffects, initializeSwitchToggleEffects, setupHoverMenu, setupSignInHover} from './effects.js';
// Import from error.js
import {displayErrorMessage, displayLogMessage, displayWarningMessage, InitializeMessages} from './error.js';
// Import from favorites.js
import {addFavorite, isLinkFavorited, loadFavorites, populateFavoritesContainers, removeFavorite, saveFavorites, updateStarAppearance} from './favorites.js';
// Import from globalListeners.js
import {InitializeGlobalListeners} from './globalListeners.js';
// Import from preference.js
import {InitializePreferencesMenu, InitializePreferencesToggle, openPreferencesMenu} from './preference.js';
// Import from search.js
import {SetupSearchSuggestions} from './search.js';


// ==============================
// Global Constants and State
// ==============================

// ==============================
// Global Variables
// ==============================
export const state = {
    linksData: [],
    sortByRating: true,
    favoriteStatuses: {},
    signedIn: false,
    userName: '',
    userEmail: '',
};

export const FAVORITES_KEY = 'favoriteLinks';

// ==============================
// SVG Icons for Favorites
// ==============================
export const filledStarSVG =
    `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
viewBox="0 0 24 24"><path fill="#FFCB05" d="M12 17.27L18.18 21L16.54 14.14
L22 9.24L14.81 8.63L12 2L9.19
8.63L2 9.24L7.45 14.14L5.82 21
L12 17.27Z"/></svg>`;
export const outlinedStarSVG =
    `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
viewBox="0 0 24 24"><path fill="currentColor" d="M22 9.24L14.81 8.63L12 2L9.19
8.63L2 9.24L7.45 14.14L5.82 21L12
17.27L18.18 21L16.54 14.14L22
9.24ZM12 15.4L8.24 17.67L9.23
13.39L5.9 10.63L10.29 10.13L12
6.1L13.71 10.13L18.1 10.63L14.77
13.39L15.77 17.67L12 15.4Z"/></svg>`;
export const optionsIconSVG =
    `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
viewBox="0 0 24 24"><path fill="#555" d="M12 16a2 2 0 110 4 2 2 0 010-4zm0-6a2 2 0 110 4 2 2 0 010-4zm0-6a2 2 0 110 4 2 2 0 010-4z"/></svg>`;
export const footballSVG =
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
