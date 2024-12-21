/**
 * FILE: auth.js
 * Handles user authentication and sign-in/out functions.
 */

// Import from constants.js
// Import from animation.js
import {animateEllipticalArc} from './animation.js';
// Import from auth.js
// Import from cards.js
import {CreateCard, CreateFavoriteCard} from './cards.js';
import {FAVORITES_KEY, filledStarSVG, footballSVG, optionsIconSVG, outlinedStarSVG, state,} from './constants.js';
// Import from effects.js
import {initializeButtonEffects, initializeCardHoverEffects, initializeFavoritesIconHoverEffects, initializeHoverMenus, initializeNavIconsHoverEffects, initializeSwitchToggleEffects, setupHoverMenu, setupSignInHover,} from './effects.js';
// Import from error.js
import {displayErrorMessage, displayLogMessage, displayWarningMessage, InitializeMessages,} from './error.js';
// Import from favorites.js
import {addFavorite, isLinkFavorited, loadFavorites, populateFavoritesContainers, removeFavorite, saveFavorites, updateStarAppearance,} from './favorites.js';
// Import from globalListeners.js
import {InitializeGlobalListeners} from './globalListeners.js';
// Import from preference.js
import {InitializePreferencesMenu, InitializePreferencesToggle, openPreferencesMenu,} from './preference.js';
// Import from search.js
import {SetupSearchSuggestions} from './search.js';

// ==============================
// Authentication
// ==============================

// ==============================
// Sign-In Menu Initialization
// ==============================
/**
 * Initialize the sign-in menu based on user authentication status.
 */
export function initializeSignInMenu() {
    const signInMenu = document.getElementById('sign-in-menu');
    const signInMenuToggle = document.getElementById('sign-in-menu-toggle');
    const signInName = document.getElementById('sign-in-name');
    const signInEmail = document.getElementById('sign-in-email');
    const signInProfilePic = document.getElementById('sign-in-profile-pic');
    const signInSeparator = document.getElementById('sign-in-separator');
    const signInContainer = document.getElementById('sign-in-container');
    const signInButton = document.getElementById('sign-in-menu-toggle');
    const signInItems = document.getElementById('sign-in-items');
    const signInItemSignedOut = document.querySelectorAll('.sign-in-item-signed-out');
    const signInItemSignedIn = document.querySelectorAll('.sign-in-item-signed-in');
    const initials = state.userName.split(' ').map((n) => n[0].toUpperCase()).join('');

    if (state.signedIn) {
        // Update Profile Picture
        signInProfilePic.textContent = initials;
        signInProfilePic.style.display = 'block';
        signInName.textContent = state.userName;
        signInName.style.display = 'block';
        signInEmail.textContent = state.userEmail;
        signInEmail.style.display = 'block';
        signInSeparator.style.display = 'block';

        // Update sign-in button
        signInButton.innerHTML = `
            <div class="sign-in-profile-pic-button">${initials}</div>
            <span class="user-name">${state.userName}</span>
            `;
        signInItemSignedIn.forEach((item) => {
            item.style.display = 'block';
        });
        signInItemSignedOut.forEach((item) => {
            item.style.display = 'none';
        });
    } else {
        signInProfilePic.textContent = '';
        signInProfilePic.style.display = 'none';
        signInName.textContent = '';
        signInName.style.display = 'none';
        signInEmail.textContent = '';
        signInEmail.style.display = 'none';
        signInSeparator.style.display = 'none';
        // Update sign-in button
        signInButton.innerHTML = `
            <span class="material-icons">account_circle</span>
            Sign In
            `;
        signInItemSignedIn.forEach((item) => {
            item.style.display = 'none';
        });
        signInItemSignedOut.forEach((item) => {
            item.style.display = 'block';
        });
    }

    // Add hover effect to sign-in menu items
    const signInMenuItems = document.querySelectorAll('.sign-in-menu-item');
    signInMenuItems.forEach((item) => {
        item.addEventListener('mouseover', () => {
            item.style.backgroundColor = '#f0f0f0';
        });
        item.addEventListener('mouseout', () => {
            item.style.backgroundColor = 'transparent';
        });
    });
}

/**
 * Sign in the user.
 */
export function signIn() {
    state.signedIn = true;
    state.userName = 'Kaden';
    state.userEmail = 'kgruiz@umich.edu';
    initializeSignInMenu();
}

/**
 * Sign out the user.
 */
export function signOut() {
    state.signedIn = false;
    state.userName = '';
    state.userEmail = '';
    initializeSignInMenu();
}