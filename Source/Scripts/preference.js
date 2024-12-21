/**
 * FILE: preference.js
 * Manages user preferences throughout the application.
 */

// ==============================
// Preferences
// ==============================

// ==============================
// Modal Functionality
// ==============================
// Get modal elements
const preferencesMenu = document.getElementById('preferences-menu');
const preferencesMenuCloseButton =
    document.getElementById('preferences-menu-close-button');

/**
 * Open the preferences modal.
 */
export function openPreferencesMenu() {
    preferencesMenu.style.display = 'block';
    preferencesMenu.style.opacity = 0;
    let opacity = 0;
    const fadeIn = setInterval(() => {
        opacity += 0.05;
        preferencesMenu.style.opacity = opacity;
        if (opacity >= 1) {
            clearInterval(fadeIn);
        }
    }, 10);
    // Slide in animation
    const content = preferencesMenu.querySelector('.preferences-menu-content');
    content.style.transform = 'translateY(-50px)';
    let translateY = -50;
    const slideIn = setInterval(() => {
        translateY += 2;
        content.style.transform = `translateY(${translateY}px)`;
        if (translateY >= 0) {
            content.style.transform = 'translateY(0)';
            clearInterval(slideIn);
        }
    }, 10);
}

/**
 * Close the preferences modal.
 */
export function closePreferencesMenu() {
    // Fade out animation
    let opacity = 1;
    const fadeOut = setInterval(() => {
        opacity -= 0.05;
        preferencesMenu.style.opacity = opacity;
        if (opacity <= 0) {
            preferencesMenu.style.display = 'none';
            clearInterval(fadeOut);
        }
    }, 10);
}

export function InitializePreferencesMenu() {

    // Event listeners for modal functionality
    preferencesMenuCloseButton.addEventListener('click', closePreferencesMenu);
    window.addEventListener('click', function(event) {
        if (event.target == preferencesMenu) {
            closePreferencesMenu();
        }
    });
    window.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && preferencesMenu.style.display === 'block') {
            closePreferencesMenu();
        }
    });
}

export function InitializePreferencesToggle() {

    // ==============================
    // Favorites Preference Toggle
    // ==============================
    // Get references to DOM elements for favorites toggle
    const toggleFavoritesCheckbox = document.getElementById('toggleFavoritesCheckbox');
    const heroPinnedBox = document.querySelector('.hero-pinned-box');
    // Load and apply saved favorites preference
    const savedPreference = localStorage.getItem('showFavorites');
    const showFavorites = savedPreference !== null ? JSON.parse(savedPreference) : true;
    toggleFavoritesCheckbox.checked = showFavorites;
    if (heroPinnedBox) {
        heroPinnedBox.style.display = showFavorites ? 'block' : 'none';
    }
    // Event listener for favorites preference change
    toggleFavoritesCheckbox.addEventListener('change', () => {
        const showFavorites = toggleFavoritesCheckbox.checked;
        if (heroPinnedBox) {
            heroPinnedBox.style.display = showFavorites ? 'block' : 'none';
        }
        // Save the updated preference to localStorage
        localStorage.setItem('showFavorites', JSON.stringify(showFavorites));
    });
}