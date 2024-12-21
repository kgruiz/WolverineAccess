/**
 * FILE: effects.js
 * Provides various UI and hover effects for the application.
 */

import {signIn, signOut} from './auth.js';
import {state} from './constants.js';
import {openPreferencesMenu} from './preference.js';

// ==============================
// UI and Hover Effects
// ==============================

// ==============================
// Hover/Click Menu Logic
// ==============================
/**
 * Initialize hover menus for various UI components.
 */
export function initializeHoverMenus() {
    setupHoverMenu('group-selector', 'group-selector-menu');
    setupHoverMenu('favorites-icon', 'favorites-menu');
    setupHoverMenu('notifications-icon', 'notifications-menu');
    setupSignInHover('sign-in-container', 'sign-in-menu', 'sign-in-menu-toggle');
}

/**
 * Setup hover menu for a specific container and menu.
 * @param {string} containerId - The ID of the container element.
 * @param {string} menuId - The ID of the menu element.
 */
export function setupHoverMenu(containerId, menuId) {
    const container = document.getElementById(containerId);
    const menu = document.getElementById(menuId);
    let clickedOpen = false;
    if (!container || !menu)
        return;
    container.addEventListener('mouseover', () => {
        if (!clickedOpen) {
            menu.classList.add('active');
        }
    });
    container.addEventListener('mouseout', () => {
        if (!clickedOpen) {
            if (menu.classList.contains('active')) {
                menu.classList.remove('active');
            }
        }
    });
    container.addEventListener('click', (e) => {
        e.preventDefault();
        clickedOpen = !clickedOpen;
        menu.classList.add('active');
    });
    document.addEventListener('click', (event) => {
        if (clickedOpen && !container.contains(event.target) &&
            !menu.contains(event.target)) {
            clickedOpen = false;
            if (menu.classList.contains('active')) {
                menu.classList.remove('active');
            }
        }
    });
}

export function setupSignInHover(containerId, menuId, menuToggle) {
    const container = document.getElementById(containerId);
    const menu = document.getElementById(menuId);
    const toggle = document.getElementById(menuToggle);
    let clickedOpen = false;
    const signInItems = document.getElementById('sign-in-items');
    const signInItemSignedOut = document.querySelectorAll('.sign-in-item-signed-out');
    const signInItemSignedIn = document.querySelectorAll('.sign-in-item-signed-in');
    const preferencesButton = document.getElementById('sign-in-preferences-button');
    const feedbackButton = document.getElementById('sign-in-feedback-button');
    const preferencesMenu = document.getElementById('preferences-menu');

    if (!container || !menu || !toggle)
        return;

    container.addEventListener('mouseover', () => {
        if (!clickedOpen) {
            menu.classList.add('active');
        }
    });

    container.addEventListener('mouseout', () => {
        if (!clickedOpen) {
            if (menu.classList.contains('active')) {
                menu.classList.remove('active');
            }
        }
    });
    toggle.addEventListener('click', (e) => {
        e.preventDefault();
        if (!state.signedIn) {
            signIn();
        }
        clickedOpen = !clickedOpen;
        menu.classList.add('active');
    });

    signInItemSignedOut.forEach((item) => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            if (!state.signedIn) {
                signIn();
            }
        });
    });
    signInItemSignedIn.forEach((item) => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            if (state.signedIn) {
                signOut();
            }
        });
    });

    preferencesButton.addEventListener('click', (e) => {
        e.preventDefault();
        openPreferencesMenu();
    });

    feedbackButton.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href =
            'https://its.umich.edu/computing/web-mobile/new-wolverine-access/contact-form';
    });

    document.addEventListener('click', (event) => {
        if (clickedOpen && !container.contains(event.target) &&
            !menu.contains(event.target) && !preferencesMenu.contains(event.target)) {
            clickedOpen = false;
            if (menu.classList.contains('active')) {
                menu.classList.remove('active');
            }
        }
    });
}

// ==============================
// Button Hover and Click Effects
// ==============================
/**
 * Initialize hover and click effects for buttons.
 */
export function initializeButtonEffects() {
    const buttons = document.querySelectorAll('button');
    buttons.forEach((button) => {
        button.addEventListener('mouseover', () => {
            button.style.filter = 'brightness(90%)';
        });
        button.addEventListener('mouseout', () => {
            button.style.filter = 'brightness(100%)';
        });
        button.addEventListener('mousedown', () => {
            button.style.transform = 'scale(0.96)';
        });
        button.addEventListener('mouseup', () => {
            button.style.transform = 'scale(1)';
        });
        button.addEventListener('mouseleave', () => {
            button.style.transform = 'scale(1)';
        });
    });
}

// ==============================
// Card Hover Effects
// ==============================
/**
 * Initialize hover effects for cards.
 */
export function initializeCardHoverEffects() {
    const cards = document.querySelectorAll('.card, .it-services-card, .favorite-card');
    cards.forEach((card) => {
        card.style.transition = 'transform 0.3s ease';
        card.addEventListener('mouseover', () => {
            card.style.transform = 'translateY(-5px)';
            const favoriteStar = card.querySelector('.favorite-star');
            if (favoriteStar) {
                favoriteStar.style.display = 'block';
            }
        });
        card.addEventListener('mouseout', () => {
            card.style.transform = 'translateY(0px)';
            const favoriteStar = card.querySelector('.favorite-star');
            if (favoriteStar && !card.classList.contains('favorited-card')) {
                favoriteStar.style.display = 'none';
            }
        });
    });
}

// ==============================
// Navigation Icons Hover Effects
// ==============================
/**
 * Initialize hover effects for navigation icons.
 */
export function initializeNavIconsHoverEffects() {
    const navIconLinks = document.querySelectorAll('.nav-icons a');
    navIconLinks.forEach((link) => {
        link.addEventListener('mouseover', () => {
            link.style.color = '#FFCB05';
        });
        link.addEventListener('mouseout', () => {
            link.style.color = '';
        });
    });
}

// ==============================
// Favorites and Other Icons Hover Effects
// ==============================
/**
 * Initialize hover effects for favorites and other icons.
 */
export function initializeFavoritesIconHoverEffects() {
    const iconSelectors = [
        {selector: '.group-selector a', scale: 1.05},
        {selector: '.favorites-icon a', scale: 1.15},
        {selector: '.notifications-icon a', scale: 1.15},
        {selector: '.home-icon', scale: 1.15},
        {selector: '.all-links-icon', scale: 1.12},
    ];
    iconSelectors.forEach((iconInfo) => {
        const icons = document.querySelectorAll(iconInfo.selector);
        icons.forEach((icon) => {
            icon.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
            icon.addEventListener('mouseover', () => {
                icon.style.transform = `scale(${iconInfo.scale})`;
                icon.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
            });
            icon.addEventListener('mouseout', () => {
                icon.style.transform = 'scale(1)';
                icon.style.boxShadow = 'none';
            });
        });
    });
}

// ==============================
// Switch and Toggle Effects
// ==============================
/**
 * Initialize switch and toggle effects.
 */
export function initializeSwitchToggleEffects() {
    const switches = document.querySelectorAll('.switch input');
    switches.forEach((switchInput) => {
        const slider = switchInput.nextElementSibling;
        switchInput.addEventListener('change', () => {
            if (switchInput.checked) {
                slider.style.backgroundColor = '#FFCB05';
            } else {
                slider.style.backgroundColor = '#ccc';
            }
        });
    });
}