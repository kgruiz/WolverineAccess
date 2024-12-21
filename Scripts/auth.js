// Import from constants.js
// Import from animation.js
import {animateEllipticalArc} from './animation.js';
// Import from auth.js
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
import {InitializeGlobalListeners} from './globalListeners.js';
// Import from preference.js
import {InitializePreferencesMenu, InitializePreferencesToggle, openPreferencesMenu} from './preference.js';
// Import from search.js
import {SetupSearchSuggestions} from './search.js';

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
    const signInItems = document.getElementById('sign-in-items');
    const signInSeparator =
        document.getElementById('sign-in-separator');  // Ensure your <hr /> has this ID
    if (state.signedIn) {
        const initials = state.userName.split(' ').map(n => n[0].toUpperCase()).join('');
        signInProfilePic.textContent = initials;
        signInProfilePic.style.display = 'block';
        signInName.textContent = state.userName;
        signInName.style.display = 'block';
        signInEmail.textContent = state.userEmail;
        signInEmail.style.display = 'block';
        signInSeparator.style.display = 'block';
        // Update sign-in button
        signInMenuToggle.innerHTML = `
      <div class="sign-in-profile-pic-button">${initials}</div>
      <span class="user-name">${state.userName}</span>
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
    const signInMenuItems = document.querySelectorAll('.sign-in-menu-item');
    signInMenuItems.forEach(item => {
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